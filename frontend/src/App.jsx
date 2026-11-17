import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { apiFetch, mlPredictFetch } from './api/apiClient';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PieChart as PieChartIcon,
  BarChart3,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Trash2,
  Edit3,
  Download,
  Upload,
  UserCheck,
  ArrowUpRight,
  Bell,
  Sliders,
  RefreshCw,
  Calendar,
  CreditCard,
  X,
  Menu,
  Building2,
  PiggyBank,
  Eye,
  EyeOff,
  LogOut,
  Settings,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Lock,
  Mail,
  User,
  Check,
  Repeat,
  Target,
  Receipt,
  FileText,
  Send,
  Paperclip,
  Pause,
  Play,
  Printer,
  Tag
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart
} from 'recharts';

const DEFAULT_EXPENSE_CATEGORIES = [
  'Housing & Rent',
  'Groceries',
  'Food & Dining',
  'Utilities & Bills',
  'Transportation',
  'Shopping',
  'Healthcare',
  'Entertainment',
  'Education',
  'EMI & Loans',
  'Subscriptions',
  'Others'
];

const DEFAULT_INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investments', 'Rental Income', 'Others'];

const PAYMENT_METHODS = ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Cash'];

const CATEGORY_COLORS = {
  'Housing & Rent': '#059669',
  'Groceries': '#10b981',
  'Food & Dining': '#f59e0b',
  'Utilities & Bills': '#0284c7',
  'Transportation': '#6366f1',
  'Shopping': '#8b5cf6',
  'Healthcare': '#e11d48',
  'Entertainment': '#ea580c',
  'Education': '#0d9488',
  'EMI & Loans': '#dc2626',
  'Subscriptions': '#7c3aed',
  'Salary': '#059669',
  'Freelance': '#2563eb',
  'Investments': '#7c3aed',
  'Rental Income': '#0891b2',
  'Others': '#64748b'
};

// COLLECTION 1: users
const INITIAL_USERS = [
  {
    _id: '6738a91f4e2b9c0012a84d11',
    name: 'Aarav Sharma',
    email: 'aarav@spendsmart.ai',
    passwordPlain: 'SpendSmart@123',
    currency: 'INR',
    monthlyIncomeTarget: 92000,
    savingsGoalPct: 25,
    customCategories: ['Fitness & Gym', 'Pet Care'],
    role: '6-Month History',
    jwtPreview: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MzhhOTFmNGUyYjljMDAxMmE4NGQxMSIsImVtYWlsIjoiYWFyYXZAc3BlbmRzbWFydC5haSJ9',
    bcryptHash: '$2a$10$wK9p8xZqV3mN7rL1yB5tOeH8cF4jD2gS6vA0kM9nP3qR5sT7uV1wX',
    createdAt: '2026-06-01T08:00:00.000Z'
  },
  {
    _id: '6738b44c9a1d2e0019f02c88',
    name: 'Priya Patel',
    email: 'priya@spendsmart.ai',
    passwordPlain: 'Priya@123',
    currency: 'INR',
    monthlyIncomeTarget: 75000,
    savingsGoalPct: 20,
    customCategories: ['Books & Research'],
    role: '2-Month History',
    jwtPreview: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MzhiNDRjOWExZDJlMDAxOWYwMmM4OCIsImVtYWlsIjoicHJpeWFAc3BlbmRzbWFydC5haSJ9',
    bcryptHash: '$2a$10$9mK3vP1xL8qR4wZ7nC2yBeJ6dF0hG5sT1uV8aM4pQ2rS6tW9xY3zK',
    createdAt: '2026-10-01T09:30:00.000Z'
  }
];

// COLLECTION 2: transactions
const INITIAL_ALL_TRANSACTIONS = [
  // Aarav Sharma - June 2026
  { _id: '6738c1014e2b9c0012a84e01', userId: '6738a91f4e2b9c0012a84d11', title: 'Monthly Tech Corp Salary', amount: 88000, type: 'income', category: 'Salary', paymentMethod: 'Net Banking', date: '2026-06-01', month: '2026-06', isRecurring: true, attachmentName: 'salary_slip_jun26.pdf', notes: 'June salary credit' },
  { _id: '6738c1024e2b9c0012a84e02', userId: '6738a91f4e2b9c0012a84d11', title: '2BHK Apartment Rent', amount: 18000, type: 'expense', category: 'Housing & Rent', paymentMethod: 'UPI', date: '2026-06-03', month: '2026-06', isRecurring: true, attachmentName: 'rent_receipt_jun.pdf', notes: 'Monthly house rent' },
  { _id: '6738c1034e2b9c0012a84e03', userId: '6738a91f4e2b9c0012a84d11', title: 'DMart Monthly Groceries', amount: 5200, type: 'expense', category: 'Groceries', paymentMethod: 'UPI', date: '2026-06-06', month: '2026-06', isRecurring: true, attachmentName: '', notes: 'Staples, grains, dairy' },
  { _id: '6738c1044e2b9c0012a84e04', userId: '6738a91f4e2b9c0012a84d11', title: 'Electricity & Fiber Internet', amount: 3400, type: 'expense', category: 'Utilities & Bills', paymentMethod: 'UPI', date: '2026-06-10', month: '2026-06', isRecurring: true, attachmentName: '', notes: 'PSPCL & Airtel Fiber' },
  { _id: '6738c1054e2b9c0012a84e05', userId: '6738a91f4e2b9c0012a84d11', title: 'Petrol & Metro Recharge', amount: 3600, type: 'expense', category: 'Transportation', paymentMethod: 'UPI', date: '2026-06-14', month: '2026-06', isRecurring: false, attachmentName: '', notes: 'Daily commute fuel' },
  { _id: '6738c1064e2b9c0012a84e06', userId: '6738a91f4e2b9c0012a84d11', title: 'Zomato & Weekend Cafe', amount: 4100, type: 'expense', category: 'Food & Dining', paymentMethod: 'Credit Card', date: '2026-06-19', month: '2026-06', isRecurring: false, attachmentName: '', notes: 'Team dinner and deliveries' },
  { _id: '6738c1074e2b9c0012a84e07', userId: '6738a91f4e2b9c0012a84d11', title: 'Myntra Summer Apparel', amount: 3200, type: 'expense', category: 'Shopping', paymentMethod: 'Credit Card', date: '2026-06-23', month: '2026-06', isRecurring: false, attachmentName: '', notes: 'Casual shirts & shoes' },
  { _id: '6738c1084e2b9c0012a84e08', userId: '6738a91f4e2b9c0012a84d11', title: 'OTT Subscriptions & Movies', amount: 1600, type: 'expense', category: 'Entertainment', paymentMethod: 'UPI', date: '2026-06-26', month: '2026-06', isRecurring: true, attachmentName: '', notes: 'Netflix + PVR tickets' },

  // Aarav Sharma - July 2026
  { _id: '6738c2014e2b9c0012a84e09', userId: '6738a91f4e2b9c0012a84d11', title: 'Monthly Tech Corp Salary', amount: 88000, type: 'income', category: 'Salary', paymentMethod: 'Net Banking', date: '2026-07-01', month: '2026-07', isRecurring: true, attachmentName: 'salary_slip_jul26.pdf', notes: 'July salary credit' },
  { _id: '6738c2024e2b9c0012a84e10', userId: '6738a91f4e2b9c0012a84d11', title: 'UI/UX Freelance Sprint', amount: 14000, type: 'income', category: 'Freelance', paymentMethod: 'UPI', date: '2026-07-12', month: '2026-07', isRecurring: false, attachmentName: 'client_invoice_04.pdf', notes: 'Dashboard design project' },
  { _id: '6738c2034e2b9c0012a84e11', userId: '6738a91f4e2b9c0012a84d11', title: '2BHK Apartment Rent', amount: 18000, type: 'expense', category: 'Housing & Rent', paymentMethod: 'UPI', date: '2026-07-03', month: '2026-07', isRecurring: true, attachmentName: '', notes: 'Monthly house rent' },
  { _id: '6738c2044e2b9c0012a84e12', userId: '6738a91f4e2b9c0012a84d11', title: 'BigBasket & Fresh Produce', amount: 5500, type: 'expense', category: 'Groceries', paymentMethod: 'UPI', date: '2026-07-07', month: '2026-07', isRecurring: true, attachmentName: '', notes: 'Groceries & fruits' },
  { _id: '6738c2054e2b9c0012a84e13', userId: '6738a91f4e2b9c0012a84d11', title: 'AC Electricity Bill & Broadband', amount: 4200, type: 'expense', category: 'Utilities & Bills', paymentMethod: 'Net Banking', date: '2026-07-11', month: '2026-07', isRecurring: true, attachmentName: '', notes: 'Peak summer AC usage' },
  { _id: '6738c2064e2b9c0012a84e14', userId: '6738a91f4e2b9c0012a84d11', title: 'Fuel & Cab Rides', amount: 3900, type: 'expense', category: 'Transportation', paymentMethod: 'UPI', date: '2026-07-16', month: '2026-07', isRecurring: false, attachmentName: '', notes: 'Uber & fuel' },
  { _id: '6738c2074e2b9c0012a84e15', userId: '6738a91f4e2b9c0012a84d11', title: 'Swiggy & Family Restaurant', amount: 4600, type: 'expense', category: 'Food & Dining', paymentMethod: 'Credit Card', date: '2026-07-21', month: '2026-07', isRecurring: false, attachmentName: '', notes: 'Weekend dining' },
  { _id: '6738c2084e2b9c0012a84e16', userId: '6738a91f4e2b9c0012a84d11', title: 'Amazon Home Essentials', amount: 3800, type: 'expense', category: 'Shopping', paymentMethod: 'Credit Card', date: '2026-07-25', month: '2026-07', isRecurring: false, attachmentName: '', notes: 'Kitchen organizer & lamp' },
  { _id: '6738c2094e2b9c0012a84e17', userId: '6738a91f4e2b9c0012a84d11', title: 'Dental Checkup & Pharmacy', amount: 1900, type: 'expense', category: 'Healthcare', paymentMethod: 'Debit Card', date: '2026-07-28', month: '2026-07', isRecurring: false, attachmentName: 'dental_receipt.pdf', notes: 'Routine dental scaling' },

  // Aarav Sharma - August 2026
  { _id: '6738c3014e2b9c0012a84e18', userId: '6738a91f4e2b9c0012a84d11', title: 'Monthly Tech Corp Salary', amount: 88000, type: 'income', category: 'Salary', paymentMethod: 'Net Banking', date: '2026-08-01', month: '2026-08', isRecurring: true, attachmentName: '', notes: 'August salary credit' },
  { _id: '6738c3024e2b9c0012a84e19', userId: '6738a91f4e2b9c0012a84d11', title: '2BHK Apartment Rent', amount: 18000, type: 'expense', category: 'Housing & Rent', paymentMethod: 'UPI', date: '2026-08-03', month: '2026-08', isRecurring: true, attachmentName: '', notes: 'Monthly house rent' },
  { _id: '6738c3034e2b9c0012a84e20', userId: '6738a91f4e2b9c0012a84d11', title: 'Reliance Smart Groceries', amount: 5600, type: 'expense', category: 'Groceries', paymentMethod: 'UPI', date: '2026-08-08', month: '2026-08', isRecurring: true, attachmentName: '', notes: 'Monthly provisions' },
  { _id: '6738c3044e2b9c0012a84e21', userId: '6738a91f4e2b9c0012a84d11', title: 'Electricity, Gas & Mobile', amount: 3950, type: 'expense', category: 'Utilities & Bills', paymentMethod: 'UPI', date: '2026-08-12', month: '2026-08', isRecurring: true, attachmentName: '', notes: 'Utility bills' },
  { _id: '6738c3054e2b9c0012a84e22', userId: '6738a91f4e2b9c0012a84d11', title: 'Car Service & Fuel', amount: 4300, type: 'expense', category: 'Transportation', paymentMethod: 'Debit Card', date: '2026-08-17', month: '2026-08', isRecurring: false, attachmentName: '', notes: 'Oil filter & petrol' },
  { _id: '6738c3064e2b9c0012a84e23', userId: '6738a91f4e2b9c0012a84d11', title: 'Dining Out & Coffee Shops', amount: 4900, type: 'expense', category: 'Food & Dining', paymentMethod: 'Credit Card', date: '2026-08-22', month: '2026-08', isRecurring: false, attachmentName: '', notes: 'Starbucks & dinner' },
  { _id: '6738c3074e2b9c0012a84e24', userId: '6738a91f4e2b9c0012a84d11', title: 'Rakhi Gifts & Ethnic Wear', amount: 4800, type: 'expense', category: 'Shopping', paymentMethod: 'Credit Card', date: '2026-08-26', month: '2026-08', isRecurring: false, attachmentName: '', notes: 'Festival gifts for family' },
  { _id: '6738c3084e2b9c0012a84e25', userId: '6738a91f4e2b9c0012a84d11', title: 'Cloud Certification Course', amount: 2400, type: 'expense', category: 'Education', paymentMethod: 'Credit Card', date: '2026-08-29', month: '2026-08', isRecurring: false, attachmentName: 'aws_exam_invoice.pdf', notes: 'AWS practice exams' },

  // Aarav Sharma - September 2026
  { _id: '6738c4014e2b9c0012a84e26', userId: '6738a91f4e2b9c0012a84d11', title: 'Monthly Tech Corp Salary', amount: 92000, type: 'income', category: 'Salary', paymentMethod: 'Net Banking', date: '2026-09-01', month: '2026-09', isRecurring: true, attachmentName: '', notes: 'Salary with increment' },
  { _id: '6738c4024e2b9c0012a84e27', userId: '6738a91f4e2b9c0012a84d11', title: 'Dividend Payout', amount: 4500, type: 'income', category: 'Investments', paymentMethod: 'Net Banking', date: '2026-09-10', month: '2026-09', isRecurring: false, attachmentName: '', notes: 'Nifty 50 index dividend' },
  { _id: '6738c4034e2b9c0012a84e28', userId: '6738a91f4e2b9c0012a84d11', title: '2BHK Apartment Rent', amount: 18000, type: 'expense', category: 'Housing & Rent', paymentMethod: 'UPI', date: '2026-09-03', month: '2026-09', isRecurring: true, attachmentName: '', notes: 'Monthly house rent' },
  { _id: '6738c4044e2b9c0012a84e29', userId: '6738a91f4e2b9c0012a84d11', title: 'Monthly Organic Groceries', amount: 5800, type: 'expense', category: 'Groceries', paymentMethod: 'UPI', date: '2026-09-06', month: '2026-09', isRecurring: true, attachmentName: '', notes: 'Blinkit & DMart' },
  { _id: '6738c4054e2b9c0012a84e30', userId: '6738a91f4e2b9c0012a84d11', title: 'Power, Water & Broadband', amount: 3800, type: 'expense', category: 'Utilities & Bills', paymentMethod: 'UPI', date: '2026-09-11', month: '2026-09', isRecurring: true, attachmentName: '', notes: 'Monthly utility bills' },
  { _id: '6738c4064e2b9c0012a84e31', userId: '6738a91f4e2b9c0012a84d11', title: 'Emergency Car Tyre Replacement', amount: 9400, type: 'expense', category: 'Transportation', paymentMethod: 'Credit Card', date: '2026-09-15', month: '2026-09', isRecurring: false, attachmentName: 'bridgestone_invoice.pdf', notes: 'Two new Bridgestone tyres + fuel' },
  { _id: '6738c4074e2b9c0012a84e32', userId: '6738a91f4e2b9c0012a84d11', title: 'Weekend Fine Dining & Zomato', amount: 5400, type: 'expense', category: 'Food & Dining', paymentMethod: 'Credit Card', date: '2026-09-20', month: '2026-09', isRecurring: false, attachmentName: '', notes: 'Birthday treat with friends' },
  { _id: '6738c4084e2b9c0012a84e33', userId: '6738a91f4e2b9c0012a84d11', title: 'Electronics & Ergonomic Mouse', amount: 4200, type: 'expense', category: 'Shopping', paymentMethod: 'Credit Card', date: '2026-09-25', month: '2026-09', isRecurring: false, attachmentName: '', notes: 'Logitech MX Master mouse' },

  // Aarav Sharma - October 2026
  { _id: '6738c5014e2b9c0012a84e34', userId: '6738a91f4e2b9c0012a84d11', title: 'Monthly Tech Corp Salary', amount: 92000, type: 'income', category: 'Salary', paymentMethod: 'Net Banking', date: '2026-10-01', month: '2026-10', isRecurring: true, attachmentName: '', notes: 'October salary credit' },
  { _id: '6738c5024e2b9c0012a84e35', userId: '6738a91f4e2b9c0012a84d11', title: 'React Consulting Milestone', amount: 18000, type: 'income', category: 'Freelance', paymentMethod: 'Net Banking', date: '2026-10-14', month: '2026-10', isRecurring: false, attachmentName: '', notes: 'Client frontend audit' },
  { _id: '6738c5034e2b9c0012a84e36', userId: '6738a91f4e2b9c0012a84d11', title: '2BHK Apartment Rent', amount: 18000, type: 'expense', category: 'Housing & Rent', paymentMethod: 'UPI', date: '2026-10-03', month: '2026-10', isRecurring: true, attachmentName: '', notes: 'Monthly house rent' },
  { _id: '6738c5044e2b9c0012a84e37', userId: '6738a91f4e2b9c0012a84d11', title: 'Supermarket & Dry Fruits', amount: 6300, type: 'expense', category: 'Groceries', paymentMethod: 'UPI', date: '2026-10-07', month: '2026-10', isRecurring: true, attachmentName: '', notes: 'Festive grocery stock' },
  { _id: '6738c5054e2b9c0012a84e38', userId: '6738a91f4e2b9c0012a84d11', title: 'Electricity & Postpaid Family Plan', amount: 3700, type: 'expense', category: 'Utilities & Bills', paymentMethod: 'UPI', date: '2026-10-12', month: '2026-10', isRecurring: true, attachmentName: '', notes: 'Monthly bills' },
  { _id: '6738c5064e2b9c0012a84e39', userId: '6738a91f4e2b9c0012a84d11', title: 'Highway Toll & Petrol', amount: 4400, type: 'expense', category: 'Transportation', paymentMethod: 'UPI', date: '2026-10-18', month: '2026-10', isRecurring: false, attachmentName: '', notes: 'Weekend hometown trip' },
  { _id: '6738c5074e2b9c0012a84e40', userId: '6738a91f4e2b9c0012a84d11', title: 'Restaurant & Sweet Shop Orders', amount: 6100, type: 'expense', category: 'Food & Dining', paymentMethod: 'Credit Card', date: '2026-10-22', month: '2026-10', isRecurring: false, attachmentName: '', notes: 'Festive get-togethers' },
  { _id: '6738c5084e2b9c0012a84e41', userId: '6738a91f4e2b9c0012a84d11', title: 'Festive Smart TV & Gifts Purchase', amount: 11800, type: 'expense', category: 'Shopping', paymentMethod: 'Credit Card', date: '2026-10-26', month: '2026-10', isRecurring: false, attachmentName: 'sony_tv_warranty.pdf', notes: 'Big Billion Day sale electronics & gifts' },
  { _id: '6738c5094e2b9c0012a84e42', userId: '6738a91f4e2b9c0012a84d11', title: 'Concert Tickets & Gaming Pass', amount: 2800, type: 'expense', category: 'Entertainment', paymentMethod: 'Credit Card', date: '2026-10-29', month: '2026-10', isRecurring: false, attachmentName: '', notes: 'Live music show' },

  // Aarav Sharma - November 2026
  { _id: '6738c6014e2b9c0012a84e43', userId: '6738a91f4e2b9c0012a84d11', title: 'Monthly Tech Corp Salary', amount: 92000, type: 'income', category: 'Salary', paymentMethod: 'Net Banking', date: '2026-11-01', month: '2026-11', isRecurring: true, attachmentName: 'salary_slip_nov26.pdf', notes: 'November salary credit' },
  { _id: '6738c6024e2b9c0012a84e44', userId: '6738a91f4e2b9c0012a84d11', title: 'Full-Stack Mentorship Stipend', amount: 12000, type: 'income', category: 'Freelance', paymentMethod: 'UPI', date: '2026-11-08', month: '2026-11', isRecurring: false, attachmentName: '', notes: 'Weekend cohort sessions' },
  { _id: '6738c6034e2b9c0012a84e45', userId: '6738a91f4e2b9c0012a84d11', title: '2BHK Apartment Rent', amount: 18000, type: 'expense', category: 'Housing & Rent', paymentMethod: 'UPI', date: '2026-11-03', month: '2026-11', isRecurring: true, attachmentName: 'rent_nov26.pdf', notes: 'Monthly house rent' },
  { _id: '6738c6044e2b9c0012a84e46', userId: '6738a91f4e2b9c0012a84d11', title: 'BigBasket & Organic Staples', amount: 6100, type: 'expense', category: 'Groceries', paymentMethod: 'UPI', date: '2026-11-05', month: '2026-11', isRecurring: true, attachmentName: '', notes: 'Monthly household groceries' },
  { _id: '6738c6054e2b9c0012a84e47', userId: '6738a91f4e2b9c0012a84d11', title: 'Broadband, LPG Cylinder & Power', amount: 3900, type: 'expense', category: 'Utilities & Bills', paymentMethod: 'UPI', date: '2026-11-09', month: '2026-11', isRecurring: true, attachmentName: '', notes: 'Utility bills paid' },
  { _id: '6738c6064e2b9c0012a84e48', userId: '6738a91f4e2b9c0012a84d11', title: 'Fuel & Intercity Cab', amount: 4200, type: 'expense', category: 'Transportation', paymentMethod: 'UPI', date: '2026-11-11', month: '2026-11', isRecurring: false, attachmentName: '', notes: 'Commute + Chandigarh trip' },
  { _id: '6738c6074e2b9c0012a84e49', userId: '6738a91f4e2b9c0012a84d11', title: 'Zomato Gold & Weekend Dining', amount: 6850, type: 'expense', category: 'Food & Dining', paymentMethod: 'Credit Card', date: '2026-11-13', month: '2026-11', isRecurring: false, attachmentName: '', notes: 'Approaching dining budget limit' },
  { _id: '6738c6084e2b9c0012a84e50', userId: '6738a91f4e2b9c0012a84d11', title: 'Winter Jacket & Designer Sneaker', amount: 9600, type: 'expense', category: 'Shopping', paymentMethod: 'Credit Card', date: '2026-11-14', month: '2026-11', isRecurring: false, attachmentName: 'myntra_bill_nov.pdf', notes: 'Exceeded monthly shopping budget' },
  { _id: '6738c6094e2b9c0012a84e51', userId: '6738a91f4e2b9c0012a84d11', title: 'IMAX Movie Night & Bowling', amount: 2650, type: 'expense', category: 'Entertainment', paymentMethod: 'UPI', date: '2026-11-15', month: '2026-11', isRecurring: false, attachmentName: '', notes: 'Weekend outing' },
  { _id: '6738c6104e2b9c0012a84e52', userId: '6738a91f4e2b9c0012a84d11', title: 'Annual Health Vitamin Panel', amount: 2400, type: 'expense', category: 'Healthcare', paymentMethod: 'Debit Card', date: '2026-11-16', month: '2026-11', isRecurring: false, attachmentName: 'lalpathlabs_report.pdf', notes: 'Preventive lab test' },

  // Priya Patel (Second User - Isolated Data)
  { _id: '6738c7014e2b9c0012a84e61', userId: '6738b44c9a1d2e0019f02c88', title: 'Cloud Systems Salary', amount: 75000, type: 'income', category: 'Salary', paymentMethod: 'Net Banking', date: '2026-10-01', month: '2026-10', isRecurring: true, attachmentName: '', notes: 'October salary credit' },
  { _id: '6738c7024e2b9c0012a84e62', userId: '6738b44c9a1d2e0019f02c88', title: '1BHK Studio Rent', amount: 14000, type: 'expense', category: 'Housing & Rent', paymentMethod: 'UPI', date: '2026-10-04', month: '2026-10', isRecurring: true, attachmentName: '', notes: 'Monthly studio rent' },
  { _id: '6738c7034e2b9c0012a84e63', userId: '6738b44c9a1d2e0019f02c88', title: 'Nature Basket Groceries', amount: 4200, type: 'expense', category: 'Groceries', paymentMethod: 'UPI', date: '2026-10-09', month: '2026-10', isRecurring: true, attachmentName: '', notes: 'Monthly groceries' },
  { _id: '6738c7044e2b9c0012a84e64', userId: '6738b44c9a1d2e0019f02c88', title: 'Metro Pass & Cab Commute', amount: 2800, type: 'expense', category: 'Transportation', paymentMethod: 'UPI', date: '2026-10-15', month: '2026-10', isRecurring: false, attachmentName: '', notes: 'Office commute' },
  { _id: '6738c7054e2b9c0012a84e65', userId: '6738b44c9a1d2e0019f02c88', title: 'Cafe & Team Lunch', amount: 3400, type: 'expense', category: 'Food & Dining', paymentMethod: 'Credit Card', date: '2026-10-21', month: '2026-10', isRecurring: false, attachmentName: '', notes: 'Dining out' },
  { _id: '6738c7064e2b9c0012a84e66', userId: '6738b44c9a1d2e0019f02c88', title: 'Cloud Systems Salary', amount: 75000, type: 'income', category: 'Salary', paymentMethod: 'Net Banking', date: '2026-11-01', month: '2026-11', isRecurring: true, attachmentName: '', notes: 'November salary credit' },
  { _id: '6738c7074e2b9c0012a84e67', userId: '6738b44c9a1d2e0019f02c88', title: '1BHK Studio Rent', amount: 14000, type: 'expense', category: 'Housing & Rent', paymentMethod: 'UPI', date: '2026-11-04', month: '2026-11', isRecurring: true, attachmentName: '', notes: 'Monthly studio rent' },
  { _id: '6738c7084e2b9c0012a84e68', userId: '6738b44c9a1d2e0019f02c88', title: 'Fresh Produce & Groceries', amount: 4450, type: 'expense', category: 'Groceries', paymentMethod: 'UPI', date: '2026-11-08', month: '2026-11', isRecurring: true, attachmentName: '', notes: 'Monthly groceries' },
  { _id: '6738c7094e2b9c0012a84e69', userId: '6738b44c9a1d2e0019f02c88', title: 'Electricity & Fiber Bill', amount: 2600, type: 'expense', category: 'Utilities & Bills', paymentMethod: 'UPI', date: '2026-11-11', month: '2026-11', isRecurring: true, attachmentName: '', notes: 'Utility bills' },
  { _id: '6738c7104e2b9c0012a84e70', userId: '6738b44c9a1d2e0019f02c88', title: 'Swiggy & Coffee Roasters', amount: 3900, type: 'expense', category: 'Food & Dining', paymentMethod: 'Credit Card', date: '2026-11-14', month: '2026-11', isRecurring: false, attachmentName: '', notes: 'Weekend deliveries' }
];

