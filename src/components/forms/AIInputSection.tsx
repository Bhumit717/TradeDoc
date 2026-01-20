import React, { useState } from 'react';
import { Sparkles, Wand2 } from 'lucide-react';

interface AIInputProps {
    documentType: string;
    onGenerate: (prompt: string) => void;
    isGenerating?: boolean;
}

const AIInputSection: React.FC<AIInputProps> = ({ documentType, onGenerate, isGenerating }) => {
    const [prompt, setPrompt] = useState('');

    const handleGenerate = () => {
        if (!prompt.trim()) return;
        onGenerate(prompt);
    };

    return (
        <div style={{
            backgroundColor: '#eef2ff',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #c7d2fe',
            marginBottom: '20px'
        }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#4f46e5', fontWeight: 'bold', marginBottom: '12px' }}>
                <Sparkles size={18} />
                <span>AI Copilot for {documentType}</span>
            </div>

            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={`🤖 AI-Powered Data Extraction (SambaNova Meta-Llama)

Example inputs:
• "Customer: Acme Corp, Mumbai, 9876543210, email: sales@acme.com
  Items: 100 Steel Rods @ Rs 1200 each, 50 Bolts @ Rs 10 each
  GST: 18%, Transport: Road, Vehicle GJ01AB1234"

• "Bill to John Doe, 123 MG Road Delhi
  50 Units of Product A at 500 rupees per piece
  Delivery in 7 days, 30% advance payment"

Try it with your customer details, items, transport info!`}
                style={{
                    width: '100%',
                    height: isGenerating ? '100px' : '120px',
                    padding: '12px',
                    border: '1px solid #c7d2fe',
                    borderRadius: '8px',
                    fontSize: '13px',
                    marginBottom: '10px',
                    fontFamily: 'inherit',
                    transition: 'all 0.3s ease'
                }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim()}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 20px',
                        backgroundColor: isGenerating ? '#94a3b8' : '#4f46e5',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: isGenerating ? 'not-allowed' : 'pointer',
                        fontWeight: 600,
                        fontSize: '13px'
                    }}
                >
                    <Wand2 size={14} />
                    {isGenerating ? 'Generating...' : 'Auto-Fill Details'}
                </button>
            </div>


            <div style={{ marginTop: '10px', fontSize: '11px', color: '#6366f1', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {isGenerating ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#4f46e5', fontWeight: 'bold' }}>
                        <div className="loading-spinner" style={{
                            width: '12px',
                            height: '12px',
                            border: '2px solid #c7d2fe',
                            borderTop: '2px solid #4f46e5',
                            borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite'
                        }}></div>
                        AI is analyzing your text...
                    </div>
                ) : (
                    <>
                        <div style={{ fontWeight: '600', color: '#4f46e5' }}>
                            ✨ Powered by SambaNova Meta-Llama-3.3-70B-Instruct
                        </div>
                        <div style={{ color: '#6366f1' }}>
                            💡 Tip: Paste email threads, WhatsApp chats, or any informal text
                        </div>
                    </>
                )}
            </div>

            {/* Add CSS animation for spinner */}
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default AIInputSection;
