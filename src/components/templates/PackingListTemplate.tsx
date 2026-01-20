import React from 'react';
import type { InvoiceData } from '../../types';
import { DOCUMENT_CONFIGS } from '../../data/documentTypes';

const PackingListTemplate: React.FC<{ data: InvoiceData }> = ({ data }) => {
    const config = DOCUMENT_CONFIGS[data.documentType as keyof typeof DOCUMENT_CONFIGS];
    const themeColor = config?.color || '#374151';

    return (
        <div style={{
            fontFamily: "'Inter', sans-serif",
            padding: '30px',
            color: '#1e293b',
            fontSize: '11px',
            lineHeight: '1.4',
            backgroundColor: 'white'
        }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `3px solid ${themeColor}`, paddingBottom: '15px', marginBottom: '20px' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '900', color: themeColor }}>PACKING LIST</h1>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '5px' }}>#{data.documentNumber}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    {data.seller.logoUrl && <img src={data.seller.logoUrl} alt="Logo" style={{ maxHeight: '50px', marginBottom: '5px' }} />}
                    <div style={{ fontWeight: '800' }}>{data.seller.companyName}</div>
                    <div style={{ fontSize: '10px' }}>{data.seller.address.city}, {data.seller.address.state}</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div style={{ border: '1px solid #e2e8f0', padding: '10px' }}>
                    <div style={{ fontWeight: 'bold', color: themeColor, marginBottom: '5px', borderBottom: '1px solid #eee' }}>CONSIGNEE / SHIP TO:</div>
                    <div style={{ fontWeight: 'bold' }}>{data.consignee?.companyName || data.buyer.companyName}</div>
                    <div>{(data.consignee?.address || data.buyer.address).line1}</div>
                    <div>{(data.consignee?.address || data.buyer.address).city}, {(data.consignee?.address || data.buyer.address).state}</div>
                    <div>Phone: {data.consignee?.phone || data.buyer.phone}</div>
                </div>
                <div style={{ border: '1px solid #e2e8f0', padding: '10px' }}>
                    <div style={{ fontWeight: 'bold', color: themeColor, marginBottom: '5px', borderBottom: '1px solid #eee' }}>SHIPMENT DETAILS:</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '5px' }}>
                        <span>Date:</span> <span style={{ fontWeight: 'bold' }}>{data.date}</span>
                        <span>Mode:</span> <span style={{ fontWeight: 'bold' }}>{data.transportDetails?.mode || 'N/A'}</span>
                        <span>Vehicle No:</span> <span style={{ fontWeight: 'bold' }}>{data.transportDetails?.vehicleNo || 'N/A'}</span>
                        <span>Invoice Ref:</span> <span style={{ fontWeight: 'bold' }}>{data.buyerOrderNo || 'N/A'}</span>
                    </div>
                </div>
            </div>

            {/* Packing Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead style={{ backgroundColor: '#f8fafc' }}>
                    <tr>
                        <th style={{ padding: '8px', border: '1px solid #cbd5e1', textAlign: 'center', width: '30px' }}>SR.</th>
                        <th style={{ padding: '8px', border: '1px solid #cbd5e1', textAlign: 'left' }}>DESCRIPTION OF GOODS</th>
                        <th style={{ padding: '8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>UNIT</th>
                        <th style={{ padding: '8px', border: '1px solid #cbd5e1', textAlign: 'right' }}>QTY</th>
                        <th style={{ padding: '8px', border: '1px solid #cbd5e1', textAlign: 'right' }}>PKGS</th>
                        <th style={{ padding: '8px', border: '1px solid #cbd5e1', textAlign: 'right' }}>NET WT.</th>
                        <th style={{ padding: '8px', border: '1px solid #cbd5e1', textAlign: 'right' }}>GROSS WT.</th>
                    </tr>
                </thead>
                <tbody>
                    {data.items.map((item, idx) => (
                        <tr key={idx}>
                            <td style={{ padding: '8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>{idx + 1}</td>
                            <td style={{ padding: '8px', border: '1px solid #cbd5e1' }}>
                                <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                                {item.description && <div style={{ fontSize: '9px', color: '#64748b' }}>{item.description}</div>}
                            </td>
                            <td style={{ padding: '8px', border: '1px solid #cbd5e1', textAlign: 'center' }}>{item.unit}</td>
                            <td style={{ padding: '8px', border: '1px solid #cbd5e1', textAlign: 'right', fontWeight: 'bold' }}>{item.quantity}</td>
                            <td style={{ padding: '8px', border: '1px solid #cbd5e1', textAlign: 'right' }}>-</td>
                            <td style={{ padding: '8px', border: '1px solid #cbd5e1', textAlign: 'right' }}>-</td>
                            <td style={{ padding: '8px', border: '1px solid #cbd5e1', textAlign: 'right' }}>-</td>
                        </tr>
                    ))}
                    {/* Placeholder for totals */}
                    <tr style={{ backgroundColor: '#f8fafc', fontWeight: 'bold' }}>
                        <td colSpan={3} style={{ padding: '8px', border: '1px solid #cbd5e1', textAlign: 'right' }}>TOTAL</td>
                        <td style={{ padding: '8px', border: '1px solid #cbd5e1', textAlign: 'right' }}>{data.items.reduce((sum, i) => sum + i.quantity, 0)}</td>
                        <td style={{ padding: '8px', border: '1px solid #cbd5e1', textAlign: 'right' }}>-</td>
                        <td style={{ padding: '8px', border: '1px solid #cbd5e1', textAlign: 'right' }}>-</td>
                        <td style={{ padding: '8px', border: '1px solid #cbd5e1', textAlign: 'right' }}>-</td>
                    </tr>
                </tbody>
            </table>

            {/* Meta */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '30px' }}>
                <div>
                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>DECLARATION:</div>
                    <div style={{ fontSize: '9px', color: '#64748b' }}>
                        We declare that this packing list shows the actual content of the goods described and that all particulars are true and correct.
                    </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ borderTop: '1px solid #000', width: '200px', margin: '40px auto 5px auto' }}></div>
                    <div style={{ fontWeight: 'bold' }}>AUTHORIZED SIGNATORY</div>
                    <div>{data.seller.companyName}</div>
                </div>
            </div>
        </div>
    );
};

export default PackingListTemplate;
