from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score

app = Flask(__name__)
CORS(app)

MIN_HISTORICAL_MONTHS = 3


@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        "status": "ok",
        "service": "SpendSmart AI - Python ML Forecasting Microservice",
        "libraries": ["Flask", "Pandas", "Scikit-learn"]
    })


@app.route('/api/predict-expenses', methods=['POST'])
def predict_expenses():
    payload = request.get_json(silent=True) or {}
    transactions = payload.get("transactions", [])

    if not transactions:
        return jsonify({
            "success": True,
            "hasSufficientData": False,
            "minimumMonthsRequired": MIN_HISTORICAL_MONTHS,
            "availableMonths": 0,
            "message": "No transaction records available for training."
        })

    df = pd.DataFrame(transactions)
    df = df[df["type"] == "expense"].copy()
    if df.empty:
        return jsonify({
            "success": True,
            "hasSufficientData": False,
            "minimumMonthsRequired": MIN_HISTORICAL_MONTHS,
            "availableMonths": 0,
            "message": "No expense transactions found."
        })

    df["date"] = pd.to_datetime(df["date"])
    df["month"] = df["date"].dt.to_period("M").astype(str)

    monthly_totals = (
        df.groupby("month")["amount"]
        .sum()
        .reset_index()
        .sort_values("month")
        .reset_index(drop=True)
    )

    num_months = len(monthly_totals)
    if num_months < MIN_HISTORICAL_MONTHS:
        return jsonify({
            "success": True,
            "hasSufficientData": False,
            "minimumMonthsRequired": MIN_HISTORICAL_MONTHS,
            "availableMonths": num_months,
            "message": f"At least {MIN_HISTORICAL_MONTHS} months of historical data are required for reliable ML expense prediction."
        })

    X = np.arange(num_months).reshape(-1, 1)
    y = monthly_totals["amount"].values

    model = LinearRegression()
    model.fit(X, y)

    y_pred_train = model.predict(X)
    r2 = float(r2_score(y, y_pred_train)) if num_months > 2 else 1.0
    next_month_pred = float(max(0.0, model.predict(np.array([[num_months]]))[0]))
    residual_std = float(np.std(y - y_pred_train))

    pivot = (
        df.pivot_table(index="month", columns="category", values="amount", aggfunc="sum", fill_value=0.0)
        .reindex(monthly_totals["month"])
    )

    category_predictions = []
    for category in pivot.columns:
        cat_y = pivot[category].values
        cat_model = LinearRegression()
        cat_model.fit(X, cat_y)
        cat_next = float(max(0.0, cat_model.predict(np.array([[num_months]]))[0]))
        category_predictions.append({
            "category": category,
            "historicalAverage": round(float(np.mean(cat_y)), 2),
            "lastMonthActual": round(float(cat_y[-1]), 2),
            "predictedNextMonth": round(cat_next, 2),
            "trendSlope": round(float(cat_model.coef_[0]), 2)
        })

    category_predictions.sort(key=lambda item: item["predictedNextMonth"], reverse=True)

    return jsonify({
        "success": True,
        "hasSufficientData": True,
        "minimumMonthsRequired": MIN_HISTORICAL_MONTHS,
        "availableMonths": num_months,
        "modelMetrics": {
            "algorithm": "Scikit-learn Ordinary Least Squares LinearRegression",
            "r2Score": round(r2, 4),
            "monthlySlope": round(float(model.coef_[0]), 2),
            "intercept": round(float(model.intercept_), 2),
            "confidenceInterval95": round(1.96 * residual_std, 2)
        },
        "predictedNextMonthTotal": round(next_month_pred, 2),
        "historicalSeries": monthly_totals.to_dict(orient="records"),
        "categoryPredictions": category_predictions
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
