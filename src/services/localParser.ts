import type { InvoiceData, InvoiceItem } from "../types";

// --- REGEX LIBRARY ---
const GST_REGEX = /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/i;
const DATE_REGEX = /(\d{1,2}[-./]\d{1,2}[-./]\d{2,4})|(\d{4}[-./]\d{1,2}[-./]\d{1,2})/g;
const PINCODE_REGEX = /\b\d{6}\b/; // Indian Pincode
const PHONE_REGEX = /(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}/; // Indian Mobile
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;

// Item Patterns:
// Item Patterns (Deprecated - using Nano-AI Tokenizer)
// const ITEM_PATTERN_A = ...
// const ITEM_PATTERN_B = ...
// const ITEM_PATTERN_C = ...

// List of Indian States for heuristics
const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Chandigarh"
];

const DOC_TYPES: Record<string, string> = {
    'tax invoice': 'Tax Invoice',
    'proforma': 'Proforma Invoice',
    'quotation': 'Quotation',
    'estimate': 'Estimate',
    'purchase order': 'Purchase Order',
    'po': 'Purchase Order',
    'work order': 'Work Order',
    'wo': 'Work Order',
    'challan': 'Delivery Challan',
    'receipt': 'Receipt'
};

/**
 * Advanced Local Parser that acts as a "Local AI" using pattern matching.
 */
