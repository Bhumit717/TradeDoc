import React, { useState, useEffect } from 'react';
import { Printer } from 'lucide-react';
import type { InvoiceData } from '../types';
import { DOCUMENT_CONFIGS } from '../data/documentTypes';
import { createEmptyInvoice } from '../utils/mockData';
import {
    StandardGSTTemplate,
    DeliveryChallanTemplate,
    ExportInvoiceTemplate,
    QuotationTemplate,
    PurchaseOrderTemplate,
    VoucherTemplate,
    ServiceInvoiceTemplate,
    WorkOrderTemplate,
    DebitCreditNoteTemplate,
    PackingListTemplate,
    BillOfSupplyTemplate,
    EstimationTemplate,
    ReceiptTemplate
} from '../components/templates';

import TaxInvoiceForm from '../components/forms/TaxInvoiceForm';
import QuotationForm from '../components/forms/QuotationForm';
import POForm from '../components/forms/POForm';
import ServiceInvoiceForm from '../components/forms/ServiceInvoiceForm';
import OrderFormAdapter from '../components/forms/OrderFormAdapter';

import AIInputSection from '../components/forms/AIInputSection';
import { generateDocumentFromAI } from '../services/gemini';
import { useParams, useNavigate } from 'react-router-dom';

const TEMPLATE_REGISTRY: Record<string, React.FC<{ data: InvoiceData }>> = {
    'Tax Invoice': StandardGSTTemplate,
    'Bill of Supply': BillOfSupplyTemplate,
    'Proforma Invoice': QuotationTemplate,
    'Service Invoice': ServiceInvoiceTemplate,
    'Quotation': QuotationTemplate,
    'Estimate': EstimationTemplate,
    'Purchase Order': PurchaseOrderTemplate,
    'Sales Order': PurchaseOrderTemplate,
    'Delivery Challan': DeliveryChallanTemplate,
    'Export Invoice': ExportInvoiceTemplate,
    'Commercial Invoice': ExportInvoiceTemplate,
    'Payment Voucher': VoucherTemplate,
    'Expense Voucher': VoucherTemplate,
    'Receipt': ReceiptTemplate,
    'Work Order': WorkOrderTemplate,
    'Debit Note': DebitCreditNoteTemplate,
    'Credit Note': DebitCreditNoteTemplate,
    'Packing List': PackingListTemplate,
    'Performa PO': PurchaseOrderTemplate,
};

const FORM_REGISTRY: Record<string, React.FC<{ data: InvoiceData, onChange: (d: InvoiceData) => void }>> = {
    'Tax Invoice': TaxInvoiceForm,
    'Quotation': QuotationForm,
    'Estimate': QuotationForm,
    'Proforma Invoice': QuotationForm,
    'Purchase Order': POForm,
    'Sales Order': POForm,
    'Service Invoice': ServiceInvoiceForm,
};

