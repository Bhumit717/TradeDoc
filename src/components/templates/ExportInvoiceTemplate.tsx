import React from 'react';
import type { InvoiceData } from '../../types';

const ExportInvoiceTemplate: React.FC<{ data: InvoiceData }> = ({ data }) => {

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: data.currency || 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    };

    return (
        <div style={{
            fontFamily: "'Inter', sans-serif",
            padding: '20px',
            color: '#1e293b',
            fontSize: '10px',
            lineHeight: '1.2',
            backgroundColor: 'white',
            border: '1px solid #000'
        }}>
            {/* Main Header Matrix */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', borderBottom: '1px solid #000' }}>
                <div style={{ padding: '10px', borderRight: '1px solid #000' }}>
                    <div style={{ fontSize: '8px', color: '#64748b', fontWeight: 'bold' }}>EXPORTER:</div>
                    <div style={{ fontWeight: '800', fontSize: '14px', marginBottom: '5px' }}>{data.seller.companyName}</div>
                    <div style={{ fontSize: '10px' }}>
                        {data.seller.address.line1}, {data.seller.address.line2}<br />
                        {data.seller.address.city}, {data.seller.address.state} - {data.seller.address.zip}<br />
                        {data.seller.iec && <strong>IEC: {data.seller.iec}</strong>}<br />
                        {data.seller.gstin && <strong>GSTIN: {data.seller.gstin}</strong>}
                    </div>
                </div>
                <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                        <div style={{ padding: '8px', borderBottom: '1px solid #000', borderRight: '1px solid #000' }}>
                            <div style={{ fontSize: '8px', color: '#64748b' }}>Invoice No. & Date</div>
                            <div style={{ fontWeight: 'bold' }}>{data.documentNumber}</div>
                            <div>{data.date}</div>
                        </div>
                        <div style={{ padding: '8px', borderBottom: '1px solid #000' }}>
                            <div style={{ fontSize: '8px', color: '#64748b' }}>Exporter's Ref</div>
                            <div style={{ fontWeight: 'bold' }}>{data.seller.iec || 'N/A'}</div>
                        </div>
                    </div>
                    <div style={{ padding: '8px' }}>
                        <div style={{ fontSize: '8px', color: '#64748b' }}>Buyer's Order No. & Date</div>
                        <div style={{ fontWeight: 'bold' }}>{data.buyerOrderNo || 'N/A'}</div>
                        <div>{data.buyerOrderDate || ''}</div>
                    </div>
                </div>
            </div>

            {/* Consignee & International Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', borderBottom: '1px solid #000' }}>
                <div style={{ padding: '10px', borderRight: '1px solid #000' }}>
                    <div style={{ fontSize: '8px', color: '#64748b', fontWeight: 'bold' }}>CONSIGNEE:</div>
                    <div style={{ fontWeight: '800', fontSize: '12px' }}>{data.buyer.companyName}</div>
                    <div>{data.buyer.address.line1}</div>
                    <div>{data.buyer.address.city}, {data.buyer.address.country}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                    <div style={{ padding: '8px', borderRight: '1px solid #000', borderBottom: '1px solid #000' }}>
                        <div style={{ fontSize: '8px', color: '#64748b' }}>Country of Origin</div>
                        <div style={{ fontWeight: 'bold' }}>{data.exportDetails?.countryOfOrigin || 'INDIA'}</div>
                    </div>
                    <div style={{ padding: '8px', borderBottom: '1px solid #000' }}>
                        <div style={{ fontSize: '8px', color: '#64748b' }}>Country of Destination</div>
                        <div style={{ fontWeight: 'bold' }}>{data.exportDetails?.countryOfDestination || data.buyer.address.country}</div>
                    </div>
                    <div style={{ padding: '8px', borderRight: '1px solid #000' }}>
                        <div style={{ fontSize: '8px', color: '#64748b' }}>Terms of Delivery</div>
                        <div style={{ fontWeight: 'bold' }}>{data.termsAndConditions?.split('\n')[0] || 'CIF / FOB'}</div>
                    </div>
                    <div style={{ padding: '8px' }}>
                        <div style={{ fontSize: '8px', color: '#64748b' }}>Currency</div>
                        <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{data.currency}</div>
                    </div>
                </div>
            </div>

            {/* Vessel/Flight & Port Details (Unique to Export) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderBottom: '1px solid #000', backgroundColor: '#f9fafb' }}>
                <div style={{ padding: '8px', borderRight: '1px solid #000' }}>
                    <div style={{ fontSize: '7px', color: '#64748b' }}>Vessel/Flight No.</div>
                    <div style={{ fontWeight: 'bold' }}>{data.exportDetails?.vesselFlightNo || 'N/A'}</div>
                </div>
                <div style={{ padding: '8px', borderRight: '1px solid #000' }}>
                    <div style={{ fontSize: '7px', color: '#64748b' }}>Port of Loading</div>
                    <div style={{ fontWeight: 'bold' }}>{data.exportDetails?.portOfLoading || 'N/A'}</div>
                </div>
                <div style={{ padding: '8px', borderRight: '1px solid #000' }}>
                    <div style={{ fontSize: '7px', color: '#64748b' }}>Port of Discharge</div>
                    <div style={{ fontWeight: 'bold' }}>{data.exportDetails?.portOfDischarge || 'N/A'}</div>
                </div>
                <div style={{ padding: '8px' }}>
                    <div style={{ fontSize: '7px', color: '#64748b' }}>Final Destination</div>
                    <div style={{ fontWeight: 'bold' }}>{data.exportDetails?.countryOfDestination || 'N/A'}</div>
                </div>
            </div>

            {/* Items Matrix */}
            <table style={{ width: '100%', borderCollapse: 'collapse', borderBottom: '1px solid #000' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f3f4f6', fontSize: '9px' }}>
                        <th style={{ padding: '8px', borderRight: '1px solid #000', borderBottom: '1px solid #000', width: '30px' }}>Sr.</th>
                        <th style={{ padding: '8px', borderRight: '1px solid #000', borderBottom: '1px solid #000', textAlign: 'left' }}>Description of Goods</th>
                        <th style={{ padding: '8px', borderRight: '1px solid #000', borderBottom: '1px solid #000', width: '60px' }}>Quantity</th>
                        <th style={{ padding: '8px', borderRight: '1px solid #000', borderBottom: '1px solid #000', width: '80px' }}>Rate</th>
                        <th style={{ padding: '8px', borderBottom: '1px solid #000', width: '100px', textAlign: 'right' }}>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {data.items.map((item, idx) => (
                        <tr key={idx}>
                            <td style={{ padding: '8px', borderRight: '1px solid #000', textAlign: 'center' }}>{idx + 1}</td>
                            <td style={{ padding: '8px', borderRight: '1px solid #000' }}>
                                <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                                <div style={{ fontSize: '9px', color: '#4b5563' }}>{item.description}</div>
                                {item.hsnSacCode && <div style={{ fontSize: '8px' }}>HSN: {item.hsnSacCode}</div>}
                            </td>
                            <td style={{ padding: '8px', borderRight: '1px solid #000', textAlign: 'center' }}>{item.quantity} {item.unit}</td>
                            <td style={{ padding: '8px', borderRight: '1px solid #000', textAlign: 'right' }}>{formatCurrency(item.unitPrice)}</td>
                            <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>{formatCurrency(item.totalAmount)}</td>
                        </tr>
                    ))}
                    {/* Fill space */}
                    {[...Array(Math.max(0, 8 - data.items.length))].map((_, i) => (
                        <tr key={`fill-${i}`}>
                            <td style={{ height: '25px', borderRight: '1px solid #000' }}></td>
                            <td style={{ borderRight: '1px solid #000' }}></td>
                            <td style={{ borderRight: '1px solid #000' }}></td>
                            <td style={{ borderRight: '1px solid #000' }}></td>
                            <td></td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr style={{ borderTop: '1px solid #000', fontWeight: '900', fontSize: '11px' }}>
                        <td colSpan={2} style={{ padding: '10px', borderRight: '1px solid #000', textAlign: 'right' }}>TOTAL VALUE</td>
                        <td style={{ padding: '10px', borderRight: '1px solid #000', textAlign: 'center' }}>{data.items.reduce((sum, i) => sum + i.quantity, 0)}</td>
                        <td style={{ borderRight: '1px solid #000' }}></td>
                        <td style={{ padding: '10px', textAlign: 'right', backgroundColor: '#f9fafb' }}>{formatCurrency(data.grandTotal)}</td>
                    </tr>
                </tfoot>
            </table>

            {/* Bottom Footer Blocks */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr' }}>
                <div style={{ padding: '10px', borderRight: '1px solid #000' }}>
                    <div style={{ fontSize: '8px', fontWeight: 'bold', color: '#64748b' }}>Amount Chargeable (in words)</div>
                    <div style={{ fontWeight: 'bold', marginBottom: '15px' }}>{data.amountInWords || 'US Dollars Only'}</div>

                    <div style={{ fontSize: '8px', fontWeight: 'bold', color: '#64748b' }}>Declaration:</div>
                    <div style={{ fontSize: '8px', color: '#4b5563' }}>
                        We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.
                    </div>
                </div>
                <div style={{ padding: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', fontWeight: '800' }}>For {data.seller.companyName}</div>
                    <div style={{ marginTop: '40px' }}>
                        {data.seller.signatureUrl && <img src={data.seller.signatureUrl} style={{ height: '40px' }} />}
                    </div>
                    <div style={{ fontSize: '9px', fontWeight: 'bold', borderTop: '1px solid #000', display: 'inline-block', paddingTop: '4px', marginTop: '10px' }}>
                        Authorized Signatory
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExportInvoiceTemplate;
