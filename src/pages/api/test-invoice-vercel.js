import { generateInvoiceVercel } from '../../utils/invoicehelper-vercel';

export default async function handler(req, res) {
  // Allow GET and POST methods
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log("Starting Vercel OG invoice generation");
    console.log("Environment:", process.env.NODE_ENV || 'development');
    console.log("Platform:", process.platform);
    console.log("Node version:", process.version);
    
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

    console.log("Vercel OG invoice generation successful");
    
    // Return the ImageResponse directly
    return imageResponse;

  } catch (error) {
    console.error("Vercel OG invoice generation failed:", error);
    
    // Return error as JSON if generation fails
    res.status(500).json({ 
      success: false, 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      environment: process.env.NODE_ENV || 'development',
      platform: process.platform,
      library: 'vercel/og'
    });
  }
}

// Configure API route for edge runtime (required for @vercel/og)
export const config = {
  runtime: 'edge',
};