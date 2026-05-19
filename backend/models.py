from pydantic import BaseModel
from typing import List, Optional


class TransactionRequest(BaseModel):
    payer_id: str
    payee_id: str
    amount: float
    timestamp: str
    location: str
    device_id: str


class FraudAnalysisResponse(BaseModel):
    transaction_id: str
    risk_score: float
    risk_level: str  # LOW, MEDIUM, HIGH
    fraud_status: bool
    triggered_rules: List[str]
    reasons: List[str]


class Transaction(BaseModel):
    """Complete transaction model with analysis results"""
    payer_id: str
    payee_id: str
    amount: float
    timestamp: str
    location: str
    device_id: str
    risk_score: float
    risk_level: str
    fraud_status: bool
    triggered_rules: List[str]
    reasons: List[str]


class StatsResponse(BaseModel):
    """Statistics response model"""
    flagged_transactions: int
    high_risk_transactions: int
    average_risk_score: float
