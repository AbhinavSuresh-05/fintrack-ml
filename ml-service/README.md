# FinTrack ML Service

A Python Flask microservice for machine learning operations in the FinTrack personal finance application.

## Features

### Phase 1 (Current)
- ✅ Basic Flask server with CORS
- ✅ `/ping` health check endpoint
- ✅ `/health` detailed status endpoint
- ✅ `/api/ml/categorize` placeholder ML categorization

### Future Phases
- 🔄 ML model training for transaction categorization
- 🔄 Spending pattern analysis
- 🔄 Budget recommendation engine
- 🔄 Anomaly detection for unusual spending

## Quick Start

### Prerequisites
- Python 3.8+
- pip (Python package manager)

### Installation

1. **Create virtual environment:**
```bash
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Run the service:**
```bash
python app.py
```

The service will start on `http://localhost:5002`

## API Endpoints

### Health Checks
- `GET /ping` - Simple health check
- `GET /health` - Detailed service status

### ML Operations
- `POST /api/ml/categorize` - Categorize transactions (placeholder)

#### Example Request:
```bash
curl -X POST http://localhost:5002/api/ml/categorize \
  -H "Content-Type: application/json" \
  -d '{"description": "Starbucks Coffee"}'
```

#### Example Response:
```json
{
  "status": "success",
  "predicted_category": "Food & Dining",
  "confidence": 0.85,
  "method": "rule-based-placeholder",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Project Structure

```
ml-service/
├── app.py              # Main Flask application
├── requirements.txt    # Python dependencies
├── .env               # Environment configuration
└── README.md          # This file
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DEBUG` | `True` | Enable Flask debug mode |
| `PORT` | `5002` | Service port number |
| `FLASK_ENV` | `development` | Flask environment |

## Development Notes

- Currently uses rule-based categorization as a placeholder
- Real ML models will be added in Phase 2+
- Service is designed to integrate with the main FinTrack backend
- CORS enabled for frontend integration
