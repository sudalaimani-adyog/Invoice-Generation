import { ImageResponse } from '@vercel/og';

export const generateInvoiceVercel = async (
  invoiceNumber,
  date,
  referenceNumber,
  otherReference,
  clientMobile,
  clientEmail,
  clientAddress,
  items,
  igstRow,
  totalAmount,
  amountInWords,
  igstDetails,
  totalTaxAmount,
  taxAmountInWords
) => {
  try {
    const response = new ImageResponse(
      (
        <div
          style={{
            width: '800px',
            height: '1000px',
            backgroundColor: 'white',
            padding: '20px',
            fontFamily: 'monospace',
            fontSize: '14px',
            color: 'black',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div style={{
            textAlign: 'center',
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: '20px',
            border: '2px solid black',
            padding: '10px'
          }}>
            TAX INVOICE
          </div>

          {/* Company Info */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>NIPM TEST COMPANY</div>
            <div style={{ fontSize: '12px' }}>123 Test Street</div>
            <div style={{ fontSize: '12px' }}>Test City, Test State</div>
          </div>

          {/* Invoice Details */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <div>Invoice No: {invoiceNumber}</div>
              <div>Date: {date}</div>
            </div>
            <div>
              <div>Reference: {referenceNumber}</div>
              <div>Other Ref: {otherReference}</div>
            </div>
          </div>

          {/* Client Details */}
          <div style={{ marginBottom: '20px', border: '1px solid black', padding: '10px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Bill To:</div>
            <div>{clientAddress.line1}</div>
            <div>{clientAddress.line2}</div>
            <div>{clientAddress.State} - {clientAddress.Code}</div>
            <div>Mobile: {clientMobile}</div>
            <div>Email: {clientEmail}</div>
          </div>

          {/* Items Table */}
          <div style={{ border: '1px solid black', marginBottom: '20px' }}>
            {/* Table Header */}
            <div style={{
              display: 'flex',
              backgroundColor: '#f0f0f0',
              border: '1px solid black',
              padding: '5px'
            }}>
              <div style={{ width: '50px', borderRight: '1px solid black' }}>S.No</div>
              <div style={{ flex: '1', paddingLeft: '10px', borderRight: '1px solid black' }}>Particulars</div>
              <div style={{ width: '100px', textAlign: 'right', paddingRight: '10px' }}>Amount</div>
            </div>

            {/* Items */}
            {items.map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                border: '1px solid black',
                padding: '5px'
              }}>
                <div style={{ width: '50px', borderRight: '1px solid black' }}>{item.serialNumber}</div>
                <div style={{ flex: '1', paddingLeft: '10px', borderRight: '1px solid black' }}>{item.particulars}</div>
                <div style={{ width: '100px', textAlign: 'right', paddingRight: '10px' }}>{item.amount}</div>
              </div>
            ))}

            {/* IGST Row */}
            <div style={{
              display: 'flex',
              border: '1px solid black',
              padding: '5px'
            }}>
              <div style={{ width: '50px', borderRight: '1px solid black' }}></div>
              <div style={{ flex: '1', paddingLeft: '10px', borderRight: '1px solid black' }}>{igstRow.particulars}</div>
              <div style={{ width: '100px', textAlign: 'right', paddingRight: '10px' }}>{igstRow.amount}</div>
            </div>

            {/* Total Row */}
            <div style={{
              display: 'flex',
              border: '2px solid black',
              padding: '5px',
              backgroundColor: '#f0f0f0',
              fontWeight: 'bold'
            }}>
              <div style={{ width: '50px', borderRight: '1px solid black' }}></div>
              <div style={{ flex: '1', paddingLeft: '10px', borderRight: '1px solid black' }}>TOTAL</div>
              <div style={{ width: '100px', textAlign: 'right', paddingRight: '10px' }}>{totalAmount}</div>
            </div>
          </div>

          {/* Amount in Words */}
          <div style={{ marginBottom: '20px', fontSize: '12px' }}>
            <strong>Amount in words:</strong> {amountInWords}
          </div>

          {/* Declaration */}
          <div style={{ marginBottom: '15px', fontSize: '11px' }}>
            <strong>Declaration:</strong> We declare that this invoice shows the actual price of the services described and that all particulars are true and correct.
          </div>

          {/* Bank Details */}
          <div style={{ fontSize: '11px' }}>
            <strong>Bank Details:</strong> State Bank of India, Account Number: 10513447918, IFSC: SBIN0001749, Branch: Park Circus, Kolkata
          </div>
        </div>
      ),
      {
        width: 800,
        height: 1000,
      }
    );

    return response;
  } catch (error) {
    console.error('Error generating invoice with Vercel OG:', error);
    throw error;
  }
};