import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import type { InvoiceData } from '../../types';

interface FormProps {
    data: InvoiceData;
    onChange: (data: InvoiceData) => void;
}

const TaxInvoiceForm: React.FC<FormProps> = ({ data, onChange }) => {
    const themeColor = '#1e293b'; // Slate/Dark Blue for Invoice

    const update = (field: keyof InvoiceData | string, value: any) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#f8fafc' }}>
            <Tabs.Root defaultValue="details" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Tabs.List style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', backgroundColor: 'white' }}>
                    <Tabs.Trigger value="details" className="tab-trigger">Details</Tabs.Trigger>
                    <Tabs.Trigger value="billing" className="tab-trigger">Billing</Tabs.Trigger>
                    <Tabs.Trigger value="items" className="tab-trigger">Line Items</Tabs.Trigger>
                    <Tabs.Trigger value="logistics" className="tab-trigger">Logistics</Tabs.Trigger>
                </Tabs.List>

                <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                    <Tabs.Content value="details">
                        <div className="section-box">
                            <label className="input-label">Invoice Number</label>
                            <input className="input-field" value={data.documentNumber} onChange={e => update('documentNumber', e.target.value)} />

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '15px' }}>
                                <div>
                                    <label className="input-label">Invoice Date</label>
                                    <input type="date" className="input-field" value={data.date} onChange={e => update('date', e.target.value)} />
                                </div>
                                <div>
                                    <label className="input-label">Due Date</label>
                                    <input type="date" className="input-field" value={data.dueDate || ''} onChange={e => update('dueDate', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </Tabs.Content>

                    <Tabs.Content value="billing">
                        <div className="section-box">
                            <h4 style={{ marginBottom: '10px', fontSize: '12px' }}>CUSTOMER DETAILS</h4>
                            <input className="input-field" placeholder="Customer Company Name" value={data.buyer.companyName}
                                onChange={e => onChange({ ...data, buyer: { ...data.buyer, companyName: e.target.value } })} />
                            <textarea className="input-field" placeholder="Full Address" style={{ marginTop: '10px' }} value={data.buyer.address.line1}
                                onChange={e => onChange({ ...data, buyer: { ...data.buyer, address: { ...data.buyer.address, line1: e.target.value } } })} />
                            <input className="input-field" placeholder="GSTIN" style={{ marginTop: '10px' }} value={data.buyer.gstin || ''}
                                onChange={e => onChange({ ...data, buyer: { ...data.buyer, gstin: e.target.value } })} />
                        </div>
                    </Tabs.Content>

                    <Tabs.Content value="items">
                        {data.items.map((item, idx) => (
                            <div key={idx} className="item-card" style={{ borderLeftColor: themeColor }}>
                                <input className="input-field" placeholder="Item Name" value={item.name} onChange={e => {
                                    const newItems = [...data.items];
                                    newItems[idx].name = e.target.value;
                                    onChange({ ...data, items: newItems });
                                }} />
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginTop: '10px' }}>
                                    <input type="number" className="input-field" placeholder="Qty" value={item.quantity} onChange={e => {
                                        const newItems = [...data.items];
                                        newItems[idx].quantity = parseFloat(e.target.value) || 0;
                                        onChange({ ...data, items: newItems });
                                    }} />
                                    <input type="number" className="input-field" placeholder="Rate" value={item.unitPrice} onChange={e => {
                                        const newItems = [...data.items];
                                        newItems[idx].unitPrice = parseFloat(e.target.value) || 0;
                                        onChange({ ...data, items: newItems });
                                    }} />
                                    <input type="number" className="input-field" placeholder="GST %" value={item.taxRate} onChange={e => {
                                        const newItems = [...data.items];
                                        newItems[idx].taxRate = parseFloat(e.target.value) || 0;
                                        onChange({ ...data, items: newItems });
                                    }} />
                                </div>
                            </div>
                        ))}
                        <button className="add-btn" onClick={() => update('items', [...data.items, { id: Date.now().toString(), name: '', quantity: 1, unitPrice: 0, taxRate: 18, taxableValue: 0, taxAmount: 0, totalAmount: 0, unit: 'Nos' }])}>
                            + Add Item
                        </button>
                    </Tabs.Content>
                </div>
            </Tabs.Root>

            <style>{`
                .tab-trigger { flex: 1; padding: 12px; font-size: 11px; font-weight: bold; text-transform: uppercase; cursor: pointer; border: none; background: white; border-bottom: 2px solid transparent; }
                .tab-trigger[data-state='active'] { border-bottom-color: ${themeColor}; color: ${themeColor}; }
                .section-box { padding: 15px; background: white; border-radius: 8px; border: 1px solid #e2e8f0; }
                .item-card { padding: 12px; background: white; border-radius: 6px; border: 1px solid #e2e8f0; border-left: 4px solid; margin-bottom: 10px; }
                .input-label { font-size: 10px; font-weight: bold; color: #64748b; margin-bottom: 4px; display: block; }
                .input-field { width: 100% !important; max-width: 100% !important; box-sizing: border-box !important; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 13px; }
                .add-btn { margin-top: 10px; padding: 10px; border: 2px dashed #cbd5e1; background: none; border-radius: 6px; width: 100%; cursor: pointer; font-weight: bold; }
            `}</style>
        </div>
    );
};

export default TaxInvoiceForm;