export const parseLocalPrompt = (prompt: string, currentData: InvoiceData): Partial<InvoiceData> => {
    const text = prompt;
    const lowerText = text.toLowerCase();
    const extracted: Partial<InvoiceData> = {
        buyer: { ...currentData.buyer, address: { ...currentData.buyer.address } },
        items: []
    };

    // 1. DOCUMENT TYPE DETECTION
    for (const [key, val] of Object.entries(DOC_TYPES)) {
        if (lowerText.includes(key)) {
            extracted.documentType = val as any;
            break;
        }
    }

    // 2. ENTITY EXTRACTION (Buyer, GST, Phone, Email)

    // a. GSTIN
    const gstMatch = text.match(GST_REGEX);
    if (gstMatch) {
        if (!extracted.buyer) extracted.buyer = {} as any;
        extracted.buyer!.gstin = gstMatch[0].toUpperCase();
    }

    // b. Email
    const emailMatch = text.match(EMAIL_REGEX);
    if (emailMatch) {
        if (!extracted.buyer) extracted.buyer = {} as any;
        extracted.buyer!.email = emailMatch[0];
    }

    // c. Phone
    const phoneMatch = text.match(PHONE_REGEX);
    if (phoneMatch) {
        if (!extracted.buyer) extracted.buyer = {} as any;
        extracted.buyer!.phone = phoneMatch[0];
    }

    // d. Buyer Name Strategy
    // Look for "to [Name]" or "client [Name]" or "customer [Name]"
    // Stop at common delimiters like comma, newline, "date", "gst", "consisting"
    const buyerRegex = /(?:to|client|customer|buyer|party)\s+([a-zA-Z0-9\s.&'-]+?)(?=\s*(?:,|;|\.|gst|date|items|consisting|\n|$))/i;
    const buyerMatch = text.match(buyerRegex);
    if (buyerMatch && buyerMatch[1]) {
        if (!extracted.buyer) extracted.buyer = {} as any;
        extracted.buyer!.companyName = buyerMatch[1].trim();
    } else if (!currentData.buyer?.companyName || currentData.buyer.companyName.includes('Client')) {
        // Fallback: If prompt starts with a name approx? (Riskier, skip for now)
    }

    // e. Address Logic
    // If we find a Pincode, grab surrounding text?
    // Or check for State names
    const foundState = INDIAN_STATES.find(s => text.toLowerCase().includes(s.toLowerCase()));
    if (foundState) {
        if (!extracted.buyer) extracted.buyer = {} as any;
        if (!extracted.buyer!.address) extracted.buyer!.address = {} as any;
        extracted.buyer!.address.state = foundState;
        extracted.buyer!.placeOfSupply = foundState; // Simple assumption
    }
    const pinMatch = text.match(PINCODE_REGEX);
    if (pinMatch) {
        if (!extracted.buyer) extracted.buyer = {} as any;
        if (!extracted.buyer!.address) extracted.buyer!.address = {} as any;
        extracted.buyer!.address.zip = pinMatch[0];

        // Try to grab city (word before pincode?)
        // This is hard without NER, but we can try basic heuristics
    }


    // 3. DATE EXTRACTION
    const dates = text.match(DATE_REGEX);
    if (dates && dates.length > 0) {
        // Assume first date is invoice date
        const d1 = normalizeDate(dates[0]);
        if (d1) extracted.date = d1;

        // If second date, maybe due date?
        if (dates.length > 1) {
            const d2 = normalizeDate(dates[1]);
            if (d2) extracted.dueDate = d2;
        }
    }
    // "Due in X days" logic
    const dueInMatch = text.match(/due\s+(?:in|after)\s+(\d+)\s+days/i);
    if (dueInMatch && extracted.date) {
        const days = parseInt(dueInMatch[1]);
        const dateObj = new Date(extracted.date);
        dateObj.setDate(dateObj.getDate() + days);
        extracted.dueDate = dateObj.toISOString().split('T')[0];
    }


    // 4. ITEM EXTRACTION (The Core)
    // We split by newlines or commas to process potential list items
    const segments = text.split(/[\n,;]+/);
    const newItems: InvoiceItem[] = [];

    for (const segment of segments) {
        // Use the hoisted "Nano-AI" parser for each segment
        const parsed = parseOneItemLine(segment);
        if (parsed && parsed.name) {
            // Only add if we got a valid name
            newItems.push(buildItem(parsed.name, parsed.quantity, parsed.unitPrice));
        }
    }

    if (newItems.length > 0) {
        extracted.items = newItems;
        // Recalc
        const taxable = newItems.reduce((sum, i) => sum + i.taxableValue, 0);
        const taxes = newItems.reduce((sum, i) => sum + i.taxAmount, 0);

        extracted.totalTaxable = taxable;
        extracted.totalIGST = taxes;
        extracted.grandTotal = taxable + taxes;
    }

    return extracted;
};

/**
 * "Nano-AI" Parser: Uses fuzzy logic and heuristics to understand natural language inputs
 * without strict regex patterns. Adapts to user syntax.
 */
/**
 * "Nano-AI" Parser: Uses fuzzy logic and heuristics to understand natural language inputs
 * without strict regex patterns. Adapts to user syntax.
 */
export function parseOneItemLine(text: string): { name: string, quantity: number, unitPrice: number } | null {
    const raw = text.trim();
    if (!raw) return null;

    // 1. Pre-processing: Remove commas in numbers (1,000 -> 1000) but keep structure
    const cleanText = raw.replace(/(\d+),(\d+)/g, '$1$2').toLowerCase();

    // 2. Tokenize by spaces
    const tokens = cleanText.split(/\s+/);

    // State
    let price: number | null = null;
    let qty: number | null = null;
    let nameTokens: string[] = [];

    // Helper: partial check for numeric
    const isNum = (s: string) => /^\d+(\.\d+)?$/.test(s);

    // Markers
    const priceMarkers = ['@', 'rs', 'inr', '$', '€', 'price', 'rate', 'cost', 'each', 'amount'];
    const qtyMarkers = ['qty', 'pc', 'pcs', 'nos', 'unit', 'units', 'box', 'boxes', 'kg', 'kgs', 'packets'];

    for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i];

        // Check for "100rs" or "5kg" combined styles
        const priceSuffix = t.match(/^(\d+(\.\d+)?)?(rs|inr|\$|€)$/);
        const qtySuffix = t.match(/^(\d+(\.\d+)?)?(kg|pcs|pc|nos)$/);

        if (priceSuffix && priceSuffix[1]) {
            price = parseFloat(priceSuffix[1]);
            continue;
        }
        if (qtySuffix && qtySuffix[1]) {
            qty = parseFloat(qtySuffix[1]);
            continue;
        }

        // Check explicit markers in previous/next tokens
        // logic: if 't' is number, look around.
        if (isNum(t)) {
            const val = parseFloat(t);
            const prev = tokens[i - 1];
            const next = tokens[i + 1];

            // Explicit Price Context
            if (priceMarkers.includes(prev) || (next && priceMarkers.includes(next))) {
                price = val;
                continue;
            }

            // Explicit Qty Context
            if (qtyMarkers.includes(prev) || (next && qtyMarkers.includes(next))) {
                qty = val;
                continue;
            }

            // Ambiguous Number - Store for resolution later
            // We'll treat it as potential data but push to name if we already have both?
            // Actually, let's store ambiguous numbers if we lack Qty or Price
        }
    }

    // Second Pass: Ambiguous Numbers (if not resolved by markers)
    // If we have "5 apples 100", 5 and 100 are numbers without markers.
    // Heuristic: Smaller integer is likely Qty. Larger is Price.
    const numericTokens = tokens.filter(t => isNum(t)).map(t => parseFloat(t));
    const unusedNumbers = numericTokens.filter(n => n !== price && n !== qty);

    if (unusedNumbers.length > 0) {
        // If we need a Quantity
        if (qty === null) {
            // Prefer the smaller integer (common sense)
            // But if only one number exists and it's huge, maybe it's price?
            const candidate = unusedNumbers.reduce((a, b) => a < b ? a : b); // Min

            // If only one number total, and it's big (>1000), assume price, default Qty 1
            if (unusedNumbers.length === 1 && candidate > 1000 && price === null) {
                price = candidate;
                qty = 1;
            } else {
                qty = candidate;
            }
        }
    }

    // If we still need a Price, take the remaining unused number
    if (price === null) {
        const remaining = numericTokens.filter(n => n !== qty);
        if (remaining.length > 0) {
            price = remaining[0]; // Take whatever is left
        }
    }

    // Default Fallbacks
    if (qty === null) qty = 1;
    if (price === null) price = 0;

    // 3. Name Extraction
    // Everything that is NOT a used number and NOT a marker
    nameTokens = tokens.filter(t => {
        // formatting checks
        const cleanO = t.replace(/(rs|inr|\$|kg|pcs)/g, '');
        const val = parseFloat(cleanO);

        // If this token was used as Price or Qty, exclude it
        if (!isNaN(val)) {
            if (val === price || val === qty) {
                // Edge case: if price and qty are same (5 apples 5 rs), allow removing one instance?
                // For simplicity, remove distinct matches.
                // To be safe against "Iphone 14" (14 is part of name), we should only remove IF it was truly identifying.
                // This naive filter removes all numbers matching price/qty.
                // Refinement: "Iphone 14 qty 14" -> 14 is both? rare.
                // Let's assume purely numeric tokens matching our Qty/Price are excluded.
                if (isNum(t)) return false;
                // Mixed "5kg" -> we handled this by extraction, so t is "5kg", val is 5.
                if (t.match(/\d+(kg|pcs|rs)/)) return false;
            }
        }
        // Remove markers
        if (priceMarkers.includes(t) || qtyMarkers.includes(t) || t === 'of') return false;

        return true;
    });

    const finalName = nameTokens.join(' ').replace(/\s+/g, ' ').trim();

    // Capitalize first letter logic
    const displayName = finalName.charAt(0).toUpperCase() + finalName.slice(1);

    if (!displayName) return null;

    return {
        name: displayName,
        quantity: qty,
        unitPrice: price
    };
};

// --- HELPER FUNC ---
function buildItem(name: string, qty: number, unitPrice: number): InvoiceItem {
    const taxRate = 18; // Default GST
    const taxableValue = qty * unitPrice;
    const taxAmount = taxableValue * (taxRate / 100);
    return {
        id: Math.random().toString(36).substr(2, 9),
        name: name,
        quantity: qty,
        unit: 'Nos',
        unitPrice: unitPrice,
        taxRate: taxRate,
        taxableValue: taxableValue,
        taxAmount: taxAmount,
        totalAmount: taxableValue + taxAmount,
        description: ''
    };
}

function normalizeDate(dateStr: string): string | null {
    try {
        // Handle DD-MM-YYYY or DD/MM/YYYY
        if (dateStr.match(/^[0-3]?\d[-./][01]?\d[-./]\d{4}$/)) {
            const parts = dateStr.split(/[-./]/);
            return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
        // Handle YYYY-MM-DD
        if (dateStr.match(/^\d{4}[-./][01]?\d[-./][0-3]?\d$/)) {
            return dateStr.replace(/\//g, '-');
        }
        return null;
    } catch (e) { return null; }
}
