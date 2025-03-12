from flask import Flask, request, render_template, jsonify
from categorization.pdf_processor import process_pdf
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Only needed if using separate frontend

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
    