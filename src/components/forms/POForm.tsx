import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { Package, Truck, UserCheck, CreditCard } from 'lucide-react';
import type { InvoiceData } from '../../types';

interface FormProps {
    data: InvoiceData;
    onChange: (data: InvoiceData) => void;
}

const POForm: React.FC<FormProps> = ({ data, onChange }) => {
    const themeColor = '#2563eb'; // Blue for PO

    const update = (field: keyof InvoiceData | string, value: any) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#f1f5f9' }}>
            <Tabs.Root defaultValue="header" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Tabs.List style={{ display: 'flex', borderBottom: '1px solid #cbd5e1', backgroundColor: '#fff' }}>
                    <Tabs.Trigger value="header" className="p-tab"><CreditCard size={14} /> ID</Tabs.Trigger>
                    <Tabs.Trigger value="supplier" className="p-tab"><UserCheck size={14} /> Vendor</Tabs.Trigger>
                    <Tabs.Trigger value="items" className="p-tab"><Package size={14} /> Items</Tabs.Trigger>
                    <Tabs.Trigger value="shipping" className="p-tab"><Truck size={14} /> Ship</Tabs.Trigger>
                </Tabs.List>

                <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                    <Tabs.Content value="header">
                        <div style={{ background: '#fff', padding: '20px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                            <label style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b' }}>PURCHASE ORDER #</label>
                            <input
                                style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', marginTop: '5px' }}
                                value={data.documentNumber} onChange={e => update('documentNumber', e.target.value)}
                            />

                            <div style={{ marginTop: '20px' }}>
                                <label style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b' }}>ORDER DATE</label>
                                <input type="date" style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', marginTop: '5px' }}
                                    value={data.date} onChange={e => update('date', e.target.value)}
                                />
                            </div>
                        </div>
                    </Tabs.Content>

                    <Tabs.Content value="supplier">
                        <div style={{ background: '#fff', padding: '20px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                            <label style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b' }}>SUPPLIER NAME</label>
                            <input
                                style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', marginTop: '5px' }}
                                value={data.buyer.companyName}
                                onChange={e => onChange({ ...data, buyer: { ...data.buyer, companyName: e.target.value } })}
                            />

                            <label style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b', display: 'block', marginTop: '15px' }}>SUPPLIER ADDRESS</label>
                            <textarea
                                style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', marginTop: '5px' }}
                                rows={3}
                                value={data.buyer.address.line1}
                                onChange={e => onChange({ ...data, buyer: { ...data.buyer, address: { ...data.buyer.address, line1: e.target.value } } })}
                            />
                        </div>
                    </Tabs.Content>

                    <Tabs.Content value="items">
                        {data.items.map((item, idx) => (
                            <div key={idx} style={{ background: '#fff', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '4px', marginBottom: '10px' }}>
                                <input style={{ width: '100%', padding: '8px', border: '1px solid #eee', fontWeight: 'bold' }}
                                    placeholder="Part Number / Description"
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
                                    <input type="number" placeholder="Unit Cost" style={{ padding: '8px', border: '1px solid #eee' }} value={item.unitPrice} onChange={e => {
                                        const newItems = [...data.items];
                                        newItems[idx].unitPrice = parseFloat(e.target.value) || 0;
                                        onChange({ ...data, items: newItems });
                                    }} />
                                </div>
                            </div>
                        ))}
                        <button
                            style={{ width: '100%', padding: '10px', background: themeColor, color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
                            onClick={() => update('items', [...data.items, { id: Date.now().toString(), name: '', quantity: 1, unitPrice: 0, taxRate: 18, taxableValue: 0, taxAmount: 0, totalAmount: 0, unit: 'Nos' }])}
                        >
                            + Add Line Item
                        </button>
                    </Tabs.Content>

                    <Tabs.Content value="shipping">
                        <div style={{ background: '#fff', padding: '20px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                            <label style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b' }}>SHIPPING INSTRUCTIONS</label>
                            <textarea
                                style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', marginTop: '5px' }}
                                rows={5}
                                value={data.termsAndConditions || ''}
                                onChange={e => update('termsAndConditions', e.target.value)}
                                placeholder="Enter delivery terms, packaging specs etc."
                            />
                        </div>
                    </Tabs.Content>
                </div>
            </Tabs.Root>

            <style>{`
                .p-tab { flex: 1; padding: 12px; border: none; background: none; font-weight: 800; font-size: 10px; color: #64748b; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 5px; }
                .p-tab[data-state='active'] { color: ${themeColor}; border-bottom: 3px solid ${themeColor}; background: #f8fafc; }
            `}</style>
        </div>
    );
};

export default POForm;
