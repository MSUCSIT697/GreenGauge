import pdfplumber
import pytesseract
import pandas as pd
import re
import tempfile
import os
from flask import jsonify


# Configure Tesseract path (Windows specific)
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

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
    """Categorize transactions and calculate emissions"""
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

def calculate_emissions(df):
    """Calculate carbon emissions based on categories"""
    def categorize(row):
        desc = row['Description'].lower()
        if any(k in desc for k in ['bus', 'uber', 'lyft']):
            return 'Transport', abs(row['Amount']) * 0.5
        elif any(k in desc for k in ['canteen', 'food', 'restaurant', 'coffee']):
            return 'Food & Dining', abs(row['Amount']) * 0.3
        elif any(k in desc for k in ['payment', 'transfer', 'zelle']):
            return 'Finance', 0
        elif 'quizlet' in desc or 'subscription' in desc:
            return 'Subscriptions', abs(row['Amount']) * 0.1
        return 'Other', 0

    df[['Category', 'Emissions']] = df.apply(
        lambda row: pd.Series(categorize(row)), axis=1
    )
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
            
            # Categorize and calculate
            df = categorize_transactions(transactions)
            df = calculate_emissions(df)
            
            # Prepare results
            totals = df.groupby('Category')['Emissions'].sum().reset_index()
            
            return {
                "transactions": df.to_dict(orient='records'),
                "totals": totals.to_dict(orient='records'),
                "footprint": df['Emissions'].sum(),
                "dates": df['Date'].unique().tolist()
            }
            
    except Exception as e:
        return {"error": str(e)}
