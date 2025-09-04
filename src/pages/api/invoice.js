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


    const invoiceBuffer = await generateInvoice(
      "NIPM/2025-26/855",
      "24-07-2025",
      "",
      "C 855",
      "9658741230",
      "mr@gmail.com",
      {
        line1: 'mani ratnam',
        line2: '272,Thalayari Street',
        State: '24',
        Code: '23232'
      },
      [
        {
          serialNumber: '1',
          particulars: 'Entrance Fees (IGST@18%)',
          serviceCode: '-',
          amount: 500
        },
        {
          serialNumber: '2',
          particulars: 'Membership Fees (IGST@18%)',
          serviceCode: '-',
          amount: 2000
        }
      ],
      {
        serialNumber: '',
        particulars: 'IGST',
        serviceCode: '-',
        amount: 450
      }, 
      2950, 
      "INR TWO THOUSAND, NINE HUNDRED FIFTY ONLY",
      [
        {
          HSNserial: '999599',
          taxableValue: 2950,
          igst: { rate: '18%', amount: 450 },
          totalTax: 450
        }
      ],
      "450",
      "INR FOUR HUNDRED FIFTY ONLY"
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