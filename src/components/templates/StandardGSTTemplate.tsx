// Refreshed
import React from 'react';
import type { InvoiceData } from '../../types';
import { QRCodeSVG } from 'qrcode.react';
import { DOCUMENT_CONFIGS } from '../../data/documentTypes';

// Helper for currency formatting
const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2
    }).format(amount);
};


const StandardGSTTemplate: React.FC<{ data: InvoiceData }> = ({ data }) => {
    const config = DOCUMENT_CONFIGS[data.documentType as keyof typeof DOCUMENT_CONFIGS];
    const themeColor = config?.color || data.themeColor || '#0f172a';
    const docTitle = config?.title || data.documentType.toUpperCase();

    // Contextual Labels
    const isPurchase = data.documentType.includes('Purchase') || data.documentType.includes('Expense') || data.documentType.includes('Import') || data.documentType.includes('Voucher');
    const billedLabel = isPurchase ? 'SUPPLIER / VENDOR:' : 'BILLED TO:';
    const shippedLabel = isPurchase ? 'DELIVER TO:' : 'SHIPPED TO:';

    return (
        <div className="gst-template" style={{
            fontFamily: '"Interact", sans-serif',
            color: '#000',
            lineHeight: 1.3,
            fontSize: '11px'
        }}>
            {/* 
        Strict Grid Layout mimicking Tally/Zoho/Vyapar 
        Outer Border Box
      */}
            <div style={{ border: '1px solid #000', minHeight: '800px', display: 'flex', flexDirection: 'column' }}>

                {/* HEADER SECTION */}
                <div style={{ display: 'flex', borderBottom: '1px solid #000' }}>
                    {/* Company Details (Left) */}
                    <div style={{ flex: 1, padding: '10px', borderRight: '1px solid #000' }}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                            {data.seller.logoUrl && <img src={data.seller.logoUrl} alt="Logo" style={{ height: '40px', objectFit: 'contain' }} />}
                            <div>
                                <h2 style={{ fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px', color: themeColor, margin: 0 }}>
                                    {data.seller.companyName}
                                </h2>
                                <div style={{ whiteSpace: 'pre-line' }}>{data.seller.address.line1}{data.seller.address.line2 ? `, ${data.seller.address.line2}` : ''}</div>
                                <div>{data.seller.address.city}, {data.seller.address.state} - {data.seller.address.zip}</div>
                                {data.seller.gstin && <div style={{ marginTop: '8px' }}><strong>GSTIN:</strong> {data.seller.gstin}</div>}
                                {data.seller.email && <div><strong>E-mail:</strong> {data.seller.email}</div>}
                                {data.seller.phone && <div><strong>Phone:</strong> {data.seller.phone}</div>}
                            </div>
                        </div>
                    </div>

                    {/* Document Details (Right) */}
                    <div style={{ flex: 1 }}>
                        <div style={{ padding: '10px', backgroundColor: '#f3f4f6', borderBottom: '1px solid #000', textAlign: 'center' }}>
                            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>{docTitle}</h1>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                            <div style={{ width: '50%', padding: '5px 10px', borderRight: '1px solid #000', borderBottom: '1px solid #000' }}>
                                <div style={{ fontSize: '9px', color: '#555' }}>Invoice No:</div>
                                <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{data.documentNumber}</div>
                            </div>
                            <div style={{ width: '50%', padding: '5px 10px', borderBottom: '1px solid #000' }}>
                                <div style={{ fontSize: '9px', color: '#555' }}>Date:</div>
                                <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{data.date}</div>
                            </div>

                            {/* Extra Logistics Fields */}
                            {data.transportDetails?.mode && (
                                <>
                                    <div style={{ width: '50%', padding: '5px 10px', borderRight: '1px solid #000', borderBottom: '1px solid #000' }}>
                                        <div style={{ fontSize: '9px', color: '#555' }}>Mode:</div>
                                        <div>{data.transportDetails.mode}</div>
                                    </div>
                                    <div style={{ width: '50%', padding: '5px 10px', borderBottom: '1px solid #000' }}>
                                        <div style={{ fontSize: '9px', color: '#555' }}>Vehicle No:</div>
                                        <div>{data.transportDetails.vehicleNo || '-'}</div>
                                    </div>
                                </>
                            )}
                            <div style={{ width: '100%', padding: '5px 10px' }}>
                                <div style={{ fontSize: '9px', color: '#555' }}>Place of Supply:</div>
                                <div style={{ fontWeight: 600 }}>{data.buyer.placeOfSupply || data.buyer.address.state}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* PARTY DETAILS */}
                <div style={{ display: 'flex', borderBottom: '1px solid #000' }}>
                    <div style={{ flex: 1, padding: '10px', borderRight: '1px solid #000' }}>
                        <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '4px', textDecoration: 'underline' }}>{billedLabel}</div>
                        <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{data.buyer.companyName}</div>
                        <div style={{ whiteSpace: 'pre-line', margin: '4px 0' }}>
                            {data.buyer.address.line1}, {data.buyer.address.city}, {data.buyer.address.state}
                        </div>
                        {data.buyer.gstin && <div><strong>GSTIN:</strong> {data.buyer.gstin}</div>}
                    </div>
                    <div style={{ flex: 1, padding: '10px' }}>
                        <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '4px', textDecoration: 'underline' }}>{shippedLabel}</div>
                        <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{data.consignee?.companyName || data.buyer.companyName}</div>
                        <div style={{ whiteSpace: 'pre-line', margin: '4px 0' }}>
                            {(data.consignee?.address || data.buyer.address).line1}, {(data.consignee?.address || data.buyer.address).city}
                        </div>
                    </div>
                </div>

                {/* ITEMS TABLE */}
                <div style={{ flex: 1 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
                        <thead style={{ backgroundColor: themeColor, color: 'white' }}>
                            <tr>
                                <th style={{ padding: '6px', width: '30px', borderBottom: '1px solid #000' }}>#</th>
                                <th style={{ padding: '6px', textAlign: 'left', borderBottom: '1px solid #000' }}>Item Description</th>
                                <th style={{ padding: '6px', width: '60px', borderBottom: '1px solid #000' }}>HSN/SAC</th>
                                <th style={{ padding: '6px', width: '50px', borderBottom: '1px solid #000' }}>Qty</th>
                                <th style={{ padding: '6px', width: '70px', borderBottom: '1px solid #000' }}>Rate</th>
                                <th style={{ padding: '6px', width: '50px', borderBottom: '1px solid #000' }}>Disc.</th>
                                <th style={{ padding: '6px', width: '80px', borderBottom: '1px solid #000' }}>Taxable</th>
                                <th style={{ padding: '6px', width: '90px', borderBottom: '1px solid #000' }}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.items.map((item, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #ccc' }}>
                                    <td style={{ padding: '6px', textAlign: 'center' }}>{idx + 1}</td>
                                    <td style={{ padding: '6px' }}>
                                        <strong>{item.name}</strong>
                                        {item.description && <div style={{ fontSize: '9px', color: '#444' }}>{item.description}</div>}
                                    </td>
                                    <td style={{ padding: '6px', textAlign: 'center' }}>{item.hsnSacCode || '-'}</td>
                                    <td style={{ padding: '6px', textAlign: 'right' }}>{item.quantity} {item.unit}</td>
                                    <td style={{ padding: '6px', textAlign: 'right' }}>{formatCurrency(item.unitPrice, data.currency)}</td>
                                    <td style={{ padding: '6px', textAlign: 'right' }}>{item.discountAmount ? formatCurrency(item.discountAmount, data.currency) : '-'}</td>
                                    <td style={{ padding: '6px', textAlign: 'right' }}>{formatCurrency(item.taxableValue, data.currency)}</td>
                                    <td style={{ padding: '6px', textAlign: 'right', fontWeight: 'bold' }}>{formatCurrency(item.totalAmount, data.currency)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* FOOTER TOTALS */}
                <div style={{ display: 'flex', borderTop: '1px solid #000' }}>
                    <div style={{ flex: 1.5, padding: '10px', borderRight: '1px solid #000', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        {data.amountInWords && (
                            <div style={{ marginBottom: '15px' }}>
                                <div style={{ fontSize: '9px', fontWeight: 'bold' }}>Total In Words:</div>
                                <div>{data.amountInWords}</div>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '20px' }}>
                            <div style={{ flex: 1 }}>
                                {data.seller.bankDetails?.[0]?.bankName && (
                                    <>
                                        <div style={{ fontSize: '9px', fontWeight: 'bold' }}>Bank Details:</div>
                                        <div style={{ fontSize: '10px' }}>
                                            Bank: {data.seller.bankDetails[0].bankName}<br />
                                            A/c No: {data.seller.bankDetails[0].accountNumber}<br />
                                            IFSC: {data.seller.bankDetails[0].ifscCode}
                                        </div>
                                    </>
                                )}
                            </div>
                            {data.seller.qrCodeUrl ? (
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '8px', marginBottom: '2px' }}>Scan for Details</div>
                                    <img src={data.seller.qrCodeUrl} alt="QR" style={{ height: '60px' }} />
                                </div>
                            ) : data.seller.qrCodeValue ? (
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '8px', marginBottom: '2px' }}>Scan to Pay</div>
                                    <QRCodeSVG value={data.seller.qrCodeValue} size={60} />
                                </div>
                            ) : null}
                        </div>

                        {data.termsAndConditions && (
                            <div style={{ marginTop: '20px' }}>
                                <div style={{ fontSize: '9px', fontWeight: 'bold' }}>Terms and Conditions:</div>
                                <div style={{ fontSize: '9px', whiteSpace: 'pre-line' }}>{data.termsAndConditions}</div>
                            </div>
                        )}
                    </div>

                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 10px', borderBottom: '1px solid #eee' }}>
                            <span>Taxable Amount</span>
                            <span style={{ fontWeight: 'bold' }}>{formatCurrency(data.totalTaxable, data.currency)}</span>
                        </div>
                        {config?.hasTax && (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 10px', borderBottom: '1px solid #eee' }}>
                                    <span>CGST</span>
                                    <span>{formatCurrency(data.totalCGST || 0, data.currency)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 10px', borderBottom: '1px solid #eee' }}>
                                    <span>SGST</span>
                                    <span>{formatCurrency(data.totalSGST || 0, data.currency)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 10px', borderBottom: '1px solid #eee' }}>
                                    <span>IGST</span>
                                    <span>{formatCurrency(data.totalIGST || 0, data.currency)}</span>
                                </div>
                            </>
                        )}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '10px',
                            backgroundColor: themeColor,
                            color: 'white',
                            fontWeight: 800,
                            fontSize: '14px'
                        }}>
                            <span>Grand Total</span>
                            <span>{formatCurrency(data.grandTotal, data.currency)}</span>
                        </div>

                        <div style={{ textAlign: 'center', marginTop: '30px', paddingBottom: '10px' }}>
                            <div style={{ height: '40px' }}>
                                {data.seller.signatureUrl && <img src={data.seller.signatureUrl} style={{ height: '40px' }} alt="Sig" />}
                            </div>
                            <div style={{ fontSize: '10px', fontWeight: 'bold' }}>For {data.seller.companyName}</div>
                            <div style={{ fontSize: '9px' }}>Authorized Signatory</div>
                        </div>
                    </div>
                </div>

            </div>
            <div style={{ textAlign: 'center', marginTop: '5px', fontSize: '9px', color: '#666' }}>
                Result Generated by TradeDoc AI
            </div>
        </div>
    );
};

export default StandardGSTTemplate;