// COLLECTION 3: budgets
const INITIAL_BUDGETS_COLLECTION = [
  {
    _id: '6738d7014e2b9c0012a84f01',
    userId: '6738a91f4e2b9c0012a84d11',
    month: '2026-11',
    overallLimit: 52000,
    alertThresholdPct: 80,
    categoryLimits: {
      'Housing & Rent': 18000,
      'Food & Dining': 7000,
      'Groceries': 6500,
      'Transportation': 5000,
      'Utilities & Bills': 4500,
      'Shopping': 6000,
      'Entertainment': 3000,
      'Healthcare': 3000,
      'Education': 3000,
      'EMI & Loans': 5000,
      'Subscriptions': 2000,
      'Others': 2000
    }
  },
  {
    _id: '6738d7024e2b9c0012a84f02',
    userId: '6738b44c9a1d2e0019f02c88',
    month: '2026-11',
    overallLimit: 38000,
    alertThresholdPct: 80,
    categoryLimits: {
      'Housing & Rent': 14000,
      'Food & Dining': 4500,
      'Groceries': 5000,
      'Transportation': 3500,
      'Utilities & Bills': 3000,
      'Shopping': 4000,
      'Entertainment': 2000,
      'Healthcare': 2000,
      'Education': 2000,
      'Others': 1500
    }
  }
];

// COLLECTION 4: recurringschedules (Monthly rent, subscriptions, EMI, recurring income)
const INITIAL_RECURRING_SCHEDULES = [
  {
    _id: '6738f1014e2b9c0012a85a01',
    userId: '6738a91f4e2b9c0012a84d11',
    title: 'Monthly Tech Corp Salary',
    amount: 92000,
    type: 'income',
    category: 'Salary',
    paymentMethod: 'Net Banking',
    frequency: 'monthly',
    dayOfMonth: 1,
    nextDueDate: '2026-12-01',
    status: 'active',
    lastGeneratedDate: '2026-11-01',
    notes: 'Primary monthly salary credit'
  },
  {
    _id: '6738f1024e2b9c0012a85a02',
    userId: '6738a91f4e2b9c0012a84d11',
    title: '2BHK Apartment Rent',
    amount: 18000,
    type: 'expense',
    category: 'Housing & Rent',
    paymentMethod: 'UPI',
    frequency: 'monthly',
    dayOfMonth: 3,
    nextDueDate: '2026-12-03',
    status: 'active',
    lastGeneratedDate: '2026-11-03',
    notes: 'Auto-debit to landlord via UPI mandate'
  },
  {
    _id: '6738f1034e2b9c0012a85a03',
    userId: '6738a91f4e2b9c0012a84d11',
    title: 'Car Loan EMI (HDFC Bank)',
    amount: 8400,
    type: 'expense',
    category: 'EMI & Loans',
    paymentMethod: 'Net Banking',
    frequency: 'monthly',
    dayOfMonth: 20,
    nextDueDate: '2026-11-20',
    status: 'active',
    lastGeneratedDate: '2026-10-20',
    notes: 'Due this month — click Generate Transaction to post'
  },
  {
    _id: '6738f1044e2b9c0012a85a04',
    userId: '6738a91f4e2b9c0012a84d11',
    title: 'Netflix, Spotify & Google One Bundle',
    amount: 1199,
    type: 'expense',
    category: 'Subscriptions',
    paymentMethod: 'Credit Card',
    frequency: 'monthly',
    dayOfMonth: 18,
    nextDueDate: '2026-11-18',
    status: 'active',
    lastGeneratedDate: '2026-10-18',
    notes: 'Digital media & cloud storage subscriptions'
  },
  {
    _id: '6738f1054e2b9c0012a85a05',
    userId: '6738a91f4e2b9c0012a84d11',
    title: 'Cult.fit Pro Gym Membership',
    amount: 1500,
    type: 'expense',
    category: 'Fitness & Gym',
    paymentMethod: 'UPI',
    frequency: 'monthly',
    dayOfMonth: 10,
    nextDueDate: '2026-12-10',
    status: 'paused',
    lastGeneratedDate: '2026-10-10',
    notes: 'Paused for travel'
  },
  // Priya's recurring schedules
  {
    _id: '6738f1064e2b9c0012a85a06',
    userId: '6738b44c9a1d2e0019f02c88',
    title: '1BHK Studio Rent',
    amount: 14000,
    type: 'expense',
    category: 'Housing & Rent',
    paymentMethod: 'UPI',
    frequency: 'monthly',
    dayOfMonth: 4,
    nextDueDate: '2026-12-04',
    status: 'active',
    lastGeneratedDate: '2026-11-04',
    notes: 'Monthly rent'
  }
];

// COLLECTION 5: savingsgoals
const INITIAL_SAVINGS_GOALS = [
  {
    _id: '6738f2014e2b9c0012a85b01',
    userId: '6738a91f4e2b9c0012a84d11',
    name: '6-Month Emergency Liquid Fund',
    category: 'Emergency Fund',
    targetAmount: 300000,
    currentAmount: 215000,
    monthlyCommitment: 17000,
    targetDate: '2027-04-30',
    status: 'active',
    contributions: [
      { amount: 20000, date: '2026-09-05', note: 'September SIP transfer' },
      { amount: 18000, date: '2026-10-05', note: 'October transfer' },
      { amount: 17000, date: '2026-11-05', note: 'November transfer' }
    ]
  },
  {
    _id: '6738f2024e2b9c0012a85b02',
    userId: '6738a91f4e2b9c0012a84d11',
    name: 'MacBook Pro M4 Upgrade',
    category: 'Tech & Career',
    targetAmount: 165000,
    currentAmount: 125000,
    monthlyCommitment: 10000,
    targetDate: '2027-03-15',
    status: 'active',
    contributions: [
      { amount: 15000, date: '2026-10-15', note: 'Freelance bonus allocation' },
      { amount: 10000, date: '2026-11-10', note: 'Monthly goal deposit' }
    ]
  },
  {
    _id: '6738f2034e2b9c0012a85b03',
    userId: '6738a91f4e2b9c0012a84d11',
    name: 'Japan Spring Travel Fund',
    category: 'Travel & Leisure',
    targetAmount: 180000,
    currentAmount: 72000,
    monthlyCommitment: 12000,
    targetDate: '2027-08-01',
    status: 'active',
    contributions: [{ amount: 12000, date: '2026-11-06', note: 'Initial flight fund' }]
  },
  // Priya's goal
  {
    _id: '6738f2044e2b9c0012a85b04',
    userId: '6738b44c9a1d2e0019f02c88',
    name: 'Emergency Reserve Fund',
    category: 'Emergency Fund',
    targetAmount: 150000,
    currentAmount: 65000,
    monthlyCommitment: 15000,
    targetDate: '2027-05-01',
    status: 'active',
    contributions: [{ amount: 15000, date: '2026-11-03', note: 'Monthly transfer' }]
  }
];

// COLLECTION 6: billreminders
const INITIAL_BILL_REMINDERS = [
  {
    _id: '6738f3014e2b9c0012a85c01',
    userId: '6738a91f4e2b9c0012a84d11',
    title: 'HDFC Regalia Credit Card Statement',
    category: 'Credit Card Bill',
    amount: 14250,
    dueDate: '2026-11-21',
    paymentMethod: 'Net Banking',
    status: 'pending',
    isRecurringBill: true,
    notes: 'Total due for Oct–Nov billing cycle'
  },
  {
    _id: '6738f3024e2b9c0012a85c02',
    userId: '6738a91f4e2b9c0012a84d11',
    title: 'Car Loan EMI Installment #18',
    category: 'EMI & Loans',
    amount: 8400,
    dueDate: '2026-11-20',
    paymentMethod: 'Net Banking',
    status: 'pending',
    isRecurringBill: true,
    notes: 'Auto-debit scheduled'
  },
  {
    _id: '6738f3034e2b9c0012a85c03',
    userId: '6738a91f4e2b9c0012a84d11',
    title: 'Airtel Black Fiber + Postpaid Bill',
    category: 'Utilities & Bills',
    amount: 1769,
    dueDate: '2026-11-25',
    paymentMethod: 'UPI',
    status: 'pending',
    isRecurringBill: true,
    notes: '300 Mbps fiber plan'
  },
  {
    _id: '6738f3044e2b9c0012a85c04',
    userId: '6738a91f4e2b9c0012a84d11',
    title: '2BHK Apartment Rent (Nov)',
    category: 'Housing & Rent',
    amount: 18000,
    dueDate: '2026-11-03',
    paymentMethod: 'UPI',
    status: 'paid',
    isRecurringBill: true,
    notes: 'Paid on 03 Nov 2026'
  },
  {
    _id: '6738f3054e2b9c0012a85c05',
    userId: '6738a91f4e2b9c0012a84d11',
    title: 'State Electricity Board (PSPCL)',
    category: 'Utilities & Bills',
    amount: 2130,
    dueDate: '2026-11-09',
    paymentMethod: 'UPI',
    status: 'paid',
    isRecurringBill: true,
    notes: 'Paid on 09 Nov 2026'
  },
  // Priya's bill
  {
    _id: '6738f3064e2b9c0012a85c06',
    userId: '6738b44c9a1d2e0019f02c88',
    title: 'ICICI Coral Credit Card Bill',
    category: 'Credit Card Bill',
    amount: 6400,
    dueDate: '2026-11-22',
    paymentMethod: 'UPI',
    status: 'pending',
    isRecurringBill: true,
    notes: 'Monthly credit card bill'
  }
];

function formatINR(value) {
  const num = Number(value) || 0;
  return '₹' + Math.round(num).toLocaleString('en-IN');
}

function generateObjectId() {
  const chars = '0123456789abcdef';
  let id = '6738';
  for (let i = 0; i < 20; i++) {
    id += chars[Math.floor(Math.random() * 16)];
  }
  return id;
}

