import React, { useState } from 'react';
import { Save, Building, MapPin, Phone, CreditCard } from 'lucide-react';
import { getSavedCompanyProfile, saveCompanyProfile } from '../services/settingsStore';
import type { CompanyProfile } from '../types';

const Settings: React.FC = () => {
    const [profile, setProfile] = useState<CompanyProfile>(getSavedCompanyProfile());
    const [status, setStatus] = useState<string>('');

    const handleSave = () => {
        saveCompanyProfile(profile);
        setStatus('Settings Saved Successfully!');
        setTimeout(() => setStatus(''), 3000);
    };

    const updateAddress = (field: string, value: string) => {
        setProfile(prev => ({
            ...prev,
            address: { ...prev.address, [field]: value }
        }));
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>

            <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0, color: '#0f172a' }}>Settings</h1>
                    <p style={{ color: '#64748b', marginTop: '5px' }}>Manage your company profile and defaults.</p>
                </div>
                <button
                    onClick={handleSave}
                    style={{
                        backgroundColor: '#0f172a', color: 'white', padding: '10px 20px', borderRadius: '8px',
                        border: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                        fontWeight: '600'
                    }}
                >
                    <Save size={18} /> Save Changes
                </button>
            </div>

            {status && (
                <div style={{
                    padding: '12px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '6px',
                    marginBottom: '20px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px'
                }}>
                    ✅ {status}
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

                {/* COMPANY BASICS */}
                <div className="section-card">
                    <div className="section-header">
                        <Building size={20} className="icon" />
                        <h3>Company Details</h3>
                    </div>
                    <div className="grid-2">
                        <div className="input-group">
                            <label>Company Name</label>
                            <input value={profile.companyName} onChange={e => setProfile({ ...profile, companyName: e.target.value })} />
                        </div>
                        <div className="input-group">
                            <label>GSTIN / Tax ID</label>
                            <input value={profile.gstin || ''} onChange={e => setProfile({ ...profile, gstin: e.target.value })} />
                        </div>
                        <div className="input-group">
                            <label>Logo</label>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <input type="file" accept="image/*" onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setProfile(prev => ({ ...prev, logoUrl: reader.result as string }));
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }} style={{ width: 'auto' }} />
                                {profile.logoUrl && <img src={profile.logoUrl} alt="Preview" style={{ height: '30px', border: '1px solid #ccc' }} />}
                            </div>
                            <input
                                value={profile.logoUrl || ''}
                                onChange={e => setProfile({ ...profile, logoUrl: e.target.value })}
                                placeholder="Or paste Logo URL..."
                                style={{ marginTop: '5px', fontSize: '11px', color: '#666' }}
                            />
                        </div>
                        <div className="input-group">
                            <label>Website</label>
                            <input value={profile.website || ''} onChange={e => setProfile({ ...profile, website: e.target.value })} />
                        </div>
                    </div>
                </div>

                {/* ADDRESS */}
                <div className="section-card">
                    <div className="section-header">
                        <MapPin size={20} className="icon" />
                        <h3>Address</h3>
                    </div>
                    <div className="input-group">
                        <label>Address Line 1</label>
                        <input value={profile.address.line1} onChange={e => updateAddress('line1', e.target.value)} />
                    </div>
                    <div className="grid-2">
                        <div className="input-group">
                            <label>City</label>
                            <input value={profile.address.city} onChange={e => updateAddress('city', e.target.value)} />
                        </div>
                        <div className="input-group">
                            <label>State</label>
                            <input value={profile.address.state} onChange={e => updateAddress('state', e.target.value)} />
                        </div>
                        <div className="input-group">
                            <label>Zip / Pincode</label>
                            <input value={profile.address.zip} onChange={e => updateAddress('zip', e.target.value)} />
                        </div>
                        <div className="input-group">
                            <label>Country</label>
                            <input value={profile.address.country} onChange={e => updateAddress('country', e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* CONTACT */}
                <div className="section-card">
                    <div className="section-header">
                        <Phone size={20} className="icon" />
                        <h3>Contact Info</h3>
                    </div>
                    <div className="grid-2">
                        <div className="input-group">
                            <label>Email</label>
                            <input value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} />
                        </div>
                        <div className="input-group">
                            <label>Phone</label>
                            <input value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} />
                        </div>
                    </div>
                </div>

                {/* BANK DETAILS */}
                <div className="section-card">
                    <div className="section-header">
                        <CreditCard size={20} className="icon" />
                        <h3>Bank Details</h3>
                    </div>
                    <div className="grid-2">
                        <div className="input-group">
                            <label>Bank Name</label>
                            <input value={profile.bankDetails?.[0]?.bankName || ''} onChange={e => {
                                const newBanks = [...(profile.bankDetails || [])];
                                if (!newBanks[0]) newBanks[0] = { id: '1', bankName: '', accountName: '', accountNumber: '', ifscCode: '' };
                                newBanks[0].bankName = e.target.value;
                                setProfile({ ...profile, bankDetails: newBanks });
                            }} />
                        </div>
                        <div className="input-group">
                            <label>Account Number</label>
                            <input value={profile.bankDetails?.[0]?.accountNumber || ''} onChange={e => {
                                const newBanks = [...(profile.bankDetails || [])];
                                if (!newBanks[0]) newBanks[0] = { id: '1', bankName: '', accountName: '', accountNumber: '', ifscCode: '' };
                                newBanks[0].accountNumber = e.target.value;
                                setProfile({ ...profile, bankDetails: newBanks });
                            }} />
                        </div>
                        <div className="input-group">
                            <label>IFSC Code</label>
                            <input value={profile.bankDetails?.[0]?.ifscCode || ''} onChange={e => {
                                const newBanks = [...(profile.bankDetails || [])];
                                if (!newBanks[0]) newBanks[0] = { id: '1', bankName: '', accountName: '', accountNumber: '', ifscCode: '' };
                                newBanks[0].ifscCode = e.target.value;
                                setProfile({ ...profile, bankDetails: newBanks });
                            }} />
                        </div>
                        <div className="input-group">
                            <label>Account Name</label>
                            <input value={profile.bankDetails?.[0]?.accountName || ''} onChange={e => {
                                const newBanks = [...(profile.bankDetails || [])];
                                if (!newBanks[0]) newBanks[0] = { id: '1', bankName: '', accountName: '', accountNumber: '', ifscCode: '' };
                                newBanks[0].accountName = e.target.value;
                                setProfile({ ...profile, bankDetails: newBanks });
                            }} />
                        </div>
                        <div className="input-group" style={{ gridColumn: 'span 2' }}>
                            <label>QR Code Setup</label>
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px' }}>Option A: Dynamic QR (Auto-generated from text/UPI ID)</div>
                                    <input
                                        placeholder="e.g. upi://pay?pa=yourname@bank&pn=YourName"
                                        value={profile.qrCodeValue || ''}
                                        onChange={e => setProfile({ ...profile, qrCodeValue: e.target.value })}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px' }}>Option B: Static QR Image (Upload your own)</div>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <input type="file" accept="image/*" onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setProfile(prev => ({ ...prev, qrCodeUrl: reader.result as string }));
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }} style={{ width: 'auto' }} />
                                        {profile.qrCodeUrl && <img src={profile.qrCodeUrl} alt="QR Preview" style={{ height: '40px', border: '1px solid #ccc' }} />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <style>{`
                .section-card { background: white; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05); }
                .section-header { display: flex; alignItems: center; gap: 10px; margin-bottom: 20px; color: #334155; }
                .section-header h3 { margin: 0; font-size: 18px; font-weight: 700; }
                .section-header .icon { color: #6366f1; }
                
                .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                
                .input-group { display: flex; flexDirection: column; gap: 6px; margin-bottom: 5px; }
                .input-group label { font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
                .input-group input { padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; outline: none; transition: all 0.2s; }
                .input-group input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1); }
            `}</style>
        </div>
    );
};

export default Settings;
