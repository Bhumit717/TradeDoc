import type { DocumentType } from "../types";

export interface DocumentConfig {
    title: string;
    prefix: string; // e.g. INV-, QTY-
    color: string;
    terms: string;
    hasShipping: boolean;
    hasTax: boolean;
}

const defaultTerms = "1. Payment is due within 30 days.\n2. Goods once sold will not be taken back.\n3. Interest @ 24% p.a. will be charged on delayed payments.";

export const DOCUMENT_CONFIGS: Record<DocumentType, DocumentConfig> = {
    'Tax Invoice': {
        title: 'TAX INVOICE',
        prefix: 'INV-',
        color: '#0f172a',
        terms: defaultTerms,
        hasShipping: true,
        hasTax: true
    },
    'Proforma Invoice': {
        title: 'PROFORMA INVOICE',
        prefix: 'PI-',
        color: '#334155',
        terms: "This is a proforma invoice. Not for tax purposes.",
        hasShipping: true,
        hasTax: true
    },
    'Quotation': {
        title: 'QUOTATION',
        prefix: 'QT-',
        color: '#059669',
        terms: "Quotation valid for 30 days.",
        hasShipping: false,
        hasTax: true
    },
    'Estimate': {
        title: 'ESTIMATE',
        prefix: 'EST-',
        color: '#d97706',
        terms: "This is an estimate only.",
        hasShipping: false,
        hasTax: true
    },
    'Purchase Order': {
        title: 'PURCHASE ORDER',
        prefix: 'PO-',
        color: '#2563eb',
        terms: "Please deliver goods within the specified timeline.",
        hasShipping: true,
        hasTax: true
    },
    'Sales Order': {
        title: 'SALES ORDER',
        prefix: 'SO-',
        color: '#4f46e5',
        terms: "Order confirmed.",
        hasShipping: true,
        hasTax: true
    },
    'Delivery Challan': {
        title: 'DELIVERY CHALLAN',
        prefix: 'DC-',
        color: '#475569',
        terms: "Received in good condition.",
        hasShipping: true,
        hasTax: false
    },
    'Commercial Invoice': {
        title: 'COMMERCIAL INVOICE',
        prefix: 'EXP-',
        color: '#0f172a',
        terms: "FOB / CIF",
        hasShipping: true,
        hasTax: true
    },
    'Bill of Supply': {
        title: 'BILL OF SUPPLY',
        prefix: 'BOS-',
        color: '#57534e',
        terms: "Composition Dealer - No Tax Collected",
        hasShipping: false,
        hasTax: false
    },
    'Debit Note': {
        title: 'DEBIT NOTE',
        prefix: 'DN-',
        color: '#b91c1c',
        terms: "",
        hasShipping: false,
        hasTax: true
    },
    'Credit Note': {
        title: 'CREDIT NOTE',
        prefix: 'CN-',
        color: '#15803d',
        terms: "",
        hasShipping: false,
        hasTax: true
    },
    'Receipt': {
        title: 'PAYMENT RECEIPT',
        prefix: 'RCPT-',
        color: '#047857',
        terms: "",
        hasShipping: false,
        hasTax: false
    },
    'Packing List': {
        title: 'PACKING LIST',
        prefix: 'PL-',
        color: '#374151',
        terms: "",
        hasShipping: true,
        hasTax: false
    },
    'Export Invoice': {
        title: 'EXPORT INVOICE',
        prefix: 'EI-',
        color: '#1e3a8a',
        terms: "Supply Meant For Export Under Bond/LUT",
        hasShipping: true,
        hasTax: true
    },
    'Import Invoice': {
        title: 'IMPORT INVOICE',
        prefix: 'IMP-',
        color: '#1e3a8a',
        terms: "",
        hasShipping: true,
        hasTax: true
    },
    'Payment Voucher': {
        title: 'PAYMENT VOUCHER',
        prefix: 'PV-',
        color: '#be185d',
        terms: "",
        hasShipping: false,
        hasTax: false
    },
    'Expense Voucher': {
        title: 'EXPENSE VOUCHER',
        prefix: 'EXP-',
        color: '#be185d',
        terms: "",
        hasShipping: false,
        hasTax: true
    },
    'Work Order': {
        title: 'WORK ORDER',
        prefix: 'WO-',
        color: '#c2410c',
        terms: "",
        hasShipping: false,
        hasTax: true
    },
    'Performa PO': {
        title: 'PERFORMA PURCHASE ORDER',
        prefix: 'PPO-',
        color: '#1d4ed8',
        terms: "",
        hasShipping: true,
        hasTax: true
    },
    'Customs Invoice': {
        title: 'CUSTOMS INVOICE',
        prefix: 'CUST-',
        color: '#0f172a',
        terms: "For Customs Clearance Only",
        hasShipping: true,
        hasTax: true
    },
    'Job Work Challan': {
        title: 'JOB WORK CHALLAN',
        prefix: 'JW-',
        color: '#713f12',
        terms: "Returnable Material",
        hasShipping: true,
        hasTax: false
    },
    'Refund Invoice': {
        title: 'REFUND INVOICE',
        prefix: 'REF-',
        color: '#b91c1c',
        terms: "",
        hasShipping: false,
        hasTax: true
    },
    'Service Invoice': {
        title: 'SERVICE INVOICE',
        prefix: 'SER-',
        color: '#4c1d95',
        terms: "",
        hasShipping: false,
        hasTax: true
    }
};
