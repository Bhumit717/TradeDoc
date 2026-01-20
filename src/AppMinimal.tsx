import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DocumentsLibrary from './pages/DocumentsLibrary';
import DocumentEditor from './pages/DocumentEditor';
import Settings from './pages/Settings';
import Login from './pages/Login';

// Placeholder Auth
const isAuthenticated = true;

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return children;
};

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route path="/" element={
                    <ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>
                } />

                <Route path="/documents" element={
                    <ProtectedRoute><Layout><DocumentsLibrary /></Layout></ProtectedRoute>
                } />

                {/* DEDICATED DOCUMENT ROUTES */}
                <Route path="/document/:docType" element={
                    <ProtectedRoute><Layout><DocumentEditor /></Layout></ProtectedRoute>
                } />

                {/* Fallback */}
                <Route path="/create" element={
                    <ProtectedRoute><Layout><DocumentEditor /></Layout></ProtectedRoute>
                } />

                <Route path="/settings" element={
                    <ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>
                } />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
