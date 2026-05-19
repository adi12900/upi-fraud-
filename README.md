# UPI Fraud Detector

Real-time fraud detection system for UPI transactions using 11 weighted rules.

## Quick Start

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📊 Project Structure

```
upi-fraud-detector/
├── backend/
│   ├── main.py                 # FastAPI server & endpoints
│   ├── fraud_engine.py         # Fraud detection logic
│   ├── models.py               # Pydantic models
│   ├── utils.py                # Helper functions
│   ├── sample_data.py          # Demo data generator
│   ├── requirements.txt        # Python dependencies
│  Architecture

**Backend**: FastAPI, Python 3.8+  
**Frontend**: React 18, Vite, TailwindCSS  
**Storage**: In-memory (no database)  
**API**: RESTful with Pydantic validation*NEW_DEVICE_NEW_PAYEE** | New device + new payee | +35 | New device with new beneficiary |
| **LOCATION_CHANGE** | Location differs | +20 | Sudden location change |
| **SMURFING_PATTERN** | >8 txns <₹200 in 5min | +25 | Possible structuring/AML pattern |
| **REPEATED_PATTERN** | Same amount >4x rapidly | +15 | Repeated transaction amounts |
| **BEHAVIORAL_ANOMALY** | Amount > 3x user avg | +25 | Unusual user behavior |
| **TRUSTED_MERCHANT** | Payee in whitelist | -10 | Trusted merchant (reduction) |

**Trusted Merchants**: AMAZON, SWIGGY, ZOMATO, FLIPKART, PAYTM

### Risk Scoring

- **Score Range**: 0 - 100
- **LOW**: 0-29 (✅ Green)
- **MEDIUM**: 30-59 (⚠️ Yellow)
- **HIGH**: 60-100 (🚨 Red)
- **Flagged**: Risk score ≥ 60

## Features

- 11 weighted fraud detection rules
- Real-time risk scoring (0-100)
- Transaction history tracking
- Interactive dashboard with 3 charts
- Flagged transaction alerts
- CSV export
- Demo data generation (30 scenarios)
- 8 React components
- 7 API endpoints

## Frontend

- Navbar (status + stats)
- Transaction Form (input + analysis)
- Risk Result (animated score)
- Stats Cards (4 KPIs)
- Charts (Pie, Bar, Line)
- Alerts Table (flagged txns)
- Live Feed (auto-refresh)

## API Endpoints

- POST /transaction - Analyze
- GET /transactions - All txns
- GET /flagged - Flagged only
- GET /stats - Statistics
- GET /export - CSV download
- POST /generate-demo-data - Demo
- POST /clear-data - Reset
- GET /health - Health check

## Tech Stack

**Backend**: FastAPI, Pydantic, Python 3.8+  
**Frontend**: React 18, Vite, TailwindCSS, Recharts, Axios  
**No**: Database, Auth, ML, Containers, Complexity