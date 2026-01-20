import type { InvoiceData, InvoiceItem } from "../types";
import { parseOneItemLine } from "./localParser"; // Re-using the Nano-AI identifier

/**
 * AI GENERATION SERVICE - HYBRID APPROACH
 * 
 * Priority Order:
 * 1. SambaNova AI (Meta-Llama-3.3-70B) - Real AI for complex natural language
 * 2. Local Command Engine - Fallback for offline/simple edits
 * 
 * This provides the best of both worlds: powerful AI when available,
 * and reliable local processing as backup.
 */

// Import SambaNova AI service
import { generateInvoiceFromAI as sambaNovaGenerate } from './sambanova';

/**
 * Main entry point for AI document generation
 * Tries SambaNova AI first, falls back to local engine if it fails
 */

export const generateDocumentFromAI = async (prompt: string, currentData: InvoiceData): Promise<Partial<InvoiceData>> => {

    // STRATEGY: Try SambaNova AI first, fallback to local engine
    console.log("🤖 AI Generation: Starting with SambaNova AI...");

    try {
        // Try SambaNova AI (real AI-powered extraction)
        const result = await sambaNovaGenerate(prompt, currentData);
        console.log("✅ SambaNova AI succeeded!");
        return result;
    } catch (error) {
        console.warn("⚠️ SambaNova AI failed, falling back to Local Command Engine...", error);
        // Fall back to local command engine
        return generateDocumentFromLocalEngine(prompt, currentData);
    }
};

/**
 * LOCAL COMMAND ENGINE (Fallback)
 * Handles simple editing commands offline
 */
