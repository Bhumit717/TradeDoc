import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import type { InvoiceData } from '../../types';

interface FormProps {
    data: InvoiceData;
    onChange: (data: InvoiceData) => void;
}

const QuotationForm: React.FC<FormProps> = ({ data, onChange }) => {
    const themeColor = '#10b981'; // Green for Quotation

    const update = (field: keyof InvoiceData | string, value: any) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#f0fdf4' }}>
            <Tabs.Root defaultValue="basic" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Tabs.List style={{ display: 'flex', borderBottom: '1px solid #bcf0da', backgroundColor: 'white' }}>
                    <Tabs.Trigger value="basic" className="q-tab">General</Tabs.Trigger>
                    <Tabs.Trigger value="buyer" className="q-tab">Prospect</Tabs.Trigger>
                    <Tabs.Trigger value="scope" className="q-tab">Products</Tabs.Trigger>
                </Tabs.List>

                <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                    <Tabs.Content value="basic">
                        <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '12px', border: '1px solid #bcf0da' }}>
                            <label style={{ fontSize: '10px', color: themeColor, fontWeight: '900' }}>QUOTE REFERENCE</label>
                            <input
                                style={{ width: '100%', padding: '12px', border: `1px solid ${themeColor}40`, borderRadius: '8px', marginTop: '5px' }}
                                value={data.documentNumber} onChange={e => update('documentNumber', e.target.value)}
                            />

                            <div style={{ marginTop: '20px' }}>
                                <label style={{ fontSize: '10px', color: themeColor, fontWeight: '900' }}>VALID UNTIL</label>
                                <input type="date"
                                    style={{ width: '100%', padding: '12px', border: `1px solid ${themeColor}40`, borderRadius: '8px', marginTop: '5px' }}
                                    value={data.dueDate || ''} onChange={e => update('dueDate', e.target.value)}
                                />
                            </div>
                        </div>
                    </Tabs.Content>

                    <Tabs.Content value="buyer">
                        <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '12px', border: '1px solid #bcf0da' }}>
                            <h4 style={{ color: themeColor, margin: '0 0 10px 0' }}>Client Information</h4>
                            <input
                                placeholder="Prospect Company Name"
                                style={{ width: '100%', padding: '12px', border: `1px solid ${themeColor}40`, borderRadius: '8px' }}
                                value={data.buyer.companyName}
                                onChange={e => onChange({ ...data, buyer: { ...data.buyer, companyName: e.target.value } })}
                            />
                            <textarea
                                placeholder="Delivery/Billing Address"
                                style={{ width: '100%', padding: '12px', border: `1px solid ${themeColor}40`, borderRadius: '8px', marginTop: '10px' }}
                                rows={4}
                                value={data.buyer.address.line1}
                                onChange={e => onChange({ ...data, buyer: { ...data.buyer, address: { ...data.buyer.address, line1: e.target.value } } })}
                            />
                        </div>
                    </Tabs.Content>

                    <Tabs.Content value="scope">
                        {data.items.map((item, idx) => (
                            <div key={idx} style={{ padding: '15px', backgroundColor: 'white', border: `1px solid ${themeColor}20`, borderRadius: '8px', marginBottom: '10px', borderLeft: `6px solid ${themeColor}` }}>
                                <input
                                    placeholder="Product/Service Name"
                                    style={{ width: '100%', padding: '8px', border: '1px solid #eee', borderRadius: '4px', fontWeight: 'bold' }}
                                    value={item.name}
                                    onChange={e => {
                                        const newItems = [...data.items];
                                        newItems[idx].name = e.target.value;
                                        onChange({ ...data, items: newItems });
                                    }}
                                />
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                                    <input type="number" placeholder="Qty" style={{ padding: '8px', border: '1px solid #eee' }} value={item.quantity} onChange={e => {
                                        const newItems = [...data.items];
                                        newItems[idx].quantity = parseFloat(e.target.value) || 0;
                                        onChange({ ...data, items: newItems });
                                    }} />
                                    <input type="number" placeholder="Rate" style={{ padding: '8px', border: '1px solid #eee' }} value={item.unitPrice} onChange={e => {
                                        const newItems = [...data.items];
                                        newItems[idx].unitPrice = parseFloat(e.target.value) || 0;
                                        onChange({ ...data, items: newItems });
                                    }} />
                                </div>
                            </div>
                        ))}
                        <button
                            style={{ width: '100%', padding: '12px', backgroundColor: themeColor, color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                            onClick={() => update('items', [...data.items, { id: Date.now().toString(), name: '', quantity: 1, unitPrice: 0, taxRate: 18, taxableValue: 0, taxAmount: 0, totalAmount: 0, unit: 'Nos' }])}
                        >
                            + Add Item to Quote
                        </button>
                    </Tabs.Content>
                </div>
            </Tabs.Root>

            <style>{`
                .q-tab { flex: 1; padding: 15px; border: none; background: none; font-weight: bold; font-size: 12px; color: #64748b; cursor: pointer; }
                .q-tab[data-state='active'] { color: ${themeColor}; border-bottom: 3px solid ${themeColor}; }
            `}</style>
        </div>
    );
};

export default QuotationForm;
