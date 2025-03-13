from flask import Flask, request, render_template, jsonify
from categorization.pdf_processor import process_pdf
from flask_cors import CORS
from app.routes import api_routes  # ✅ Import API routes

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# ✅ Register API routes
app.register_blueprint(api_routes, url_prefix="/api")

@app.route('/')
def dashboard():
    return render_template('dashboard.html')

@app.route('/upload', methods=['POST'])
def handle_upload():
    if 'pdf' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
        
    file = request.files['pdf']
    try:
        result = process_pdf(file.stream)
        return jsonify({
            "status": "success",
            "data": result['transactions'],
            "totals": result['totals'],
            "footprint": result['footprint'],
            "dates": result['dates']
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
