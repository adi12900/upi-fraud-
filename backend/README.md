# Backend - UPI Fraud Detector

FastAPI server with 11 fraud detection rules.

## Setup

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

## Endpoints

- POST /transaction - Analyze transaction
- GET /transactions - All transactions
- GET /flagged - Flagged only
- GET /stats - Statistics
- GET /export - CSV download
- POST /generate-demo-data - Demo data
- POST /clear-data - Reset
- GET /health - Health check

## Fraud Rules (11)

1. HIGH_AMOUNT (₹10k+): +25
2. VERY_HIGH_AMOUNT (₹50k+): +40
3. HIGH_VELOCITY (6+ txns/2min): +30
4. ODD_HOUR_TRANSACTION (12-4 AM): +20
5. NEW_DEVICE: +15
6. NEW_DEVICE_NEW_PAYEE: +35
7. LOCATION_CHANGE: +20
8. SMURFING_PATTERN (9+ small): +25
9. REPEATED_PATTERN (4+ same): +15
10. BEHAVIORAL_ANOMALY (3x avg): +25
11. TRUSTED_MERCHANT: -10

Risk: 0-100 scale | Flagged: ≥ 60

| 6 | NEW_DEVICE_NEW_PAYEE | New device + new payee | +35 | New device with new beneficiary |
| 7 | LOCATION_CHANGE | Location differs from last | +20 | Sudden location change |
| 8 | SMURFING_PATTERN | >8 txns <₹200 in 5min | +25 | Possible smurfing/structuring |
| 9 | REPEATED_PATTERN | Same amount >4x rapidly | +15 | Repeated transaction pattern |
| 10 | BEHAVIORAL_ANOMALY | Amount > 3x user avg | +25 | Exceeds normal behavior |
| 11 | TRUSTED_MERCHANT | Payee in trusted list | -10 | Trusted merchant (reduction) |

## Risk Scoring

- **Score Range**: 0 - 100
- **LOW RISK**: 0-29 (Green)
- **MEDIUM RISK**: 30-59 (Yellow)
- **HIGH RISK**: 60-100 (Red)
- **Flagged**: Risk score ≥ 60

## Trusted Merchants

Automatically reduces risk:
- AMAZON
- SWIGGY
- ZOMATO
- FLIPKART
- PAYTM

## Data Models

### Transaction
```python
{
  "transaction_id": str,           # Unique ID
  "payer_id": str,                 # Sender
  "payee_id": str,                 # Receiver
  "amount": float,                 # Amount in INR
  "timestamp": str,                # ISO format
  "location": str,                 # City/Location
  "device_id": str,                # Device ID
  "risk_score": float,             # 0-100
  "risk_level": str,               # LOW/MEDIUM/HIGH
  "fraud_status": bool,            # Flagged or not
  "triggered_rules": List[str],    # Rules that triggered
  "reasons": List[str]             # Explanations
}
```

## Architecture

```
main.py
├── FastAPI app setup
├── CORS middleware
├── Endpoint handlers
└── Transaction processing

fraud_engine.py
├── Rule evaluation
├── Score calculation
├── History tracking
└── Risk assessment

models.py
├── Request models
├── Response models
└── Data schemas

utils.py
├── Helper functions
├── Timestamp parsing
├── CSV export
└── Utility methods

sample_data.py
└── Demo scenario generator
```

## Usage Example

```python
# Run with:
uvicorn main:app --reload

# Test with curl:
curl -X POST "http://localhost:8000/transaction" \
  -H "Content-Type: application/json" \
  -d '{
    "payer_id": "9988776655",
    "payee_id": "UNKNOWN_SHOP",
    "amount": 65000,
    "timestamp": "2026-02-10T03:30:00",
    "location": "Mumbai",
    "device_id": "NEW_DEVICE_001"
  }'
```

## Performance Notes

- In-memory storage for demo purposes
- Tracks last 100 transactions per payer
- O(n) lookup for velocity checks
- Scales for real-time processing
- For production: integrate database

## Future Enhancements

- Machine learning model integration
- Database persistence
- Authentication & authorization
- Advanced anomaly detection
- Multi-level approval workflows
- Real-time alerts/notifications
- API rate limiting

---

**Built for**: 3-hour placement hackathon  
**Purpose**: Demonstrate fraud detection logic and real-time monitoring
