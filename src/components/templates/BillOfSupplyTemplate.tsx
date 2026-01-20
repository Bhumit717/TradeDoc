import React from 'react';
import type { InvoiceData } from '../../types';
import { DOCUMENT_CONFIGS } from '../../data/documentTypes';

const BillOfSupplyTemplate: React.FC<{ data: InvoiceData }> = ({ data }) => {
    const config = DOCUMENT_CONFIGS[data.documentType as keyof typeof DOCUMENT_CONFIGS];
    const themeColor = config?.color || '#57534e';

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
            fontSize: '11px',
            lineHeight: '1.4',
            backgroundColor: 'white',
            border: '2px solid #000'
        }}>
            <div style={{ borderBottom: '2px solid #000', paddingBottom: '10px', marginBottom: '20px', textAlign: 'center' }}>
                <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '900', color: themeColor }}>BILL OF SUPPLY</h1>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#b91c1c' }}>
                    Composition taxable person, not eligible to collect tax on supplies
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                    <div style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '10px', color: '#64748b' }}>Details of Seller</div>
                    <div style={{ fontWeight: '900', fontSize: '16px' }}>{data.seller.companyName}</div>
                    <div>{data.seller.address.line1}, {data.seller.address.city}</div>
                    {data.seller.gstin && <div><strong>GSTIN:</strong> {data.seller.gstin}</div>}
                    <div><strong>Phone:</strong> {data.seller.phone}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-grid', gridTemplateColumns: 'auto auto', gap: '5px 15px', textAlign: 'left' }}>
                        <span style={{ color: '#64748b' }}>Bill No:</span> <span style={{ fontWeight: 'bold' }}>{data.documentNumber}</span>
                        <span style={{ color: '#64748b' }}>Date:</span> <span style={{ fontWeight: 'bold' }}>{data.date}</span>
                        <span style={{ color: '#64748b' }}>State Code:</span> <span style={{ fontWeight: 'bold' }}>{data.seller.address.state}</span>
                    </div>
                </div>
            </div>

            <div style={{ backgroundColor: '#f9fafb', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '4px', marginBottom: '20px' }}>
                <div style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '10px', color: '#64748b', marginBottom: '5px' }}>Details of Receiver</div>
                <div style={{ fontWeight: '900', fontSize: '14px' }}>{data.buyer.companyName}</div>
                <div>{data.buyer.address.line1}, {data.buyer.address.city}, {data.buyer.address.state}</div>
                {data.buyer.gstin && <div><strong>GSTIN:</strong> {data.buyer.gstin}</div>}
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead style={{ borderTop: '1px solid #000', borderBottom: '1px solid #000' }}>
                    <tr>
                        <th style={{ padding: '10px', textAlign: 'center', width: '40px' }}>S.N.</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Description of Goods / Services</th>
                        <th style={{ padding: '10px', textAlign: 'center', width: '80px' }}>HSN</th>
                        <th style={{ padding: '10px', textAlign: 'right', width: '60px' }}>Qty</th>
                        <th style={{ padding: '10px', textAlign: 'right', width: '100px' }}>Rate</th>
                        <th style={{ padding: '10px', textAlign: 'right', width: '100px' }}>Value</th>
                    </tr>
                </thead>
                <tbody>
                    {data.items.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px dashed #e2e8f0' }}>
                            <td style={{ padding: '10px', textAlign: 'center' }}>{idx + 1}</td>
                            <td style={{ padding: '10px', fontWeight: 'bold' }}>{item.name}</td>
                            <td style={{ padding: '10px', textAlign: 'center' }}>{item.hsnSacCode || '-'}</td>
                            <td style={{ padding: '10px', textAlign: 'right' }}>{item.quantity} {item.unit}</td>
                            <td style={{ padding: '10px', textAlign: 'right' }}>{formatCurrency(item.unitPrice)}</td>
                            <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>{formatCurrency(item.totalAmount)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px' }}>
                <div>
                    <div style={{ fontSize: '9px', fontWeight: 'bold', marginBottom: '5px' }}>Amount in Words:</div>
                    <div style={{ fontStyle: 'italic', marginBottom: '20px' }}>{data.amountInWords}</div>

                    <div style={{ fontSize: '9px', fontWeight: 'bold', marginBottom: '5px' }}>Terms & Conditions:</div>
                    <div style={{ fontSize: '9px', color: '#64748b' }}>{data.termsAndConditions || 'Payment due within 15 days.'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ borderTop: '2px solid #000', padding: '10px 0', fontSize: '18px', fontWeight: '900' }}>
                        <span style={{ fontSize: '12px' }}>Total Amount:</span> {formatCurrency(data.grandTotal)}
                    </div>
                    <div style={{ marginTop: '40px' }}>
                        <div style={{ fontSize: '10px', fontWeight: '900' }}>FOR {data.seller.companyName}</div>
                        <div style={{ marginTop: '40px', fontSize: '10px' }}>Authorized Signatory</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillOfSupplyTemplate;
