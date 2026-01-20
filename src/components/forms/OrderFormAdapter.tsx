import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { Plus, Trash2, Package, Users, FileText, Truck, PenTool } from 'lucide-react';
import type { InvoiceData } from '../../types';
import { DOCUMENT_CONFIGS } from '../../data/documentTypes';

interface OrderFormProps {
    data: InvoiceData;
    onChange: (data: InvoiceData) => void;
}

const OrderFormAdapter: React.FC<OrderFormProps> = ({ data, onChange }) => {

    const config = DOCUMENT_CONFIGS[data.documentType as keyof typeof DOCUMENT_CONFIGS];
    const themeColor = config?.color || '#2563eb';

    const update = (field: keyof InvoiceData | string, value: any) => {
        onChange({ ...data, [field]: value });
    };

    // Determine Labels based on Document Type
    const isPurchase = data.documentType.includes('Purchase') || data.documentType.includes('Expense') || data.documentType.includes('Import') || data.documentType.includes('Voucher');
    const isService = data.documentType.toLowerCase().includes('work') || data.documentType.toLowerCase().includes('service');

    const partiesTabLabel = isPurchase ? 'Supplier' : (isService ? 'Contractor' : 'Buyer');
    const itemsTabLabel = isService ? 'Services' : 'Items';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#f8fafc' }}>

            <Tabs.Root defaultValue="general" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Tabs.List style={{
                    display: 'flex',
                    borderBottom: '1px solid #e2e8f0',
                    padding: '0 10px',
                    backgroundColor: 'white',
                    gap: '5px'
                }}>
                    <Tabs.Trigger value="general" className="tab-trigger"><FileText size={14} /> Details</Tabs.Trigger>
                    <Tabs.Trigger value="parties" className="tab-trigger"><Users size={14} /> {partiesTabLabel}</Tabs.Trigger>
                    <Tabs.Trigger value="items" className="tab-trigger"><Package size={14} /> {itemsTabLabel}</Tabs.Trigger>
                    {config?.hasShipping && <Tabs.Trigger value="logistics" className="tab-trigger"><Truck size={14} /> Logistics</Tabs.Trigger>}
                    <Tabs.Trigger value="terms" className="tab-trigger"><PenTool size={14} /> Terms</Tabs.Trigger>
                </Tabs.List>

                <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>

                    {/* 1. DETAILS TAB */}
                    <Tabs.Content value="general" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div className="section-box">
                            <label className="input-label">Document Number</label>
                            <input className="input-field" value={data.documentNumber} onChange={e => update('documentNumber', e.target.value)} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div className="section-box">
                                <label className="input-label">Date</label>
                                <input type="date" className="input-field" value={data.date} onChange={e => update('date', e.target.value)} />
                            </div>
                            <div className="section-box">
                                <label className="input-label">Due Date</label>
                                <input type="date" className="input-field" value={data.dueDate || ''} onChange={e => update('dueDate', e.target.value)} />
                            </div>
                        </div>

                        <div className="section-box">
                            <label className="input-label">Payment Status</label>
                            <select className="input-field" value={data.status} onChange={e => update('status', e.target.value)}>
                                <option>Draft</option>
                                <option>Sent</option>
                                <option>Pending</option>
                                <option>Approved</option>
                                <option>Partial</option>
                                <option>Paid</option>
                                <option>Overdue</option>
                                <option>Cancelled</option>
                            </select>
                        </div>
                    </Tabs.Content>

                    {/* 2. PARTIES TAB */}
                    <Tabs.Content value="parties" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div className="section-box">
                            <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: themeColor }}>{partiesTabLabel} Information</h4>
                            <label className="input-label">Company Name</label>
                            <input className="input-field" placeholder="Full legal name" value={data.buyer.companyName}
                                onChange={e => onChange({ ...data, buyer: { ...data.buyer, companyName: e.target.value } })} />

                            <label className="input-label" style={{ marginTop: '12px' }}>Address</label>
                            <input className="input-field" placeholder="Building, Street..." value={data.buyer.address.line1}
                                onChange={e => onChange({ ...data, buyer: { ...data.buyer, address: { ...data.buyer.address, line1: e.target.value } } })} />

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                                <div>
                                    <input className="input-field" placeholder="City" value={data.buyer.address.city}
                                        onChange={e => onChange({ ...data, buyer: { ...data.buyer, address: { ...data.buyer.address, city: e.target.value } } })} />
                                </div>
                                <div>
                                    <input className="input-field" placeholder="State" value={data.buyer.address.state}
                                        onChange={e => onChange({ ...data, buyer: { ...data.buyer, address: { ...data.buyer.address, state: e.target.value } } })} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '12px' }}>
                                <div>
                                    <label className="input-label">GSTIN / TAX ID</label>
                                    <input className="input-field" placeholder="ID Number" value={data.buyer.gstin || ''}
                                        onChange={e => onChange({ ...data, buyer: { ...data.buyer, gstin: e.target.value } })} />
                                </div>
                                <div>
                                    <label className="input-label">Place of Supply</label>
                                    <input className="input-field" placeholder="State/Country" value={data.buyer.placeOfSupply || ''}
                                        onChange={e => onChange({ ...data, buyer: { ...data.buyer, placeOfSupply: e.target.value } })} />
                                </div>
                            </div>
                        </div>
                    </Tabs.Content>

                    {/* 3. ITEMS TAB */}
                    <Tabs.Content value="items" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {data.items.map((item, idx) => (
                                <div key={idx} className="item-card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }}>
                                        <span style={{ fontSize: '11px', fontWeight: '800', color: themeColor, textTransform: 'uppercase' }}>{itemsTabLabel} #{idx + 1}</span>
                                        <button
                                            onClick={() => {
                                                const newItems = data.items.filter((_, i) => i !== idx);
                                                onChange({ ...data, items: newItems });
                                            }}
                                            className="remove-btn"
                                        >
                                            <Trash2 size={12} /> Remove
                                        </button>
                                    </div>

                                    <input className="input-field" placeholder="Item Name or Description" value={item.name} onChange={e => {
                                        const newItems = [...data.items];
                                        newItems[idx].name = e.target.value;
                                        onChange({ ...data, items: newItems });
                                    }} style={{ marginBottom: '10px', fontWeight: '600' }} />

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                                        <div>
                                            <label className="input-label">Qty</label>
                                            <input className="input-field" type="number" value={item.quantity} onChange={e => {
                                                const newItems = [...data.items];
                                                const val = parseFloat(e.target.value) || 0;
                                                newItems[idx].quantity = val;
                                                newItems[idx].taxableValue = val * newItems[idx].unitPrice;
                                                newItems[idx].totalAmount = newItems[idx].taxableValue + (newItems[idx].taxableValue * (newItems[idx].taxRate / 100));
                                                onChange({ ...data, items: newItems });
                                            }} />
                                        </div>
                                        <div>
                                            <label className="input-label">Rate</label>
                                            <input className="input-field" type="number" value={item.unitPrice} onChange={e => {
                                                const newItems = [...data.items];
                                                const val = parseFloat(e.target.value) || 0;
                                                newItems[idx].unitPrice = val;
                                                newItems[idx].taxableValue = newItems[idx].quantity * val;
                                                newItems[idx].totalAmount = newItems[idx].taxableValue + (newItems[idx].taxableValue * (newItems[idx].taxRate / 100));
                                                onChange({ ...data, items: newItems });
                                            }} />
                                        </div>
                                        <div>
                                            <label className="input-label">GST %</label>
                                            <select className="input-field" value={item.taxRate} onChange={e => {
                                                const newItems = [...data.items];
                                                const val = parseFloat(e.target.value) || 0;
                                                newItems[idx].taxRate = val;
                                                newItems[idx].totalAmount = newItems[idx].taxableValue + (newItems[idx].taxableValue * (val / 100));
                                                onChange({ ...data, items: newItems });
                                            }}>
                                                <option value={0}>0%</option>
                                                <option value={5}>5%</option>
                                                <option value={12}>12%</option>
                                                <option value={18}>18%</option>
                                                <option value={28}>28%</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <button
                                className="add-btn"
                                style={{ borderColor: themeColor, color: themeColor }}
                                onClick={() => {
                                    onChange({
                                        ...data,
                                        items: [...data.items, {
                                            id: Date.now().toString(),
                                            name: '',
                                            quantity: 1,
                                            unitPrice: 0,
                                            taxRate: 18,
                                            taxableValue: 0,
                                            taxAmount: 0,
                                            totalAmount: 0,
                                            unit: 'Nos'
                                        }]
                                    })
                                }}
                            >
                                <Plus size={16} /> Add {itemsTabLabel}
                            </button>
                        </div>
                    </Tabs.Content>

                    {/* 4. LOGISTICS TAB */}
                    {config?.hasShipping && (
                        <Tabs.Content value="logistics" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div className="section-box">
                                <label className="input-label">Transport Mode</label>
                                <input className="input-field" placeholder="e.g. Road, Air" value={data.transportDetails?.mode || ''}
                                    onChange={e => update('transportDetails', { ...data.transportDetails, mode: e.target.value })} />

                                <label className="input-label" style={{ marginTop: '12px' }}>Vehicle Number</label>
                                <input className="input-field" placeholder="MH-XX-XXXX" value={data.transportDetails?.vehicleNo || ''}
                                    onChange={e => update('transportDetails', { ...data.transportDetails, vehicleNo: e.target.value })} />
                            </div>
                        </Tabs.Content>
                    )}

                    {/* 5. TERMS TAB */}
                    <Tabs.Content value="terms" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div className="section-box">
                            <label className="input-label">Terms and Conditions</label>
                            <textarea className="input-field" rows={6} value={data.termsAndConditions || ''}
                                onChange={e => update('termsAndConditions', e.target.value)} />
                        </div>
                        <div className="section-box">
                            <label className="input-label">Amount In Words</label>
                            <input className="input-field" placeholder="Auto-fills if possible..." value={data.amountInWords || ''}
                                onChange={e => update('amountInWords', e.target.value)} />
                        </div>
                    </Tabs.Content>

                </div>
            </Tabs.Root>

            <style>{`
                .tab-trigger { 
                    flex: 1; padding: 12px 5px; border: none; background: none; cursor: pointer; border-bottom: 2px solid transparent; 
                    color: #64748b; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;
                    display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s;
                }
                .tab-trigger[data-state='active'] { border-bottom-color: ${themeColor}; color: ${themeColor}; background-color: #f8fafc; }
                .tab-trigger:hover { color: ${themeColor}; }
                
                .section-box { padding: 15px; background: white; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
                .item-card { padding: 15px; background: white; border: 1px solid #e2e8f0; border-radius: 8px; border-left: 4px solid ${themeColor}; }
                
                .input-label { display: block; font-size: 10px; font-weight: 800; color: #64748b; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.8px; }
                .input-field { width: 100%; padding: 10px 12px; font-size: 13px; border: 1px solid #cbd5e1; border-radius: 6px; outline: none; transition: all 0.2s; background-color: #fff; }
                .input-field:focus { border-color: ${themeColor}; box-shadow: 0 0 0 3px ${themeColor}15; }
                
                .add-btn { width: 100%; padding: 12px; background: white; border: 2px dashed #cbd5e1; border-radius: 8px; font-weight: 700; font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; }
                .add-btn:hover { background-color: #f1f5f9; border-style: solid; }
                
                .remove-btn { color: #f87171; border: none; background: none; cursor: pointer; font-size: 11px; font-weight: 700; text-transform: uppercase; display: flex; align-items: center; gap: 4px; }
                .remove-btn:hover { color: #ef4444; }
             `}</style>
        </div>
    );
};

export default OrderFormAdapter;
