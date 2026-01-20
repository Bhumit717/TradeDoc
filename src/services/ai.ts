import type { InvoiceData } from '../types';

// TODO: Replace with actual Gemini API call
// You will need a backend proxy or use the client SDK with "dangerouslyAllowBrowser" if acceptable for prototype
// Recommended: Use Firebase Functions to hide the API key

export const generateInvoiceFromPrompt = async (prompt: string): Promise<Partial<InvoiceData>> => {
    console.log("Calling AI with prompt:", prompt);

    // Mock response for testing
    // In reality, this would be a fetch call to Gemini API
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                documentType: 'Tax Invoice',
                currency: 'USD',
                buyer: {
                    id: 'mock-client',
                    companyName: 'Acme Corp',
                    address: { line1: '456 Tech Park', city: 'San Jose', state: 'CA', zip: '94000', country: 'USA' },
                    email: "buyer@example.com",
                    phone: "1234567890"
                },
                items: [
                    {
                        id: '1',
                        name: 'Generated Item: ' + prompt.slice(0, 10),
                        description: 'AI Generated Description',
                        quantity: 1,
                        unit: 'Pcs',
                        unitPrice: 100,
                        taxRate: 18,
                        discountAmount: 0,
                        taxableValue: 100,
                        taxAmount: 18,
                        totalAmount: 118
                    }
                ]
            });
        }, 1500);
    });
};