function computePasswordStrength(pw) {
  if (!pw) return { score: 0, label: 'Enter a password', color: 'bg-slate-200', textColor: 'text-slate-400' };
  let score = 0;
  if (pw.length >= 8) score += 1;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score += 1;
  if (/\d/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;

  const map = {
    0: { label: 'Too Short', color: 'bg-rose-500', textColor: 'text-rose-600' },
    1: { label: 'Weak', color: 'bg-rose-500', textColor: 'text-rose-600' },
    2: { label: 'Fair', color: 'bg-amber-500', textColor: 'text-amber-600' },
    3: { label: 'Good', color: 'bg-emerald-500', textColor: 'text-emerald-600' },
    4: { label: 'Strong', color: 'bg-emerald-600', textColor: 'text-emerald-700' }
  };
  return { score, ...map[score] };
}

function addMonthsToDateStr(baseYm, monthsToAdd) {
  const [y, m] = baseYm.split('-').map(Number);
  const d = new Date(Date.UTC(y, m - 1 + monthsToAdd, 1));
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export default function App() {
  const [selectedMonth, setSelectedMonth] = useState('2026-11');
  // Navigation & Responsive Mobile Drawer State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Live Backend JWT & MongoDB Synchronization
  const [jwtToken, setJwtToken] = useState(() => localStorage.getItem('spendsmart_jwt') || '');
  const [backendConnected, setBackendConnected] = useState(false);

  const syncFromMongoDBBackend = useCallback(async (tokenToUse) => {
    const tk = tokenToUse || jwtToken;
    if (!tk) return;
    try {
      const [meRes, txRes, budgetRes, recRes, goalRes, billRes] = await Promise.all([
        apiFetch('/auth/me', {}, tk),
        apiFetch('/transactions', {}, tk),
        apiFetch(`/budgets/${selectedMonth}`, {}, tk),
        apiFetch('/recurring', {}, tk),
        apiFetch('/goals', {}, tk),
        apiFetch('/bills', {}, tk)
      ]);
      if (meRes.user) setCurrentUser((prev) => ({ ...prev, ...meRes.user }));
      if (txRes.data) {
        setAllTransactions(
          txRes.data.map((t) => ({
            ...t,
            date: new Date(t.date).toISOString().slice(0, 10)
          }))
        );
      }
      if (recRes.data && recRes.data.length) setAllRecurring(recRes.data);
      if (goalRes.data && goalRes.data.length) setAllGoals(goalRes.data);
      if (billRes.data && billRes.data.length) setAllBills(billRes.data);
      if (budgetRes.data && budgetRes.data.budget) {
        const b = budgetRes.data.budget;
        const limitsObj = {};
        (b.categoryLimits || []).forEach((cl) => {
          limitsObj[cl.category] = cl.limit;
        });
        setBudgetsCollection((prev) => {
          const updated = {
            _id: b._id,
            userId: b.userId,
            month: b.month,
            overallLimit: b.overallLimit,
            alertThresholdPct: b.alertThresholdPct,
            categoryLimits: Object.keys(limitsObj).length ? limitsObj : INITIAL_BUDGETS_COLLECTION[0].categoryLimits
          };
          const filtered = prev.filter((item) => item.userId !== String(b.userId));
          return [...filtered, updated];
        });
      }
      setBackendConnected(true);
    } catch (err) {
      setBackendConnected(false);
    }
  }, [jwtToken, selectedMonth]);

  useEffect(() => {
    if (jwtToken) syncFromMongoDBBackend(jwtToken);
  }, [jwtToken, syncFromMongoDBBackend]);

  // Authentication & Standalone Login / Signup State
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [authScreen, setAuthScreen] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loginForm, setLoginForm] = useState({
    email: 'aarav@spendsmart.ai',
    password: 'SpendSmart@123',
    rememberMe: true
  });

  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  const [forgotEmail, setForgotEmail] = useState('');

  // Core MongoDB Collections State
  const [usersCollection, setUsersCollection] = useState(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState(INITIAL_USERS[0]);
  const [datasetMode, setDatasetMode] = useState('full_6m');
  const [authForm, setAuthForm] = useState({
    name: INITIAL_USERS[0].name,
    email: INITIAL_USERS[0].email,
    currency: INITIAL_USERS[0].currency,
    monthlyIncomeTarget: INITIAL_USERS[0].monthlyIncomeTarget,
    savingsGoalPct: INITIAL_USERS[0].savingsGoalPct
  });

  const [allTransactions, setAllTransactions] = useState(INITIAL_ALL_TRANSACTIONS);
  const [budgetsCollection, setBudgetsCollection] = useState(INITIAL_BUDGETS_COLLECTION);
  const [allRecurring, setAllRecurring] = useState(INITIAL_RECURRING_SCHEDULES);
  const [allGoals, setAllGoals] = useState(INITIAL_SAVINGS_GOALS);
  const [allBills, setAllBills] = useState(INITIAL_BILL_REMINDERS);

  

  // Search & Filter State (Transactions Page)
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');
  const [filterMonth, setFilterMonth] = useState('all');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');
  const [newCustomCategory, setNewCustomCategory] = useState('');

  // CSV Import Modal State
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [csvRawText, setCsvRawText] = useState(
    '2026-11-16,Apollo Pharmacy Essentials,expense,Healthcare,UPI,850,Monthly vitamins\n2026-11-16,Freelance Code Review,income,Freelance,UPI,4500,Weekend payout'
  );
  const [csvValidationPreview, setCsvValidationPreview] = useState(null);

  // Transaction Add/Edit Modal State
  const [txModalOpen, setTxModalOpen] = useState(false);
  const [editingTxId, setEditingTxId] = useState(null);
  const [txForm, setTxForm] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: 'Food & Dining',
    paymentMethod: 'UPI',
    date: '2026-11-16',
    isRecurring: false,
    attachmentName: '',
    notes: ''
  });

  // Recurring Expenses Modal & Form State
  const [recurringModalOpen, setRecurringModalOpen] = useState(false);
  const [editingRecurringId, setEditingRecurringId] = useState(null);
  const [recurringForm, setRecurringForm] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: 'Subscriptions',
    paymentMethod: 'UPI',
    frequency: 'monthly',
    dayOfMonth: '5',
    nextDueDate: '2026-12-05',
    notes: ''
  });

  // Savings Goals Modal & Contribution State
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [goalForm, setGoalForm] = useState({
    name: '',
    category: 'Emergency Fund',
    targetAmount: '',
    currentAmount: '',
    monthlyCommitment: '10000',
    targetDate: '2027-06-30'
  });
  const [contributionInputs, setContributionInputs] = useState({});

  // Bill Reminders Modal State
  const [billModalOpen, setBillModalOpen] = useState(false);
  const [editingBillId, setEditingBillId] = useState(null);
  const [billForm, setBillForm] = useState({
    title: '',
    category: 'Utilities & Bills',
    amount: '',
    dueDate: '2026-11-25',
    paymentMethod: 'UPI',
    isRecurringBill: true,
    notes: ''
  });

  // Expense Calendar State
  const [selectedCalendarDate, setSelectedCalendarDate] = useState('2026-11-14');

  // Reports & Analytics State
  const [reportPeriod, setReportPeriod] = useState('monthly'); // 'weekly' | 'monthly' | 'yearly'
  const [showPdfReportModal, setShowPdfReportModal] = useState(false);

  // AI Finance Assistant Chat State
  const [assistantInput, setAssistantInput] = useState('');
  const [assistantMessages, setAssistantMessages] = useState([
    {
      id: 'msg-welcome',
      role: 'assistant',
      text: 'Hello! I am your SpendSmart AI Finance Assistant. Ask me any question about your spending, budgets, upcoming bills, recurring subscriptions, or savings goals — I compute every answer directly from your financial records.'
    }
  ]);

  // Budget Inline Edit State
  const [editingCategoryBudget, setEditingCategoryBudget] = useState(null);
  const [tempCategoryLimit, setTempCategoryLimit] = useState('');

  // Toast Notification
  const [toast, setToast] = useState(null);
  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev && prev.message === message ? null : prev));
    }, 3500);
  };

  // ============================================================================
  // STRICT USER-SCOPED DATA ISOLATION
  // ============================================================================
  const activeUserId = currentUser ? currentUser._id : '';

  const expenseCategoriesList = useMemo(() => {
    const custom = (currentUser && currentUser.customCategories) || [];
    return [...DEFAULT_EXPENSE_CATEGORIES, ...custom.filter((c) => !DEFAULT_EXPENSE_CATEGORIES.includes(c))];
  }, [currentUser]);

  const incomeCategoriesList = useMemo(() => {
    const custom = (currentUser && currentUser.customCategories) || [];
    return [...DEFAULT_INCOME_CATEGORIES, ...custom.filter((c) => !DEFAULT_INCOME_CATEGORIES.includes(c))];
  }, [currentUser]);

  const transactions = useMemo(
    () => allTransactions.filter((t) => t.userId === activeUserId),
    [allTransactions, activeUserId]
  );

  const recurringSchedules = useMemo(
    () => allRecurring.filter((r) => r.userId === activeUserId),
    [allRecurring, activeUserId]
  );

  const savingsGoals = useMemo(
    () => allGoals.filter((g) => g.userId === activeUserId),
    [allGoals, activeUserId]
  );

  const billReminders = useMemo(
    () => allBills.filter((b) => b.userId === activeUserId),
    [allBills, activeUserId]
  );

  const budgetConfig = useMemo(() => {
    const found = budgetsCollection.find((b) => b.userId === activeUserId);
    if (found) return found;
    return {
      _id: '6738d7994e2b9c0012a84f99',
      userId: activeUserId,
      month: selectedMonth,
      overallLimit: 45000,
      alertThresholdPct: 80,
      categoryLimits: {
        'Housing & Rent': 15000,
        'Food & Dining': 6000,
        'Groceries': 5500,
        'Transportation': 4000,
        'Utilities & Bills': 4000,
        'Shopping': 5000,
        'Entertainment': 2500,
        'Healthcare': 2500,
        'Education': 2500,
        'Others': 2000
      }
    };
  }, [budgetsCollection, activeUserId, selectedMonth]);

  const updateCurrentUserBudget = (updater) => {
    setBudgetsCollection((prev) => {
      const exists = prev.some((b) => b.userId === activeUserId);
      if (!exists) {
        const nextDoc = updater(budgetConfig);
        return [...prev, nextDoc];
      }
      return prev.map((b) => (b.userId === activeUserId ? updater(b) : b));
    });
  };

  // Switch between Aarav (6-Month) and Priya (2-Month)
  const handleSwitchDatasetMode = (mode) => {
    setDatasetMode(mode);
    setProfileDropdownOpen(false);
    if (mode === 'new_user_2m') {
      const priya = usersCollection.find((u) => u.email === 'priya@spendsmart.ai') || INITIAL_USERS[1];
      setCurrentUser(priya);
      setAuthForm({
        name: priya.name,
        email: priya.email,
        currency: priya.currency,
        monthlyIncomeTarget: priya.monthlyIncomeTarget,
        savingsGoalPct: priya.savingsGoalPct
      });
      triggerToast('Switched to Priya Patel account (isolated records loaded).', 'info');
    } else {
      const aarav = usersCollection.find((u) => u.email === 'aarav@spendsmart.ai') || INITIAL_USERS[0];
      setCurrentUser(aarav);
      setAuthForm({
        name: aarav.name,
        email: aarav.email,
        currency: aarav.currency,
        monthlyIncomeTarget: aarav.monthlyIncomeTarget,
        savingsGoalPct: aarav.savingsGoalPct
      });
      triggerToast('Switched to Aarav Sharma account (6-month history loaded).', 'success');
    }
  };

  // ============================================================================
  // AUTHENTICATION HANDLERS
  // ============================================================================
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setAuthError('');

    const cleanEmail = loginForm.email.trim().toLowerCase();
    const cleanPass = loginForm.password;

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setAuthError('Please enter a valid email address.');
      return;
    }
    if (!cleanPass || cleanPass.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }

    setIsAuthLoading(true);
    setTimeout(() => {
      const matchedUser = usersCollection.find(
        (u) => u.email.toLowerCase() === cleanEmail && u.passwordPlain === cleanPass
      );

      if (!matchedUser) {
        setIsAuthLoading(false);
        setAuthError('Invalid email or password. Please verify your credentials.');
        return;
      }

      setCurrentUser(matchedUser);
      setDatasetMode(matchedUser.email === 'priya@spendsmart.ai' ? 'new_user_2m' : 'full_6m');
      setAuthForm({
        name: matchedUser.name,
        email: matchedUser.email,
        currency: matchedUser.currency || 'INR',
        monthlyIncomeTarget: matchedUser.monthlyIncomeTarget,
        savingsGoalPct: matchedUser.savingsGoalPct
      });
      setIsAuthLoading(false);
      setIsAuthenticated(true);
      setActiveTab('dashboard');
      triggerToast(`Welcome back, ${matchedUser.name}!`, 'success');
    }, 300);
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setAuthError('');

    const cleanName = signupForm.name.trim();
    const cleanEmail = signupForm.email.trim().toLowerCase();
    const pass = signupForm.password;

    if (cleanName.length < 2) {
      setAuthError('Full name must be at least 2 characters.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setAuthError('Please enter a valid email address.');
      return;
    }
    if (pass.length < 6) {
      setAuthError('Password must be at least 6 characters long.');
      return;
    }
    if (pass !== signupForm.confirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }
    if (!signupForm.acceptTerms) {
      setAuthError('Please accept the Terms of Service and Privacy Policy to continue.');
      return;
    }
    if (usersCollection.some((u) => u.email.toLowerCase() === cleanEmail)) {
      setAuthError('An account with this email address is already registered.');
      return;
    }

    setIsAuthLoading(true);
    setTimeout(() => {
      const newUserId = generateObjectId();
      const newUserDoc = {
        _id: newUserId,
        name: cleanName,
        email: cleanEmail,
        passwordPlain: pass,
        currency: 'INR',
        monthlyIncomeTarget: 80000,
        savingsGoalPct: 25,
        customCategories: [],
        role: 'Personal Account',
        jwtPreview: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({ id: newUserId, email: cleanEmail })).replace(/=/g, '')}`,
        bcryptHash: `$2a$10$${generateObjectId()}${generateObjectId().slice(0, 11)}`,
        createdAt: new Date().toISOString()
      };

      const starterBudgetDoc = {
        _id: generateObjectId(),
        userId: newUserId,
        month: selectedMonth,
        overallLimit: 45000,
        alertThresholdPct: 80,
        categoryLimits: {
          'Housing & Rent': 15000,
          'Food & Dining': 6000,
          'Groceries': 5000,
          'Transportation': 4000,
          'Utilities & Bills': 4000,
          'Shopping': 5000,
          'Entertainment': 2500,
          'Healthcare': 2000,
          'Education': 2000,
          'Others': 1500
        }
      };

      setUsersCollection((prev) => [...prev, newUserDoc]);
      setBudgetsCollection((prev) => [...prev, starterBudgetDoc]);
      setCurrentUser(newUserDoc);
      setAuthForm({
        name: newUserDoc.name,
        email: newUserDoc.email,
        currency: newUserDoc.currency,
        monthlyIncomeTarget: newUserDoc.monthlyIncomeTarget,
        savingsGoalPct: newUserDoc.savingsGoalPct
      });
      setIsAuthLoading(false);
      setIsAuthenticated(true);
      setActiveTab('dashboard');
      triggerToast(`Account created for ${newUserDoc.name}!`, 'success');
    }, 350);
  };

  const handleLogout = () => {
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    setIsAuthenticated(false);
    setAuthScreen('login');
    setAuthError('');
    triggerToast('Signed out safely.', 'info');
  };

  // ============================================================================
  // FINANCIAL ANALYTICS & AGGREGATIONS (User-Scoped)
  // ============================================================================

  const monthlySeries = useMemo(() => {
    const map = {};
    transactions.forEach((tx) => {
      const m = tx.date.slice(0, 7);
      if (!map[m]) {
        map[m] = { month: m, income: 0, expense: 0, savings: 0, count: 0 };
      }
      if (tx.type === 'income') map[m].income += Number(tx.amount);
      else map[m].expense += Number(tx.amount);
      map[m].count += 1;
    });

    const monthLabels = {
      '2026-06': 'Jun 26',
      '2026-07': 'Jul 26',
      '2026-08': 'Aug 26',
      '2026-09': 'Sep 26',
      '2026-10': 'Oct 26',
      '2026-11': 'Nov 26',
      '2026-12': 'Dec 26'
    };

    return Object.values(map)
      .sort((a, b) => a.month.localeCompare(b.month))
      .map((item) => ({
        ...item,
        label: monthLabels[item.month] || item.month,
        savings: item.income - item.expense,
        avgTxAmount: item.count > 0 ? Math.round((item.income + item.expense) / item.count) : 0,
        savingsRate: item.income > 0 ? Number((((item.income - item.expense) / item.income) * 100).toFixed(1)) : 0
      }));
  }, [transactions]);

  const selectedMonthStats = useMemo(() => {
    const monthTxs = transactions.filter((t) => t.date.startsWith(selectedMonth));
    let income = 0;
    let expense = 0;
    let recurringExpense = 0;
    const catMap = {};

    monthTxs.forEach((t) => {
      const amt = Number(t.amount);
      if (t.type === 'income') {
        income += amt;
      } else {
        expense += amt;
        if (t.isRecurring) recurringExpense += amt;
        if (!catMap[t.category]) catMap[t.category] = { category: t.category, amount: 0, count: 0, maxTx: 0 };
        catMap[t.category].amount += amt;
        catMap[t.category].count += 1;
        if (amt > catMap[t.category].maxTx) catMap[t.category].maxTx = amt;
      }
    });

    const cumulativeBalance = transactions.reduce(
      (acc, t) => acc + (t.type === 'income' ? Number(t.amount) : -Number(t.amount)),
      0
    );

    const categoryBreakdown = Object.values(catMap)
      .sort((a, b) => b.amount - a.amount)
      .map((c) => ({
        ...c,
        avgTx: c.count > 0 ? Math.round(c.amount / c.count) : 0,
        sharePct: expense > 0 ? Number(((c.amount / expense) * 100).toFixed(1)) : 0,
        color: CATEGORY_COLORS[c.category] || '#059669'
      }));

    const savings = income - expense;
    const savingsRate = income > 0 ? Number(((savings / income) * 100).toFixed(1)) : 0;
    const dailyAvgExpense = Math.round(expense / 30);
    const topCategory = categoryBreakdown[0] ? categoryBreakdown[0].category : 'None';

    return {
      cumulativeBalance,
      income,
      expense,
      recurringExpense,
      discretionaryExpense: Math.max(0, expense - recurringExpense),
      dailyAvgExpense,
      topCategory,
      savings,
      savingsRate,
      categoryBreakdown,
      monthTxs
    };
  }, [transactions, selectedMonth]);

  // Weekly & Yearly Report Series for Reports & Analytics Page
  const reportAnalytics = useMemo(() => {
    // 1. Weekly Breakdown of Selected Month (Weeks 1..4)
    const weeks = [
      { label: 'Week 1 (Days 1–7)', income: 0, expense: 0, savings: 0, count: 0 },
      { label: 'Week 2 (Days 8–14)', income: 0, expense: 0, savings: 0, count: 0 },
      { label: 'Week 3 (Days 15–21)', income: 0, expense: 0, savings: 0, count: 0 },
      { label: 'Week 4 (Days 22–31)', income: 0, expense: 0, savings: 0, count: 0 }
    ];

    selectedMonthStats.monthTxs.forEach((tx) => {
      const dayNum = Number(tx.date.slice(8, 10)) || 1;
      const wIdx = dayNum <= 7 ? 0 : dayNum <= 14 ? 1 : dayNum <= 21 ? 2 : 3;
      if (tx.type === 'income') weeks[wIdx].income += Number(tx.amount);
      else weeks[wIdx].expense += Number(tx.amount);
      weeks[wIdx].count += 1;
    });
    weeks.forEach((w) => {
      w.savings = w.income - w.expense;
    });

    // 2. Yearly Summary Rollup
    const yearlyIncome = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
    const yearlyExpense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
    const yearlyCatMap = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        if (!yearlyCatMap[t.category]) yearlyCatMap[t.category] = { category: t.category, amount: 0, count: 0 };
        yearlyCatMap[t.category].amount += Number(t.amount);
        yearlyCatMap[t.category].count += 1;
      });
    const yearlyCategories = Object.values(yearlyCatMap)
      .sort((a, b) => b.amount - a.amount)
      .map((c) => ({
        ...c,
        avgTx: c.count > 0 ? Math.round(c.amount / c.count) : 0,
        sharePct: yearlyExpense > 0 ? Number(((c.amount / yearlyExpense) * 100).toFixed(1)) : 0,
        color: CATEGORY_COLORS[c.category] || '#059669'
      }));

    return {
      weeks,
      yearlyIncome,
      yearlyExpense,
      yearlySavings: yearlyIncome - yearlyExpense,
      yearlySavingsRate: yearlyIncome > 0 ? Number((((yearlyIncome - yearlyExpense) / yearlyIncome) * 100).toFixed(1)) : 0,
      yearlyCategories
    };
  }, [selectedMonthStats, transactions]);

  // Budget Evaluation (80% Warning & 100% Exceeded Alerts)
  const budgetEvaluation = useMemo(() => {
    const { expense, categoryBreakdown } = selectedMonthStats;
    const overallPct = budgetConfig.overallLimit > 0 ? Number(((expense / budgetConfig.overallLimit) * 100).toFixed(1)) : 0;
    const spendByCat = {};
    const countByCat = {};
    categoryBreakdown.forEach((c) => {
      spendByCat[c.category] = c.amount;
      countByCat[c.category] = c.count;
    });

    const alerts = [];
    if (overallPct >= 100) {
      alerts.push({
        id: 'alert-overall',
        level: 'critical',
        scope: 'Overall Monthly Budget',
        spent: expense,
        limit: budgetConfig.overallLimit,
        pct: overallPct,
        message: `100% Budget Exceeded Alert: Overall monthly spending (${formatINR(expense)}) has exceeded your ${formatINR(budgetConfig.overallLimit)} limit.`
      });
    } else if (overallPct >= budgetConfig.alertThresholdPct) {
      alerts.push({
        id: 'alert-overall',
        level: 'warning',
        scope: 'Overall Monthly Budget',
        spent: expense,
        limit: budgetConfig.overallLimit,
        pct: overallPct,
        message: `80% Spending Warning: Overall spending has reached ${overallPct}% of your ${formatINR(budgetConfig.overallLimit)} monthly budget.`
      });
    }

    const categoriesStatus = expenseCategoriesList.map((cat) => {
      const limit = budgetConfig.categoryLimits[cat] || 3000;
      const spent = spendByCat[cat] || 0;
      const txCount = countByCat[cat] || 0;
      const pct = limit > 0 ? Number(((spent / limit) * 100).toFixed(1)) : 0;
      let status = 'healthy';
      if (pct >= 100) {
        status = 'exceeded';
        alerts.push({
          id: `alert-${cat}`,
          level: 'critical',
          scope: cat,
          spent,
          limit,
          pct,
          message: `100% Budget Exceeded: ${cat} spending (${formatINR(spent)}) exceeded its ${formatINR(limit)} limit (${pct}%).`
        });
      } else if (pct >= budgetConfig.alertThresholdPct) {
        status = 'warning';
        alerts.push({
          id: `alert-${cat}`,
          level: 'warning',
          scope: cat,
          spent,
          limit,
          pct,
          message: `80% Warning: ${cat} spending reached ${pct}% (${formatINR(spent)} of ${formatINR(limit)}).`
        });
      }
      return {
        category: cat,
        budgetDocId: budgetConfig._id,
        month: selectedMonth,
        limit,
        spent,
        txCount,
        remaining: Math.max(0, limit - spent),
        overrun: Math.max(0, spent - limit),
        pct,
        status,
        color: CATEGORY_COLORS[cat] || '#059669'
      };
    });

    return {
      overallPct,
      alerts: alerts.sort((a, b) => b.pct - a.pct),
      categoriesStatus
    };
  }, [selectedMonthStats, budgetConfig, selectedMonth, expenseCategoriesList]);

  // Expense Calendar Daily Aggregation Grid
  const calendarGridData = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDayWeekday = new Date(year, month - 1, 1).getDay(); // 0 = Sun

    const dailyMap = {};
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${selectedMonth}-${String(d).padStart(2, '0')}`;
      dailyMap[dateStr] = {
        dateStr,
        day: d,
        income: 0,
        expense: 0,
        txs: [],
        billsDue: []
      };
    }

    selectedMonthStats.monthTxs.forEach((tx) => {
      if (dailyMap[tx.date]) {
        if (tx.type === 'income') dailyMap[tx.date].income += Number(tx.amount);
        else dailyMap[tx.date].expense += Number(tx.amount);
        dailyMap[tx.date].txs.push(tx);
      }
    });

    billReminders.forEach((bill) => {
      if (dailyMap[bill.dueDate]) {
        dailyMap[bill.dueDate].billsDue.push(bill);
      }
    });

    const cells = [];
    for (let i = 0; i < firstDayWeekday; i++) {
      cells.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${selectedMonth}-${String(d).padStart(2, '0')}`;
      const info = dailyMap[dateStr];
      cells.push({
        ...info,
        isHighSpend: info.expense >= 5000
      });
    }

    const activeDateInfo = dailyMap[selectedCalendarDate] || dailyMap[`${selectedMonth}-01`] || {
      dateStr: `${selectedMonth}-01`,
      day: 1,
      income: 0,
      expense: 0,
      txs: [],
      billsDue: []
    };

    return { cells, activeDateInfo };
  }, [selectedMonth, selectedMonthStats, billReminders, selectedCalendarDate]);

  // AI Analytics & Scikit-learn OLS Linear Regression Engine
  const aiAnalytics = useMemo(() => {
    const MIN_MONTHS = 3;
    const numMonths = monthlySeries.length;
    const hasSufficientData = numMonths >= MIN_MONTHS;

    const expTxs = transactions.filter((t) => t.type === 'expense');
    const catGroups = {};
    expTxs.forEach((t) => {
      if (!catGroups[t.category]) catGroups[t.category] = [];
      catGroups[t.category].push(Number(t.amount));
    });

    const catStats = {};
    Object.entries(catGroups).forEach(([cat, arr]) => {
      const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
      const variance = arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / arr.length;
      catStats[cat] = { mean, std: Math.sqrt(variance), count: arr.length };
    });

    const anomalies = expTxs
      .map((tx) => {
        const st = catStats[tx.category] || { mean: tx.amount, std: 0, count: 1 };
        const zScore = st.std > 0 ? (tx.amount - st.mean) / st.std : 0;
        const ratio = st.mean > 0 ? tx.amount / st.mean : 1;
        return {
          ...tx,
          categoryMean: Math.round(st.mean),
          zScore: Number(zScore.toFixed(2)),
          ratio: Number(ratio.toFixed(2)),
          isAnomaly: st.count >= 3 && zScore >= 1.35 && ratio >= 1.45 && tx.amount >= 2500
        };
      })
      .filter((tx) => tx.isAnomaly)
      .sort((a, b) => b.ratio - a.ratio);

    const savingSuggestions = [];
    const { income, expense, savingsRate } = selectedMonthStats;

    budgetEvaluation.categoriesStatus.forEach((cs) => {
      if (cs.pct >= 80 && cs.category !== 'Housing & Rent') {
        const targetCut = Math.round(cs.spent * 0.2);
        savingSuggestions.push({
          id: `rule-cat-${cs.category}`,
          title: `Trim ${cs.category} Outflow (${cs.pct}% of Cap Used)`,
          category: cs.category,
          potentialMonthlySaving: targetCut,
          potentialAnnualSaving: targetCut * 12,
          recommendation: `Your ${cs.category} spending in ${selectedMonth} reached ${formatINR(cs.spent)} against a ${formatINR(cs.limit)} budget. Reducing discretionary orders by 20% saves ${formatINR(targetCut)}/month.`
        });
      }
    });

    const wantsCategories = ['Food & Dining', 'Shopping', 'Entertainment'];
    const wantsSpend = selectedMonthStats.categoryBreakdown
      .filter((c) => wantsCategories.includes(c.category))
      .reduce((s, c) => s + c.amount, 0);
    const wantsPctOfIncome = income > 0 ? Number(((wantsSpend / income) * 100).toFixed(1)) : 0;

    if (wantsPctOfIncome > 12) {
      const saveAmt = Math.round(wantsSpend * 0.18);
      savingSuggestions.push({
        id: 'rule-wants-ratio',
        title: '50/30/20 Discretionary Allocation Rule',
        category: 'Lifestyle & Wants',
        potentialMonthlySaving: saveAmt,
        potentialAnnualSaving: saveAmt * 12,
        recommendation: `Lifestyle spending across Dining, Shopping, and Entertainment is ${formatINR(wantsSpend)} (${wantsPctOfIncome}% of income). Setting a weekly UPI cap can redirect ${formatINR(saveAmt)}/month into your savings goals.`
      });
    }

    const creditCardSpend = selectedMonthStats.monthTxs
      .filter((t) => t.type === 'expense' && t.paymentMethod === 'Credit Card')
      .reduce((s, t) => s + Number(t.amount), 0);
    if (creditCardSpend > expense * 0.25) {
      const saveInterest = Math.round(creditCardSpend * 0.1);
      savingSuggestions.push({
        id: 'rule-cc-share',
        title: 'Credit Card Utilization Balancing',
        category: 'Payment Mix',
        potentialMonthlySaving: saveInterest,
        potentialAnnualSaving: saveInterest * 12,
        recommendation: `${formatINR(creditCardSpend)} (${Math.round((creditCardSpend / Math.max(1, expense)) * 100)}% of monthly expenses) was charged to Credit Cards. Shifting routine dining and shopping to UPI reduces impulse spend by ~10%.`
      });
    }

    if (!hasSufficientData) {
      return {
        hasSufficientData: false,
        availableMonths: numMonths,
        minimumMonthsRequired: MIN_MONTHS,
        anomalies,
        savingSuggestions,
        savingsRate
      };
    }

    const n = numMonths;
    const xVals = monthlySeries.map((_, idx) => idx);
    const yVals = monthlySeries.map((m) => m.expense);

    const xMean = xVals.reduce((a, b) => a + b, 0) / n;
    const yMean = yVals.reduce((a, b) => a + b, 0) / n;

    let num = 0;
    let den = 0;
    for (let i = 0; i < n; i++) {
      num += (xVals[i] - xMean) * (yVals[i] - yMean);
      den += Math.pow(xVals[i] - xMean, 2);
    }
    const slope = den === 0 ? 0 : num / den;
    const intercept = yMean - slope * xMean;

    let ssRes = 0;
    let ssTot = 0;
    const fittedSeries = monthlySeries.map((m, idx) => {
      const yHat = intercept + slope * idx;
      ssRes += Math.pow(m.expense - yHat, 2);
      ssTot += Math.pow(m.expense - yMean, 2);
      return {
        ...m,
        actualExpense: m.expense,
        regressionFit: Math.round(yHat),
        predictedExpense: null
      };
    });

    const r2Score = ssTot === 0 ? 1 : Math.max(0, 1 - ssRes / ssTot);
    const residualStd = Math.sqrt(ssRes / Math.max(1, n - 2));
    const confidence95 = Math.round(1.96 * residualStd);
    const nextMonthPred = Math.max(0, Math.round(intercept + slope * n));

    const chartForecastSeries = [
      ...fittedSeries,
      {
        month: '2026-12',
        label: 'Dec 26 (Forecast)',
        actualExpense: null,
        regressionFit: nextMonthPred,
        predictedExpense: nextMonthPred
      }
    ];

    const categoryForecasts = expenseCategoriesList
      .map((cat) => {
        const catMonthlyY = monthlySeries.map((m) =>
          transactions
            .filter((t) => t.type === 'expense' && t.category === cat && t.date.startsWith(m.month))
            .reduce((s, t) => s + Number(t.amount), 0)
        );
        const catMean = catMonthlyY.reduce((a, b) => a + b, 0) / n;
        let cNum = 0;
        for (let i = 0; i < n; i++) {
          cNum += (xVals[i] - xMean) * (catMonthlyY[i] - catMean);
        }
        const cSlope = den === 0 ? 0 : cNum / den;
        const cIntercept = catMean - cSlope * xMean;
        const predNext = Math.max(0, Math.round(cIntercept + cSlope * n));
        return {
          category: cat,
          historicalAvg: Math.round(catMean),
          lastMonthActual: catMonthlyY[n - 1] || 0,
          predictedNextMonth: predNext,
          trendSlope: Math.round(cSlope)
        };
      })
      .filter((c) => c.historicalAvg > 0 || c.predictedNextMonth > 0)
      .sort((a, b) => b.predictedNextMonth - a.predictedNextMonth);

    return {
      hasSufficientData: true,
      availableMonths: numMonths,
      minimumMonthsRequired: MIN_MONTHS,
      predictedNextMonthTotal: nextMonthPred,
      confidence95,
      r2Score: Number(r2Score.toFixed(3)),
      slope: Math.round(slope),
      intercept: Math.round(intercept),
      chartForecastSeries,
      categoryForecasts,
      anomalies,
      savingSuggestions
    };
  }, [monthlySeries, transactions, selectedMonthStats, budgetEvaluation, selectedMonth, expenseCategoriesList]);

  // Filtered & Sorted Transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        if (filterType !== 'all' && tx.type !== filterType) return false;
        if (filterCategory !== 'all' && tx.category !== filterCategory) return false;
        if (filterPayment !== 'all' && tx.paymentMethod !== filterPayment) return false;
        if (filterMonth !== 'all' && !tx.date.startsWith(filterMonth)) return false;
        if (startDateFilter && tx.date < startDateFilter) return false;
        if (endDateFilter && tx.date > endDateFilter) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = tx.title.toLowerCase().includes(q);
          const matchNotes = (tx.notes || '').toLowerCase().includes(q);
          const matchCat = tx.category.toLowerCase().includes(q);
          if (!matchTitle && !matchNotes && !matchCat) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date_desc') return b.date.localeCompare(a.date);
        if (sortBy === 'date_asc') return a.date.localeCompare(b.date);
        if (sortBy === 'amount_desc') return Number(b.amount) - Number(a.amount);
        if (sortBy === 'amount_asc') return Number(a.amount) - Number(b.amount);
        return 0;
      });
  }, [transactions, filterType, filterCategory, filterPayment, filterMonth, startDateFilter, endDateFilter, searchQuery, sortBy]);

  // ============================================================================
  // CRUD HANDLERS FOR TRANSACTIONS, CUSTOM CATEGORIES & CSV IMPORT
  // ============================================================================
  const openAddTransactionModal = (presetDate = null) => {
    setEditingTxId(null);
    setTxForm({
      title: '',
      amount: '',
      type: 'expense',
      category: 'Food & Dining',
      paymentMethod: 'UPI',
      date: typeof presetDate === 'string' ? presetDate : `${selectedMonth}-16`,
      isRecurring: false,
      attachmentName: '',
      notes: ''
    });
    setTxModalOpen(true);
  };

  const openEditTransactionModal = (tx) => {
    setEditingTxId(tx._id);
    setTxForm({
      title: tx.title,
      amount: String(tx.amount),
      type: tx.type,
      category: tx.category,
      paymentMethod: tx.paymentMethod,
      date: tx.date,
      isRecurring: Boolean(tx.isRecurring),
      attachmentName: tx.attachmentName || '',
      notes: tx.notes || ''
    });
    setTxModalOpen(true);
  };

  const handleSaveTransaction = (e) => {
    e.preventDefault();
    const numericAmount = Number(txForm.amount);
    if (!txForm.title.trim() || isNaN(numericAmount) || numericAmount <= 0) {
      triggerToast('Please enter a valid description and positive amount.', 'error');
      return;
    }

    const monthStr = (txForm.date || '2026-11-16').slice(0, 7);

    if (editingTxId) {
      setAllTransactions((prev) =>
        prev.map((item) =>
          item._id === editingTxId && item.userId === activeUserId
            ? { ...item, ...txForm, amount: numericAmount, month: monthStr }
            : item
        )
      );
      triggerToast(`Updated transaction "${txForm.title}".`, 'success');
    } else {
      const newObjId = generateObjectId();
      const newTx = {
        _id: newObjId,
        userId: activeUserId,
        title: txForm.title.trim(),
        amount: numericAmount,
        type: txForm.type,
        category: txForm.category,
        paymentMethod: txForm.paymentMethod,
        date: txForm.date || '2026-11-16',
        month: monthStr,
        isRecurring: Boolean(txForm.isRecurring),
        attachmentName: txForm.attachmentName || '',
        notes: txForm.notes.trim()
      };
      setAllTransactions((prev) => [newTx, ...prev]);
      triggerToast(`Recorded ${formatINR(numericAmount)} in ${txForm.category}.`, 'success');
    }
    setTxModalOpen(false);
  };

  const handleDeleteTransaction = (id, title) => {
    setAllTransactions((prev) => prev.filter((item) => !(item._id === id && item.userId === activeUserId)));
    triggerToast(`Removed transaction "${title}".`, 'info');
  };

  const handleAddCustomCategory = (e) => {
    e.preventDefault();
    const clean = newCustomCategory.trim();
    if (!clean) return;
    if (expenseCategoriesList.includes(clean)) {
      triggerToast('Category already exists.', 'info');
      return;
    }
    setCurrentUser((prev) => ({
      ...prev,
      customCategories: [...(prev.customCategories || []), clean]
    }));
    setUsersCollection((prev) =>
      prev.map((u) =>
        u._id === activeUserId
          ? { ...u, customCategories: [...(u.customCategories || []), clean] }
          : u
      )
    );
    setNewCustomCategory('');
    triggerToast(`Added custom category "${clean}".`, 'success');
  };

  // Validate & Import CSV Rows
  const handleValidateCsvText = (rawText) => {
    const lines = rawText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    const valid = [];
    const rejected = [];

    lines.forEach((line, idx) => {
      if (idx === 0 && line.toLowerCase().startsWith('date,')) return;
      const parts = line.split(',').map((p) => p.trim().replace(/^"|"$/g, ''));
      const [date, title, type, category, paymentMethod, amountStr, notes] = parts;
      const amt = Number(amountStr);
      const isDateValid = /^\d{4}-\d{2}-\d{2}$/.test(date || '');
      const cleanType = (type || '').toLowerCase();

      if (!isDateValid) {
        rejected.push({ line: idx + 1, raw: line, reason: 'Invalid date (expected YYYY-MM-DD)' });
      } else if (!title) {
        rejected.push({ line: idx + 1, raw: line, reason: 'Missing description/title' });
      } else if (!['income', 'expense'].includes(cleanType)) {
        rejected.push({ line: idx + 1, raw: line, reason: 'Type must be income or expense' });
      } else if (isNaN(amt) || amt <= 0) {
        rejected.push({ line: idx + 1, raw: line, reason: 'Amount must be a positive number' });
      } else {
        valid.push({
          _id: generateObjectId(),
          userId: activeUserId,
          date,
          month: date.slice(0, 7),
          title,
          type: cleanType,
          category: category || 'Others',
          paymentMethod: PAYMENT_METHODS.includes(paymentMethod) ? paymentMethod : 'UPI',
          amount: amt,
          isRecurring: false,
          attachmentName: '',
          notes: notes || 'CSV Import'
        });
      }
    });

    setCsvValidationPreview({ valid, rejected });
  };

  const handleConfirmCsvImport = () => {
    if (!csvValidationPreview || csvValidationPreview.valid.length === 0) {
      triggerToast('No valid CSV rows to import.', 'error');
      return;
    }
    if (backendConnected && jwtToken) {
      apiFetch('/transactions/import-csv', {
        method: 'POST',
        body: JSON.stringify({ rows: csvValidationPreview.valid })
      }, jwtToken).catch(() => {});
    }
    setAllTransactions((prev) => [...csvValidationPreview.valid, ...prev]);
    triggerToast(`Imported ${csvValidationPreview.valid.length} validated transactions!`, 'success');
    setCsvModalOpen(false);
    setCsvValidationPreview(null);
  };

  // ============================================================================
  // HANDLERS FOR RECURRING EXPENSES
  // ============================================================================
  const handleSaveRecurring = (e) => {
    e.preventDefault();
    const amt = Number(recurringForm.amount);
    if (!recurringForm.title.trim() || isNaN(amt) || amt <= 0) {
      triggerToast('Please provide a valid title and positive amount.', 'error');
      return;
    }
    if (editingRecurringId) {
      setAllRecurring((prev) =>
        prev.map((r) =>
          r._id === editingRecurringId && r.userId === activeUserId
            ? { ...r, ...recurringForm, amount: amt, dayOfMonth: Number(recurringForm.dayOfMonth) || 1 }
            : r
        )
      );
      triggerToast(`Updated recurring schedule "${recurringForm.title}".`, 'success');
    } else {
      const created = {
        _id: generateObjectId(),
        userId: activeUserId,
        ...recurringForm,
        amount: amt,
        dayOfMonth: Number(recurringForm.dayOfMonth) || 1,
        status: 'active',
        lastGeneratedDate: null
      };
      if (backendConnected && jwtToken) {
        apiFetch('/recurring', { method: 'POST', body: JSON.stringify(created) }, jwtToken).catch(() => {});
      }
      setAllRecurring((prev) => [created, ...prev]);
      triggerToast(`Created recurring schedule "${created.title}".`, 'success');
    }
    setRecurringModalOpen(false);
  };

  const handleGenerateRecurringTransaction = (schedule) => {
    const dueStr = schedule.nextDueDate || `${selectedMonth}-16`;
    const newTx = {
      _id: generateObjectId(),
      userId: activeUserId,
      title: `${schedule.title} (Auto-Recurring)`,
      amount: Number(schedule.amount),
      type: schedule.type,
      category: schedule.category,
      paymentMethod: schedule.paymentMethod,
      date: dueStr,
      month: dueStr.slice(0, 7),
      isRecurring: true,
      attachmentName: '',
      notes: `Generated from ${schedule.frequency} recurring schedule`
    };

    // Advance nextDueDate by 1 period
    const [y, m, d] = dueStr.split('-').map(Number);
    const nextDate = new Date(Date.UTC(y, m - 1, d || 1));
    if (schedule.frequency === 'weekly') nextDate.setUTCDate(nextDate.getUTCDate() + 7);
    else if (schedule.frequency === 'yearly') nextDate.setUTCFullYear(nextDate.getUTCFullYear() + 1);
    else nextDate.setUTCMonth(nextDate.getUTCMonth() + 1);
    const nextDueStr = nextDate.toISOString().slice(0, 10);

    setAllTransactions((prev) => [newTx, ...prev]);
    setAllRecurring((prev) =>
      prev.map((r) =>
        r._id === schedule._id
          ? { ...r, lastGeneratedDate: dueStr, nextDueDate: nextDueStr }
          : r
      )
    );
    triggerToast(`Generated ${formatINR(schedule.amount)} transaction for "${schedule.title}". Next due: ${nextDueStr}`, 'success');
  };

  const handleToggleRecurringStatus = (id, nextStatus) => {
    setAllRecurring((prev) =>
      prev.map((r) => (r._id === id && r.userId === activeUserId ? { ...r, status: nextStatus } : r))
    );
    triggerToast(`Schedule status updated to ${nextStatus}.`, 'info');
  };

  // ============================================================================
  // HANDLERS FOR SAVINGS GOALS
  // ============================================================================
  const handleSaveGoal = (e) => {
    e.preventDefault();
    const target = Number(goalForm.targetAmount);
    const current = Number(goalForm.currentAmount) || 0;
    const monthly = Number(goalForm.monthlyCommitment) || 5000;
    if (!goalForm.name.trim() || isNaN(target) || target <= 0) {
      triggerToast('Please enter a valid goal name and target amount.', 'error');
      return;
    }

    if (editingGoalId) {
      setAllGoals((prev) =>
        prev.map((g) =>
          g._id === editingGoalId && g.userId === activeUserId
            ? {
                ...g,
                name: goalForm.name.trim(),
                category: goalForm.category,
                targetAmount: target,
                currentAmount: current,
                monthlyCommitment: monthly,
                targetDate: goalForm.targetDate
              }
            : g
        )
      );
      triggerToast(`Updated savings goal "${goalForm.name}".`, 'success');
    } else {
      const created = {
        _id: generateObjectId(),
        userId: activeUserId,
        name: goalForm.name.trim(),
        category: goalForm.category,
        targetAmount: target,
        currentAmount: current,
        monthlyCommitment: monthly,
        targetDate: goalForm.targetDate || '2027-06-30',
        status: current >= target ? 'completed' : 'active',
        contributions: current > 0 ? [{ amount: current, date: `${selectedMonth}-16`, note: 'Initial deposit' }] : []
      };
      if (backendConnected && jwtToken) {
        apiFetch('/goals', { method: 'POST', body: JSON.stringify(created) }, jwtToken).catch(() => {});
      }
      setAllGoals((prev) => [created, ...prev]);
      triggerToast(`Created savings goal "${created.name}".`, 'success');
    }
    setGoalModalOpen(false);
  };

  const handleContributeToGoal = (goalId, rawAmount) => {
    const amt = Number(rawAmount);
    if (isNaN(amt) || amt <= 0) {
      triggerToast('Enter a positive contribution amount.', 'error');
      return;
    }
    setAllGoals((prev) =>
      prev.map((g) => {
        if (g._id !== goalId || g.userId !== activeUserId) return g;
        const nextCurrent = g.currentAmount + amt;
        return {
          ...g,
          currentAmount: nextCurrent,
          status: nextCurrent >= g.targetAmount ? 'completed' : 'active',
          contributions: [
            { amount: amt, date: `${selectedMonth}-16`, note: 'Added contribution' },
            ...(g.contributions || [])
          ]
        };
      })
    );
    setContributionInputs((prev) => ({ ...prev, [goalId]: '' }));
    triggerToast(`Added ${formatINR(amt)} contribution to your savings goal!`, 'success');
  };

  const handleDeleteGoal = (id, name) => {
    setAllGoals((prev) => prev.filter((g) => !(g._id === id && g.userId === activeUserId)));
    triggerToast(`Deleted savings goal "${name}".`, 'info');
  };

  // ============================================================================
  // HANDLERS FOR BILL REMINDERS
  // ============================================================================
  const handleSaveBill = (e) => {
    e.preventDefault();
    const amt = Number(billForm.amount);
    if (!billForm.title.trim() || isNaN(amt) || amt <= 0) {
      triggerToast('Please enter a valid bill name and positive amount.', 'error');
      return;
    }
    if (editingBillId) {
      setAllBills((prev) =>
        prev.map((b) =>
          b._id === editingBillId && b.userId === activeUserId
            ? { ...b, ...billForm, amount: amt }
            : b
        )
      );
      triggerToast(`Updated bill reminder "${billForm.title}".`, 'success');
    } else {
      const created = {
        _id: generateObjectId(),
        userId: activeUserId,
        ...billForm,
        amount: amt,
        status: 'pending'
      };
      if (backendConnected && jwtToken) {
        apiFetch('/bills', { method: 'POST', body: JSON.stringify(created) }, jwtToken).catch(() => {});
      }
      setAllBills((prev) => [created, ...prev]);
      triggerToast(`Added bill reminder "${created.title}".`, 'success');
    }
    setBillModalOpen(false);
  };

  const handleToggleBillPaid = (bill) => {
    if (bill.status === 'paid') {
      setAllBills((prev) =>
        prev.map((b) => (b._id === bill._id ? { ...b, status: 'pending' } : b))
      );
      triggerToast(`Marked "${bill.title}" as pending.`, 'info');
      return;
    }

    // Mark paid & record expense transaction automatically
    const newTx = {
      _id: generateObjectId(),
      userId: activeUserId,
      title: `Bill Payment: ${bill.title}`,
      amount: Number(bill.amount),
      type: 'expense',
      category: bill.category === 'Credit Card Bill' ? 'Shopping' : bill.category,
      paymentMethod: bill.paymentMethod || 'UPI',
      date: `${selectedMonth}-16`,
      month: selectedMonth,
      isRecurring: Boolean(bill.isRecurringBill),
      attachmentName: '',
      notes: `Paid bill due ${bill.dueDate}`
    };

    setAllTransactions((prev) => [newTx, ...prev]);
    setAllBills((prev) =>
      prev.map((b) => (b._id === bill._id ? { ...b, status: 'paid' } : b))
    );
    triggerToast(`Marked "${bill.title}" as Paid and recorded ${formatINR(bill.amount)} expense!`, 'success');
  };

  const handleDeleteBill = (id, title) => {
    setAllBills((prev) => prev.filter((b) => !(b._id === id && b.userId === activeUserId)));
    triggerToast(`Deleted bill reminder "${title}".`, 'info');
  };

  // ============================================================================
  // AI FINANCE ASSISTANT Q&A ENGINE (Grounded strictly in user's actual records)
  // ============================================================================
  const handleAskAssistant = (questionText) => {
    const qRaw = (questionText || assistantInput).trim();
    if (!qRaw) return;
    const q = qRaw.toLowerCase();

    const userMsg = { id: 'msg-u-' + Date.now(), role: 'user', text: qRaw };

    let reply = '';
    const { income, expense, savings, savingsRate, categoryBreakdown } = selectedMonthStats;
    const pendingBills = billReminders.filter((b) => b.status !== 'paid');
    const pendingBillsTotal = pendingBills.reduce((s, b) => s + Number(b.amount), 0);

    if (q.includes('unnecessary') || q.includes('overspend') || q.includes('cut') || q.includes('save')) {
      const topDiscretionary = categoryBreakdown.filter(
        (c) => !['Housing & Rent', 'Utilities & Bills', 'EMI & Loans'].includes(c.category)
      );
      const top1 = topDiscretionary[0];
      const top2 = topDiscretionary[1];
      const savePot = aiAnalytics.savingSuggestions.reduce((s, x) => s + x.potentialMonthlySaving, 0);
      reply = `Based on your ${selectedMonth} records, your top non-essential spending is ${
        top1 ? `${top1.category} (${formatINR(top1.amount)}, ${top1.sharePct}% of spend)` : 'minimal'
      }${top2 ? ` followed by ${top2.category} (${formatINR(top2.amount)})` : ''}. ${
        budgetEvaluation.alerts.length > 0 ? budgetEvaluation.alerts[0].message : ''
      } Trimming discretionary orders by 20% can save approximately ${formatINR(savePot || 2500)}/month (${formatINR((savePot || 2500) * 12)}/year).`;
    } else if (q.includes('bill') || q.includes('due') || q.includes('reminder')) {
      reply =
        pendingBills.length > 0
          ? `You have ${pendingBills.length} pending bill(s) totaling ${formatINR(pendingBillsTotal)}: ${pendingBills
              .map((b) => `${b.title} (${formatINR(b.amount)}, due ${b.dueDate})`)
              .join('; ')}. You can mark them as paid directly in the Bill Reminders tab.`
          : `All ${billReminders.length} of your tracked bills for ${selectedMonth} are already marked as Paid!`;
    } else if (q.includes('goal') || q.includes('target') || q.includes('macbook') || q.includes('emergency')) {
      reply =
        savingsGoals.length > 0
          ? `You are tracking ${savingsGoals.length} active savings goal(s): ` +
            savingsGoals
              .map((g) => {
                const rem = Math.max(0, g.targetAmount - g.currentAmount);
                const mos = g.monthlyCommitment > 0 ? Math.ceil(rem / g.monthlyCommitment) : 0;
                const pct = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
                return `${g.name} is ${pct}% complete (${formatINR(g.currentAmount)} of ${formatINR(g.targetAmount)} saved; ${formatINR(rem)} remaining, ~${mos} month(s) to completion at ${formatINR(g.monthlyCommitment)}/mo)`;
              })
              .join(' • ')
          : 'You currently have no active savings goals. Open the Savings Goals tab to create one!';
    } else if (q.includes('predict') || q.includes('forecast') || q.includes('next month') || q.includes('december')) {
      reply = aiAnalytics.hasSufficientData
        ? `Using Ordinary Least Squares (OLS) linear regression across your ${aiAnalytics.availableMonths} months of historical records (R² = ${aiAnalytics.r2Score}), your projected December 2026 expense is ${formatINR(
            aiAnalytics.predictedNextMonthTotal
          )} (±${formatINR(aiAnalytics.confidence95)}), with a monthly trend slope of +${formatINR(aiAnalytics.slope)}/month.`
        : `Expense forecasting requires at least ${aiAnalytics.minimumMonthsRequired} months of historical records. Your profile currently has ${aiAnalytics.availableMonths} month(s) recorded.`;
    } else if (q.includes('recurring') || q.includes('subscription') || q.includes('emi')) {
      const activeRec = recurringSchedules.filter((r) => r.status === 'active' && r.type === 'expense');
      const totalRec = activeRec.reduce((s, r) => s + Number(r.amount), 0);
      reply = `You have ${activeRec.length} active recurring expense schedule(s) totaling ${formatINR(totalRec)}/month: ${activeRec
        .map((r) => `${r.title} (${formatINR(r.amount)} on day ${r.dayOfMonth})`)
        .join(', ')}.`;
    } else {
      const topCat = categoryBreakdown[0];
      reply = `For ${selectedMonth}, your recorded income is ${formatINR(income)}, total expenses are ${formatINR(
        expense
      )}, and net savings are ${formatINR(savings)} (${savingsRate}% savings rate). Your cumulative net balance across all ${
        transactions.length
      } transactions is ${formatINR(selectedMonthStats.cumulativeBalance)}, and your largest expense category this month is ${
        topCat ? `${topCat.category} (${formatINR(topCat.amount)})` : 'N/A'
      }.`;
    }

    setAssistantMessages((prev) => [
      ...prev,
      userMsg,
      { id: 'msg-a-' + (Date.now() + 1), role: 'assistant', text: reply }
    ]);
    setAssistantInput('');
  };

  // Export CSV Handler
  const handleExportCSV = () => {
    const headers = ['Date,Title,Type,Category,PaymentMethod,Amount,Recurring,Attachment,Notes'];
    const rows = filteredTransactions.map((t) =>
      `"${t.date}","${t.title.replace(/"/g, '""')}","${t.type}","${t.category}","${t.paymentMethod}",${t.amount},${Boolean(t.isRecurring)},"${t.attachmentName || ''}","${(t.notes || '').replace(/"/g, '""')}"`
    );
    const csvString = headers.concat(rows).join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `spendsmart_report_${selectedMonth}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    triggerToast(`Exported ${filteredTransactions.length} transactions to CSV.`, 'success');
  };

  const passwordStrength = computePasswordStrength(signupForm.password);
  const pendingBillsList = billReminders.filter((b) => b.status !== 'paid');
  const pendingBillsTotalAmount = pendingBillsList.reduce((s, b) => s + Number(b.amount), 0);

  // ============================================================================
  // STANDALONE AUTHENTICATION SCREENS (LOGIN, SIGNUP, FORGOT PASSWORD)
  // ============================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col lg:flex-row overflow-x-hidden">
        {toast && (
          <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border bg-white border-emerald-200 text-slate-800 max-w-md">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-sm font-medium">{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-auto text-slate-400 hover:text-slate-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Left Branding Panel */}
        <div className="lg:w-5/12 bg-slate-900 text-white p-8 lg:p-12 flex flex-col justify-between">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold tracking-tight">SpendSmart AI</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Personal Finance
                  </span>
                </div>
                <p className="text-xs text-slate-400">Complete Financial Management Platform</p>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-snug text-white">
                Master Your Cashflow, Budgets, Bills &amp; Savings Goals in One Place.
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                Track daily expenses, automate recurring bills and EMIs, forecast future spending with machine learning, and reach your savings targets faster.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {[
                'Automated Recurring Expenses, Subscriptions & EMI Tracking',
                'Interactive Savings Goals with Completion Date Forecasting',
                'Smart Bill Reminders, Expense Calendar & PDF/CSV Reports',
                'Conversational AI Finance Assistant Grounded in Your Data'
              ].map((feat) => (
                <div key={feat} className="flex items-center gap-2.5 text-xs text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Quick-Fill Demo Accounts
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setAuthScreen('login');
                  setLoginForm({ email: 'aarav@spendsmart.ai', password: 'SpendSmart@123', rememberMe: true });
                  setAuthError('');
                }}
                className="p-3 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-left transition"
              >
                <div className="text-xs font-bold text-emerald-400">Aarav Sharma (6M Data)</div>
                <div className="text-[11px] text-slate-300 font-mono mt-0.5">aarav@spendsmart.ai</div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthScreen('login');
                  setLoginForm({ email: 'priya@spendsmart.ai', password: 'Priya@123', rememberMe: true });
                  setAuthError('');
                }}
                className="p-3 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-left transition"
              >
                <div className="text-xs font-bold text-amber-400">Priya Patel (2M Data)</div>
                <div className="text-[11px] text-slate-300 font-mono mt-0.5">priya@spendsmart.ai</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Form Container */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200/90 p-7 sm:p-8 shadow-sm space-y-6">
            {authScreen === 'login' && (
              <>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Sign in to SpendSmart AI</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Enter your registered email and password to access your personal finance workspace.
                  </p>
                </div>

                {authError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{authError}</span>
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs sm:text-sm">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={loginForm.email}
                        onChange={(e) => setLoginForm((p) => ({ ...p, email: e.target.value }))}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-700">Password</label>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthScreen('forgot');
                          setForgotEmail(loginForm.email);
                          setAuthError('');
                        }}
                        className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={loginForm.password}
                        onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
                        placeholder="Enter your password"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={loginForm.rememberMe}
                        onChange={(e) => setLoginForm((p) => ({ ...p, rememberMe: e.target.checked }))}
                        className="rounded border-slate-300 accent-emerald-600"
                      />
                      <span>Remember me for 7 days</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isAuthLoading}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition"
                  >
                    {isAuthLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <span>Sign In</span>
                    )}
                  </button>
                </form>

                <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
                  Don&apos;t have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthScreen('signup');
                      setAuthError('');
                    }}
                    className="font-bold text-emerald-600 hover:text-emerald-700"
                  >
                    Create an account
                  </button>
                </div>
              </>
            )}

            {authScreen === 'signup' && (
              <>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Create your SpendSmart Account</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Set up your private personal finance profile in seconds.
                  </p>
                </div>

                {authError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{authError}</span>
                  </div>
                )}

                <form onSubmit={handleSignupSubmit} className="space-y-3.5 text-xs sm:text-sm">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={signupForm.name}
                        onChange={(e) => setSignupForm((p) => ({ ...p, name: e.target.value }))}
                        placeholder="e.g., Rohan Verma"
                        className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={signupForm.email}
                        onChange={(e) => setSignupForm((p) => ({ ...p, email: e.target.value }))}
                        placeholder="rohan@example.com"
                        className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={signupForm.password}
                        onChange={(e) => setSignupForm((p) => ({ ...p, password: e.target.value }))}
                        placeholder="Create a strong password"
                        className="w-full pl-10 pr-10 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="mt-2 space-y-1">
                      <div className="grid grid-cols-4 gap-1.5 h-1.5">
                        {[1, 2, 3, 4].map((seg) => (
                          <div
                            key={seg}
                            className={`rounded-full transition-all ${
                              passwordStrength.score >= seg ? passwordStrength.color : 'bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">8+ chars, upper/lowercase, number &amp; symbol</span>
                        <span className={`font-semibold ${passwordStrength.textColor}`}>
                          {passwordStrength.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Confirm Password
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={signupForm.confirmPassword}
                      onChange={(e) => setSignupForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                      placeholder="Re-enter your password"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>

                  <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={signupForm.acceptTerms}
                      onChange={(e) => setSignupForm((p) => ({ ...p, acceptTerms: e.target.checked }))}
                      className="mt-0.5 rounded border-slate-300 accent-emerald-600"
                    />
                    <span>I agree to the SpendSmart AI Terms of Service and Privacy Policy.</span>
                  </label>

                  <button
                    type="submit"
                    disabled={isAuthLoading}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition"
                  >
                    {isAuthLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <span>Create Account</span>
                    )}
                  </button>
                </form>

                <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthScreen('login');
                      setAuthError('');
                    }}
                    className="font-bold text-emerald-600 hover:text-emerald-700"
                  >
                    Sign in to existing account
                  </button>
                </div>
              </>
            )}

            {authScreen === 'forgot' && (
              <>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Reset your Password</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Enter your registered email address to receive a password reset link.
                  </p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!forgotEmail.trim()) return;
                    triggerToast(`Password reset instructions sent to ${forgotEmail}.`, 'success');
                    setAuthScreen('login');
                  }}
                  className="space-y-4 text-xs sm:text-sm"
                >
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Registered Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition"
                  >
                    Send Reset Link
                  </button>
                </form>

                <div className="pt-3 text-center">
                  <button
                    type="button"
                    onClick={() => setAuthScreen('login')}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    ← Back to Sign In
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Exact 10 Customer-Facing Navigation Items Requested
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: BarChart3 },
    { id: 'transactions', label: 'Transactions', icon: CreditCard, badge: transactions.length },
    { id: 'recurring', label: 'Recurring Expenses', icon: Repeat, badge: recurringSchedules.filter((r) => r.status === 'active').length },
    {
      id: 'budgets',
      label: 'Budgets',
      icon: Sliders,
      badge: budgetEvaluation.alerts.length > 0 ? `${budgetEvaluation.alerts.length}` : null,
      badgeAlert: budgetEvaluation.alerts.length > 0
    },
    { id: 'goals', label: 'Savings Goals', icon: Target, badge: savingsGoals.length },
    {
      id: 'bills',
      label: 'Bill Reminders',
      icon: Receipt,
      badge: pendingBillsList.length > 0 ? `${pendingBillsList.length} due` : null,
      badgeAlert: pendingBillsList.length > 0
    },
    { id: 'calendar', label: 'Expense Calendar', icon: Calendar },
    { id: 'reports', label: 'Reports & Analytics', icon: FileText },
    { id: 'ai_assistant', label: 'AI Finance Assistant', icon: Sparkles },
    { id: 'profile', label: 'Profile Settings', icon: Settings }
  ];

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full justify-between py-5 px-3.5 bg-white select-none overflow-y-auto">
      <div className="space-y-5">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center shadow-sm shadow-emerald-600/20">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-slate-900">SpendSmart</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  AI
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400">Personal Finance Platform</p>
            </div>
          </div>
          {mobileMenuOpen && (
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.2 rounded-xl text-xs sm:text-[13px] font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200/70'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 py-0.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge !== null && (
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      item.badgeAlert
                        ? 'bg-amber-100 text-amber-800'
                        : isActive
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Card & Account Switcher */}
      <div className="space-y-2.5 pt-4 border-t border-slate-200 mt-4">
        <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-1">
            Switch Account
          </div>
          <div className="grid grid-cols-2 gap-1 bg-slate-200/70 p-1 rounded-lg text-[11px]">
            <button
              onClick={() => handleSwitchDatasetMode('full_6m')}
              className={`py-1 rounded-md font-medium transition ${
                currentUser.email === 'aarav@spendsmart.ai'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Aarav (6M)
            </button>
            <button
              onClick={() => handleSwitchDatasetMode('new_user_2m')}
              className={`py-1 rounded-md font-medium transition ${
                currentUser.email === 'priya@spendsmart.ai'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Priya (2M)
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => setActiveTab('profile')}
            className="flex-1 flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition text-left min-w-0"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0">
              {currentUser.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-slate-900 truncate">{currentUser.name}</div>
              <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
            </div>
          </button>
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition shrink-0"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex overflow-x-hidden">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border bg-white border-emerald-200 text-slate-800 max-w-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-sm font-medium">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-auto text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 border-r border-slate-200/80 bg-white fixed inset-y-0 left-0 z-30">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-64 max-w-[80vw] bg-white h-full shadow-2xl z-50">
            {renderSidebarContent()}
          </div>
        </div>
      )}

      {/* Main Content Column */}
      <div className="flex-1 lg:pl-64 min-w-0 flex flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                {navItems.find((n) => n.id === activeTab)?.label || 'Overview'}
              </h1>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                <select
                  value={selectedMonth}
                  onChange={(e) => {
                    setSelectedMonth(e.target.value);
                    setSelectedCalendarDate(`${e.target.value}-14`);
                  }}
                  aria-label="Select statement month"
                  className="bg-transparent text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="2026-11">November 2026</option>
                  <option value="2026-10">October 2026</option>
                  <option value="2026-09">September 2026</option>
                  <option value="2026-08">August 2026</option>
                  <option value="2026-07">July 2026</option>
                  <option value="2026-06">June 2026</option>
                </select>
              </div>

              <button
                onClick={() => openAddTransactionModal()}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Transaction</span>
                <span className="sm:hidden">Add</span>
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                    {currentUser.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  <span className="hidden md:inline text-xs font-semibold text-slate-800 max-w-[110px] truncate">
                    {currentUser.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50 text-xs">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <div className="font-bold text-slate-900">{currentUser.name}</div>
                      <div className="text-slate-500 truncate">{currentUser.email}</div>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          setActiveTab('profile');
                        }}
                        className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                      >
                        <Settings className="w-4 h-4 text-slate-400" />
                        <span>Profile Settings</span>
                      </button>
                      <button
                        onClick={() =>
                          handleSwitchDatasetMode(
                            currentUser.email === 'aarav@spendsmart.ai' ? 'new_user_2m' : 'full_6m'
                          )
                        }
                        className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                      >
                        <UserCheck className="w-4 h-4 text-emerald-600" />
                        <span>
                          Switch to {currentUser.email === 'aarav@spendsmart.ai' ? 'Priya Patel' : 'Aarav Sharma'}
                        </span>
                      </button>
                    </div>
                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 font-semibold"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Workspace Body */}
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* ================= 1. OVERVIEW DASHBOARD ================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {budgetEvaluation.alerts.length > 0 && (
                <div className="rounded-2xl bg-amber-50/90 border border-amber-200/90 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900">
                          Active Budget Alerts ({budgetEvaluation.alerts.length})
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{budgetEvaluation.alerts[0].message}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('budgets')}
                    className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-amber-100/50 text-amber-900 border border-amber-300 text-xs font-semibold shrink-0 transition"
                  >
                    Manage Budgets →
                  </button>
                </div>
              )}

              {/* 4 KPI Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Total Balance
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Building2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
                      {formatINR(selectedMonthStats.cumulativeBalance)}
                    </div>
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-700 font-medium">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>+{formatINR(selectedMonthStats.savings)} net in {selectedMonth}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Monthly Income
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
                      {formatINR(selectedMonthStats.income)}
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                      <span>Target: {formatINR(currentUser.monthlyIncomeTarget)}</span>
                      <span className="text-emerald-700 font-semibold">{selectedMonth}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Monthly Expenses
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                      <TrendingDown className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
                      {formatINR(selectedMonthStats.expense)}
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs">
                      <span className="text-slate-500">Cap: {formatINR(budgetConfig.overallLimit)}</span>
                      <span
                        className={`font-semibold ${
                          budgetEvaluation.overallPct >= 100
                            ? 'text-rose-600'
                            : budgetEvaluation.overallPct >= budgetConfig.alertThresholdPct
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {budgetEvaluation.overallPct}% used
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Savings Rate
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                      <PiggyBank className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
                      {selectedMonthStats.savingsRate}%
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs">
                      <span className="text-emerald-700 font-semibold">
                        {formatINR(selectedMonthStats.savings)} saved
                      </span>
                      <span className="text-slate-400">Goal: {currentUser.savingsGoalPct}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Row: Monthly Financial Trends + Category-Wise Spending */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Monthly Financial Trends</h2>
                      <p className="text-xs text-slate-500">
                        Income vs. expenses and net savings trajectory ({monthlySeries.length} months)
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('reports')}
                      className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                    >
                      Full Reports →
                    </button>
                  </div>

                  <div className="relative h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={monthlySeries} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#059669" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                        <XAxis dataKey="label" stroke="#64748B" fontSize={12} tickLine={false} />
                        <YAxis
                          stroke="#64748B"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(v) => `₹${Math.round(v / 1000)}k`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#FFFFFF',
                            borderColor: '#E2E8F0',
                            borderRadius: '12px',
                            color: '#0F172A'
                          }}
                          formatter={(val) => formatINR(val)}
                        />
                        <Bar dataKey="income" name="Income" fill="#059669" radius={[6, 6, 0, 0]} barSize={22} />
                        <Bar dataKey="expense" name="Expenses" fill="#334155" radius={[6, 6, 0, 0]} barSize={22} />
                        <Line
                          type="monotone"
                          dataKey="savings"
                          name="Net Savings"
                          stroke="#0D9488"
                          strokeWidth={2.5}
                          dot={{ r: 4, fill: '#0D9488' }}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="lg:col-span-5 rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h2 className="text-base font-bold text-slate-900">Category-Wise Spending</h2>
                        <p className="text-xs text-slate-500">
                          {selectedMonth} outflow breakdown ({formatINR(selectedMonthStats.expense)})
                        </p>
                      </div>
                      <PieChartIcon className="w-4 h-4 text-emerald-600" />
                    </div>

                    <div className="relative h-52 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={selectedMonthStats.categoryBreakdown}
                            dataKey="amount"
                            nameKey="category"
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={78}
                            paddingAngle={2.5}
                          >
                            {selectedMonthStats.categoryBreakdown.map((entry) => (
                              <Cell key={entry.category} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(val) => formatINR(val)} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="space-y-2 mt-2 pt-2 border-t border-slate-100 max-h-44 overflow-y-auto">
                    {selectedMonthStats.categoryBreakdown.map((cat) => (
                      <div key={cat.category} className="flex items-center justify-between text-xs py-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                          <span className="text-slate-700 font-medium truncate">{cat.category}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 tabular-nums">
                          <span className="text-slate-400">{cat.sharePct}%</span>
                          <span className="font-semibold text-slate-900 w-20 text-right">{formatINR(cat.amount)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Middle Row: Upcoming Bills Widget + Savings Goal Progress Widget */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Upcoming Bills Widget */}
                <div className="lg:col-span-6 rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Upcoming Bills &amp; Reminders</h2>
                      <p className="text-xs text-slate-500">
                        {pendingBillsList.length} pending bill(s) totaling {formatINR(pendingBillsTotalAmount)}
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('bills')}
                      className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                    >
                      All Bills →
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {billReminders.slice(0, 4).map((bill) => (
                      <div
                        key={bill._id}
                        className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                            {bill.title}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            Due: {bill.dueDate} • {bill.category}
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5 shrink-0">
                          <span className="text-sm font-bold text-slate-900 tabular-nums">
                            {formatINR(bill.amount)}
                          </span>
                          <button
                            onClick={() => handleToggleBillPaid(bill)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                              bill.status === 'paid'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            }`}
                          >
                            {bill.status === 'paid' ? 'Paid ✓' : 'Pay Now'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Savings Goal Progress Widget */}
                <div className="lg:col-span-6 rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Savings Goal Progress</h2>
                      <p className="text-xs text-slate-500">
                        Track milestone targets and estimated completion dates
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('goals')}
                      className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                    >
                      Manage Goals →
                    </button>
                  </div>

                  <div className="space-y-3.5">
                    {savingsGoals.slice(0, 3).map((goal) => {
                      const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
                      const rem = Math.max(0, goal.targetAmount - goal.currentAmount);
                      const mosLeft = goal.monthlyCommitment > 0 ? Math.ceil(rem / goal.monthlyCommitment) : 0;
                      const estDate = rem === 0 ? 'Completed' : addMonthsToDateStr(selectedMonth, mosLeft);
                      return (
                        <div key={goal._id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-900">{goal.name}</span>
                            <span className="font-semibold text-emerald-700">{pct}% • Est. {estDate}</span>
                          </div>
                          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <div className="flex justify-between text-[11px] text-slate-500 tabular-nums">
                            <span>Saved: {formatINR(goal.currentAmount)}</span>
                            <span>Target: {formatINR(goal.targetAmount)} ({formatINR(rem)} left)</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Recent Transactions Table */}
              <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Recent Transactions</h2>
                    <p className="text-xs text-slate-500">Latest activity in {selectedMonth}</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('transactions')}
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    View All ({transactions.length}) →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        <th className="py-3 px-6">Date</th>
                        <th className="py-3 px-6">Description</th>
                        <th className="py-3 px-6">Category</th>
                        <th className="py-3 px-6">Payment Method</th>
                        <th className="py-3 px-6 text-right">Amount</th>
                        <th className="py-3 px-6 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                      {selectedMonthStats.monthTxs.slice(0, 6).map((tx) => (
                        <tr key={tx._id} className="hover:bg-slate-50/80 transition">
                          <td className="py-3.5 px-6 whitespace-nowrap text-xs text-slate-500 tabular-nums">
                            {tx.date}
                          </td>
                          <td className="py-3.5 px-6">
                            <div className="font-semibold text-slate-900 flex items-center gap-2">
                              <span>{tx.title}</span>
                              {tx.attachmentName && (
                                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                                  <Paperclip className="w-2.5 h-2.5" />
                                  {tx.attachmentName}
                                </span>
                              )}
                            </div>
                            {tx.notes && <div className="text-xs text-slate-500 mt-0.5">{tx.notes}</div>}
                          </td>
                          <td className="py-3.5 px-6 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                              <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: CATEGORY_COLORS[tx.category] || '#059669' }}
                              />
                              {tx.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-6 whitespace-nowrap text-xs text-slate-600 font-medium">
                            {tx.paymentMethod}
                          </td>
                          <td
                            className={`py-3.5 px-6 whitespace-nowrap text-right font-bold tabular-nums ${
                              tx.type === 'income' ? 'text-emerald-600' : 'text-slate-900'
                            }`}
                          >
                            {tx.type === 'income' ? '+' : '-'}
                            {formatINR(tx.amount)}
                          </td>
                          <td className="py-3.5 px-6 whitespace-nowrap text-right">
                            <button
                              onClick={() => openEditTransactionModal(tx)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition"
                              title="Edit Transaction"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= 2. ADVANCED TRANSACTIONS MANAGEMENT ================= */}
          {activeTab === 'transactions' && (
            <div className="space-y-5">
              {/* Custom Categories & Actions Bar */}
              <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Advanced Transaction Ledger
                    </h2>
                    <p className="text-xs text-slate-500">
                      Showing {filteredTransactions.length} of {transactions.length} transactions • Supports custom categories, receipt attachments &amp; validated CSV import
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => {
                        handleValidateCsvText(csvRawText);
                        setCsvModalOpen(true);
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Import CSV</span>
                    </button>
                    <button
                      onClick={handleExportCSV}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export CSV</span>
                    </button>
                    <button
                      onClick={() => openAddTransactionModal()}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Transaction</span>
                    </button>
                  </div>
                </div>

                {/* Custom Category Creator */}
                <form onSubmit={handleAddCustomCategory} className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-xs">
                  <span className="flex items-center gap-1 text-slate-500 font-medium">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    Custom Categories:
                  </span>
                  {(currentUser.customCategories || []).map((c) => (
                    <span
                      key={c}
                      className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium"
                    >
                      {c}
                    </span>
                  ))}
                  <div className="flex items-center gap-1.5 ml-auto">
                    <input
                      type="text"
                      value={newCustomCategory}
                      onChange={(e) => setNewCustomCategory(e.target.value)}
                      placeholder="New category name..."
                      className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold"
                    >
                      + Add Category
                    </button>
                  </div>
                </form>

                {/* Filter Row 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
                  <div className="lg:col-span-2 relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search description, category, notes..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white"
                    />
                  </div>

                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    aria-label="Filter by type"
                    className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700"
                  >
                    <option value="all">All Types</option>
                    <option value="expense">Expenses Only</option>
                    <option value="income">Income Only</option>
                  </select>

                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    aria-label="Filter by category"
                    className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700"
                  >
                    <option value="all">All Categories</option>
                    {[...incomeCategoriesList, ...expenseCategoriesList]
                      .filter((v, i, a) => a.indexOf(v) === i)
                      .map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                  </select>

                  <select
                    value={filterPayment}
                    onChange={(e) => setFilterPayment(e.target.value)}
                    aria-label="Filter by payment method"
                    className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700"
                  >
                    <option value="all">All Payment Modes</option>
                    {PAYMENT_METHODS.map((pm) => (
                      <option key={pm} value={pm}>
                        {pm}
                      </option>
                    ))}
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    aria-label="Sort order"
                    className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700"
                  >
                    <option value="date_desc">Newest First</option>
                    <option value="date_asc">Oldest First</option>
                    <option value="amount_desc">Amount: High to Low</option>
                    <option value="amount_asc">Amount: Low to High</option>
                  </select>
                </div>

                {/* Filter Row 2: Date Range */}
                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-medium">Month:</span>
                    <select
                      value={filterMonth}
                      onChange={(e) => setFilterMonth(e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-medium"
                    >
                      <option value="all">All Months</option>
                      <option value="2026-11">Nov 2026</option>
                      <option value="2026-10">Oct 2026</option>
                      <option value="2026-09">Sep 2026</option>
                      <option value="2026-08">Aug 2026</option>
                      <option value="2026-07">Jul 2026</option>
                      <option value="2026-06">Jun 2026</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-medium">From:</span>
                    <input
                      type="date"
                      value={startDateFilter}
                      onChange={(e) => setStartDateFilter(e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-medium">To:</span>
                    <input
                      type="date"
                      value={endDateFilter}
                      onChange={(e) => setEndDateFilter(e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700"
                    />
                  </div>

                  {(searchQuery || filterType !== 'all' || filterCategory !== 'all' || filterPayment !== 'all' || filterMonth !== 'all' || startDateFilter || endDateFilter) && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setFilterType('all');
                        setFilterCategory('all');
                        setFilterPayment('all');
                        setFilterMonth('all');
                        setStartDateFilter('');
                        setEndDateFilter('');
                      }}
                      className="text-emerald-600 hover:text-emerald-700 font-semibold ml-auto"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              </div>

              {/* Transactions Table */}
              <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        <th className="py-3.5 px-6">Date</th>
                        <th className="py-3.5 px-6">Description, Notes &amp; Receipt</th>
                        <th className="py-3.5 px-6">Category</th>
                        <th className="py-3.5 px-6">Payment Method</th>
                        <th className="py-3.5 px-6 text-right">Amount</th>
                        <th className="py-3.5 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                      {filteredTransactions.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-400">
                            No transactions match your active filters.
                          </td>
                        </tr>
                      ) : (
                        filteredTransactions.map((tx) => (
                          <tr key={tx._id} className="hover:bg-slate-50/80 transition">
                            <td className="py-3.5 px-6 whitespace-nowrap text-xs text-slate-500 tabular-nums">
                              {tx.date}
                            </td>
                            <td className="py-3.5 px-6">
                              <div className="font-semibold text-slate-900 flex flex-wrap items-center gap-2">
                                <span>{tx.title}</span>
                                {tx.isRecurring && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                                    Recurring
                                  </span>
                                )}
                                {tx.attachmentName && (
                                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                                    <Paperclip className="w-2.5 h-2.5" />
                                    {tx.attachmentName}
                                  </span>
                                )}
                              </div>
                              {tx.notes && <div className="text-xs text-slate-500 mt-0.5">{tx.notes}</div>}
                            </td>
                            <td className="py-3.5 px-6 whitespace-nowrap">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                                <span
                                  className="w-1.5 h-1.5 rounded-full"
                                  style={{ backgroundColor: CATEGORY_COLORS[tx.category] || '#059669' }}
                                />
                                {tx.category}
                              </span>
                            </td>
                            <td className="py-3.5 px-6 whitespace-nowrap text-xs text-slate-600 font-medium">
                              {tx.paymentMethod}
                            </td>
                            <td
                              className={`py-3.5 px-6 whitespace-nowrap text-right font-bold tabular-nums ${
                                tx.type === 'income' ? 'text-emerald-600' : 'text-slate-900'
                              }`}
                            >
                              {tx.type === 'income' ? '+' : '-'}
                              {formatINR(tx.amount)}
                            </td>
                            <td className="py-3.5 px-6 whitespace-nowrap text-right">
                              <div className="inline-flex items-center gap-1">
                                <button
                                  onClick={() => openEditTransactionModal(tx)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition"
                                  title="Edit"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteTransaction(tx._id, tx.title)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= 3. RECURRING EXPENSES ================= */}
          {activeTab === 'recurring' && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Recurring Expenses, EMIs &amp; Subscriptions
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Automate monthly rent, loan EMIs, OTT subscriptions, and salary inflows. Click &quot;Generate Transaction&quot; when due.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingRecurringId(null);
                    setRecurringForm({
                      title: '',
                      amount: '',
                      type: 'expense',
                      category: 'Subscriptions',
                      paymentMethod: 'UPI',
                      frequency: 'monthly',
                      dayOfMonth: '5',
                      nextDueDate: '2026-12-05',
                      notes: ''
                    });
                    setRecurringModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Recurring Schedule</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recurringSchedules.map((sched) => (
                  <div
                    key={sched._id}
                    className={`rounded-2xl bg-white p-5 border shadow-xs flex flex-col justify-between gap-4 ${
                      sched.status === 'paused' || sched.status === 'cancelled'
                        ? 'border-slate-200 opacity-75'
                        : 'border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">{sched.title}</span>
                          <span
                            className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                              sched.status === 'active'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : sched.status === 'paused'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {sched.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          {sched.category} • {sched.paymentMethod} • Every {sched.frequency} (Day {sched.dayOfMonth})
                        </p>
                        {sched.notes && <p className="text-xs text-slate-400 mt-1">{sched.notes}</p>}
                      </div>
                      <div className="text-right shrink-0 tabular-nums">
                        <div
                          className={`text-lg font-bold ${
                            sched.type === 'income' ? 'text-emerald-600' : 'text-slate-900'
                          }`}
                        >
                          {sched.type === 'income' ? '+' : '-'}
                          {formatINR(sched.amount)}
                        </div>
                        <span className="text-[11px] text-slate-400">Next Due: {sched.nextDueDate}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5">
                        {sched.status === 'active' && (
                          <button
                            onClick={() => handleGenerateRecurringTransaction(sched)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition"
                          >
                            Generate Transaction Now
                          </button>
                        )}
                        {sched.status === 'active' ? (
                          <button
                            onClick={() => handleToggleRecurringStatus(sched._id, 'paused')}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium flex items-center gap-1"
                          >
                            <Pause className="w-3 h-3" />
                            <span>Pause</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleRecurringStatus(sched._id, 'active')}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium flex items-center gap-1"
                          >
                            <Play className="w-3 h-3" />
                            <span>Resume</span>
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingRecurringId(sched._id);
                            setRecurringForm({
                              title: sched.title,
                              amount: String(sched.amount),
                              type: sched.type,
                              category: sched.category,
                              paymentMethod: sched.paymentMethod,
                              frequency: sched.frequency,
                              dayOfMonth: String(sched.dayOfMonth),
                              nextDueDate: sched.nextDueDate,
                              notes: sched.notes || ''
                            });
                            setRecurringModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                          title="Edit Schedule"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        {sched.status !== 'cancelled' && (
                          <button
                            onClick={() => handleToggleRecurringStatus(sched._id, 'cancelled')}
                            className="px-2 py-1 rounded-lg text-rose-600 hover:bg-rose-50 font-medium"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 4. BUDGETS ================= */}
          {activeTab === 'budgets' && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-7 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-base font-bold text-slate-900">
                          Overall Monthly Budget ({selectedMonth})
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          80% spending warning and 100% budget exceeded alerts
                        </p>
                      </div>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          budgetEvaluation.overallPct >= 100
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : budgetEvaluation.overallPct >= budgetConfig.alertThresholdPct
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {budgetEvaluation.overallPct}% Utilized
                      </span>
                    </div>

                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          budgetEvaluation.overallPct >= 100
                            ? 'bg-rose-600'
                            : budgetEvaluation.overallPct >= budgetConfig.alertThresholdPct
                            ? 'bg-amber-500'
                            : 'bg-emerald-600'
                        }`}
                        style={{ width: `${Math.min(100, budgetEvaluation.overallPct)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-600 tabular-nums">
                      <span>
                        Actual Spent: <strong className="text-slate-900">{formatINR(selectedMonthStats.expense)}</strong>
                      </span>
                      <span>
                        Monthly Target Cap: <strong className="text-slate-900">{formatINR(budgetConfig.overallLimit)}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-slate-600">Monthly Budget Cap</span>
                        <span className="font-bold text-emerald-700 tabular-nums">{formatINR(budgetConfig.overallLimit)}</span>
                      </div>
                      <input
                        type="range"
                        min="25000"
                        max="90000"
                        step="1000"
                        value={budgetConfig.overallLimit}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          updateCurrentUserBudget((prev) => ({ ...prev, overallLimit: val }));
                        }}
                        className="w-full accent-emerald-600 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-slate-600">Warning Threshold (%)</span>
                        <span className="font-bold text-amber-700 tabular-nums">{budgetConfig.alertThresholdPct}%</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="95"
                        step="5"
                        value={budgetConfig.alertThresholdPct}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          updateCurrentUserBudget((prev) => ({ ...prev, alertThresholdPct: val }));
                        }}
                        className="w-full accent-emerald-600 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {budgetEvaluation.categoriesStatus.map((item) => (
                  <div
                    key={item.category}
                    className={`rounded-2xl bg-white p-5 border shadow-xs transition ${
                      item.status === 'exceeded'
                        ? 'border-rose-300'
                        : item.status === 'warning'
                        ? 'border-amber-300'
                        : 'border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <h3 className="text-sm font-bold text-slate-900">{item.category}</h3>
                      </div>
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                          item.status === 'exceeded'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : item.status === 'warning'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {item.status === 'exceeded'
                          ? '100% Exceeded'
                          : item.status === 'warning'
                          ? '80% Warning'
                          : 'On Track'}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between text-xs text-slate-500 mb-2 tabular-nums">
                      <span>
                        Spent: <strong className="text-slate-900">{formatINR(item.spent)}</strong>
                      </span>
                      <span>
                        Limit: <strong className="text-slate-700">{formatINR(item.limit)}</strong> ({item.pct}%)
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-3">
                      <div
                        className={`h-full transition-all ${
                          item.status === 'exceeded'
                            ? 'bg-rose-600'
                            : item.status === 'warning'
                            ? 'bg-amber-500'
                            : 'bg-emerald-600'
                        }`}
                        style={{ width: `${Math.min(100, item.pct)}%` }}
                      />
                    </div>

                    {editingCategoryBudget === item.category ? (
                      <div className="flex items-center gap-2 mt-2">
                        <input
                          type="number"
                          value={tempCategoryLimit}
                          onChange={(e) => setTempCategoryLimit(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-emerald-500 text-xs text-slate-900"
                          placeholder="New limit (₹)"
                        />
                        <button
                          onClick={() => {
                            const val = Number(tempCategoryLimit);
                            if (val >= 100) {
                              updateCurrentUserBudget((prev) => ({
                                ...prev,
                                categoryLimits: { ...prev.categoryLimits, [item.category]: val }
                              }));
                              triggerToast(`Updated ${item.category} budget to ${formatINR(val)}.`);
                            } else {
                              triggerToast('Budget limit must be at least ₹100.', 'error');
                            }
                            setEditingCategoryBudget(null);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="tabular-nums">
                          {item.overrun > 0
                            ? `Exceeded by ${formatINR(item.overrun)}`
                            : `${formatINR(item.remaining)} remaining`}
                        </span>
                        <button
                          onClick={() => {
                            setEditingCategoryBudget(item.category);
                            setTempCategoryLimit(String(item.limit));
                          }}
                          className="text-emerald-600 hover:text-emerald-700 font-semibold"
                        >
                          Edit Limit
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 5. SAVINGS GOALS ================= */}
          {activeTab === 'goals' && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Savings Goals &amp; Completion Estimator
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Create custom targets, add contributions, and track estimated completion dates based on your monthly commitment.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingGoalId(null);
                    setGoalForm({
                      name: '',
                      category: 'Emergency Fund',
                      targetAmount: '',
                      currentAmount: '0',
                      monthlyCommitment: '10000',
                      targetDate: '2027-06-30'
                    });
                    setGoalModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Savings Goal</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {savingsGoals.map((goal) => {
                  const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
                  const rem = Math.max(0, goal.targetAmount - goal.currentAmount);
                  const mosLeft = goal.monthlyCommitment > 0 ? Math.ceil(rem / goal.monthlyCommitment) : 0;
                  const estCompletion = rem === 0 ? 'Goal Reached!' : `${addMonthsToDateStr(selectedMonth, mosLeft)} (${mosLeft} mos)`;

                  return (
                    <div
                      key={goal._id}
                      className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {goal.category}
                            </span>
                            <h3 className="text-base font-bold text-slate-900 mt-2">{goal.name}</h3>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setEditingGoalId(goal._id);
                                setGoalForm({
                                  name: goal.name,
                                  category: goal.category,
                                  targetAmount: String(goal.targetAmount),
                                  currentAmount: String(goal.currentAmount),
                                  monthlyCommitment: String(goal.monthlyCommitment),
                                  targetDate: goal.targetDate
                                });
                                setGoalModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                              title="Edit Goal"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteGoal(goal._id, goal.name)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                              title="Delete Goal"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-baseline justify-between text-xs tabular-nums">
                          <span>
                            Saved: <strong className="text-base text-slate-900">{formatINR(goal.currentAmount)}</strong>
                          </span>
                          <span>
                            Target: <strong className="text-slate-700">{formatINR(goal.targetAmount)}</strong> ({pct}%)
                          </span>
                        </div>

                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                            style={{ width: `${pct}%` }}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                            <span className="text-slate-400 block text-[11px]">Remaining Amount</span>
                            <span className="font-bold text-slate-800 tabular-nums">{formatINR(rem)}</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                            <span className="text-slate-400 block text-[11px]">Est. Completion</span>
                            <span className="font-bold text-emerald-700">{estCompletion}</span>
                          </div>
                        </div>
                      </div>

                      {/* Add Contribution Bar */}
                      <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                        <input
                          type="number"
                          min="100"
                          value={contributionInputs[goal._id] || ''}
                          onChange={(e) =>
                            setContributionInputs((prev) => ({ ...prev, [goal._id]: e.target.value }))
                          }
                          placeholder={`Add contribution (e.g. ${goal.monthlyCommitment})`}
                          className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                        />
                        <button
                          onClick={() =>
                            handleContributeToGoal(
                              goal._id,
                              contributionInputs[goal._id] || goal.monthlyCommitment
                            )
                          }
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shrink-0 transition"
                        >
                          + Contribute
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= 6. BILL REMINDERS ================= */}
          {activeTab === 'bills' && (
            <div className="space-y-6">
              {/* Upcoming Payment Dashboard Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Pending Bills Total
                  </span>
                  <div className="text-2xl font-bold text-rose-600 mt-2 tabular-nums">
                    {formatINR(pendingBillsTotalAmount)}
                  </div>
                  <span className="text-xs text-slate-500 mt-1 block">
                    Across {pendingBillsList.length} upcoming payment(s)
                  </span>
                </div>

                <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Paid Bills Total
                  </span>
                  <div className="text-2xl font-bold text-emerald-600 mt-2 tabular-nums">
                    {formatINR(
                      billReminders
                        .filter((b) => b.status === 'paid')
                        .reduce((s, b) => s + Number(b.amount), 0)
                    )}
                  </div>
                  <span className="text-xs text-slate-500 mt-1 block">
                    {billReminders.filter((b) => b.status === 'paid').length} bill(s) settled this cycle
                  </span>
                </div>

                <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Bill Reminder Actions
                    </span>
                    <p className="text-xs text-slate-500 mt-1">
                      Add electricity, broadband, rent, EMI, or credit card due dates
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingBillId(null);
                      setBillForm({
                        title: '',
                        category: 'Utilities & Bills',
                        amount: '',
                        dueDate: '2026-11-25',
                        paymentMethod: 'UPI',
                        isRecurringBill: true,
                        notes: ''
                      });
                      setBillModalOpen(true);
                    }}
                    className="mt-3 w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Bill Reminder</span>
                  </button>
                </div>
              </div>

              {/* Bills List */}
              <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-900">Upcoming &amp; Settled Bills</h2>
                  <span className="text-xs text-slate-500">
                    Marking a bill as Paid automatically logs the expense transaction
                  </span>
                </div>
                <div className="divide-y divide-slate-100">
                  {billReminders.map((bill) => (
                    <div
                      key={bill._id}
                      className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <span className="text-sm font-bold text-slate-900">{bill.title}</span>
                          <span
                            className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                              bill.status === 'paid'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {bill.status === 'paid' ? 'Paid' : `Due ${bill.dueDate}`}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500">
                          {bill.category} • {bill.paymentMethod} {bill.notes ? `• ${bill.notes}` : ''}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-base font-bold text-slate-900 tabular-nums">
                          {formatINR(bill.amount)}
                        </span>
                        <button
                          onClick={() => handleToggleBillPaid(bill)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                            bill.status === 'paid'
                              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          }`}
                        >
                          {bill.status === 'paid' ? 'Mark Pending' : 'Mark as Paid'}
                        </button>
                        <button
                          onClick={() => handleDeleteBill(bill._id, bill.title)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Delete Bill"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= 7. EXPENSE CALENDAR ================= */}
          {activeTab === 'calendar' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Calendar Grid (8 cols) */}
                <div className="lg:col-span-8 rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">
                        Daily Expense Calendar ({selectedMonth})
                      </h2>
                      <p className="text-xs text-slate-500">
                        Click any date to inspect daily transactions. High-spending days (≥ ₹5,000) are highlighted.
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1.5 text-rose-700 font-medium">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                        High-Spend Day (≥ ₹5k)
                      </span>
                    </div>
                  </div>

                  {/* Weekday Headers */}
                  <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400 pb-1">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                      <div key={d}>{d}</div>
                    ))}
                  </div>

                  {/* Day Cells */}
                  <div className="grid grid-cols-7 gap-2">
                    {calendarGridData.cells.map((cell, idx) => {
                      if (!cell) {
                        return <div key={`empty-${idx}`} className="h-20 rounded-xl bg-slate-50/50" />;
                      }
                      const isSelected = calendarGridData.activeDateInfo.dateStr === cell.dateStr;
                      return (
                        <button
                          key={cell.dateStr}
                          onClick={() => setSelectedCalendarDate(cell.dateStr)}
                          className={`h-20 p-2 rounded-xl border text-left flex flex-col justify-between transition ${
                            isSelected
                              ? 'border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/30'
                              : cell.isHighSpend
                              ? 'border-rose-300 bg-rose-50/40 hover:bg-rose-50/70'
                              : 'border-slate-200/80 bg-white hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span
                              className={`text-xs font-bold ${
                                isSelected ? 'text-emerald-700' : 'text-slate-700'
                              }`}
                            >
                              {cell.day}
                            </span>
                            {cell.isHighSpend && (
                              <span className="w-2 h-2 rounded-full bg-rose-500" title="High-spending day" />
                            )}
                          </div>

                          <div className="space-y-0.5 w-full overflow-hidden tabular-nums">
                            {cell.income > 0 && (
                              <div className="text-[10px] font-semibold text-emerald-600 truncate">
                                +{formatINR(cell.income)}
                              </div>
                            )}
                            {cell.expense > 0 && (
                              <div
                                className={`text-[10px] font-bold truncate ${
                                  cell.isHighSpend ? 'text-rose-700' : 'text-slate-800'
                                }`}
                              >
                                -{formatINR(cell.expense)}
                              </div>
                            )}
                            {cell.billsDue.length > 0 && (
                              <div className="text-[9px] font-semibold text-amber-700 truncate">
                                {cell.billsDue.length} bill due
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Day Inspector (4 cols) */}
                <div className="lg:col-span-4 rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                        Selected Date
                      </span>
                      <h3 className="text-base font-bold text-slate-900">
                        {calendarGridData.activeDateInfo.dateStr}
                      </h3>
                    </div>
                    <button
                      onClick={() => openAddTransactionModal(calendarGridData.activeDateInfo.dateStr)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                    >
                      + Add Entry
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 text-xs tabular-nums">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block">Daily Income</span>
                      <span className="text-sm font-bold text-emerald-600 mt-0.5 block">
                        +{formatINR(calendarGridData.activeDateInfo.income)}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block">Daily Spend</span>
                      <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                        -{formatINR(calendarGridData.activeDateInfo.expense)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div className="text-xs font-semibold text-slate-700">
                      Transactions on {calendarGridData.activeDateInfo.dateStr}:
                    </div>
                    {calendarGridData.activeDateInfo.txs.length === 0 ? (
                      <div className="p-4 rounded-xl bg-slate-50 text-xs text-slate-400 text-center">
                        No transactions recorded on this date.
                      </div>
                    ) : (
                      calendarGridData.activeDateInfo.txs.map((tx) => (
                        <div
                          key={tx._id}
                          className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2 text-xs"
                        >
                          <div>
                            <div className="font-semibold text-slate-900">{tx.title}</div>
                            <div className="text-slate-500">{tx.category} • {tx.paymentMethod}</div>
                          </div>
                          <span
                            className={`font-bold tabular-nums ${
                              tx.type === 'income' ? 'text-emerald-600' : 'text-slate-900'
                            }`}
                          >
                            {tx.type === 'income' ? '+' : '-'}
                            {formatINR(tx.amount)}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 8. FINANCIAL REPORTS & ANALYTICS ================= */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              {/* Top Report Controls & CSV / PDF Export */}
              <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Financial Reports &amp; Statements
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Compare weekly, monthly, and yearly income vs. expenses and export CSV or PDF financial statements.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex bg-slate-100 p-1 rounded-xl text-xs">
                    {[
                      { id: 'weekly', label: 'Weekly' },
                      { id: 'monthly', label: 'Monthly' },
                      { id: 'yearly', label: 'Yearly (FY 26)' }
                    ].map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setReportPeriod(p.id)}
                        className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                          reportPeriod === p.id
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download CSV</span>
                  </button>

                  <button
                    onClick={() => setShowPdfReportModal(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Download / Print PDF Report</span>
                  </button>
                </div>
              </div>

              {/* Period Comparison Chart + Category Breakdown Table */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs">
                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    {reportPeriod === 'weekly' && `Weekly Income vs. Expense Breakdown (${selectedMonth})`}
                    {reportPeriod === 'monthly' && 'Monthly Income vs. Expense Comparison (6 Months)'}
                    {reportPeriod === 'yearly' && 'Annual Category Outflow Distribution (FY 2026)'}
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Aggregated directly from your verified transaction ledger
                  </p>

                  <div className="relative h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      {reportPeriod === 'weekly' ? (
                        <BarChart data={reportAnalytics.weeks}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                          <XAxis dataKey="label" stroke="#64748B" fontSize={11} />
                          <YAxis stroke="#64748B" fontSize={11} tickFormatter={(v) => `₹${Math.round(v / 1000)}k`} />
                          <Tooltip formatter={(val) => formatINR(val)} />
                          <Legend wrapperStyle={{ fontSize: '12px' }} />
                          <Bar dataKey="income" name="Weekly Income" fill="#059669" radius={[6, 6, 0, 0]} />
                          <Bar dataKey="expense" name="Weekly Expense" fill="#334155" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      ) : reportPeriod === 'monthly' ? (
                        <ComposedChart data={monthlySeries}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                          <XAxis dataKey="label" stroke="#64748B" fontSize={12} />
                          <YAxis stroke="#64748B" fontSize={12} tickFormatter={(v) => `₹${Math.round(v / 1000)}k`} />
                          <Tooltip formatter={(val) => formatINR(val)} />
                          <Legend wrapperStyle={{ fontSize: '12px' }} />
                          <Bar dataKey="income" name="Monthly Income" fill="#059669" radius={[6, 6, 0, 0]} />
                          <Bar dataKey="expense" name="Monthly Expense" fill="#334155" radius={[6, 6, 0, 0]} />
                          <Line type="monotone" dataKey="savings" name="Net Savings" stroke="#0D9488" strokeWidth={2.5} />
                        </ComposedChart>
                      ) : (
                        <BarChart data={reportAnalytics.yearlyCategories}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                          <XAxis dataKey="category" stroke="#64748B" fontSize={10} />
                          <YAxis stroke="#64748B" fontSize={11} tickFormatter={(v) => `₹${Math.round(v / 1000)}k`} />
                          <Tooltip formatter={(val) => formatINR(val)} />
                          <Bar dataKey="amount" name="Annual Category Spend" fill="#059669" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Category-Wise Spending Report Table */}
                <div className="lg:col-span-5 rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs">
                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    Category-Wise Spending Report
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    {reportPeriod === 'yearly' ? 'Full-Year (FY 2026) Totals' : `Month of ${selectedMonth}`}
                  </p>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                          <th className="py-2.5">Category</th>
                          <th className="py-2.5 text-right">Transactions</th>
                          <th className="py-2.5 text-right">Share</th>
                          <th className="py-2.5 text-right">Total Spend</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 tabular-nums">
                        {(reportPeriod === 'yearly'
                          ? reportAnalytics.yearlyCategories
                          : selectedMonthStats.categoryBreakdown
                        ).map((cat) => (
                          <tr key={cat.category}>
                            <td className="py-2.5 font-semibold text-slate-800">{cat.category}</td>
                            <td className="py-2.5 text-right text-slate-500">{cat.count}</td>
                            <td className="py-2.5 text-right text-slate-500">{cat.sharePct}%</td>
                            <td className="py-2.5 text-right font-bold text-slate-900">{formatINR(cat.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 9. AI FINANCE ASSISTANT ================= */}
          {activeTab === 'ai_assistant' && (
            <div className="space-y-6">
              {/* Interactive AI Financial Chat Assistant */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <h2 className="text-base font-bold text-slate-900">AI Finance Assistant</h2>
                          <p className="text-xs text-slate-500">
                            Answers questions using your actual transactions, budgets, bills &amp; goals
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Prompt Chips */}
                    <div className="flex flex-wrap gap-1.5 py-3">
                      {[
                        'Where can I cut unnecessary spending this month?',
                        'Which bills are pending right now?',
                        'How are my savings goals progressing?',
                        'What is my projected December 2026 expense?',
                        'Show my active recurring subscriptions and EMIs'
                      ].map((promptText) => (
                        <button
                          key={promptText}
                          onClick={() => handleAskAssistant(promptText)}
                          className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 text-[11px] font-medium transition"
                        >
                          {promptText}
                        </button>
                      ))}
                    </div>

                    {/* Chat Messages Feed */}
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-1 py-2">
                      {assistantMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                              msg.role === 'user'
                                ? 'bg-emerald-600 text-white font-medium'
                                : 'bg-slate-50 border border-slate-200/80 text-slate-800'
                            }`}
                          >
                            {msg.text}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAskAssistant(assistantInput);
                    }}
                    className="flex items-center gap-2 pt-3 border-t border-slate-100"
                  >
                    <input
                      type="text"
                      value={assistantInput}
                      onChange={(e) => setAssistantInput(e.target.value)}
                      placeholder="Ask about your expenses, bills, savings rate, or forecast..."
                      className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 transition"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Ask AI</span>
                    </button>
                  </form>
                </div>

                {/* Right Column: Personalized Saving Suggestions & Unusual Spending Alerts */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-3">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Personalized Saving Suggestions</span>
                    </h3>
                    {aiAnalytics.savingSuggestions.map((s) => (
                      <div
                        key={s.id}
                        className="p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-200/80 space-y-1"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-slate-900">{s.title}</span>
                          <span className="text-xs font-bold text-emerald-700 shrink-0 tabular-nums">
                            Save {formatINR(s.potentialMonthlySaving)}/mo
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{s.recommendation}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-3">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Unusual High-Spending Alerts</span>
                    </h3>
                    {aiAnalytics.anomalies.map((anom) => (
                      <div
                        key={anom._id}
                        className="p-3.5 rounded-xl bg-rose-50/50 border border-rose-200/80 flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900">{anom.title}</div>
                          <div className="text-[11px] text-slate-500">
                            {anom.category} • {anom.date} • Avg: {formatINR(anom.categoryMean)}
                          </div>
                        </div>
                        <div className="text-right shrink-0 tabular-nums">
                          <div className="text-xs font-bold text-rose-700">{formatINR(anom.amount)}</div>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                            {anom.ratio}x avg
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ML Expense Forecast Section */}
              {aiAnalytics.hasSufficientData && (
                <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Next-Month Expense Forecast: {formatINR(aiAnalytics.predictedNextMonthTotal)} (Dec 2026)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Trained across {aiAnalytics.availableMonths} completed months (R² = {(aiAnalytics.r2Score * 100).toFixed(1)}%, 95% CI: ±{formatINR(aiAnalytics.confidence95)})
                      </p>
                    </div>
                  </div>
                  <div className="relative h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={aiAnalytics.chartForecastSeries}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                        <XAxis dataKey="label" stroke="#64748B" fontSize={11} />
                        <YAxis stroke="#64748B" fontSize={11} tickFormatter={(v) => `₹${Math.round(v / 1000)}k`} />
                        <Tooltip formatter={(val) => (val ? formatINR(val) : 'N/A')} />
                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                        <Bar dataKey="actualExpense" name="Actual Historical Spend" fill="#334155" radius={[6, 6, 0, 0]} barSize={26} />
                        <Bar dataKey="predictedExpense" name="Projected Dec 2026" fill="#059669" radius={[6, 6, 0, 0]} barSize={26} />
                        <Line type="monotone" dataKey="regressionFit" name="Linear Trendline" stroke="#10B981" strokeWidth={2.5} strokeDasharray="5 5" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= 10. PROFILE SETTINGS PAGE ================= */}
          {activeTab === 'profile' && (
            <div className="max-w-3xl space-y-6">
              <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 font-bold text-base flex items-center justify-center">
                      {currentUser.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)}
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900">{currentUser.name}</h2>
                      <p className="text-xs text-slate-500">{currentUser.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setCurrentUser((prev) => ({
                      ...prev,
                      name: authForm.name || prev.name,
                      email: authForm.email || prev.email,
                      monthlyIncomeTarget: Number(authForm.monthlyIncomeTarget) || prev.monthlyIncomeTarget,
                      savingsGoalPct: Number(authForm.savingsGoalPct) || prev.savingsGoalPct
                    }));
                    setUsersCollection((prev) =>
                      prev.map((u) =>
                        u._id === currentUser._id
                          ? {
                              ...u,
                              name: authForm.name || u.name,
                              email: authForm.email || u.email,
                              monthlyIncomeTarget: Number(authForm.monthlyIncomeTarget) || u.monthlyIncomeTarget,
                              savingsGoalPct: Number(authForm.savingsGoalPct) || u.savingsGoalPct
                            }
                          : u
                      )
                    );
                    triggerToast('Profile settings saved successfully!', 'success');
                  }}
                  className="space-y-4 text-xs sm:text-sm"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={authForm.name}
                        onChange={(e) => setAuthForm((prev) => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={authForm.email}
                        onChange={(e) => setAuthForm((prev) => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Monthly Income Target (₹)
                      </label>
                      <input
                        type="number"
                        value={authForm.monthlyIncomeTarget}
                        onChange={(e) =>
                          setAuthForm((prev) => ({ ...prev, monthlyIncomeTarget: e.target.value }))
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Target Savings Rate (%)
                      </label>
                      <input
                        type="number"
                        min="5"
                        max="80"
                        value={authForm.savingsGoalPct}
                        onChange={(e) =>
                          setAuthForm((prev) => ({ ...prev, savingsGoalPct: e.target.value }))
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold transition"
                    >
                      Save Profile Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ================= MODAL 1: ADD / EDIT TRANSACTION ================= */}
      {txModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingTxId ? 'Edit Transaction' : 'Add New Transaction'}
              </h3>
              <button onClick={() => setTxModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTransaction} className="space-y-3.5 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() =>
                    setTxForm((prev) => ({ ...prev, type: 'expense', category: 'Food & Dining' }))
                  }
                  className={`py-2 rounded-lg font-semibold transition ${
                    txForm.type === 'expense'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setTxForm((prev) => ({ ...prev, type: 'income', category: 'Salary' }))
                  }
                  className={`py-2 rounded-lg font-semibold transition ${
                    txForm.type === 'income'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Income
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Description / Merchant</label>
                <input
                  type="text"
                  required
                  value={txForm.title}
                  onChange={(e) => setTxForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., BigBasket Groceries or Monthly Salary"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={txForm.amount}
                    onChange={(e) => setTxForm((prev) => ({ ...prev, amount: e.target.value }))}
                    placeholder="2500"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={txForm.date}
                    onChange={(e) => setTxForm((prev) => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Category</label>
                  <select
                    value={txForm.category}
                    onChange={(e) => setTxForm((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  >
                    {(txForm.type === 'income' ? incomeCategoriesList : expenseCategoriesList).map(
                      (cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Payment Method</label>
                  <select
                    value={txForm.paymentMethod}
                    onChange={(e) =>
                      setTxForm((prev) => ({ ...prev, paymentMethod: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  >
                    {PAYMENT_METHODS.map((pm) => (
                      <option key={pm} value={pm}>
                        {pm}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Receipt / Attachment File
                  </label>
                  <input
                    type="file"
                    onChange={(e) => {
                      const f = e.target.files && e.target.files[0];
                      if (f) setTxForm((prev) => ({ ...prev, attachmentName: f.name }));
                    }}
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Notes</label>
                  <input
                    type="text"
                    value={txForm.notes}
                    onChange={(e) => setTxForm((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="Optional memo"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isRecurringCheck"
                  checked={txForm.isRecurring}
                  onChange={(e) =>
                    setTxForm((prev) => ({ ...prev, isRecurring: e.target.checked }))
                  }
                  className="rounded border-slate-300 accent-emerald-600"
                />
                <label htmlFor="isRecurringCheck" className="text-xs text-slate-600">
                  Recurring monthly transaction
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTxModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                  {editingTxId ? 'Save Changes' : 'Add Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: CSV IMPORT WITH VALIDATION ================= */}
      {csvModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white border border-slate-200 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Import Transactions via CSV</h3>
                <p className="text-xs text-slate-500">
                  Format: <code className="text-emerald-700">YYYY-MM-DD,Title,income|expense,Category,PaymentMethod,Amount,Notes</code>
                </p>
              </div>
              <button onClick={() => setCsvModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <textarea
              rows={4}
              value={csvRawText}
              onChange={(e) => {
                setCsvRawText(e.target.value);
                handleValidateCsvText(e.target.value);
              }}
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800"
            />

            {csvValidationPreview && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-emerald-700">
                    Valid Rows Ready: {csvValidationPreview.valid.length}
                  </span>
                  <span className="text-rose-600">
                    Rejected Rows: {csvValidationPreview.rejected.length}
                  </span>
                </div>
                {csvValidationPreview.rejected.length > 0 && (
                  <div className="space-y-1 text-rose-600 text-[11px]">
                    {csvValidationPreview.rejected.map((r) => (
                      <div key={r.line}>
                        Line {r.line}: {r.reason}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setCsvModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmCsvImport}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
              >
                Import Valid Rows
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: RECURRING SCHEDULE MODAL ================= */}
      {recurringModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingRecurringId ? 'Edit Recurring Schedule' : 'Create Recurring Schedule'}
              </h3>
              <button onClick={() => setRecurringModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRecurring} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={recurringForm.title}
                  onChange={(e) => setRecurringForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g., Home Loan EMI or Netflix"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={recurringForm.amount}
                    onChange={(e) => setRecurringForm((p) => ({ ...p, amount: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Type</label>
                  <select
                    value={recurringForm.type}
                    onChange={(e) => setRecurringForm((p) => ({ ...p, type: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Frequency</label>
                  <select
                    value={recurringForm.frequency}
                    onChange={(e) => setRecurringForm((p) => ({ ...p, frequency: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Next Due Date</label>
                  <input
                    type="date"
                    required
                    value={recurringForm.nextDueDate}
                    onChange={(e) => setRecurringForm((p) => ({ ...p, nextDueDate: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRecurringModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: SAVINGS GOAL MODAL ================= */}
      {goalModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingGoalId ? 'Edit Savings Goal' : 'Create Savings Goal'}
              </h3>
              <button onClick={() => setGoalModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGoal} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Goal Name</label>
                <input
                  type="text"
                  required
                  value={goalForm.name}
                  onChange={(e) => setGoalForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g., New Car Downpayment"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Target Amount (₹)</label>
                  <input
                    type="number"
                    required
                    min="500"
                    value={goalForm.targetAmount}
                    onChange={(e) => setGoalForm((p) => ({ ...p, targetAmount: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Already Saved (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={goalForm.currentAmount}
                    onChange={(e) => setGoalForm((p) => ({ ...p, currentAmount: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Monthly Planned Saving (₹)
                  </label>
                  <input
                    type="number"
                    min="500"
                    value={goalForm.monthlyCommitment}
                    onChange={(e) => setGoalForm((p) => ({ ...p, monthlyCommitment: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Target Date</label>
                  <input
                    type="date"
                    value={goalForm.targetDate}
                    onChange={(e) => setGoalForm((p) => ({ ...p, targetDate: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setGoalModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 5: BILL REMINDER MODAL ================= */}
      {billModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingBillId ? 'Edit Bill Reminder' : 'Add Bill Reminder'}
              </h3>
              <button onClick={() => setBillModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBill} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Bill Name</label>
                <input
                  type="text"
                  required
                  value={billForm.title}
                  onChange={(e) => setBillForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g., Electricity Bill or Credit Card Statement"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={billForm.amount}
                    onChange={(e) => setBillForm((p) => ({ ...p, amount: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={billForm.dueDate}
                    onChange={(e) => setBillForm((p) => ({ ...p, dueDate: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBillModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                  Save Bill Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 6: PRINTABLE PDF FINANCIAL STATEMENT REPORT ================= */}
      {showPdfReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                  SpendSmart AI Official Financial Statement
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {currentUser.name} — {selectedMonth} Statement Report
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    try {
                      window.print();
                    } catch (e) {}
                    triggerToast('Prepared printable PDF statement!', 'success');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save as PDF</span>
                </button>
                <button onClick={() => setShowPdfReportModal(false)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs tabular-nums">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">Statement Income</span>
                <span className="text-base font-bold text-emerald-700 mt-1 block">
                  {formatINR(selectedMonthStats.income)}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">Statement Expenses</span>
                <span className="text-base font-bold text-slate-900 mt-1 block">
                  {formatINR(selectedMonthStats.expense)}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">Net Savings ({selectedMonthStats.savingsRate}%)</span>
                <span className="text-base font-bold text-emerald-700 mt-1 block">
                  {formatINR(selectedMonthStats.savings)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Category Breakdown ({selectedMonth})
              </h4>
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2">Category</th>
                    <th className="py-2 text-right">Transactions</th>
                    <th className="py-2 text-right">Share</th>
                    <th className="py-2 text-right">Total Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 tabular-nums">
                  {selectedMonthStats.categoryBreakdown.map((c) => (
                    <tr key={c.category}>
                      <td className="py-2 font-semibold text-slate-800">{c.category}</td>
                      <td className="py-2 text-right text-slate-500">{c.count}</td>
                      <td className="py-2 text-right text-slate-500">{c.sharePct}%</td>
                      <td className="py-2 text-right font-bold text-slate-900">{formatINR(c.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
