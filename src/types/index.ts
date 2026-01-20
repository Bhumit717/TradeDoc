// --- Address & Party Models ---
export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface CompanyProfile {
  id?: string;
  companyName: string;
  logoUrl?: string;
  address: Address;
  gstin?: string;
  pan?: string;
  cin?: string; // Corporate Identity Number
  iec?: string; // Import Export Code
  email: string;
  phone: string;
  website?: string;

  // Bank Details (Multiple supported)
  bankDetails?: BankAccount[];

  // Signatures
  signatureUrl?: string;
  authorizedSignatoryName?: string;
  authorizedSignatoryDesignation?: string;
  qrCodeValue?: string; // Content for QR Code (e.g. UPI ID or URL)
  qrCodeUrl?: string; // Uploaded QR Code Image URL
}

export interface ClientProfile {
  id: string;
  companyName: string;
  contactPerson?: string;
  address: Address;
  shippingAddress?: Address;
  gstin?: string;
  pan?: string;
  email?: string;
  phone?: string;
  placeOfSupply?: string; // State Code
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  ifscCode: string; // India
  swiftCode?: string; // International
  iban?: string; // International
  branchName?: string;
  upiId?: string;
}

// --- Item Model ---
export interface InvoiceItem {
  id: string;
  name: string;
  description?: string;
  hsnSacCode?: string; // Harmonized System Nomenclature

  quantity: number;
  unit: string; // kg, pcs, box, mtr, etc.

  unitPrice: number;
  discountAmount?: number;
  discountPercentage?: number;

  taxRate: number; // IGST or (CGST+SGST) combined rate
  cess?: number;

  // Computed fields
  taxableValue: number;
  taxAmount: number;
  totalAmount: number;
}

// --- Document Model ---
export type DocumentType =
  | 'Tax Invoice' | 'Proforma Invoice' | 'Commercial Invoice' | 'Quotation' | 'Estimate'
  | 'Purchase Order' | 'Sales Order' | 'Delivery Challan' | 'Bill of Supply'
  | 'Debit Note' | 'Credit Note' | 'Receipt' | 'Packing List' | 'Export Invoice'
  | 'Import Invoice' | 'Payment Voucher' | 'Expense Voucher' | 'Work Order'
  | 'Performa PO' | 'Customs Invoice' | 'Job Work Challan' | 'Refund Invoice'
  | 'Service Invoice';

export interface TransportDetails {
  mode: 'Road' | 'Rail' | 'Air' | 'Ship' | 'Courier' | '';
  transporterName?: string;
  transporterId?: string; // GSTIN of transporter
  lrNo?: string; // Lorry Receipt / Docket No
  lrDate?: string;
  vehicleNo?: string;
  distance?: number; // km
  eWayBillNo?: string;
}

export interface ExportDetails {
  portOfLoading?: string;
  portOfDischarge?: string;
  countryOfOrigin?: string;
  countryOfDestination?: string;
  shippingBillNo?: string;
  shippingBillDate?: string;
  preCarriageBy?: string;
  vesselFlightNo?: string;
  containerNo?: string;
  lutBoNo?: string; // Letter of Undertaking / Bond No
}

export interface InvoiceData {
  id?: string;
  documentType: DocumentType;
  documentNumber: string;

  // Dates
  date: string;
  dueDate?: string;
  timeOfSupply?: string;

  // References
  buyerOrderNo?: string; // PO Reference
  buyerOrderDate?: string;
  dispatchDocNo?: string; // Challan Reference
  dispatchThrough?: string;

  // Parties
  seller: CompanyProfile; // Populated from global settings, editable
  buyer: ClientProfile;
  consignee?: ClientProfile; // Shipped To (if different from Buyer)

  // Line Items
  items: InvoiceItem[];

  // Logistics
  transportDetails?: TransportDetails;
  exportDetails?: ExportDetails;

  // Financials
  currency: string;
  exchangeRate?: number; // For Export invoices

  isReverseCharge: boolean;

  // Computed Totals
  totalTaxable: number;
  totalCGST?: number;
  totalSGST?: number;
  totalIGST?: number;
  totalCess?: number;
  totalDiscount: number;
  roundOff: number;
  grandTotal: number;
  amountInWords?: string;

  // Meta
  notes?: string;
  termsAndConditions?: string;
  status: 'Draft' | 'Sent' | 'Paid' | 'Cancelled';

  // Template Settings
  templateId?: 'standard-gst' | 'modern-tech' | 'classic-export';
  themeColor?: string;
}
