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
    if not flagged:
        return Response(
            content="No flagged transactions to export",
            media_type="text/plain"
        )
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