function generateDocumentFromLocalEngine(prompt: string, currentData: InvoiceData): Promise<Partial<InvoiceData>> {

    console.log("Processing with Local Command Engine...", prompt);

    // Deep copy current data to modify
    const newData = JSON.parse(JSON.stringify(currentData));
    const lowerPrompt = prompt.toLowerCase();

    // --- INTENT DETECTION ---
    const isRemove = matches(lowerPrompt, ['remove', 'delete', 'hataavo', 'clear', 'drop']);
    const isReplace = matches(lowerPrompt, ['replace', 'jagya par', 'badle', 'instead']);
    const isAdd = matches(lowerPrompt, ['add', 'create', 'new', 'include']);
    const isUpdate = matches(lowerPrompt, ['change', 'update', 'set', 'karo', 'make', 'edit']);

    // --- TARGET DETECTION ---

    // 1. GST / TAX
    if (matches(lowerPrompt, ['gst', 'tax', 'vat'])) {
        if (isRemove) {
            // "gst hataavo"
            // Assuming tax is derived from items, we might set a global tax flag or set all items tax to 0?
            // For this app's logic (tax per item), we update all items?
            // Or maybe there is a global tax setting in some apps. 
            // Based on example: { "gst": { "rate": 5 } } -> remove it. 
            // We'll assume updating items taxRate to 0 for now as InvoiceData structure is item-based.
            if (newData.items) {
                newData.items.forEach((i: any) => i.taxRate = 0);
            }
            return Promise.resolve({ items: newData.items });
        }

        // "gst 12 karo"
        const num = extractNumber(lowerPrompt);
        if (num !== null) {
            if (newData.items) {
                newData.items.forEach((i: any) => i.taxRate = num);
            }
            return Promise.resolve({ items: newData.items });
        }
    }

    // 2. ITEM OPERATIONS
    if (newData.items) {

        // A. Position Detection (First, Second...)
        let targetIndex = -1;
        if (lowerPrompt.includes('first') || lowerPrompt.includes('1st')) targetIndex = 0;
        else if (lowerPrompt.includes('second') || lowerPrompt.includes('2nd')) targetIndex = 1;
        else if (lowerPrompt.includes('third') || lowerPrompt.includes('3rd')) targetIndex = 2;
        else if (lowerPrompt.includes('last')) targetIndex = newData.items.length - 1;

        // B. Name Detection (Fuzzy Match) if no position
        if (targetIndex === -1) {
            // Find which item name is mentioned in the prompt
            currentData.items.forEach((item, idx) => {
                if (lowerPrompt.includes(item.name.toLowerCase())) {
                    targetIndex = idx;
                }
            });
        }

        // --- EXECUTE ITEM ACTIONS ---

        // DELETE
        if (isRemove && targetIndex !== -1) {
            newData.items.splice(targetIndex, 1);
            return Promise.resolve({ items: newData.items });
        }

        // REPLACE ("Rice ni jagya par Sugar...")
        if (isReplace && targetIndex !== -1) {
            // Parse the REST of the prompt to find the new item details
            // Strip out the old item name and command words to leave the new item description
            // Simple heuristic used: Parse the whole prompt as an item, triggering on "add" logic style
            const parsed = parseOneItemLine(prompt); // Use the Nano-AI parser
            if (parsed && parsed.name) {
                const oldItem = newData.items[targetIndex];
                newData.items[targetIndex] = {
                    ...oldItem,
                    name: parsed.name,
                    quantity: parsed.quantity || oldItem.quantity,
                    unitPrice: parsed.unitPrice || oldItem.unitPrice
                };
                return Promise.resolve({ items: newData.items });
            }
        }

        // UPDATE ("Rice qty 30 karo")
        if ((isUpdate || !isRemove) && targetIndex !== -1) {
            const item = newData.items[targetIndex];

            // Extract Qty
            if (matches(lowerPrompt, ['qty', 'quantity', 'count'])) {
                const nums = extractAllNumbers(lowerPrompt);
                // Heuristic: If prompt has "30", use it.
                // We need to be careful not to pick up the price if both present.
                // Simple: look for number near 'qty'
                const val = extractNumberContext(lowerPrompt, ['qty', 'quantity']);
                if (val !== null) item.quantity = val;
                else if (nums.length > 0) item.quantity = nums[0]; // Fallback
            }

            // Extract Rate/Price
            if (matches(lowerPrompt, ['rate', 'price', 'rs', 'rupees'])) {
                const nums = extractAllNumbers(lowerPrompt);
                const val = extractNumberContext(lowerPrompt, ['rate', 'price', 'rs']);
                if (val !== null) item.unitPrice = val;
                else if (nums.length > 0) item.unitPrice = nums.length > 1 ? nums[1] : nums[0];
            }

            // Recalculate totals
            item.taxableValue = item.quantity * item.unitPrice;
            item.taxAmount = item.taxableValue * (item.taxRate / 100);
            item.totalAmount = item.taxableValue + item.taxAmount;

            return Promise.resolve({ items: newData.items });
        }
    }

    // 3. ADD NEW ITEM ("Add Sugar 20kg 900")
    // If no specific update/remove command, or explicit "Add"
    if (isAdd || (!isRemove && !isUpdate && !isReplace)) {
        // Try parsing the whole line as an item
        const parsed = parseOneItemLine(prompt);
        if (parsed && parsed.name) {
            newData.items.push(buildItem(parsed.name, parsed.quantity, parsed.unitPrice));
            return Promise.resolve({ items: newData.items });
        }
    }

    // Fallback: If nothing matched, maybe it's a completely new invoice description?
    // "Invoice for Acme Corp..."
    // We can try to extract buyer from it?
    // For now, adhering to "Strict Edit" rules: matches nothing -> change nothing.
    console.log("Command not understood by Local Engine.");
    return Promise.resolve({});
};

// --- HELPERS ---

function matches(text: string, words: string[]) {
    return words.some(w => text.includes(w));
}

function extractNumber(text: string): number | null {
    const match = text.match(/(\d+(\.\d+)?)/);
    return match ? parseFloat(match[0]) : null;
}

function extractAllNumbers(text: string): number[] {
    const matches = text.match(/(\d+(\.\d+)?)/g);
    return matches ? matches.map(parseFloat) : [];
}

// Looks for a number following specific keywords (e.g. "qty 30")
function extractNumberContext(text: string, keywords: string[]): number | null {
    const tokens = text.split(/\s+/);
    for (let i = 0; i < tokens.length; i++) {
        if (keywords.some(k => tokens[i].includes(k))) {
            // Look ahead 1 or 2 tokens for a number
            if (i + 1 < tokens.length && !isNaN(parseFloat(tokens[i + 1]))) return parseFloat(tokens[i + 1]);
            if (i + 2 < tokens.length && !isNaN(parseFloat(tokens[i + 2]))) return parseFloat(tokens[i + 2]);
            // Look behind
            if (i - 1 >= 0 && !isNaN(parseFloat(tokens[i - 1]))) return parseFloat(tokens[i - 1]);
        }
    }
    return null;
}

function buildItem(name: string, qty: number, unitPrice: number): InvoiceItem {
    const taxRate = 18; // Default
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
