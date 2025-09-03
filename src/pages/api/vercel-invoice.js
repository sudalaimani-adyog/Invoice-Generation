import { ImageResponse } from '@vercel/og';

export default async function handler() {
  try {
    return new ImageResponse(
      (
        <div
          style={{
            width: '800px',
            height: '600px',
            backgroundColor: 'white',
            padding: '40px',
            fontFamily: 'system-ui',
            fontSize: '16px',
            color: 'black',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{
            textAlign: 'center',
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '30px',
            border: '2px solid black',
            padding: '15px'
          }}>
            TAX INVOICE
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>NIPM TEST COMPANY</div>
            <div>123 Test Street</div>
            <div>Test City, Test State</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <div>Invoice No: TEST/2024/001</div>
              <div>Date: 01-01-2024</div>
            </div>
          </div>

          <div style={{ marginBottom: '20px', border: '1px solid black', padding: '15px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>Bill To:</div>
            <div>Test Customer Name</div>
            <div>Test Address Line 1</div>
            <div>Delhi - 07</div>
            <div>Mobile: 1234567890</div>
            <div>Email: test@test.com</div>
          </div>

          <div style={{ border: '1px solid black', marginBottom: '20px' }}>
            <div style={{
              display: 'flex',
              backgroundColor: '#f0f0f0',
              borderBottom: '1px solid black',
              padding: '10px'
            }}>
              <div style={{ width: '60px' }}>S.No</div>
              <div style={{ flex: '1' }}>Particulars</div>
              <div style={{ width: '100px', textAlign: 'right' }}>Amount</div>
            </div>

            <div style={{ display: 'flex', padding: '10px', borderBottom: '1px solid black' }}>
              <div style={{ width: '60px' }}>1</div>
              <div style={{ flex: '1' }}>Test Entrance Fee</div>
              <div style={{ width: '100px', textAlign: 'right' }}>1000</div>
            </div>

            <div style={{ display: 'flex', padding: '10px', borderBottom: '1px solid black' }}>
              <div style={{ width: '60px' }}>2</div>
              <div style={{ flex: '1' }}>Test Membership Fee</div>
              <div style={{ width: '100px', textAlign: 'right' }}>2000</div>
            </div>

            <div style={{ display: 'flex', padding: '10px', borderBottom: '1px solid black' }}>
              <div style={{ width: '60px' }}></div>
              <div style={{ flex: '1' }}>IGST</div>
              <div style={{ width: '100px', textAlign: 'right' }}>540</div>
            </div>

            <div style={{
              display: 'flex',
              padding: '10px',
              backgroundColor: '#f0f0f0',
              fontWeight: 'bold'
            }}>
              <div style={{ width: '60px' }}></div>
              <div style={{ flex: '1' }}>TOTAL</div>
              <div style={{ width: '100px', textAlign: 'right' }}>3540</div>
            </div>
          </div>

          <div style={{ fontSize: '14px' }}>
            <div style={{ marginBottom: '15px' }}>
              <strong>Amount in words:</strong> INR THREE THOUSAND FIVE HUNDRED AND FORTY ONLY
            </div>
            
            <div style={{ marginBottom: '10px' }}>
              <strong>Declaration:</strong> We declare that this invoice shows the actual price of the services described.
            </div>
            
            <div>
              <strong>Bank Details:</strong> State Bank of India, Acc: 10513447918, IFSC: SBIN0001749
            </div>
          </div>
        </div>
      ),
      {
        width: 800,
        height: 600,
      }
    );
  } catch (error) {
    console.error('Error generating invoice:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export const config = {
  runtime: 'edge',
};