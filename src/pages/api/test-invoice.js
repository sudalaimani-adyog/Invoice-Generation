export default async function handler(req, res) {
  // Allow GET and POST methods
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log("Starting test-invoice endpoint");
    console.log("Environment:", process.env.NODE_ENV || 'development');
    console.log("Platform:", process.platform);
    console.log("Node version:", process.version);
    
    // Dynamic import to avoid build issues
    const generateInvoice = (await import("../../utils/invoicehelper")).default;
    
    if (!generateInvoice) {
      throw new Error("Failed to import generateInvoice function");
    }
    
    console.log("generateInvoice function loaded");
    
    // Test invoice generation with minimal data
    const testInvoice = await generateInvoice(
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

    console.log("Invoice generation successful, buffer size:", testInvoice?.length || 0);
    
    // Return the image as response
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Length', testInvoice.length);
    res.setHeader('Content-Disposition', 'inline; filename="test-invoice.jpeg"');
    
    // Send the image buffer directly
    res.status(200).send(testInvoice);

  } catch (error) {
    console.error("Invoice generation test failed:", error);
    
    // Return error as JSON if generation fails
    res.status(500).json({ 
      success: false, 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      environment: process.env.NODE_ENV || 'development',
      platform: process.platform
    });
  }
}

// Configure API route to handle larger response body
export const config = {
  api: {
    responseLimit: '10mb',
  },
};