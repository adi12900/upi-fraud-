# Frontend - UPI Fraud Detector

React dashboard for fraud detection with charts and live updates.

## Setup

```bash
npm install
npm run dev
```

Runs at: http://localhost:5173

## Components

- Navbar - Title + stats
- TransactionForm - Input analysis
- RiskResult - Animated score
- StatsCards - 4 KPIs
- RiskCharts - Pie, Bar, Line charts
- AlertsTable - Flagged txns
- LiveFeed - Auto-refresh feed

## Features

- Dark fintech theme
- Real-time updates (3 sec refresh)
- Interactive charts
- Transaction form with validation
- CSV export
- Demo data generation
- Responsive design

## Tech Stack

React 18, Vite, TailwindCSS, Recharts, Axios

1. Fill in the transaction form with details
2. Click "Analyze Transaction"
3. View risk assessment and fraud reasons

### Generate Demo Data
1. Click "Generate Fraud Traffic" button
2. System generates 20-30 realistic fraud scenarios
3. All data appears in dashboard instantly

### Export Suspicious Transactions
1. Click "Export Suspicious CSV" button
2. CSV file downloads with all flagged transactions

### Clear Data
1. Click "Clear All Data" button
2. Confirm the action
3. All transactions are reset

## Styling

- **Dark Theme**: Gray-900 background with gradients
- **Accent Colors**:
  - Red (#ef4444) - High risk
  - Yellow (#f59e0b) - Medium risk
  - Green (#10b981) - Low risk
  - Blue (#3b82f6) - Statistics
- **Effects**: Smooth transitions, hover animations, glassmorphism

## API Integration

Connects to FastAPI backend at `http://localhost:8000`:

- `POST /transaction` - Analyze single transaction
- `GET /transactions` - Get all transactions
- `GET /flagged` - Get flagged transactions
- `GET /stats` - Get statistics
- `POST /generate-demo-data` - Generate demo transactions
- `GET /export` - Export CSV
- `POST /clear-data` - Clear all data

## Performance

- Auto-refresh every 3 seconds
- Efficient state management
- Lazy component loading
- Optimized re-renders
- Chart data caching

## Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Build

```bash
# Production build
npm run build

# Preview build
npm run preview
```

## Future Enhancements

- Advanced filtering and search
- Transaction details modal
- Custom date range analysis
- Risk trend prediction
- Notification system
- User preferences/settings
- Dark mode toggle (currently dark-only)
- PDF export reports

---

**Built for**: 3-hour placement hackathon  
**Purpose**: Real-time fraud monitoring dashboard
