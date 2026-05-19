from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
import uuid
from datetime import datetime
from typing import List

from models import TransactionRequest, FraudAnalysisResponse, Transaction, StatsResponse
from fraud_engine import FraudEngine
from sample_data import DemoDataGenerator
from utils import is_trusted_merchant, export_transactions_csv


app = FastAPI(title="UPI Fraud Detector API", version="1.0.0")

fraud_engine = FraudEngine()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def generate_transaction_id() -> str:
    return f"TXN{str(uuid.uuid4())[:8].upper()}"


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.post("/transaction", response_model=FraudAnalysisResponse)
async def analyze_transaction(request: TransactionRequest):
    try:
        transaction_id = generate_transaction_id()
        transaction_data = {
            "payer_id": request.payer_id,
            "payee_id": request.payee_id,
            "amount": request.amount,
            "timestamp": request.timestamp,
            "location": request.location,
            "device_id": request.device_id
        }
        risk_score, triggered_rules, reasons = fraud_engine.analyze_transaction(transaction_data)
        risk_level = fraud_engine.get_risk_level(risk_score)
        fraud_status = fraud_engine.should_flag_transaction(risk_score)
        full_transaction = {
            "transaction_id": transaction_id,
            "payer_id": request.payer_id,
            "payee_id": request.payee_id,
            "amount": request.amount,
            "timestamp": request.timestamp,
            "location": request.location,
            "device_id": request.device_id,
            "risk_score": round(risk_score, 2),
            "risk_level": risk_level,
            "fraud_status": fraud_status,
            "triggered_rules": triggered_rules,
            "reasons": reasons
        }
        fraud_engine.transactions.append(full_transaction)
        return FraudAnalysisResponse(
            transaction_id=transaction_id,
            risk_score=round(risk_score, 2),
            risk_level=risk_level,
            fraud_status=fraud_status,
            triggered_rules=triggered_rules,
            reasons=reasons
        )
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/transactions")
async def get_all_transactions() -> List[Transaction]:
    return fraud_engine.transactions


@app.get("/flagged")
async def get_flagged_transactions() -> List[Transaction]:
    return [txn for txn in fraud_engine.transactions if txn["fraud_status"]]


@app.get("/alerts")
async def get_alerts():
    # Derive alerts from recent transactions and triggered rules
    alerts = []
    recent = fraud_engine.transactions[-50:][::-1]
    for idx, txn in enumerate(recent[:20]):
        severity = 'MEDIUM'
        if txn['risk_score'] >= 80:
            severity = 'CRITICAL'
        elif txn['risk_score'] >= 60:
            severity = 'HIGH'
        elif txn['risk_score'] >= 40:
            severity = 'MEDIUM'
        else:
            severity = 'LOW'

        category = txn.get('triggered_rules', [None])[0] or 'ANOMALY'
        message = f"{txn['payer_id']} → {txn['payee_id']} amount ₹{txn['amount']} (score {txn['risk_score']})"
        alerts.append({
            'id': txn['transaction_id'],
            'severity': severity,
            'category': category,
            'message': message,
            'timestamp': txn['timestamp'],
            'escalated': txn['fraud_status']
        })

    return {'alerts': alerts}


@app.get('/timeline')
async def get_timeline():
    # Build a simple event timeline based on recent transactions
    events = []
    recent = fraud_engine.transactions[-30:]
    for txn in recent[::-1]:
        ev_type = 'normal'
        if txn['risk_score'] >= 80:
            ev_type = 'critical'
        elif txn['risk_score'] >= 60:
            ev_type = 'warning'

        label = txn.get('triggered_rules', ['Anomaly'])[0]
        events.append({
            'id': txn['transaction_id'],
            'type': ev_type,
            'label': label,
            'time': txn['timestamp'],
            'icon': None,
        })

    return {'events': events}


@app.get('/risk-distribution')
async def get_risk_distribution():
    # Map risk_score to severity buckets
    buckets = {'Safe': 0, 'Monitor': 0, 'Suspicious': 0, 'High Risk': 0}
    for txn in fraud_engine.transactions:
        score = txn.get('risk_score', 0)
        if score < 30:
            buckets['Safe'] += 1
        elif score < 50:
            buckets['Monitor'] += 1
        elif score < 70:
            buckets['Suspicious'] += 1
        else:
            buckets['High Risk'] += 1

    data = [
        {'name': 'Safe', 'value': buckets['Safe'], 'color': '#16A34A'},
        {'name': 'Monitor', 'value': buckets['Monitor'], 'color': '#D97706'},
        {'name': 'Suspicious', 'value': buckets['Suspicious'], 'color': '#EA580C'},
        {'name': 'High Risk', 'value': buckets['High Risk'], 'color': '#DC2626'},
    ]
    return {'distribution': data}


