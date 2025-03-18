import pdfplumber
import pytesseract
import pandas as pd
import re
import tempfile
from flask import jsonify

# Configure Tesseract path (Windows specific)
pytesseract.pytesseract.tesseract_cmd = r'C:/Program Files/Tesseract-OCR/tesseract.exe'

def extract_text_from_pdf(pdf_path):
    """Extract text from PDF using pdfplumber and fallback to OCR"""
    all_text = ""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                page_text = ""
                text = page.extract_text()
                
                if text:
                    page_text += text
                else:
                    # Handle tables
                    tables = page.extract_tables()
                    if tables:
                        for table in tables:
                            for row in table:
                                page_text += " | ".join([str(cell) if cell else "" for cell in row]) + "\n"
                    else:
                        # OCR fallback
                        image = page.to_image()
                        ocr_text = pytesseract.image_to_string(
                            image.original,
                            config='--psm 3 --oem 3 -c preserve_interword_spaces=1'
                        )
                        page_text += ocr_text

                all_text += page_text + "\n"
    except Exception as e:
        raise RuntimeError(f"PDF processing failed: {str(e)}")
    
    return all_text

def parse_transactions(all_text):
    """Parse transactions from extracted text"""
    date_pattern = r"(\b\d{2}/\d{2}/\d{4}\b|\b\d{2}/\d{2}\b|\b\d{1,2}, \d{4}\b|\b[A-Za-z]+ \d{1,2}, \d{4}\b)"
    transaction_lines = []
    
    for line in all_text.split('\n'):
        line = line.strip()
        if re.search(date_pattern, line):
            if ('through' not in line and 'to' not in line and
                not re.search(r'\d{5}', line) and
                re.search(r'[-$]\d+(\.\d{2})?', line)):
                transaction_lines.append(line)
    
    return transaction_lines

def categorize_transactions(transaction_lines):
    """Categorize transactions"""
    transaction_pattern = r"""
        (\d{2}/\d{2}/\d{4}|\d{2}/\d{2}|\b[A-Za-z]+\s\d{1,2},\s\d{4}\b)
        \s+(.+?)
        \s+(-?\$?\d{1,3}(?:,\d{3})*(?:\.\d{2})?)
        \s+(-?\$?\d{1,3}(?:,\d{3})*(?:\.\d{2})?)?
    """
    
    parsed_data = []
    for line in transaction_lines:
        match = re.match(transaction_pattern, line, re.VERBOSE)
        if match:
            date, description, amount, balance = match.groups()
            parsed_data.append({
                "Date": date,
                "Description": description.strip(),
                "Amount": float(amount.replace('$', '').replace(',', '')) if amount else None,
                "Balance": float(balance.replace('$', '').replace(',', '')) if balance else None
            })
    
    return pd.DataFrame(parsed_data)

def categorize_only(df):
    """Categorize transactions and aggregate costs into the required JSON structure"""
    def determine_category(description):
        desc = description.lower()
        
        # Transportation
        if any(k in desc for k in ['subway', 'bus', 'train', 'domestic_flight', 'international_flight']):
            if 'subway' in desc:
                return 'transportation', 'subway'
            elif 'bus' in desc:
                return 'transportation', 'bus'
            elif 'train' in desc:
                return 'transportation', 'train'
            elif 'domestic_flight' in desc:
                return 'transportation', 'domestic_flight'
            elif 'international_flight' in desc:
                return 'transportation', 'international_flight'
        
        # Electricity
        elif 'electric' in desc:
            return 'electricity', 'consumption'
        
        # Restaurants
        elif any(k in desc for k in ['restaurant', 'food', 'coffee', 'cafe', 'canteen', 'diner', 'meal', 'doordash', 'grubhub', 'ubereats']):
            if 'fast_food' in desc:
                return 'restaurants', 'fast_food'
            elif 'casual_dining' in desc:
                return 'restaurants', 'casual_dining'
            elif 'fine_dining' in desc:
                return 'restaurants', 'fine_dining'
            else:
                return 'restaurants', 'average'
        
        # Water
        elif 'water' in desc:
            return 'water', 'water_bill'
        
        # Retail
        elif any(k in desc for k in ['amazon', 'walmart', 'target', 'purchase', 'shop', 'store', 'market']):
            if 'electronics' in desc:
                return 'retail', 'electronics'
            elif 'clothing' in desc:
                return 'retail', 'clothing'
            elif 'kids' in desc:
                return 'retail', 'kids'
            elif 'furniture' in desc:
                return 'retail', 'furniture'
            elif 'entertainment' in desc:
                return 'retail', 'entertainment'
            elif 'home_supplies' in desc:
                return 'retail', 'home_supplies'
            elif 'medical_care' in desc:
                return 'retail', 'medical_care'
            elif 'personal_care' in desc:
                return 'retail', 'personal_care'
            elif 'pets' in desc:
                return 'retail', 'pets'
        
        # Default category for unclassified transactions
        return 'other', 'other'

    # Initialize the JSON structure
    result = {
        "transportation": {
            "subway": {"cost": 0},
            "bus": {"cost": 0},
            "train": {"cost": 0},
            "domestic_flight": {"cost": 0},
            "international_flight": {"cost": 0}
        },
        "electricity": {
            "consumption": 0,
            "energy_source": "electricity_bill"
        },
        "food": {},
        "retail": {
            "electronics": 0,
            "clothing": 0,
            "kids": 0,
            "furniture": 0,
            "entertainment": 0,
            "home_supplies": 0,
            "medical_care": 0,
            "personal_care": 0,
            "pets": 0
        },
        "waste": {},
        "restaurants": {
            "fast_food": 0,
            "casual_dining": 0,
            "fine_dining": 0,
            "average": 0
        },
        "water": {
            "water_bill": 0
        }
    }

    # Apply categorization and aggregate costs
    for _, row in df.iterrows():
        category, subcategory = determine_category(row['Description'])
        if category in result:
            if subcategory in result[category]:
                if isinstance(result[category][subcategory], dict):
                    result[category][subcategory]['cost'] += row['Amount']
                else:
                    result[category][subcategory] += row['Amount']

    return result

def process_pdf(file_stream):
    """Main processing function"""
    try:
        with tempfile.NamedTemporaryFile(delete=True, suffix=".pdf") as tmp:
            # Write PDF content to temp file
            tmp.write(file_stream.read())
            tmp.seek(0)
            
            # Extract text
            all_text = extract_text_from_pdf(tmp.name)
            
            # Parse transactions
            transactions = parse_transactions(all_text)
            
            # Categorize transactions
            df = categorize_transactions(transactions)
            categorized_data = categorize_only(df)
            
            # Return the categorized transactions
            return categorized_data
            
    except Exception as e:
        return {"error": str(e)}