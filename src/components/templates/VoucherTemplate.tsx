import React from 'react';
import type { InvoiceData } from '../../types';
import { DOCUMENT_CONFIGS } from '../../data/documentTypes';

const VoucherTemplate: React.FC<{ data: InvoiceData }> = ({ data }) => {
    const config = DOCUMENT_CONFIGS[data.documentType as keyof typeof DOCUMENT_CONFIGS];
    const themeColor = config?.color || '#be185d';
    const docTitle = config?.title || data.documentType.toUpperCase();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: data.currency || 'INR',
            minimumFractionDigits: 2
        }).format(amount);
    };

    const isReceipt = data.documentType === 'Receipt';

    return (
        <div style={{
            fontFamily: "'Inter', sans-serif",
            padding: '40px',
            color: '#1e293b',
            lineHeight: '1.6',
            border: '2px solid #e2e8f0',
            maxWidth: '800px',
            margin: '0 auto',
            backgroundColor: 'white'
        }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', borderBottom: `2px solid ${themeColor}`, paddingBottom: '20px' }}>
                <div>
                    {data.seller.logoUrl && <img src={data.seller.logoUrl} alt="Logo" style={{ maxHeight: '60px', marginBottom: '10px' }} />}
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: themeColor }}>{data.seller.companyName}</h2>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                        {data.seller.address.line1}, {data.seller.address.city}, {data.seller.address.state}
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '900', color: themeColor, textTransform: 'uppercase' }}>{docTitle}</h1>
                    <div style={{ marginTop: '10px' }}>
                        <div style={{ fontWeight: 'bold' }}>Number: <span style={{ color: '#0f172a' }}>{data.documentNumber}</span></div>
                        <div style={{ fontWeight: 'bold' }}>Date: <span style={{ color: '#0f172a' }}>{data.date}</span></div>
                    </div>
                </div>
            </div>

            {/* Voucher Body */}
            <div style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', marginBottom: '20px', borderBottom: '1px dashed #cbd5e1', paddingBottom: '10px' }}>
                    <div style={{ width: '150px', fontWeight: 'bold', color: '#64748b' }}>{isReceipt ? 'RECEIVED FROM' : 'PAID TO'}:</div>
                    <div style={{ flex: 1, fontSize: '16px', fontWeight: '600' }}>{data.buyer.companyName}</div>
                </div>

                <div style={{ display: 'flex', marginBottom: '20px', borderBottom: '1px dashed #cbd5e1', paddingBottom: '10px' }}>
                    <div style={{ width: '150px', fontWeight: 'bold', color: '#64748b' }}>SUM OF:</div>
                    <div style={{ flex: 1, fontSize: '14px', fontStyle: 'italic' }}>{data.amountInWords || '....................................................................................'}</div>
                </div>

                <div style={{ display: 'flex', marginBottom: '20px', borderBottom: '1px dashed #cbd5e1', paddingBottom: '10px' }}>
                    <div style={{ width: '150px', fontWeight: 'bold', color: '#64748b' }}>ON ACCOUNT OF:</div>
                    <div style={{ flex: 1, fontSize: '14px' }}>
                        {data.notes || (data.items.length > 0 ? data.items.map(i => i.name).join(', ') : '....................................................................................')}
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
                    <div style={{
                        backgroundColor: '#f8fafc',
                        padding: '15px 30px',
                        borderRadius: '8px',
                        border: `2px solid ${themeColor}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px'
                    }}>
                        <span style={{ fontWeight: '900', fontSize: '18px', color: themeColor }}>AMOUNT:</span>
                        <span style={{ fontWeight: '900', fontSize: '24px', color: '#0f172a' }}>{formatCurrency(data.grandTotal)}</span>
                    </div>
                </div>
            </div>

            {/* Signatures */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginTop: '80px' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ borderTop: '1px solid #cbd5e1', paddingTop: '10px', fontSize: '12px', fontWeight: 'bold' }}>
                        {isReceipt ? 'PREPARED BY' : 'PAID BY'}
                    </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ borderTop: '1px solid #cbd5e1', paddingTop: '10px', fontSize: '12px', fontWeight: 'bold' }}>
                        AUTHORIZED BY
                    </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ borderTop: '1px solid #cbd5e1', paddingTop: '10px', fontSize: '12px', fontWeight: 'bold' }}>
                        {isReceipt ? "PAYER'S SIGNATURE" : "RECEIVER'S SIGNATURE"}
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '40px', textAlign: 'center', fontSize: '10px', color: '#94a3b8' }}>
                TradeDoc AI Generated Document
            </div>
        </div>
    );
};

export default VoucherTemplate;
