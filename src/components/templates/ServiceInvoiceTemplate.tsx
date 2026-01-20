import React from 'react';
import type { InvoiceData } from '../../types';
import { QRCodeSVG } from 'qrcode.react';

const ServiceInvoiceTemplate: React.FC<{ data: InvoiceData }> = ({ data }) => {
    const themeColor = '#7c3aed'; // Purple for Services

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: data.currency || 'INR',
            minimumFractionDigits: 2
        }).format(amount);
    };

    return (
        <div style={{
            fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            color: '#1e293b',
            fontSize: '11px',
            backgroundColor: 'white',
            border: `10px solid ${themeColor}10`,
            padding: '20px'
        }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    {data.seller.logoUrl && <img src={data.seller.logoUrl} alt="Logo" style={{ maxHeight: '80px', borderRadius: '4px' }} />}
                    <div>
                        <h1 style={{ margin: 0, color: themeColor, fontSize: '28px', fontWeight: 'bold' }}>SERVICE INVOICE</h1>
                        <div style={{ letterSpacing: '2px', color: '#64748b', fontSize: '10px' }}>{data.documentNumber}</div>
                    </div>
                </div>
                <div style={{ textAlign: 'right', borderRight: `4px solid ${themeColor}`, paddingRight: '15px' }}>
                    <div style={{ fontWeight: '800', fontSize: '16px' }}>{data.seller.companyName}</div>
                    <div>{data.seller.address.line1}</div>
                    <div>{data.seller.address.city}, {data.seller.address.state}</div>
                    <div>Contact: {data.seller.phone}</div>
                </div>
            </div>

            {/* Client Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
                <div>
                    <div style={{ color: themeColor, fontWeight: 'bold', fontSize: '9px', marginBottom: '8px' }}>CLIENT DETAILS</div>
                    <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{data.buyer.companyName}</div>
                    <div>{data.buyer.address.line1}</div>
                    <div>{data.buyer.address.city}, {data.buyer.address.state}</div>
                    {data.buyer.gstin && <div style={{ marginTop: '5px', fontWeight: 'bold' }}>GST: {data.buyer.gstin}</div>}
                </div>
                <div>
                    <div style={{ color: themeColor, fontWeight: 'bold', fontSize: '9px', marginBottom: '8px' }}>CONTRACT DETAILS</div>
                    <div>PO Ref: {data.buyerOrderNo || 'N/A'}</div>
                    <div>PO Date: {data.buyerOrderDate || 'N/A'}</div>
                    <div>Supply Place: {data.buyer.placeOfSupply || 'Local'}</div>
                </div>
                <div>
                    <div style={{ color: themeColor, fontWeight: 'bold', fontSize: '9px', marginBottom: '8px' }}>INVOICE SUMMARY</div>
                    <table style={{ width: '100%' }}>
                        <tr><td>Date:</td><td style={{ textAlign: 'right', fontWeight: 'bold' }}>{data.date}</td></tr>
                        <tr><td>Due Date:</td><td style={{ textAlign: 'right', fontWeight: 'bold' }}>{data.dueDate || 'N/A'}</td></tr>
                        <tr><td>Currency:</td><td style={{ textAlign: 'right', fontWeight: 'bold' }}>{data.currency}</td></tr>
                    </table>
                </div>
            </div>

            {/* Services Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
                <thead style={{ borderBottom: `2px solid ${themeColor}` }}>
                    <tr>
                        <th style={{ padding: '12px 10px', textAlign: 'left', color: themeColor }}>DESCRIPTION OF SERVICE</th>
                        <th style={{ padding: '12px 10px', textAlign: 'center', width: '80px', color: themeColor }}>SAC CODE</th>
                        <th style={{ padding: '12px 10px', textAlign: 'right', width: '150px', color: themeColor }}>SERVICE FEE</th>
                    </tr>
                </thead>
                <tbody>
                    {data.items.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '15px 10px' }}>
                                <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{item.name}</div>
                                {item.description && <div style={{ color: '#64748b', marginTop: '4px' }}>{item.description}</div>}
                            </td>
                            <td style={{ padding: '15px 10px', textAlign: 'center' }}>{item.hsnSacCode || '-'}</td>
                            <td style={{ padding: '15px 10px', textAlign: 'right', fontWeight: 'bold' }}>{formatCurrency(item.totalAmount)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Footer with unique layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '50px' }}>
                <div>
                    <div style={{ backgroundColor: '#f9fafb', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                        <div style={{ color: themeColor, fontWeight: 'bold', fontSize: '9px', marginBottom: '5px' }}>PAYMENT INSTRUCTIONS</div>
                        <div style={{ fontSize: '10px' }}>
                            Account: {data.seller.bankDetails?.[0]?.accountName}<br />
                            Bank: {data.seller.bankDetails?.[0]?.bankName}<br />
                            IFSC: {data.seller.bankDetails?.[0]?.ifscCode}<br />
                            A/c No: {data.seller.bankDetails?.[0]?.accountNumber}
                        </div>
                    </div>
                </div>

                <div>
                    <div style={{ border: `1px solid ${themeColor}30`, borderRadius: '8px', overflow: 'hidden' }}>
                        <div style={{ padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Consultancy Fee:</span>
                            <span>{formatCurrency(data.totalTaxable)}</span>
                        </div>
                        <div style={{ padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
                            <span>GST Total:</span>
                            <span>{formatCurrency(data.totalIGST || 0)}</span>
                        </div>
                        <div style={{ padding: '15px 10px', display: 'flex', justifyContent: 'space-between', backgroundColor: themeColor, color: 'white' }}>
                            <span style={{ fontWeight: 'bold' }}>FINAL TOTAL:</span>
                            <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{formatCurrency(data.grandTotal)}</span>
                        </div>
                    </div>

                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                        {data.seller.qrCodeUrl ? (
                            <img src={data.seller.qrCodeUrl} alt="QR" style={{ height: '80px' }} />
                        ) : data.seller.qrCodeValue ? (
                            <QRCodeSVG value={data.seller.qrCodeValue} size={80} />
                        ) : null}
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '60px', textAlign: 'center', color: '#cbd5e1', fontSize: '8px' }}>
                Thank you for your business. For any queries regarding this invoice, please contact us at {data.seller.email}
            </div>
        </div>
    );
};

export default ServiceInvoiceTemplate;
