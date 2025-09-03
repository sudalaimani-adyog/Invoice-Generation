import { generateInvoiceVercel } from '../../utils/invoicehelper-vercel';

export default async function handler(req) {
  // Allow GET and POST methods
  if (req.method !== 'GET' && req.method !== 'POST') {
    return new Response(JSON.stringify({ message: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    
    // Test invoice generation with sample data
    const imageResponse = await generateInvoiceVercel(
      "TEST/2024/001", // invoiceNumber
      "01-01-2024",    // date
      "",              // referenceNumber
      "TEST MEMBER",   // otherReference
      "1234567890",    // clientMobile
      "test@test.com", // clientEmail
      {
        line1: "Test Customer Name",
        line2: "Test Address Line 1",
        State: "Delhi",
        Code: "07",
      },
      [
        {
          serialNumber: "1",
          particulars: "Test Entrance Fee",
          serviceCode: "-",
          amount: 1000,
        },
        {
          serialNumber: "2", 
          particulars: "Test Membership Fee",
          serviceCode: "-",
          amount: 2000,
        }
      ],
      {
        serialNumber: "",
        particulars: "IGST",
        serviceCode: "-",
        amount: 540,
      },
      3540, // totalAmount
      "INR THREE THOUSAND FIVE HUNDRED AND FORTY ONLY",
      [
        {
          HSNserial: "999599",
          taxableValue: 3000,
          igst: {
            rate: "18%",
            amount: 540,
          },
          totalTax: 540,
        },
      ],
      540, // totalTaxAmount
      "INR FIVE HUNDRED AND FORTY ONLY"
    );

    // Return the ImageResponse directly
    return imageResponse;

  } catch (error) {
    console.error("Vercel OG invoice generation failed:", error);
    
    // Return error as JSON if generation fails
    return new Response(JSON.stringify({
      success: false, 
      error: error.message,
      library: 'vercel/og'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Configure API route for edge runtime (required for @vercel/og)
export const config = {
  runtime: 'edge',
};