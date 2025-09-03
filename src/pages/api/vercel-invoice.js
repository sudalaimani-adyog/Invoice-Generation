import generateInvoice from "../../utils/invoicehelper";

export default async function handler(req, res) {
  // Allow GET and POST methods
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log("Starting smart invoice generation");
    console.log("Environment:", process.env.NODE_ENV || 'development');
    console.log("Platform:", process.platform);
    console.log("Vercel:", process.env.VERCEL ? 'true' : 'false');

    // Sample invoice data
    const invoiceData = {
      invoiceNumber: "TEST/2024/001",
      date: "01-01-2024",
      referenceNumber: "",
      otherReference: "TEST MEMBER",
      clientMobile: "1234567890",
      clientEmail: "test@test.com",
      clientAddress: {
        line1: "Test Customer Name",
        line2: "Test Address Line 1",
        State: "Delhi",
        Code: "07",
      },
      items: [
        {
          serialNumber: "1",
          particulars: "Test Entrance Fee",
          serviceCode: "-",
          amount: 1000,
          quantity: 1000,
        },
        {
          serialNumber: "2",
          particulars: "Test Membership Fee",
          serviceCode: "-",
          amount: 2000,
          quantity: 1000,

        }
      ],
      igstRow: {
        serialNumber: "",
        particulars: "IGST",
        serviceCode: "-",
        amount: 540,
      },
      totalAmount: 3540,
      amountInWords: "INR THREE THOUSAND FIVE HUNDRED AND FORTY ONLY",
      igstDetails: [
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
      totalTaxAmount: 540,
      taxAmountInWords: "INR FIVE HUNDRED AND FORTY ONLY"
    };

    // For now, always use canvas since @vercel/og has deployment complexity
    // In production Vercel, use the dedicated /api/vercel-invoice endpoint
    console.log("Using canvas for invoice generation");

    // Use canvas for local development


    const invoiceBuffer = await generateInvoice({
      invoiceNumber: "INV-2025-001",
      invoiceDate: "2025-09-03",
      referenceNumber: "REF-12345",
      otherReference: "PO-56789",
      clientMobile: "9876543210",
      clientEmail: "client@example.com",
      clientAddress: {
      line1: "John Doe",
      line2: "123, Main Street, Business Park",
      state: "Tamil Nadu",
      code: "33",
    },
      items: [
      {
        serialNumber: 1,
        particulars: "Website Development Services",
        serviceCode: "998313",
        quantity: 1,
        rate: 50000,
        amount: 50000,
      },
      {
        serialNumber: 2,
        particulars: "Mobile App Development",
        serviceCode: "998314",
        quantity: 1,
        rate: 30000,
        amount: 30000,
      },
    ],
      igstRow: {
      serialNumber: "",
      particulars: "IGST",
      serviceCode: "-",
      amount: 14400,
    },
      totalAmount: 94400,
      amountInWords: "INR NINETY FOUR THOUSAND FOUR HUNDRED ONLY",
      gst: {
      igstDetails: [
        {
          HSNserial: "999599",
          taxableValue: 80000,
          igst: {
            rate: "18%",
            amount: 14400,
          },
          totalTax: 14400,
        },
      ],
    },
      totalTaxAmount: 14400,
      taxAmountInWords: "INR FOURTEEN THOUSAND FOUR HUNDRED ONLY"}
    );
    console.log("lsndkjashdkjashdkjhasdkjhasdjkhasjkdhjkasdhjkashdkjads");

    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Length', invoiceBuffer.length);
    res.setHeader('Content-Disposition', 'inline; filename="invoice.jpeg"');

    return res.status(200).send(invoiceBuffer);

  } catch (error) {
    console.error("Smart invoice generation failed:", error);

    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      environment: process.env.NODE_ENV || 'development',
      platform: process.platform,
      vercel: process.env.VERCEL ? 'true' : 'false'
    });
  }
}

// This endpoint works in both edge and node runtime
export const config = {
  api: {
    responseLimit: '10mb',
  },
};