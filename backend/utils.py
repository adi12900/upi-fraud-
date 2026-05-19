import uuid
import csv
from io import StringIO
from datetime import datetime
from typing import List, Dict, Any


def generate_transaction_id() -> str:
    return f"TXN{str(uuid.uuid4())[:8].upper()}"


def parse_timestamp(timestamp_str: str) -> datetime:
    try:
        return datetime.fromisoformat(timestamp_str)
    except Exception:
        return datetime.now()


def get_hour_from_timestamp(timestamp_str: str) -> int:
    try:
        dt = datetime.fromisoformat(timestamp_str)
        return dt.hour
    except Exception:
        return -1


def is_odd_hour(hour: int) -> bool:
    return 0 <= hour < 4


def calculate_time_diff_minutes(timestamp1: str, timestamp2: str) -> float:
    try:
        dt1 = datetime.fromisoformat(timestamp1)
        dt2 = datetime.fromisoformat(timestamp2)
        return abs((dt2 - dt1).total_seconds() / 60)
    except Exception:
        return float('inf')


def is_trusted_merchant(payee_id: str) -> bool:
    trusted_keywords = ["AMAZON", "SWIGGY", "ZOMATO", "FLIPKART", "PAYTM"]
    return any(keyword in payee_id.upper() for keyword in trusted_keywords)


def export_transactions_csv(transactions: List[Dict[str, Any]]) -> str:
    if not transactions:
        return ""
    
    output = StringIO()
    writer = csv.DictWriter(
        output,
        fieldnames=[
            "transaction_id", "payer_id", "payee_id", "amount",
            "timestamp", "location", "device_id", "risk_score",
            "risk_level", "fraud_status", "triggered_rules", "reasons"
        ]
    )
    
    writer.writeheader()
    for txn in transactions:
        txn_row = txn.copy()
        txn_row["triggered_rules"] = "|".join(txn.get("triggered_rules", []))
        txn_row["reasons"] = "|".join(txn.get("reasons", []))
        writer.writerow(txn_row)
    
    return output.getvalue()


def clamp_score(score: float, min_val: float = 0, max_val: float = 100) -> float:
    return max(min_val, min(score, max_val))
