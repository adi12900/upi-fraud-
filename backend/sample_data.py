from datetime import datetime, timedelta
import random


class DemoDataGenerator:
    @staticmethod
    def generate_demo_transactions() -> list:
        base_time = datetime.now()
        transactions = []
        
        payers = ["USER_001", "USER_002", "USER_003", "USER_004"]
        payees = [
            "MERCHANT121", "AMAZON123", "ZOMATO456", "FLIPKART789",
            "UNKNOWN_SHOP", "SUSPICIOUS_001", "SWIGGY234"
        ]
        locations = ["Delhi", "Mumbai", "Bangalore", "Chennai", "Hyderabad", "Unknown_Location"]
        
        transaction_count = 0
        
        for i in range(2):
            transactions.append({
                "payer_id": payers[0],
                "payee_id": payees[4],
                "amount": random.randint(15000, 75000),
                "timestamp": (base_time - timedelta(minutes=30 + i*5)).isoformat(),
                "location": locations[0],
                "device_id": "DEV_001"
            })
            transaction_count += 1
        
        transactions.append({
            "payer_id": payers[1],
            "payee_id": payees[5],
            "amount": 65000,
            "timestamp": (base_time - timedelta(minutes=25)).isoformat(),
            "location": locations[1],
            "device_id": "DEV_NEW_001"
        })
        transaction_count += 1
        
        for i in range(6):
            transactions.append({
                "payer_id": payers[2],
                "payee_id": payees[6],
                "amount": 150 + random.randint(-50, 50),
                "timestamp": (base_time - timedelta(minutes=4 - i*0.5)).isoformat(),
                "location": locations[2],
                "device_id": "DEV_TEMP_001"
            })
            transaction_count += 1
        
        midnight_time = base_time.replace(hour=2, minute=30)
        for i in range(3):
            transactions.append({
                "payer_id": payers[3],
                "payee_id": payees[4],
                "amount": random.randint(5000, 15000),
                "timestamp": (midnight_time - timedelta(days=1, hours=i)).isoformat(),
                "location": locations[3],
                "device_id": "DEV_003"
            })
            transaction_count += 1
        
        for i in range(2):
            transactions.append({
                "payer_id": payers[0],
                "payee_id": f"UNKNOWN_{random.randint(100, 999)}",
                "amount": random.randint(5000, 25000),
                "timestamp": (base_time - timedelta(minutes=15 + i*5)).isoformat(),
                "location": locations[4],
                "device_id": f"NEW_DEVICE_{random.randint(1000, 9999)}"
            })
            transaction_count += 1
        
        location_sequence = [locations[0], locations[1], locations[2], locations[3]]
        for i, loc in enumerate(location_sequence):
            transactions.append({
                "payer_id": payers[0],
                "payee_id": payees[random.randint(0, 6)],
                "amount": random.randint(2000, 8000),
                "timestamp": (base_time - timedelta(minutes=45 + i*3)).isoformat(),
                "location": loc,
                "device_id": "DEV_001"
            })
            transaction_count += 1
        
        for i in range(10):
            transactions.append({
                "payer_id": payers[1],
                "payee_id": payees[4],
                "amount": random.randint(50, 150),
                "timestamp": (base_time - timedelta(minutes=10, seconds=i*25)).isoformat(),
                "location": locations[1],
                "device_id": "DEV_004"
            })
            transaction_count += 1
        
        for i in range(15):
            transactions.append({
                "payer_id": payers[random.randint(0, 3)],
                "payee_id": payees[random.randint(0, 6)],
                "amount": random.randint(100, 5000),
                "timestamp": (base_time - timedelta(hours=random.randint(0, 4))).isoformat(),
                "location": locations[random.randint(0, 5)],
                "device_id": "DEV_" + str(random.randint(1, 5)).zfill(3)
            })
            transaction_count += 1
        
        return transactions
