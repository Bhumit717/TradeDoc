import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings as SettingsIcon, PlusCircle, LogOut } from 'lucide-react';
import './Layout.css';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="app-shell">
            <aside className="sidebar no-print">
                <div className="brand">
                    <div className="brand-logo">📄</div>
                    <h2>TradeDoc</h2>
                </div>

                <nav className="nav-menu">
                    <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink to="/documents" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <FileText size={20} />
                        <span>Documents</span>
                    </NavLink>

                    <NavLink to="/create" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <PlusCircle size={20} />
                        <span>New Document</span>
                    </NavLink>

                    <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <SettingsIcon size={20} />
                        <span>Settings</span>
                    </NavLink>
                </nav>

                <div className="sidebar-footer">
                    <button className="logout-btn">
                        <LogOut size={18} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

export default Layout;
