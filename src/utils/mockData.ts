import type { InvoiceData, CompanyProfile, ClientProfile } from '../types';
import { getSavedCompanyProfile } from '../services/settingsStore';

export const emptyCompany: CompanyProfile = {
    companyName: "Your Business Name",
    email: "email@example.com",
    phone: "+91 98765 43210",
    address: { line1: "123 Business Street", city: "Mumbai", state: "Maharashtra", zip: "400001", country: "India" },
    gstin: "27AAAAA0000A1Z5",
    bankDetails: [{
        id: '1', bankName: 'HDFC Bank', accountName: 'Your Business Name', accountNumber: '502000XXXXXX', ifscCode: 'HDFC0001234'
    }]
};

export const emptyClient: ClientProfile = {
    id: 'c1',
    companyName: "Client Company Name",
    address: { line1: "456 Client Road", city: "Bangalore", state: "Karnataka", zip: "560001", country: "India" },
    gstin: "29BBBBB0000B1Z1",
    placeOfSupply: "Karnataka"
};

export const createEmptyInvoice = (): InvoiceData => ({
    documentType: 'Tax Invoice',
    documentNumber: 'INV-2024-0001',
    date: new Date().toISOString().split('T')[0],

    seller: getSavedCompanyProfile(),
    buyer: emptyClient,
    items: [
        {
            id: '1', name: 'Product A', description: 'High quality item',
            hsnSacCode: '8544', quantity: 1, unit: 'Nos',
            unitPrice: 1000, taxRate: 18,
            taxableValue: 1000, taxAmount: 180, totalAmount: 1180
        }
    ],

    transportDetails: { mode: 'Road', vehicleNo: 'MH01AB1234', distance: 0 },

    currency: 'INR',
    isReverseCharge: false,

    totalTaxable: 1000,
    totalIGST: 180,
    totalDiscount: 0,
    roundOff: 0,
    grandTotal: 1180,
    amountInWords: 'One Thousand One Hundred Eighty Only',

    status: 'Draft',
    termsAndConditions: "1. Goods once sold will not be taken back.\n2. Interest @ 18% p.a. will be charged on delayed payments."
});
