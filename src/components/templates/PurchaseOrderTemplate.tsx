import React from 'react';
import type { InvoiceData } from '../../types';
import { QRCodeSVG } from 'qrcode.react';

const PurchaseOrderTemplate: React.FC<{ data: InvoiceData }> = ({ data }) => {
    const themeColor = '#2563eb'; // Blue for PO

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
            fontSize: '11px',
            backgroundColor: 'white'
        }}>
            {/* Split Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', marginBottom: '30px', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    {data.seller.logoUrl && <img src={data.seller.logoUrl} alt="Logo" style={{ maxHeight: '70px' }} />}
                    <div>
                        <h2 style={{ margin: 0, color: themeColor, fontSize: '20px', fontWeight: '900' }}>{data.documentType.toUpperCase()}</h2>
                        <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{data.documentNumber}</div>
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{data.seller.companyName}</div>
                    <div>{data.seller.address.line1}</div>
                    <div>{data.seller.address.city}, {data.seller.address.state} {data.seller.address.zip}</div>
                    <div>Contact: {data.seller.phone} | {data.seller.email}</div>
                    {data.seller.gstin && <div style={{ fontWeight: 'bold', marginTop: '4px' }}>GSTIN: {data.seller.gstin}</div>}
                </div>
            </div>

            {/* Parties Table-Style */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', border: '1px solid #e2e8f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '25px' }}>
                <div style={{ padding: '12px', borderRight: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: 'bold', color: themeColor, marginBottom: '8px', textTransform: 'uppercase', fontSize: '9px' }}>Supplier / Vendor</div>
                    <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>{data.buyer.companyName}</div>
                    <div>{data.buyer.address.line1}</div>
                    <div>{data.buyer.address.city}, {data.buyer.address.state}</div>
                    {data.buyer.gstin && <div style={{ marginTop: '4px' }}>GSTIN: {data.buyer.gstin}</div>}
                    {data.buyer.phone && <div>PH: {data.buyer.phone}</div>}
                </div>
                <div style={{ padding: '12px' }}>
                    <div style={{ fontWeight: 'bold', color: themeColor, marginBottom: '8px', textTransform: 'uppercase', fontSize: '9px' }}>Ship To / Deliver At</div>
                    <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>{data.consignee?.companyName || data.seller.companyName}</div>
                    <div>{data.consignee?.address.line1 || data.seller.address.line1}</div>
                    <div>{data.consignee?.address.city || data.seller.address.city}, {data.consignee?.address.state || data.seller.address.state}</div>
                    {data.seller.phone && <div>Contact: {data.seller.phone}</div>}
                </div>
            </div>

            {/* PO Info Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', backgroundColor: '#f1f5f9', padding: '10px', borderRadius: '4px', marginBottom: '20px', gap: '10px' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '8px', color: '#64748b', fontWeight: 'bold' }}>PO DATE</label>
                    <div style={{ fontWeight: 'bold' }}>{data.date}</div>
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '8px', color: '#64748b', fontWeight: 'bold' }}>EXPECTED DELIVERY</label>
                    <div style={{ fontWeight: 'bold' }}>{data.dueDate || 'Immediate'}</div>
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '8px', color: '#64748b', fontWeight: 'bold' }}>PAYMENT TERMS</label>
                    <div style={{ fontWeight: 'bold' }}>30 Days Net</div>
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '8px', color: '#64748b', fontWeight: 'bold' }}>CURRENCY</label>
                    <div style={{ fontWeight: 'bold' }}>{data.currency}</div>
                </div>
            </div>

            {/* Elegant Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead style={{ backgroundColor: themeColor, color: 'white' }}>
                    <tr>
                        <th style={{ padding: '10px', textAlign: 'center', width: '40px' }}>#</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Item Details / Specifications</th>
                        <th style={{ padding: '10px', textAlign: 'center', width: '80px' }}>Quantity</th>
                        <th style={{ padding: '10px', textAlign: 'right', width: '120px' }}>Unit Cost</th>
                        <th style={{ padding: '10px', textAlign: 'right', width: '120px' }}>Extended Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {data.items.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '10px', textAlign: 'center' }}>{idx + 1}</td>
                            <td style={{ padding: '10px' }}>
                                <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                                {item.description && <div style={{ color: '#64748b', fontSize: '10px' }}>{item.description}</div>}
                            </td>
                            <td style={{ padding: '10px', textAlign: 'center' }}>{item.quantity} {item.unit}</td>
                            <td style={{ padding: '10px', textAlign: 'right' }}>{formatCurrency(item.unitPrice)}</td>
                            <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>{formatCurrency(item.totalAmount)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Calculations and Footer */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
                <div>
                    <div style={{ color: '#475569', borderLeft: `3px solid ${themeColor}`, paddingLeft: '10px', marginBottom: '20px' }}>
                        <div style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '9px', marginBottom: '5px' }}>Purchase Instructions</div>
                        <div style={{ whiteSpace: 'pre-wrap' }}>{data.termsAndConditions || 'Please supply goods in accordance with the terms mentioned.'}</div>
                    </div>
                    {data.amountInWords && (
                        <div style={{ fontSize: '9px', color: '#64748b' }}>
                            <span style={{ fontWeight: 'bold' }}>TOTAL IN WORDS: </span>
                            {data.amountInWords}
                        </div>
                    )}
                </div>

                <div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <tr>
                            <td style={{ padding: '8px 0', color: '#64748b' }}>Subtotal:</td>
                            <td style={{ padding: '8px 0', textAlign: 'right' }}>{formatCurrency(data.totalTaxable)}</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '8px 0', color: '#64748b' }}>Tax Total (GST):</td>
                            <td style={{ padding: '8px 0', textAlign: 'right' }}>{formatCurrency(data.totalIGST || 0)}</td>
                        </tr>
                        <tr style={{ borderTop: `2px solid ${themeColor}` }}>
                            <td style={{ padding: '8px 0', fontWeight: 'bold', fontSize: '14px' }}>PO TOTAL:</td>
                            <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 'bold', fontSize: '14px', color: themeColor }}>{formatCurrency(data.grandTotal)}</td>
                        </tr>
                    </table>

                    <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                        {data.seller.qrCodeUrl ? (
                            <img src={data.seller.qrCodeUrl} alt="QR" style={{ height: '60px' }} />
                        ) : data.seller.qrCodeValue ? (
                            <QRCodeSVG value={data.seller.qrCodeValue} size={60} />
                        ) : null}
                        {data.seller.qrCodeValue && <div style={{ fontSize: '8px', color: '#94a3b8' }}>Scan for Details</div>}
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '40px', borderTop: '1px solid #e2e8f0', paddingTop: '15px', color: '#94a3b8', fontSize: '9px', display: 'flex', justifyContent: 'space-between' }}>
                <div>Computer Generated Purchase Order - No Signature Required</div>
                <div>{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</div>
            </div>
        </div>
    );
};

export default PurchaseOrderTemplate;
