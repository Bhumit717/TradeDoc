import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { Briefcase, User, Layers } from 'lucide-react';
import type { InvoiceData } from '../../types';

interface FormProps {
    data: InvoiceData;
    onChange: (data: InvoiceData) => void;
}

const ServiceInvoiceForm: React.FC<FormProps> = ({ data, onChange }) => {
    const themeColor = '#7c3aed'; // Purple for Services

    const update = (field: keyof InvoiceData | string, value: any) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#f5f3ff' }}>
            <Tabs.Root defaultValue="info" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Tabs.List style={{ display: 'flex', borderBottom: '1px solid #ddd6fe', backgroundColor: '#fff' }}>
                    <Tabs.Trigger value="info" className="s-tab"><Briefcase size={14} /> Brief</Tabs.Trigger>
                    <Tabs.Trigger value="contractor" className="s-tab"><User size={14} /> Client</Tabs.Trigger>
                    <Tabs.Trigger value="services" className="s-tab"><Layers size={14} /> Services</Tabs.Trigger>
                </Tabs.List>

                <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                    <Tabs.Content value="info">
                        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px #7c3aed10' }}>
                            <label style={{ fontSize: '10px', fontWeight: 'bold', color: themeColor }}>SERVICE INVOICE #</label>
                            <input
                                style={{ width: '100%', padding: '12px', border: `1px solid ${themeColor}20`, borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', marginTop: '5px', color: themeColor }}
                                value={data.documentNumber} onChange={e => update('documentNumber', e.target.value)}
                            />

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
                                <div>
                                    <label style={{ fontSize: '10px', fontWeight: 'bold' }}>ISSUE DATE</label>
                                    <input type="date" style={{ width: '100%', padding: '10px', border: '1px solid #eee', borderRadius: '8px' }}
                                        value={data.date} onChange={e => update('date', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '10px', fontWeight: 'bold' }}>PAYMENT BY</label>
                                    <input type="date" style={{ width: '100%', padding: '10px', border: '1px solid #eee', borderRadius: '8px' }}
                                        value={data.dueDate || ''} onChange={e => update('dueDate', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </Tabs.Content>

                    <Tabs.Content value="contractor">
                        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px #7c3aed10' }}>
                            <label style={{ fontSize: '10px', fontWeight: 'bold' }}>BILL TO CLIENT</label>
                            <input
                                style={{ width: '100%', padding: '12px', border: '1px solid #eee', borderRadius: '8px', marginTop: '5px' }}
                                value={data.buyer.companyName}
                                onChange={e => onChange({ ...data, buyer: { ...data.buyer, companyName: e.target.value } })}
                            />
                            <textarea
                                placeholder="Service Location / Billing Address"
                                style={{ width: '100%', padding: '12px', border: '1px solid #eee', borderRadius: '8px', marginTop: '10px' }}
                                rows={4}
                                value={data.buyer.address.line1}
                                onChange={e => onChange({ ...data, buyer: { ...data.buyer, address: { ...data.buyer.address, line1: e.target.value } } })}
                            />
                        </div>
                    </Tabs.Content>

                    <Tabs.Content value="services">
                        {data.items.map((item, idx) => (
                            <div key={idx} style={{ background: '#fff', padding: '15px', border: `1px solid ${themeColor}10`, borderRadius: '8px', marginBottom: '15px', borderTop: `4px solid ${themeColor}` }}>
                                <input style={{ width: '100%', padding: '10px', border: '1px solid #f3f4f6', fontWeight: 'bold', fontSize: '14px' }}
                                    placeholder="Description of Service Rendered"
                                    value={item.name}
                                    onChange={e => {
                                        const newItems = [...data.items];
                                        newItems[idx].name = e.target.value;
                                        onChange({ ...data, items: newItems });
                                    }}
                                />
                                <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                                    <input type="number" placeholder="Fee Amount" style={{ flex: 1, padding: '10px', border: '1px solid #f3f4f6' }} value={item.unitPrice} onChange={e => {
                                        const newItems = [...data.items];
                                        newItems[idx].unitPrice = parseFloat(e.target.value) || 0;
                                        newItems[idx].totalAmount = newItems[idx].unitPrice;
                                        onChange({ ...data, items: newItems });
                                    }} />
                                    <input placeholder="SAC Code" style={{ width: '100px', padding: '10px', border: '1px solid #f3f4f6' }} value={item.hsnSacCode || ''} onChange={e => {
                                        const newItems = [...data.items];
                                        newItems[idx].hsnSacCode = e.target.value;
                                        onChange({ ...data, items: newItems });
                                    }} />
                                </div>
                            </div>
                        ))}
                        <button
                            style={{ width: '100%', padding: '15px', background: themeColor, color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', boxShadow: `0 4px 15px ${themeColor}40` }}
                            onClick={() => update('items', [...data.items, { id: Date.now().toString(), name: '', quantity: 1, unitPrice: 0, taxRate: 18, taxableValue: 0, taxAmount: 0, totalAmount: 0, unit: 'Job' }])}
                        >
                            + Add Service Line
                        </button>
                    </Tabs.Content>
                </div>
            </Tabs.Root>

            <style>{`
                .s-tab { flex: 1; padding: 15px; border: none; background: none; font-weight: bold; font-size: 11px; color: #a78bfa; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.3s; }
                .s-tab[data-state='active'] { color: ${themeColor}; background: white; border-top-left-radius: 8px; border-top-right-radius: 8px; }
            `}</style>
        </div>
    );
};

export default ServiceInvoiceForm;
