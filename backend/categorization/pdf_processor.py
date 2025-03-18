import pdfplumber
import pytesseract
import pandas as pd
import re
import tempfile
import os
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
    """Categorize transactions without emissions calculations"""
    def determine_category(description):
        desc = description.lower()
        
        # Transportation
        if any(k in desc for k in ['bus', 'uber', 'lyft', 'taxi', 'car', 'gas', 'fuel', 'parking']):
            return 'Transportation'
        
        # Food & Dining
        elif any(k in desc for k in ['restaurant', 'food', 'grocery', 'coffee', 'cafe', 'canteen', 
                                    'diner', 'meal', 'doordash', 'grubhub', 'ubereats']):
            return 'Food & Dining'
        
        # Bills & Utilities
        elif any(k in desc for k in ['electric', 'water', 'utility', 'bill', 'phone', 'internet', 'wifi']):
            return 'Bills & Utilities'
        
        # Shopping & Retail
        elif any(k in desc for k in ['amazon', 'walmart', 'target', 'purchase', 'shop', 'store', 'market']):
            return 'Shopping & Retail'
        
        # Entertainment
        elif any(k in desc for k in ['movie', 'cinema', 'theater', 'netflix', 'spotify', 'hulu', 'disney', 
                                    'subscription', 'entertainment']):
            return 'Entertainment'
        
        # Financial Services
        elif any(k in desc for k in ['payment', 'transfer', 'zelle', 'venmo', 'paypal', 'bank', 'fee', 
                                    'interest', 'credit', 'loan']):
            return 'Financial Services'
        
        # Health & Medical
        elif any(k in desc for k in ['doctor', 'pharmacy', 'hospital', 'medical', 'health', 'drug', 'clinic']):
            return 'Health & Medical'
        
        # Education
        elif any(k in desc for k in ['tuition', 'school', 'university', 'college', 'education', 'course', 
                                    'class', 'book', 'quizlet']):
            return 'Education'
            
        # Default category for unclassified transactions
        return 'Other'

    # Apply categorization
    df['Category'] = df['Description'].apply(determine_category)
    
    return df

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
            
            # Categorize 
            df = categorize_transactions(transactions)
            df = categorize_only(df)
            
            # Return the categorized transactions and total
            return {
                "transactions": df[['Date', 'Description', 'Amount', 'Category']].to_dict(orient='records'),
                "total_spent": df['Amount'].sum()
            }
            
    except Exception as e:
         return {"error": str(e)}