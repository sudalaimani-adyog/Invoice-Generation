import { useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testCanvas = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/test-canvas');
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'test-canvas.jpg';
        link.click();
      } else {
        const errorData = await response.json();
        setError(`Canvas test failed: ${errorData.error}`);
      }
    } catch (err) {
      setError(`Network error: ${err.message}`);
    }
    setLoading(false);
  };

  const testInvoice = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/test-invoice');
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'test-invoice.jpg';
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
          onClick={testCanvas}
          disabled={loading}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Testing...' : 'Test Canvas'}
        </button>
        
        <button 
          onClick={testInvoice}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Testing...' : 'Test Invoice Generation'}
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
        <h3>Test Endpoints:</h3>
        <ul>
          <li><a href="/api/test-canvas" target="_blank">/api/test-canvas</a> - Basic canvas test</li>
          <li><a href="/api/test-invoice" target="_blank">/api/test-invoice</a> - Full invoice generation test</li>
        </ul>
      </div>
    </div>
  );
}