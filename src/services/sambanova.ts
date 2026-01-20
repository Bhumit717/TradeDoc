import type { InvoiceData, InvoiceItem } from '../types';

/**
 * SambaNova AI Service
 * Uses Meta-Llama-3.3-70B-Instruct for intelligent Tax Invoice data extraction
 */

const SAMBANOVA_API_URL = "https://api.sambanova.ai/v1/chat/completions";
const SAMBANOVA_API_KEY = "adf310ad-8712-4b66-8694-2451f68be017";

/**
 * Interface for AI-extracted data (before mapping to InvoiceData)
 */
interface AIExtractedData {
    customerDetails?: {
        name?: string;
        address?: string;
        city?: string;
        state?: string;
        phone?: string;
        email?: string;
        gstin?: string;
    };
    items?: Array<{
        name: string;
        description?: string;
        quantity: number;
        unit?: string;
        unitPrice: number;
        taxRate?: number;
    }>;
    transportDetails?: {
        mode?: string;
        vehicleNo?: string;
        distance?: number;
    };
    documentNumber?: string;
    date?: string;
    dueDate?: string;
    paymentTerms?: string;
    notes?: string;
}

/**
 * Generate structured Tax Invoice data from natural language prompt using SambaNova AI
 */
export const generateInvoiceFromAI = async (
    prompt: string,
    currentData: InvoiceData
): Promise<Partial<InvoiceData>> => {
    console.log("🤖 SambaNova AI: Processing prompt...", prompt);

    try {
        // Build the AI prompt with structured output instructions
        const systemPrompt = buildPrompt(prompt);

        // Make API call to SambaNova
        const response = await fetch(SAMBANOVA_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${SAMBANOVA_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: "Meta-Llama-3.3-70B-Instruct",
                messages: [
                    {
                        role: "user",
                        content: systemPrompt
                    }
                ],
                temperature: 0.1, // Low temperature for more deterministic extraction
                max_tokens: 2000
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ SambaNova API Error:", response.status, errorText);
            throw new Error(`SambaNova API failed: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        console.log("✅ SambaNova API Response:", data);

        // Extract the AI's response content
        const aiResponse = data.choices?.[0]?.message?.content;
        if (!aiResponse) {
            throw new Error("No content in AI response");
        }

        // Clean and parse the JSON response
        const extractedData = parseAIResponse(aiResponse);
        console.log("📊 Extracted Data:", extractedData);

        // Map AI-extracted data to InvoiceData format
        const invoiceUpdate = mapToInvoiceData(extractedData, currentData);
        console.log("🔄 Mapped to Invoice Format:", invoiceUpdate);

        return invoiceUpdate;

    } catch (error) {
        console.error("❌ SambaNova AI Error:", error);
        throw error; // Re-throw to allow fallback handling
    }
};

/**
 * Build the prompt for AI with clear instructions for structured output
 */
function buildPrompt(userInput: string): string {
    return `Extract structured Tax Invoice data from the following informal text and return ONLY valid JSON.

INPUT TEXT:
${userInput}

INSTRUCTIONS:
1. Parse the text to identify customer details, items, transport info, payment terms, etc.
2. Return ONLY a valid JSON object (no markdown, no explanations, no code blocks)
3. Use null for missing fields
4. For items, ensure you extract: name, quantity, unit, unitPrice, taxRate
5. For customer, extract: name, address, city, state, phone, email, gstin

RETURN THIS EXACT JSON STRUCTURE:
{
  "customerDetails": {
    "name": "string or null",
    "address": "string or null",
    "city": "string or null",
    "state": "string or null",
    "phone": "string or null",
    "email": "string or null",
    "gstin": "string or null"
  },
  "items": [
    {
      "name": "string",
      "description": "string or null",
      "quantity": 0,
      "unit": "string (Nos/Kg/Mtr/Box/etc)",
      "unitPrice": 0,
      "taxRate": 18
    }
  ],
  "transportDetails": {
    "mode": "Road/Air/Ship or null",
    "vehicleNo": "string or null",
    "distance": 0
  },
  "documentNumber": "string or null",
  "date": "YYYY-MM-DD or null",
  "dueDate": "YYYY-MM-DD or null",
  "paymentTerms": "string or null",
  "notes": "string or null"
}

Remember: Return ONLY the JSON object, nothing else.`;
}

/**
 * Parse and clean the AI response to extract valid JSON
 */
function parseAIResponse(aiResponse: string): AIExtractedData {
    // Clean the response - remove markdown code blocks if present
    let cleanedContent = aiResponse
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

    // Try to parse JSON
    try {
        const parsed = JSON.parse(cleanedContent);
        return parsed as AIExtractedData;
    } catch (error) {
        console.error("❌ JSON Parse Error. Raw response:", aiResponse);

        // Try to extract JSON from text if it's wrapped in other content
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                const parsed = JSON.parse(jsonMatch[0]);
                return parsed as AIExtractedData;
            } catch (e) {
                throw new Error("Failed to parse AI response as JSON");
            }
        }

        throw new Error("Failed to parse AI response as JSON");
    }
}

/**
 * Map AI-extracted data to InvoiceData partial update
 */
function mapToInvoiceData(
    extracted: AIExtractedData,
    currentData: InvoiceData
): Partial<InvoiceData> {
    const update: Partial<InvoiceData> = {};

    // Map customer details to buyer
    if (extracted.customerDetails) {
        const customer = extracted.customerDetails;
        update.buyer = {
            ...currentData.buyer,
            companyName: customer.name || currentData.buyer.companyName,
            address: {
                ...currentData.buyer.address,
                line1: customer.address || currentData.buyer.address.line1,
                city: customer.city || currentData.buyer.address.city,
                state: customer.state || currentData.buyer.address.state,
            },
            phone: customer.phone || currentData.buyer.phone,
            email: customer.email || currentData.buyer.email,
            gstin: customer.gstin || currentData.buyer.gstin,
        };
    }

    // Map items
    if (extracted.items && extracted.items.length > 0) {
        update.items = extracted.items.map((item, index) => {
            const quantity = item.quantity || 1;
            const unitPrice = item.unitPrice || 0;
            const taxRate = item.taxRate || 18;
            const taxableValue = quantity * unitPrice;
            const taxAmount = taxableValue * (taxRate / 100);
            const totalAmount = taxableValue + taxAmount;

            return {
                id: `ai-item-${Date.now()}-${index}`,
                name: item.name,
                description: item.description || '',
                quantity: quantity,
                unit: item.unit || 'Nos',
                unitPrice: unitPrice,
                taxRate: taxRate,
                taxableValue: taxableValue,
                taxAmount: taxAmount,
                totalAmount: totalAmount,
            } as InvoiceItem;
        });
    }

    // Map transport details
    if (extracted.transportDetails) {
        update.transportDetails = {
            mode: (extracted.transportDetails.mode as any) || currentData.transportDetails?.mode || '',
            vehicleNo: extracted.transportDetails.vehicleNo || currentData.transportDetails?.vehicleNo,
            distance: extracted.transportDetails.distance || currentData.transportDetails?.distance,
            transporterName: currentData.transportDetails?.transporterName,
            transporterId: currentData.transportDetails?.transporterId,
        };
    }

    // Map document metadata
    if (extracted.documentNumber) {
        update.documentNumber = extracted.documentNumber;
    }
    if (extracted.date) {
        update.date = extracted.date;
    }
    if (extracted.dueDate) {
        update.dueDate = extracted.dueDate;
    }

    // Map notes and payment terms
    if (extracted.paymentTerms) {
        update.termsAndConditions = extracted.paymentTerms;
    }
    if (extracted.notes) {
        update.notes = extracted.notes;
    }

    return update;
}
