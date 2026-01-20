import React from 'react';
import type { InvoiceData } from '../../types';
import { DOCUMENT_CONFIGS } from '../../data/documentTypes';

const WorkOrderTemplate: React.FC<{ data: InvoiceData }> = ({ data }) => {
    const config = DOCUMENT_CONFIGS[data.documentType as keyof typeof DOCUMENT_CONFIGS];
    const themeColor = config?.color || '#c2410c';

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
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                <div>
                    {data.seller.logoUrl && <img src={data.seller.logoUrl} alt="Logo" style={{ maxHeight: '60px', marginBottom: '10px' }} />}
                    <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '900', color: themeColor, letterSpacing: '1px' }}>WORK ORDER</h1>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '800', fontSize: '16px' }}>{data.seller.companyName}</div>
                    <div>{data.seller.address.line1}</div>
                    <div>{data.seller.address.city}, {data.seller.address.state} - {data.seller.address.zip}</div>
                    <div>{data.seller.email} | {data.seller.phone}</div>
                </div>
            </div>

            {/* Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                    <div style={{ backgroundColor: '#f8fafc', padding: '8px 12px', fontWeight: 'bold', borderBottom: '1px solid #e2e8f0', color: themeColor }}>CUSTOMER INFORMATION</div>
                    <div style={{ padding: '12px' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{data.buyer.companyName}</div>
                        <div>{data.buyer.address.line1}</div>
                        <div>{data.buyer.address.city}, {data.buyer.address.state}</div>
                        <div>Phone: {data.buyer.phone || 'N/A'}</div>
                    </div>
                </div>
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                    <div style={{ backgroundColor: '#f8fafc', padding: '8px 12px', fontWeight: 'bold', borderBottom: '1px solid #e2e8f0', color: themeColor }}>WORK DETAILS</div>
                    <div style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ color: '#64748b' }}>Order Number:</span>
                            <span style={{ fontWeight: 'bold' }}>{data.documentNumber}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ color: '#64748b' }}>Order Date:</span>
                            <span style={{ fontWeight: 'bold' }}>{data.date}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ color: '#64748b' }}>Start Date:</span>
                            <span style={{ fontWeight: 'bold' }}>{data.date}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#64748b' }}>Completion Due:</span>
                            <span style={{ fontWeight: 'bold' }}>{data.dueDate || 'TBD'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Work Location */}
            {(data.consignee || data.buyer.shippingAddress) && (
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', marginBottom: '30px' }}>
                    <div style={{ backgroundColor: '#f8fafc', padding: '8px 12px', fontWeight: 'bold', borderBottom: '1px solid #e2e8f0' }}>WORK LOCATION / SITE ADDRESS</div>
                    <div style={{ padding: '12px' }}>
                        <div>{(data.consignee?.address || data.buyer.shippingAddress)?.line1}</div>
                        <div>{(data.consignee?.address || data.buyer.shippingAddress)?.city}, {(data.consignee?.address || data.buyer.shippingAddress)?.state}</div>
                    </div>
                </div>
            )}

            {/* Items Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
                <thead>
                    <tr style={{ backgroundColor: themeColor, color: 'white' }}>
                        <th style={{ padding: '12px', textAlign: 'left', border: '1px solid white' }}>TASK / ITEM DESCRIPTION</th>
                        <th style={{ padding: '12px', textAlign: 'center', border: '1px solid white', width: '80px' }}>QTY</th>
                        <th style={{ padding: '12px', textAlign: 'right', border: '1px solid white', width: '120px' }}>RATE</th>
                        <th style={{ padding: '12px', textAlign: 'right', border: '1px solid white', width: '120px' }}>TOTAL</th>
                    </tr>
                </thead>
                <tbody>
                    {data.items.map((item, idx) => (
                        <tr key={idx}>
                            <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>
                                <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                                {item.description && <div style={{ fontSize: '11px', color: '#64748b' }}>{item.description}</div>}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'center', border: '1px solid #e2e8f0' }}>{item.quantity} {item.unit}</td>
                            <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #e2e8f0' }}>{formatCurrency(item.unitPrice)}</td>
                            <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #e2e8f0', fontWeight: 'bold' }}>{formatCurrency(item.totalAmount)}</td>
                        </tr>
                    ))}
                    {/* Placeholder empty rows to make it look like a form */}
                    {[...Array(Math.max(0, 5 - data.items.length))].map((_, i) => (
                        <tr key={`empty-${i}`}>
                            <td style={{ padding: '12px', border: '1px solid #e2e8f0', height: '30px' }}></td>
                            <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}></td>
                            <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}></td>
                            <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}></td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={3} style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', border: '1px solid #e2e8f0' }}>TOTAL WORK ORDER VALUE</td>
                        <td style={{ padding: '12px', textAlign: 'right', fontWeight: '900', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '14px' }}>{formatCurrency(data.grandTotal)}</td>
                    </tr>
                </tfoot>
            </table>

            {/* Notes & Approval */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px' }}>
                <div>
                    <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>SPECIAL INSTRUCTIONS / NOTES:</div>
                    <div style={{ minHeight: '80px', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '10px', fontSize: '11px' }}>
                        {data.notes || 'Please ensure work is completed as per specifications. Any changes must be approved in writing.'}
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '40px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ borderBottom: '1px solid #000', marginBottom: '5px' }}></div>
                        <div style={{ fontSize: '10px', fontWeight: 'bold' }}>CUSTOMER APPROVAL</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ borderBottom: '1px solid #000', marginBottom: '5px' }}></div>
                        <div style={{ fontSize: '10px', fontWeight: 'bold' }}>AUTHORIZED SIGNATORY</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkOrderTemplate;
