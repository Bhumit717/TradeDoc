import React from 'react';
import type { InvoiceData } from '../../types';

const DebitCreditNoteTemplate: React.FC<{ data: InvoiceData }> = ({ data }) => {
    const isDebit = data.documentType === 'Debit Note';
    const themeColor = isDebit ? '#b91c1c' : '#15803d'; // Red for Debit, Green for Credit

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
            padding: '30px',
            color: '#1e293b',
            fontSize: '12px',
            lineHeight: '1.5',
            backgroundColor: 'white'
        }}>
            {/* Header Ribbon */}
            <div style={{ backgroundColor: themeColor, color: 'white', padding: '15px 30px', margin: '-30px -30px 30px -30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '900', letterSpacing: '2px' }}>{data.documentType.toUpperCase()}</h1>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>#{data.documentNumber}</div>
                    <div style={{ fontSize: '12px', opacity: 0.9 }}>Date: {data.date}</div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                <div>
                    {data.seller.logoUrl && <img src={data.seller.logoUrl} alt="Logo" style={{ maxHeight: '60px', marginBottom: '10px' }} />}
                    <div style={{ fontWeight: '800', fontSize: '18px', color: themeColor }}>{data.seller.companyName}</div>
                    <div style={{ width: '250px' }}>
                        {data.seller.address.line1}, {data.seller.address.city}, {data.seller.address.state} - {data.seller.address.zip}<br />
                        {data.seller.gstin && <strong>GSTIN: {data.seller.gstin}</strong>}
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Note Issued To:</div>
                    <div style={{ fontWeight: '800', fontSize: '16px' }}>{data.buyer.companyName}</div>
                    <div style={{ width: '250px', marginLeft: 'auto' }}>
                        {data.buyer.address.line1}, {data.buyer.address.city}, {data.buyer.address.state}<br />
                        {data.buyer.gstin && <strong>GSTIN: {data.buyer.gstin}</strong>}
                    </div>
                </div>
            </div>

            {/* Reference Box */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold' }}>ORIGINAL INVOICE REF:</div>
                    <div style={{ fontWeight: 'bold' }}>{data.buyerOrderNo || 'N/A'}</div>
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold' }}>ORIGINAL DATE:</div>
                    <div style={{ fontWeight: 'bold' }}>{data.buyerOrderDate || 'N/A'}</div>
                </div>
                <div style={{ flex: 2 }}>
                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold' }}>REASON FOR {isDebit ? 'DEBIT' : 'CREDIT'}:</div>
                    <div style={{ fontWeight: 'bold' }}>{data.notes || 'Correction of pricing / Returns'}</div>
                </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
                <thead>
                    <tr style={{ borderBottom: `2px solid ${themeColor}` }}>
                        <th style={{ padding: '12px', textAlign: 'left', color: '#64748b' }}>DESCRIPTION</th>
                        <th style={{ padding: '12px', textAlign: 'right', color: '#64748b', width: '100px' }}>TAX RATE</th>
                        <th style={{ padding: '12px', textAlign: 'right', color: '#64748b', width: '150px' }}>ADJUSTMENT AMT</th>
                    </tr>
                </thead>
                <tbody>
                    {data.items.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <td style={{ padding: '12px' }}>
                                <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                                {item.description && <div style={{ fontSize: '11px', color: '#64748b' }}>{item.description}</div>}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'right' }}>{item.taxRate}%</td>
                            <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>{formatCurrency(item.totalAmount)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ width: '300px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                        <span>Taxable Adjustment:</span>
                        <span>{formatCurrency(data.totalTaxable)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                        <span>Total Tax Adjustment:</span>
                        <span>{formatCurrency(data.totalIGST || 0)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: `2px solid ${themeColor}`, marginTop: '10px', fontWeight: '900', fontSize: '16px', color: themeColor }}>
                        <span>NET ADJUSTMENT:</span>
                        <span>{formatCurrency(data.grandTotal)}</span>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '80px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div style={{ fontSize: '10px', color: '#64748b', maxWidth: '300px' }}>
                    This note is issued to adjust the account balance for the reasons stated above. Please update your records accordingly.
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '40px' }}>For {data.seller.companyName}</div>
                    <div style={{ borderTop: '1px solid #000', width: '200px', paddingTop: '5px' }}>Authorized Signatory</div>
                </div>
            </div>
        </div>
    );
};

export default DebitCreditNoteTemplate;
