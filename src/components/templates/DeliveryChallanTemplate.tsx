import React from 'react';
import type { InvoiceData } from '../../types';
import { DOCUMENT_CONFIGS } from '../../data/documentTypes';

const DeliveryChallanTemplate: React.FC<{ data: InvoiceData }> = ({ data }) => {
    const config = DOCUMENT_CONFIGS[data.documentType as keyof typeof DOCUMENT_CONFIGS];
    const themeColor = config?.color || '#475569';

    return (
        <div style={{
            fontFamily: "'Inter', sans-serif",
            padding: '40px',
            color: '#1e293b',
            fontSize: '12px',
            lineHeight: '1.4',
            backgroundColor: 'white',
            border: `5px solid ${themeColor}`
        }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '900', color: themeColor, letterSpacing: '2px' }}>DELIVERY CHALLAN</h1>
                <div style={{ fontSize: '14px', color: '#64748b', fontWeight: 'bold' }}>(Generated in Triplicate)</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px', marginBottom: '30px' }}>
                <div>
                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold' }}>FROM:</div>
                    <div style={{ fontWeight: '800', fontSize: '18px' }}>{data.seller.companyName}</div>
                    <div style={{ fontSize: '12px' }}>
                        {data.seller.address.line1}, {data.seller.address.city}<br />
                        Phone: {data.seller.phone}
                    </div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                            <div style={{ fontSize: '9px', color: '#64748b' }}>CHALLAN NO:</div>
                            <div style={{ fontWeight: 'bold' }}>{data.documentNumber}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '9px', color: '#64748b' }}>DATE:</div>
                            <div style={{ fontWeight: 'bold' }}>{data.date}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '9px', color: '#64748b' }}>VEHICLE NO:</div>
                            <div style={{ fontWeight: 'bold' }}>{data.transportDetails?.vehicleNo || 'N/A'}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '9px', color: '#64748b' }}>DISPATCHED VIA:</div>
                            <div style={{ fontWeight: 'bold' }}>{data.transportDetails?.mode || 'Road'}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold' }}>DELIVER TO:</div>
                <div style={{ fontWeight: '800', fontSize: '16px' }}>{data.buyer.companyName}</div>
                <div style={{ fontSize: '13px' }}>
                    {data.buyer.address.line1}, {data.buyer.address.city}, {data.buyer.address.state}
                </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
                <thead>
                    <tr style={{ borderBottom: `2px solid ${themeColor}` }}>
                        <th style={{ padding: '12px', textAlign: 'left', width: '50px' }}>SR.</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>DESCRIPTION OF GOODS</th>
                        <th style={{ padding: '12px', textAlign: 'center', width: '100px' }}>QUANTITY</th>
                        <th style={{ padding: '12px', textAlign: 'center', width: '100px' }}>UNIT</th>
                        <th style={{ padding: '12px', textAlign: 'left', width: '150px' }}>REMARKS</th>
                    </tr>
                </thead>
                <tbody>
                    {data.items.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <td style={{ padding: '12px' }}>{idx + 1}</td>
                            <td style={{ padding: '12px', fontWeight: 'bold' }}>{item.name}</td>
                            <td style={{ padding: '12px', textAlign: 'center', fontSize: '16px', fontWeight: '900' }}>{item.quantity}</td>
                            <td style={{ padding: '12px', textAlign: 'center' }}>{item.unit}</td>
                            <td style={{ padding: '12px', color: '#64748b' }}>-</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', marginTop: '60px' }}>
                <div style={{ border: '2px dashed #cbd5e1', padding: '20px', textAlign: 'center', borderRadius: '8px' }}>
                    <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '40px' }}>RECEIVER'S SEAL & SIGNATURE</div>
                    <div style={{ fontSize: '9px' }}>RECEIVED IN GOOD CONDITION</div>
                </div>
                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                    <div style={{ fontSize: '12px', fontWeight: 'bold' }}>FOR {data.seller.companyName}</div>
                    <div style={{ marginTop: '40px', borderTop: '1px solid #000', paddingTop: '5px' }}>
                        AUTHORIZED SIGNATORY
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '40px', textAlign: 'center', fontSize: '10px', color: '#94a3b8', fontStyle: 'italic' }}>
                Terms: Goods once dispatched are at the risk of the purchaser.
            </div>
        </div>
    );
};

export default DeliveryChallanTemplate;
