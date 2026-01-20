import React from 'react';
import { PlusCircle, FileText, Settings, Sparkles, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();

    const quickActions = [
        { title: 'New Document', icon: <PlusCircle size={24} />, path: '/create', color: '#6366f1', desc: 'Create a new invoice, PO or quote' },
        { title: 'Invoice Library', icon: <FileText size={24} />, path: '/documents', color: '#0f172a', desc: 'View and manage all your documents' },
        { title: 'Settings', icon: <Settings size={24} />, path: '/settings', color: '#64748b', desc: 'Update your company profile & bank details' },
    ];

    const recentItems = [
        { id: 'INV-001', client: 'Acme Corp', amount: '₹12,450', date: '2 hours ago', status: 'Draft' },
        { id: 'INV-002', client: 'Global Tech', amount: '₹8,900', date: '5 hours ago', status: 'Sent' },
        { id: 'QUO-045', client: 'John Doe', amount: '₹4,500', date: 'Yesterday', status: 'Draft' },
    ];

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* HERO SECTION */}
            <header style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#6366f1', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px' }}>
                    <Sparkles size={16} />
                    <span>Welcome to TradeDoc AI</span>
                </div>
                <h1 style={{ fontSize: '36px', fontWeight: '800', margin: '10px 0 5px 0', color: '#0f172a' }}>
                    What would you like to build today?
                </h1>
                <p style={{ color: '#64748b', fontSize: '18px' }}>Create professional business documents powered by AI.</p>
            </header>

            {/* QUICK ACTIONS GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '50px' }}>
                {quickActions.map((action, idx) => (
                    <div
                        key={idx}
                        onClick={() => navigate(action.path)}
                        style={{
                            padding: '30px',
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            border: '1px solid #e2e8f0',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.borderColor = action.color;
                            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgb(0 0 0 / 0.1)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.borderColor = '#e2e8f0';
                            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.05)';
                        }}
                    >
                        <div style={{ color: action.color, marginBottom: '20px' }}>{action.icon}</div>
                        <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 8px 0', color: '#0f172a' }}>{action.title}</h3>
                        <p style={{ color: '#64748b', margin: 0, lineHeight: '1.5' }}>{action.desc}</p>
                    </div>
                ))}
            </div>

            {/* RECENT ACTIVITY */}
            <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: '700', margin: 0 }}>Recent Documents</h2>
                    <button
                        onClick={() => navigate('/documents')}
                        style={{ background: 'none', border: 'none', color: '#6366f1', fontWeight: '600', cursor: 'pointer' }}
                    >
                        View All
                    </button>
                </div>

                <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    {recentItems.length > 0 ? (
                        <div style={{ width: '100%', borderCollapse: 'collapse' }}>
                            {recentItems.map((item, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        padding: '20px',
                                        borderBottom: idx === recentItems.length - 1 ? 'none' : '1px solid #f1f5f9',
                                        display: 'grid',
                                        gridTemplateColumns: '80px 1fr 120px 120px 100px',
                                        alignItems: 'center',
                                        gap: '20px'
                                    }}
                                >
                                    <div style={{ fontWeight: '700', color: '#64748b', fontSize: '13px' }}>{item.id}</div>
                                    <div style={{ fontWeight: '600', color: '#0f172a' }}>{item.client}</div>
                                    <div style={{ color: '#0f172a', fontWeight: '600' }}>{item.amount}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '13px' }}>
                                        <Clock size={14} />
                                        {item.date}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <span style={{
                                            padding: '4px 10px',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            backgroundColor: item.status === 'Sent' ? '#dcfce7' : '#f1f5f9',
                                            color: item.status === 'Sent' ? '#166534' : '#475569'
                                        }}>
                                            {item.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
                            <div style={{ marginBottom: '15px' }}><CheckCircle size={48} strokeWidth={1} style={{ margin: '0 auto' }} /></div>
                            <p>No documents created yet. Start by building a new one!</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
