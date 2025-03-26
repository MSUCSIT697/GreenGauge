import pdfplumber
import pytesseract
import pandas as pd
import re
import tempfile
import traceback

# Configure Tesseract path (Windows specific)
pytesseract.pytesseract.tesseract_cmd = r'C:/Program Files/Tesseract-OCR/tesseract.exe'

def extract_text_from_pdf(pdf_path):
    """Extract text from PDF using pdfplumber and OCR as a fallback."""
    all_text = set()  # Use a set to store unique lines
    extracted_text = ""  # Store normal extracted text separately

    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()

                if page_text:
                    # Store extracted text as a reference to filter out duplicates from tables
                    extracted_text += page_text + "\n"
                    all_text.update(page_text.split("\n"))

                # Handle tables separately but ensure no duplicate addition
                tables = page.extract_tables()
                for table in tables:
                    for row in table:
                        table_text = " ".join([str(cell).strip() if cell else "" for cell in row])

                        # Only add if it's not already in extracted text
                        if table_text.strip() and table_text not in all_text and table_text not in extracted_text:
                            all_text.add(table_text)

                # OCR fallback if no text extracted
                if not page_text.strip():
                    image = page.to_image()
                    ocr_text = pytesseract.image_to_string(
                        image.original,
                        config='--psm 6 --oem 3 -c preserve_interword_spaces=1'
                    )
                    all_text.update(ocr_text.split("\n"))

    except Exception as e:
        raise RuntimeError(f"PDF processing failed: {str(e)}")

    return "\n".join(all_text)  # Convert back to a string


def parse_transactions(all_text):
    """Parse transactions using regex patterns for different US bank formats."""
    date_patterns = [
        r"\b\d{2}/\d{2}/\d{4}\b",  # MM/DD/YYYY
        r"\b\d{2}/\d{2}\b",        # MM/DD
        r"\b\d{4}-\d{2}-\d{2}\b",  # YYYY-MM-DD
        r"\b[A-Za-z]+ \d{1,2}, \d{4}\b"  # Month DD, YYYY
    ]
    print("All Text from extract_text_from_pdf :: ", all_text)
    amount_pattern = r"[-]?\$?\d{1,3}(?:,\d{3})*(?:\.\d{2})?"

    transaction_lines = []

    for line in all_text.split('\n'):
        line = line.strip()
        if any(re.search(pattern, line) for pattern in date_patterns) and re.search(amount_pattern, line):
            transaction_lines.append(line)

    return transaction_lines

def categorize_transactions(transaction_lines):
    """Extract structured transaction data with flexible bank-specific handling."""
    transaction_patterns = [
        r"(\d{2}/\d{2}/\d{4}|\d{2}/\d{2}|\b[A-Za-z]+\s\d{1,2},\s\d{4}\b)\s+(.+?)\s+(-?\$?\d{1,3}(?:,\d{3})*(?:\.\d{2})?)",
        r"(\d{4}-\d{2}-\d{2})\s+(.+?)\s+(-?\$?\d{1,3}(?:,\d{3})*(?:\.\d{2})?)"
    ]

    parsed_data = []

    for line in transaction_lines:
        for pattern in transaction_patterns:
            match = re.match(pattern, line, re.VERBOSE)
            if match:
                date, description, amount = match.groups()
                parsed_data.append({
                    "Date": date,
                    "Description": description.strip(),
                    "Amount": float(amount.replace('$', '').replace(',', '')) if amount else 0
                })
                break  # Stop checking once a match is found

    return pd.DataFrame(parsed_data)

