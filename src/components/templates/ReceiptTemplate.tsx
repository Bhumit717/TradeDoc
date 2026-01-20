import React from 'react';
import type { InvoiceData } from '../../types';
import { DOCUMENT_CONFIGS } from '../../data/documentTypes';

const ReceiptTemplate: React.FC<{ data: InvoiceData }> = ({ data }) => {
    const config = DOCUMENT_CONFIGS[data.documentType as keyof typeof DOCUMENT_CONFIGS];
    const themeColor = config?.color || '#047857';



    return (
        <div style={{
            fontFamily: "'Inter', sans-serif",
            padding: '40px',
            color: '#1e293b',
            lineHeight: '1.8',
            backgroundColor: 'white',
            border: '2px solid #e2e8f0',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Watermark/Side Ribbon */}
            <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '60px',
                height: '100%',
                backgroundColor: themeColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{ transform: 'rotate(90deg)', color: 'white', fontWeight: '900', fontSize: '24px', whiteSpace: 'nowrap', opacity: 0.3 }}>
                    OFFICIAL RECEIPT
                </div>
            </div>

            <div style={{ paddingRight: '60px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', alignItems: 'center' }}>
                    <div>
                        {data.seller.logoUrl && <img src={data.seller.logoUrl} style={{ height: '50px', marginBottom: '10px' }} />}
                        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '900', color: themeColor }}>{data.seller.companyName}</h1>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{data.seller.address.line1}, {data.seller.address.city}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '32px', fontWeight: '900', color: themeColor }}>RECEIPT</div>
                        <div style={{ fontWeight: 'bold' }}>No: {data.documentNumber}</div>
                        <div style={{ fontWeight: 'bold' }}>Date: {data.date}</div>
                    </div>
                </div>

                <div style={{ fontSize: '16px', borderTop: '2px solid #f1f5f9', paddingTop: '30px' }}>
                    <div style={{ display: 'flex', borderBottom: '1px dashed #cbd5e1', marginBottom: '20px' }}>
                        <div style={{ width: '180px', fontWeight: 'bold', fontStyle: 'italic' }}>Received with thanks from:</div>
                        <div style={{ flex: 1, fontWeight: '800', borderBottom: '1px solid #000' }}>{data.buyer.companyName}</div>
                    </div>

                    <div style={{ display: 'flex', borderBottom: '1px dashed #cbd5e1', marginBottom: '20px' }}>
                        <div style={{ width: '180px', fontWeight: 'bold', fontStyle: 'italic' }}>The sum of:</div>
                        <div style={{ flex: 1, fontWeight: 'bold' }}>{data.amountInWords || '....................................................................................'}</div>
                    </div>

                    <div style={{ display: 'flex', borderBottom: '1px dashed #cbd5e1', marginBottom: '20px' }}>
                        <div style={{ width: '180px', fontWeight: 'bold', fontStyle: 'italic' }}>By Cash / Cheque / Online:</div>
                        <div style={{ flex: 1 }}>{data.notes || '....................................................................................'}</div>
                    </div>

                    <div style={{ display: 'flex', borderBottom: '1px dashed #cbd5e1', marginBottom: '40px' }}>
                        <div style={{ width: '180px', fontWeight: 'bold', fontStyle: 'italic' }}>On account of:</div>
                        <div style={{ flex: 1 }}>{data.items.length > 0 ? data.items.map(i => i.name).join(', ') : 'Payment towards services/goods'}</div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '40px' }}>
                    <div style={{
                        backgroundColor: '#f8fafc',
                        padding: '15px 30px',
                        borderRadius: '12px',
                        border: `3px solid ${themeColor}`,
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
                    }}>
                        <span style={{ fontSize: '24px', fontWeight: '900', color: themeColor, marginRight: '10px' }}>{data.currency}</span>
                        <span style={{ fontSize: '32px', fontWeight: '900' }}>{data.grandTotal.toLocaleString('en-IN')}</span>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        {data.seller.signatureUrl ? (
                            <img src={data.seller.signatureUrl} style={{ height: '50px' }} />
                        ) : (
                            <div style={{ height: '50px' }}></div>
                        )}
                        <div style={{ width: '200px', borderTop: '2px solid #000', paddingTop: '5px', fontWeight: 'bold', fontSize: '12px' }}>
                            Authorized Signatory
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReceiptTemplate;
