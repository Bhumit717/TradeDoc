import React from 'react';
import type { InvoiceData } from '../../types';
import { DOCUMENT_CONFIGS } from '../../data/documentTypes';

const EstimationTemplate: React.FC<{ data: InvoiceData }> = ({ data }) => {
    const config = DOCUMENT_CONFIGS[data.documentType as keyof typeof DOCUMENT_CONFIGS];
    const themeColor = config?.color || '#d97706';

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: data.currency || 'INR',
            minimumFractionDigits: 2
        }).format(amount);
    };

    return (
        <div style={{
            fontFamily: "'Outfit', sans-serif",
            padding: '40px',
            color: '#334155',
            fontSize: '13px',
            lineHeight: '1.5',
            backgroundColor: '#ffffff'
        }}>
            {/* Minimalist Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '60px' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '42px', fontWeight: '200', color: themeColor, letterSpacing: '-1px' }}>Estimate</h1>
                    <div style={{ fontSize: '16px', color: '#94a3b8' }}>#{data.documentNumber}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: '800' }}>{data.seller.companyName}</div>
                    <div style={{ color: '#64748b' }}>{data.seller.address.city}, {data.seller.address.state}</div>
                    <div style={{ color: '#64748b' }}>{data.seller.email}</div>
                </div>
            </div>

            {/* Info Grid - Clean style */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', marginBottom: '60px' }}>
                <div>
                    <div style={{ fontSize: '10px', fontWeight: 'bold', color: themeColor, textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '1px' }}>ESTIMATE FOR</div>
                    <div style={{ fontSize: '20px', fontWeight: '800', marginBottom: '5px' }}>{data.buyer.companyName}</div>
                    <div style={{ color: '#475569' }}>{data.buyer.address.line1}</div>
                    <div style={{ color: '#475569' }}>{data.buyer.address.city}, {data.buyer.address.state}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-grid', gridTemplateColumns: 'auto auto', gap: '10px 30px', textAlign: 'left' }}>
                        <span style={{ color: '#94a3b8' }}>Date:</span> <span style={{ fontWeight: 'bold' }}>{data.date}</span>
                        <span style={{ color: '#94a3b8' }}>Expires:</span> <span style={{ fontWeight: 'bold' }}>{data.dueDate || '30 days from now'}</span>
                    </div>
                </div>
            </div>

            {/* Itemized List - No heavy borders */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
                <thead>
                    <tr style={{ borderBottom: `2px solid ${themeColor}` }}>
                        <th style={{ padding: '15px 0', textAlign: 'left', fontWeight: '800', textTransform: 'uppercase', fontSize: '11px', color: '#64748b' }}>Description</th>
                        <th style={{ padding: '15px 0', textAlign: 'right', fontWeight: '800', textTransform: 'uppercase', fontSize: '11px', color: '#64748b', width: '80px' }}>Qty</th>
                        <th style={{ padding: '15px 0', textAlign: 'right', fontWeight: '800', textTransform: 'uppercase', fontSize: '11px', color: '#64748b', width: '120px' }}>Price</th>
                        <th style={{ padding: '15px 0', textAlign: 'right', fontWeight: '800', textTransform: 'uppercase', fontSize: '11px', color: '#64748b', width: '120px' }}>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {data.items.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '20px 0' }}>
                                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{item.name}</div>
                                <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>{item.description}</div>
                            </td>
                            <td style={{ padding: '20px 0', textAlign: 'right' }}>{item.quantity}</td>
                            <td style={{ padding: '20px 0', textAlign: 'right' }}>{formatCurrency(item.unitPrice)}</td>
                            <td style={{ padding: '20px 0', textAlign: 'right', fontWeight: 'bold' }}>{formatCurrency(item.totalAmount)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Grand Total - Prominent */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '60px' }}>
                <div style={{ width: '300px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                        <span style={{ color: '#64748b' }}>Estimated Subtotal</span>
                        <span>{formatCurrency(data.totalTaxable)}</span>
                    </div>
                    {data.totalIGST && data.totalIGST > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                            <span style={{ color: '#64748b' }}>Estimated TAX (IGST)</span>
                            <span>{formatCurrency(data.totalIGST)}</span>
                        </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0', borderTop: `2px solid ${themeColor}`, marginTop: '10px' }}>
                        <span style={{ fontWeight: '800', fontSize: '18px' }}>ESTIMATED TOTAL</span>
                        <span style={{ fontWeight: '800', fontSize: '24px', color: themeColor }}>{formatCurrency(data.grandTotal)}</span>
                    </div>
                </div>
            </div>

            {/* Footer Notes */}
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '30px' }}>
                <div style={{ fontWeight: 'bold', color: themeColor, marginBottom: '10px', fontSize: '11px', textTransform: 'uppercase' }}>Notes & Instructions</div>
                <div style={{ color: '#475569', fontSize: '12px', maxWidth: '600px' }}>
                    {data.notes || 'This is an estimate only, not a formal quote or invoice. Final pricing may vary based on exact requirements and market conditions at the time of order.'}
                </div>
            </div>
        </div>
    );
};

export default EstimationTemplate;