def categorize_only(df):
    """Categorize transactions and aggregate costs into the required JSON structure."""
    category_map = {
        "transportation": {
            "subway": ["subway", "metro"],
            "bus": ["bus"],
            "train": ["train", "amtrak"],
            "domestic_flight": ["domestic flight", "delta", "american airlines", "southwest"],
            "international_flight": ["international flight", "british airways", "lufthansa"],
            "gas_bill": ["gas station", "fuel", "chevron", "shell"]
        },
        "electricity": {
            "consumption": ["electric", "power", "energy"],
            "energy_source": ["electricity_bill"]
        },
        "water": {
            "water_bill": ["water", "utility"]
        },
        "restaurants": {
            "fast_food": ["mcdonald", "burger king", "kfc", "subway", "taco bell", "burger", "taco", "sandwich"],
            "casual_dining": ["diner", "casual dining", "olive garden", "red robin", "pizza"],
            "fine_dining": ["steakhouse", "fine dining", "five star", "luxury dining", "dining"],
            "average": ["restaurant", "food", "coffee", "cafe","grocery","grill","bistro","bakery","deli","tavern","eatery","diner","canteen","cafeteria"],
        },
        "retail": {
            "electronics": ["best buy", "apple", "tech", "electronics"],
            "clothing": ["nike", "adidas", "h&m", "fashion", "clothing", "apparel", "shopping"],
            "kids": ["lego", "toys", "kids store"],
            "furniture": ["ikea", "furniture","wayfair"],
            "entertainment": ["movie", "theater", "concert", "sports", "park", "entertainment", "netflix", "spotify", "hulu"],
            "home_supplies": ["home depot", "lowe's", "walmart", "target", "home supplies"],
            "medical_care": ["hospital", "clinic", "pharmacy"],
            "personal_care": ["spa", "salon", "beauty","amazon"],
            "pets": ["petco", "petsmart"]
        }
    }

    # Initialize the JSON structure with correct default values
    result = {
        "transportation": {key: {"cost": 0} for key in category_map["transportation"]},
        "electricity": {"consumption": 0, "energy_source": "electricity_bill"},
        "food": {},
        "retail": {key: 0 for key in category_map["retail"]},
        "waste": {},
        "restaurants": {key: 0 for key in category_map["restaurants"]},
        "water": {"water_bill": 0}
    }

    # **Categorization function** - Ensure accurate category mapping
    def determine_category(description):
        """Find the category and subcategory for a transaction description properly."""
        if not isinstance(description, str) or not description.strip():
            return "other", "other"

        desc = description.strip().lower()
        best_match = None  # Store the best match found

        for main_cat, subcats in category_map.items():
            for subcat, keywords in subcats.items():
                if any(keyword in desc for keyword in keywords):
                    print(f"✅ Matched: '{description}' → {main_cat} -> {subcat}")  
                    if not best_match or len(subcat) > len(best_match[1]):  
                        best_match = (main_cat, subcat)

        if best_match:
            return best_match  # Return the best match found

        print(f"❌ No match found for: '{description}'")  
        return "other", "other"

    # **Apply categorization and aggregate costs**
    for _, row in df.iterrows():
        category, subcategory = determine_category(row["Description"])
        amount = float(row["Amount"]) if row["Amount"] else 0

        if category in result:
            if subcategory in result[category]:
                if isinstance(result[category][subcategory], dict):
                    if "cost" in result[category][subcategory]:
                        # print(f"Adding to cost: {amount} for {category} -> {subcategory}")
                        result[category][subcategory]["cost"] += amount
                elif isinstance(result[category][subcategory], (int, float)):  
                    # print(f"Adding to cost: {amount} for {category} -> {subcategory}")
                    result[category][subcategory] += amount
                else:
                    # print(f"⚠️ Unexpected structure at {category} -> {subcategory}, initializing.")
                    result[category][subcategory] = amount
            else:
                # print(f"🆕 Creating new subcategory: {subcategory} in {category} with {amount}")
                result[category][subcategory] = amount

    return result

def process_pdf(file_stream):
    """Main function to process PDF and extract categorized transactions."""
    try:
        with tempfile.NamedTemporaryFile(delete=True, suffix=".pdf") as tmp:
            tmp.write(file_stream.read())
            tmp.seek(0)

            all_text = extract_text_from_pdf(tmp.name)
            transactions = parse_transactions(all_text)
            df = categorize_transactions(transactions)
            categorized_data = categorize_only(df)

            return categorized_data

    except Exception as e:
        print(f"Error processing PDF: {str(e)}")
        traceback.print_exc() 
        return {"error": str(e)}