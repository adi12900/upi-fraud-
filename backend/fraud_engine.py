from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Set
from collections import defaultdict
from utils import (
    get_hour_from_timestamp, is_odd_hour, 
    calculate_time_diff_minutes, is_trusted_merchant, clamp_score
)


class FraudEngine:
    def __init__(self):
        self.payer_timestamps: Dict[str, List[str]] = defaultdict(list)
        self.payer_devices: Dict[str, Set[str]] = defaultdict(set)
        self.payer_payees: Dict[str, Set[str]] = defaultdict(set)
        self.payer_last_location: Dict[str, str] = {}
        self.payer_amounts: Dict[str, List[float]] = defaultdict(list)
        self.transactions: List[Dict] = []
    
    def analyze_transaction(self, transaction_data: Dict) -> Tuple[float, List[str], List[str]]:
        score = 0.0
        triggered_rules = []
        reasons = []
        
        payer_id = transaction_data["payer_id"]
        payee_id = transaction_data["payee_id"]
        amount = transaction_data["amount"]
        timestamp = transaction_data["timestamp"]
        location = transaction_data["location"]
        device_id = transaction_data["device_id"]
        
        if amount > 10000:
            score += 25
            triggered_rules.append("HIGH_AMOUNT")
            reasons.append("High transaction amount")
        
        if amount > 50000:
            score += 40
            triggered_rules.append("VERY_HIGH_AMOUNT")
            reasons.append("Very high transaction amount")
        
        velocity_score, velocity_triggered = self._check_transaction_velocity(payer_id, timestamp)
        if velocity_triggered:
            score += velocity_score
            triggered_rules.append("HIGH_VELOCITY")
            reasons.append("High transaction velocity detected")
        
        hour = get_hour_from_timestamp(timestamp)
        if is_odd_hour(hour):
            score += 20
            triggered_rules.append("ODD_HOUR_TRANSACTION")
            reasons.append("Transaction during unusual hours")
        
        is_new_device = device_id not in self.payer_devices[payer_id]
        if is_new_device:
            score += 15
            triggered_rules.append("NEW_DEVICE")
            reasons.append("New device detected")
        
        is_new_payee = payee_id not in self.payer_payees[payer_id]
        if is_new_device and is_new_payee:
            score += 35
            triggered_rules.append("NEW_DEVICE_NEW_PAYEE")
            reasons.append("New device used with new beneficiary")
        
        if payer_id in self.payer_last_location:
            if location != self.payer_last_location[payer_id]:
                score += 20
                triggered_rules.append("LOCATION_CHANGE")
                reasons.append("Sudden location change detected")
        
        smurf_score, smurf_triggered = self._check_smurfing(payer_id, amount, timestamp)
        if smurf_triggered:
            score += smurf_score
            triggered_rules.append("SMURFING_PATTERN")
            reasons.append("Possible smurfing behavior detected")
        
        repeat_score, repeat_triggered = self._check_repeated_pattern(payer_id, amount, timestamp)
        if repeat_triggered:
            score += repeat_score
            triggered_rules.append("REPEATED_PATTERN")
            reasons.append("Repeated transaction pattern detected")
        
        anomaly_score, anomaly_triggered = self._check_behavioral_anomaly(payer_id, amount)
        if anomaly_triggered:
            score += anomaly_score
            triggered_rules.append("BEHAVIORAL_ANOMALY")
            reasons.append("Transaction significantly exceeds normal user behavior")
        
        if is_trusted_merchant(payee_id):
            score -= 10
            triggered_rules.append("TRUSTED_MERCHANT")
            reasons.append("Trusted merchant detected")
        
        score = clamp_score(score)
        
        self.payer_timestamps[payer_id].append(timestamp)
        self.payer_devices[payer_id].add(device_id)
        self.payer_payees[payer_id].add(payee_id)
        self.payer_last_location[payer_id] = location
        self.payer_amounts[payer_id].append(amount)
        
        if len(self.payer_timestamps[payer_id]) > 100:
            self.payer_timestamps[payer_id] = self.payer_timestamps[payer_id][-100:]
        if len(self.payer_amounts[payer_id]) > 100:
            self.payer_amounts[payer_id] = self.payer_amounts[payer_id][-100:]
        
        return score, triggered_rules, reasons
    
    def _check_transaction_velocity(self, payer_id: str, current_timestamp: str) -> Tuple[int, bool]:
        timestamps = self.payer_timestamps[payer_id]
        count = 0
        for ts in reversed(timestamps):
            diff = calculate_time_diff_minutes(ts, current_timestamp)
            if diff <= 2:
                count += 1
            else:
                break
        triggered = count > 5
        return (30 if triggered else 0, triggered)
    
    def _check_smurfing(self, payer_id: str, amount: float, current_timestamp: str) -> Tuple[int, bool]:
        transactions_in_window = []
        for ts in reversed(self.payer_timestamps[payer_id]):
            diff = calculate_time_diff_minutes(ts, current_timestamp)
            if diff <= 5:
                transactions_in_window.append(ts)
            else:
                break
        
        if amount >= 200:
            return (0, False)
        
        count = len(transactions_in_window) + 1
        triggered = count > 8
        return (25 if triggered else 0, triggered)
    
    def _check_repeated_pattern(self, payer_id: str, amount: float, current_timestamp: str) -> Tuple[int, bool]:
        count = 0
        for ts in reversed(self.payer_timestamps[payer_id]):
            diff = calculate_time_diff_minutes(ts, current_timestamp)
            if diff <= 10:
                count += 1
            else:
                break
        triggered = count > 4
        return (15 if triggered else 0, triggered)
    
    def _check_behavioral_anomaly(self, payer_id: str, amount: float) -> Tuple[int, bool]:
        amounts = self.payer_amounts[payer_id]
        if len(amounts) < 2:
            return (0, False)
        
        average = sum(amounts) / len(amounts)
        triggered = amount > (3 * average)
        return (25 if triggered else 0, triggered)
    
    def get_risk_level(self, score: float) -> str:
        if score < 30:
            return "LOW"
        elif score < 60:
            return "MEDIUM"
        else:
            return "HIGH"
    
    def should_flag_transaction(self, score: float) -> bool:
        return score >= 60
    
    def reset(self):
        self.payer_timestamps.clear()
        self.payer_devices.clear()
        self.payer_payees.clear()
        self.payer_last_location.clear()
        self.payer_amounts.clear()
        self.transactions.clear()