const DocumentEditor: React.FC = () => {
    const { docType } = useParams<{ docType: string }>();
    const navigate = useNavigate();

    const normalizeType = (slug: string | undefined): any => {
        if (!slug) return 'Tax Invoice';
        return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const [data, setData] = useState<InvoiceData>({
        ...createEmptyInvoice(),
        documentType: normalizeType(docType)
    });
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        const newType = normalizeType(docType);
        if (newType !== data.documentType) {
            setData(prev => ({ ...prev, documentType: newType }));
        }
    }, [docType]);

    const handleAIGenerate = async (prompt: string) => {
        setIsGenerating(true);
        try {
            const aiData = await generateDocumentFromAI(prompt, data);
            setData(prev => ({
                ...prev,
                ...aiData,
                items: aiData.items || prev.items,
                buyer: { ...prev.buyer, ...aiData.buyer },
            }));
        } catch (error) {
            console.error(error);
            alert("Failed to generate details.");
        } finally {
            setIsGenerating(false);
        }
    };

    useEffect(() => {
        const totalTaxable = data.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        const totalTax = data.items.reduce((sum, item) => sum + ((item.quantity * item.unitPrice) * (item.taxRate / 100)), 0);

        setData(prev => ({
            ...prev,
            totalTaxable,
            totalIGST: totalTax,
            grandTotal: totalTaxable + totalTax
        }));
    }, [data.items]);


    const [sidebarWidth, setSidebarWidth] = React.useState(500); // Increased default width
    const isResizingRef = React.useRef(false);

    React.useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isResizingRef.current) {
                e.preventDefault();
                const newWidth = e.clientX;
                if (newWidth > 300 && newWidth < window.innerWidth - 400) {
                    setSidebarWidth(newWidth);
                }
            }
        };

        const handleMouseUp = () => {
            if (isResizingRef.current) {
                isResizingRef.current = false;
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
            }
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        isResizingRef.current = true;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
            {/* TOOLBAR */}
            <div className="no-print" style={{ padding: '10px 20px', backgroundColor: 'white', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div>
                        <label style={{ fontSize: '10px', color: '#666', fontWeight: 'bold' }}>DOCUMENT TYPE</label>
                        <select
                            value={data.documentType}
                            onChange={(e) => {
                                const slug = e.target.value.toLowerCase().replace(/\s+/g, '-');
                                navigate(`/document/${slug}`);
                            }}
                            style={{ display: 'block', padding: '5px', fontWeight: 'bold' }}
                        >
                            {Object.keys(DOCUMENT_CONFIGS).map(t => <option key={t}>{t}</option>)}
                        </select>
                    </div>
                    <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{data.documentNumber}</div>
                </div>
                <button onClick={() => window.print()} style={{ display: 'flex', gap: '5px', padding: '8px 16px', backgroundColor: '#0f172a', color: 'white', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>
                    <Printer size={16} /> Print / PDF
                </button>
            </div>



            <div className="document-editor-layout" style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
                {/* LEFT: INPUTS */}
                <div className="no-print document-editor-sidebar" style={{ width: `${sidebarWidth}px`, backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', position: 'relative', overflowY: 'auto' }}>
                    <div style={{ padding: '15px', borderBottom: '1px solid #e2e8f0', backgroundColor: 'white' }}>
                        <AIInputSection
                            documentType={data.documentType}
                            onGenerate={handleAIGenerate}
                            isGenerating={isGenerating}
                        />
                    </div>
                    {(() => {
                        const FormComponent = FORM_REGISTRY[data.documentType] || OrderFormAdapter;
                        return <FormComponent data={data} onChange={setData} />;
                    })()}
                </div>

                {/* RESIZER */}
                <div
                    className="no-print resizer"
                    onMouseDown={handleMouseDown}
                    style={{
                        width: '5px',
                        cursor: 'col-resize',
                        backgroundColor: isResizingRef.current ? '#3b82f6' : '#e2e8f0',
                        position: 'relative',
                        zIndex: 5,
                        transition: 'background-color 0.2s',
                        borderLeft: '1px solid #cbd5e1',
                        borderRight: '1px solid #cbd5e1'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                    onMouseLeave={(e) => !isResizingRef.current && (e.currentTarget.style.backgroundColor = '#e2e8f0')}
                >
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '20px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isResizingRef.current ? '#3b82f6' : '#94a3b8',
                        borderRadius: '4px',
                        pointerEvents: 'none'
                    }}>
                        <div style={{ width: '2px', height: '20px', backgroundColor: 'white', marginRight: '2px' }}></div>
                        <div style={{ width: '2px', height: '20px', backgroundColor: 'white' }}></div>
                    </div>
                </div>

                {/* RIGHT: PREVIEW */}
                <div className="document-preview" style={{ flex: 1, overflowY: 'auto', padding: '40px', backgroundColor: '#525659', display: 'flex', justifyContent: 'center' }}>
                    <div className="document-preview-inner" style={{ transform: 'scale(1)', transformOrigin: 'top center' }}>
                        <div style={{ width: '210mm', minHeight: '297mm', backgroundColor: 'white', padding: '10mm', boxShadow: '0 0 10px rgba(0,0,0,0.5)' }}>
                            {(() => {
                                const TemplateComponent = TEMPLATE_REGISTRY[data.documentType] || StandardGSTTemplate;
                                return <TemplateComponent data={data} />;
                            })()}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .input-label { display: block; font-size: 11px; font-weight: 600; color: #64748b; margin-bottom: 4px; text-transform: uppercase; }
                .input-field { width: 100% !important; max-width: 100% !important; box-sizing: border-box !important; padding: 8px; font-size: 13px; border: 1px solid #cbd5e1; border-radius: 4px; outline: none; }
                .input-field:focus { border-color: #2563eb; }
                .document-editor-sidebar { user-select: ${isResizingRef.current ? 'none' : 'auto'}; }
            `}</style>
        </div>
    );
};

export default DocumentEditor;
