import { useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const testInvoice = async (endpoint = '/api/invoice') => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(endpoint);
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `invoice-${endpoint.split('/').pop()}.jpg`;
        link.click();
      } else {
        const errorData = await response.json();
        setError(`Invoice test failed: ${errorData.error}`);
      }
    } catch (err) {
      setError(`Network error: ${err.message}`);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Invoice Generation Test</h1>
      <p>Test the canvas-based invoice generation functionality</p>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => testInvoice('/api/invoice')}
          disabled={loading}
          style={{
            padding: '15px 30px',
            marginRight: '15px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Generating...' : 'Generate Canvas Invoice (Local)'}
        </button>
        
        <button 
          onClick={() => testInvoice('/api/vercel-invoice')}
          disabled={loading}
          style={{
            padding: '15px 30px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Generating...' : 'Generate Vercel Invoice (Production)'}
        </button>
      </div>
      
      {error && (
        <div style={{
          padding: '10px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: '5px'
        }}>
          {error}
        </div>
      )}
      
      <div style={{ marginTop: '30px' }}>
        <h3>Available Endpoints:</h3>
        <ul style={{ fontSize: '16px', lineHeight: '1.6' }}>
          <li><a href="/api/invoice" target="_blank" style={{ textDecoration: 'none', color: '#28a745' }}>/api/invoice</a> - Canvas-based invoice generation (works locally)</li>
          <li><a href="/api/vercel-invoice" target="_blank" style={{ textDecoration: 'none', color: '#0070f3' }}>/api/vercel-invoice</a> - Vercel OG invoice generation (works in production)</li>
        </ul>
        
        <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
          <h4 style={{ marginTop: '0', color: '#495057' }}>📋 Usage Guide:</h4>
          <div style={{ marginBottom: '15px' }}>
            <strong style={{ color: '#28a745' }}>Local Development:</strong> Use <code>/api/invoice</code> - Canvas-based with improved font rendering
          </div>
          <div style={{ marginBottom: '15px' }}>
            <strong style={{ color: '#0070f3' }}>Vercel Production:</strong> Use <code>/api/vercel-invoice</code> - Guaranteed text rendering with @vercel/og
          </div>
          <div style={{ fontSize: '14px', color: '#6c757d' }}>
            💡 The Vercel endpoint will work perfectly in serverless environments where canvas text rendering may fail.
          </div>
        </div>
      </div>
    </div>
  );
}