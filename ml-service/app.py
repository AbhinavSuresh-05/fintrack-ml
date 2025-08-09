from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration
app.config['DEBUG'] = os.getenv('DEBUG', 'True').lower() == 'true'
PORT = int(os.getenv('PORT', 5002))

@app.route('/ping', methods=['GET'])
def ping():
    """Health check endpoint"""
    return jsonify({
        'status': 'success',
        'message': 'ML Service is running',
        'timestamp': datetime.utcnow().isoformat(),
        'service': 'fintrack-ml-service',
        'version': '1.0.0'
    }), 200

@app.route('/health', methods=['GET'])
def health():
    """Detailed health check"""
    return jsonify({
        'status': 'healthy',
        'service': 'ML Service',
        'uptime': 'Active',
        'database': 'Not connected (future implementation)',
        'ml_models': 'Not loaded (future implementation)',
        'timestamp': datetime.utcnow().isoformat()
    }), 200

@app.route('/api/ml/categorize', methods=['POST'])
def categorize_transaction():
    """
    Future endpoint for ML-based transaction categorization
    Currently returns a placeholder response
    """
    try:
        data = request.get_json()
        
        if not data or 'description' not in data:
            return jsonify({
                'error': 'Missing transaction description'
            }), 400
        
        # Placeholder ML logic - will be replaced with actual model
        description = data['description'].lower()
        
        # Simple rule-based categorization for now
        if any(word in description for word in ['grocery', 'food', 'restaurant', 'cafe']):
            category = 'Food & Dining'
            confidence = 0.85
        elif any(word in description for word in ['gas', 'fuel', 'transport', 'uber', 'taxi']):
            category = 'Transportation'
            confidence = 0.80
        elif any(word in description for word in ['netflix', 'spotify', 'subscription', 'streaming']):
            category = 'Entertainment'
            confidence = 0.90
        elif any(word in description for word in ['salary', 'payroll', 'income', 'deposit']):
            category = 'Income'
            confidence = 0.95
        else:
            category = 'Other'
            confidence = 0.50
        
        return jsonify({
            'status': 'success',
            'predicted_category': category,
            'confidence': confidence,
            'method': 'rule-based-placeholder',
            'timestamp': datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'error': 'Endpoint not found',
        'message': 'The requested endpoint does not exist'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'error': 'Internal server error',
        'message': 'Something went wrong on our end'
    }), 500

if __name__ == '__main__':
    print(f"🤖 ML Service starting on port {PORT}")
    print(f"🔗 Health check: http://localhost:{PORT}/ping")
    print(f"📊 ML API: http://localhost:{PORT}/api/ml/categorize")
    app.run(host='0.0.0.0', port=PORT, debug=app.config['DEBUG'])