@app.get('/insights')
async def get_insights():
    # Compute simple insights from transaction history
    device_counts = {}
    payer_max_score = {}
    hourly_counts = {}
    new_beneficiary_counts = 0

    seen_payee_by_payer = {}

    for txn in fraud_engine.transactions:
        dev = txn.get('device_id')
        payer = txn.get('payer_id')
        payee = txn.get('payee_id')
        score = txn.get('risk_score', 0)
        timestamp = txn.get('timestamp')

        device_counts[dev] = device_counts.get(dev, 0) + 1
        payer_max_score[payer] = max(payer_max_score.get(payer, 0), score)

        hour = None
        try:
            hour = int(timestamp.split(':')[0])
        except Exception:
            hour = 0
        hourly_counts[hour] = hourly_counts.get(hour, 0) + 1

        seen = seen_payee_by_payer.setdefault(payer, set())
        if payee not in seen:
            new_beneficiary_counts += 1
            seen.add(payee)

    most_suspicious_device = max(device_counts.items(), key=lambda x: x[1])[0] if device_counts else None
    highest_risk_payer = max(payer_max_score.items(), key=lambda x: x[1])[0] if payer_max_score else None

    midnight_count = sum(v for k, v in hourly_counts.items() if k in (0, 1, 2))
    avg_hourly = sum(hourly_counts.values()) / (len(hourly_counts) or 1)
    midnight_spike = f"{(midnight_count / (avg_hourly or 1) * 100):.0f}%" if avg_hourly > 0 else '0%'

    # velocity attacks count via triggered rules
    velocity_attacks = sum(1 for txn in fraud_engine.transactions if 'HIGH_VELOCITY' in txn.get('triggered_rules', []))

    insights = [
        {'id': '1', 'title': 'Most Suspicious Device', 'value': most_suspicious_device or 'unknown', 'detail': f"{device_counts.get(most_suspicious_device,0)} flagged transactions"},
        {'id': '2', 'title': 'Highest Risk Payer', 'value': highest_risk_payer or 'unknown', 'detail': f"Risk score: {payer_max_score.get(highest_risk_payer,0)}"},
        {'id': '3', 'title': 'Midnight Activity Spike', 'value': midnight_spike, 'detail': 'vs normal activity'},
        {'id': '4', 'title': 'Rapid Location Switching', 'value': 'N/A', 'detail': 'computed from locations'},
        {'id': '5', 'title': 'New Beneficiary Spike', 'value': f"{new_beneficiary_counts}", 'detail': 'new payees detected'},
        {'id': '6', 'title': 'Velocity Attack Pattern', 'value': f"{velocity_attacks} detected", 'detail': 'across devices'},
    ]

    return {'insights': insights}


@app.get("/stats", response_model=StatsResponse)
async def get_statistics():
    total = len(fraud_engine.transactions)
    flagged = len([t for t in fraud_engine.transactions if t["fraud_status"]])
    high_risk = len([t for t in fraud_engine.transactions if t["risk_level"] == "HIGH"])
    avg_score = sum(t["risk_score"] for t in fraud_engine.transactions) / total if total > 0 else 0.0
    
    return StatsResponse(
        total_transactions=total,
        flagged_transactions=flagged,
        high_risk_transactions=high_risk,
        average_risk_score=round(avg_score, 2)
    )


@app.get("/export")
async def export_flagged_transactions():
    flagged = [txn for txn in fraud_engine.transactions if txn["fraud_status"]]
    csv_content = export_transactions_csv(flagged)
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=flagged_transactions.csv"}
    )


@app.post("/generate-demo-data")
async def generate_demo_data():
    try:
        demo_transactions = DemoDataGenerator.generate_demo_transactions()
        results = []
        for txn_data in demo_transactions:
            transaction_id = generate_transaction_id()
            risk_score, triggered_rules, reasons = fraud_engine.analyze_transaction(txn_data)
            risk_level = fraud_engine.get_risk_level(risk_score)
            fraud_status = fraud_engine.should_flag_transaction(risk_score)
            full_transaction = {
                "transaction_id": transaction_id,
                "payer_id": txn_data["payer_id"],
                "payee_id": txn_data["payee_id"],
                "amount": txn_data["amount"],
                "timestamp": txn_data["timestamp"],
                "location": txn_data["location"],
                "device_id": txn_data["device_id"],
                "risk_score": round(risk_score, 2),
                "risk_level": risk_level,
                "fraud_status": fraud_status,
                "triggered_rules": triggered_rules,
                "reasons": reasons
            }
            
            fraud_engine.transactions.append(full_transaction)
            results.append(full_transaction)
        
        return {
            "status": "success",
            "transactions_generated": len(results),
            "transactions": results
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/clear-data")
async def clear_all_data():
    fraud_engine.reset()
    fraud_engine.transactions = []
    return {"status": "success"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
