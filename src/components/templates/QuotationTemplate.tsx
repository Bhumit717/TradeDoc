import React from 'react';
import type { InvoiceData } from '../../types';
import { QRCodeSVG } from 'qrcode.react';

const QuotationTemplate: React.FC<{ data: InvoiceData }> = ({ data }) => {
    const themeColor = '#10b981'; // Green for Quotation

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: data.currency || 'INR',
            minimumFractionDigits: 2
        }).format(amount);
    };

    return (
        <div style={{
            fontFamily: "'Inter', sans-serif",
            color: '#1e293b',
            fontSize: '12px',
            lineHeight: '1.4',
            backgroundColor: 'white'
        }}>
            {/* Header Design - Modern & Clean */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', borderBottom: `4px solid ${themeColor}`, paddingBottom: '20px' }}>
                <div>
                    {data.seller.logoUrl && <img src={data.seller.logoUrl} alt="Logo" style={{ maxHeight: '60px', marginBottom: '10px' }} />}
                    <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: themeColor }}>{data.documentType.toUpperCase()}</h1>
                    <div style={{ color: '#64748b' }}>#{data.documentNumber}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '800', fontSize: '16px' }}>{data.seller.companyName}</div>
                    <div>{data.seller.address.line1}</div>
                    <div>{data.seller.address.city}, {data.seller.address.state} - {data.seller.address.zip}</div>
                    <div>Email: {data.seller.email} | Phone: {data.seller.phone}</div>
                    {data.seller.gstin && <div style={{ fontWeight: 'bold', marginTop: '5px' }}>GSTIN: {data.seller.gstin}</div>}
                </div>
            </div>

            {/* Info Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '30px' }}>
                <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 'bold', color: themeColor, textTransform: 'uppercase', marginBottom: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>
                        Quotation Prepared For
                    </div>
                    <div style={{ fontWeight: '800', fontSize: '14px', marginBottom: '5px' }}>{data.buyer.companyName}</div>
                    <div>{data.buyer.address.line1}</div>
                    <div>{data.buyer.address.city}, {data.buyer.address.state}</div>
                    {data.buyer.gstin && <div>GSTIN: {data.buyer.gstin}</div>}
                </div>
                <div style={{ padding: '15px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <tr>
                            <td style={{ color: '#64748b', padding: '4px 0' }}>Quote Date:</td>
                            <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{data.date}</td>
                        </tr>
                        <tr>
                            <td style={{ color: '#64748b', padding: '4px 0' }}>Valid Until:</td>
                            <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{data.dueDate || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td style={{ color: '#64748b', padding: '4px 0' }}>Reference:</td>
                            <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{data.buyerOrderNo || 'N/A'}</td>
                        </tr>
                    </table>
                </div>
            </div>

            {/* Items Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
                <thead>
                    <tr style={{ backgroundColor: themeColor, color: 'white' }}>
                        <th style={{ padding: '12px', textAlign: 'left', borderRadius: '4px 0 0 0' }}>#</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Description</th>
                        <th style={{ padding: '12px', textAlign: 'right' }}>Qty</th>
                        <th style={{ padding: '12px', textAlign: 'right' }}>Unit Price</th>
                        <th style={{ padding: '12px', textAlign: 'right', borderRadius: '0 4px 0 0' }}>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {data.items.map((item, index) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <td style={{ padding: '12px' }}>{index + 1}</td>
                            <td style={{ padding: '12px' }}>
                                <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                                {item.description && <div style={{ fontSize: '11px', color: '#64748b' }}>{item.description}</div>}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'right' }}>{item.quantity} {item.unit}</td>
                            <td style={{ padding: '12px', textAlign: 'right' }}>{formatCurrency(item.unitPrice)}</td>
                            <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>{formatCurrency(item.totalAmount)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Bottom Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px' }}>
                <div>
                    {data.notes && (
                        <div style={{ marginBottom: '15px' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '10px', color: themeColor, marginBottom: '5px' }}>REMARKS / NOTES:</div>
                            <div style={{ whiteSpace: 'pre-wrap', color: '#475569' }}>{data.notes}</div>
                        </div>
                    )}
                    {data.termsAndConditions && (
                        <div>
                            <div style={{ fontWeight: 'bold', fontSize: '10px', color: themeColor, marginBottom: '5px' }}>TERMS AND CONDITIONS:</div>
                            <div style={{ fontSize: '10px', color: '#64748b', whiteSpace: 'pre-wrap' }}>{data.termsAndConditions}</div>
                        </div>
                    )}
                </div>

                <div>
                    <div style={{ backgroundColor: '#f1f5f9', padding: '15px', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ color: '#64748b' }}>Subtotal:</span>
                            <span>{formatCurrency(data.totalTaxable)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ color: '#64748b' }}>Tax Total:</span>
                            <span>{formatCurrency(data.totalIGST || 0)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #cbd5e1', paddingTop: '8px', marginTop: '8px' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Grand Total:</span>
                            <span style={{ fontWeight: 'bold', fontSize: '14px', color: themeColor }}>{formatCurrency(data.grandTotal)}</span>
                        </div>
                    </div>

                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '20px', alignItems: 'center' }}>
                        {data.seller.qrCodeUrl ? (
                            <img src={data.seller.qrCodeUrl} alt="QR" style={{ height: '70px', border: '1px solid #eee' }} />
                        ) : data.seller.qrCodeValue ? (
                            <QRCodeSVG value={data.seller.qrCodeValue} size={70} />
                        ) : null}
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div style={{ color: '#94a3b8', fontSize: '10px' }}>
                    This is an electronically generated quotation.
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '150px', borderBottom: '1px solid #e2e8f0', marginBottom: '5px' }}></div>
                    <div style={{ fontSize: '10px', fontWeight: 'bold' }}>Authorized Signatory</div>
                    <div style={{ fontSize: '10px' }}>{data.seller.companyName}</div>
                </div>
            </div>
        </div>
    );
};

export default QuotationTemplate;
