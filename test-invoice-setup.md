# Invoice Generation Test Setup Guide

## Step 1: Create New Next.js App

```bash
# Create a new Next.js app
npx create-next-app@latest test-invoice-app
cd test-invoice-app

# When prompted, select:
# ✔ Would you like to use TypeScript? No
# ✔ Would you like to use ESLint? Yes
# ✔ Would you like to use Tailwind CSS? No
# ✔ Would you like to use `src/` directory? Yes
# ✔ Would you like to use App Router? No
# ✔ Would you like to customize the default import alias? No
```

## Step 2: Install Required Dependencies

```bash
# Install canvas library for invoice generation
npm install @napi-rs/canvas

# Install additional dependencies
npm install moment number-to-words
```

## Step 3: Create the Invoice Helper File

Create `src/utils/invoicehelper.js`:

```javascript
import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "path";
import fs from "fs";

const generateInvoice = async (
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
  const width = 800;
  const height = 1000;
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  // Helper function to draw text with alignment and font fallbacks
  function drawText(text, x, y, font = "20px Arial", align = "left") {
    // Use system font stack with fallbacks for better compatibility in serverless environments
    const fallbackFont = font.replace(/Arial/g, 'Arial, Helvetica, "DejaVu Sans", "Liberation Sans", FreeSans, sans-serif');
    
    try {
      context.font = fallbackFont;
      context.textAlign = align;
      context.fillStyle = "#000000"; // Ensure text color is black
      context.textBaseline = "top"; // Consistent baseline
      
      // Fallback to default font if the specified font fails
      if (!context.font || context.font === fallbackFont) {
        context.font = font.replace(/Arial/g, 'sans-serif');
      }
      
      context.fillText(text || "", x, y);
    } catch (error) {
      console.error("Error drawing text:", error);
      // Final fallback - use basic sans-serif
      context.font = "16px sans-serif";
      context.fillText(text || "", x, y);
    }
  }

  // Helper function to draw multi-line text
  function drawMultilineText(text, x, y, font = "20px Arial", align = "left", lineHeight = 20) {
    const fallbackFont = font.replace(/Arial/g, 'Arial, Helvetica, "DejaVu Sans", "Liberation Sans", FreeSans, sans-serif');
    
    try {
      context.font = fallbackFont;
      context.textAlign = align;
      context.fillStyle = "#000000"; // Ensure text color is black
      context.textBaseline = "top"; // Consistent baseline
      
      // Fallback to default font if the specified font fails
      if (!context.font || context.font === fallbackFont) {
        context.font = font.replace(/Arial/g, 'sans-serif');
      }
      
      const lines = (text || "").split('\n');
      lines.forEach((line, index) => {
        context.fillText(line.trim(), x, y + (index * lineHeight));
      });
    } catch (error) {
      console.error("Error drawing multiline text:", error);
      // Final fallback - use basic sans-serif
      context.font = "16px sans-serif";
      const lines = (text || "").split('\n');
      lines.forEach((line, index) => {
        context.fillText(line.trim(), x, y + (index * lineHeight));
      });
    }
  }

  // Set background to white and initialize canvas
  context.fillStyle = "#fff";
  context.fillRect(0, 0, width, height);
  
  // Initialize canvas context for text rendering
  context.fillStyle = "#000000";
  context.strokeStyle = "#000000";
  context.textBaseline = "top";
  context.textAlign = "left";
  
  // Test if canvas text rendering is working
  try {
    context.font = "12px sans-serif";
    const testText = "Test";
    const metrics = context.measureText(testText);
    console.log("Canvas text rendering test:", {
      font: context.font,
      textWidth: metrics.width,
      status: metrics.width > 0 ? "OK" : "FAILED",
      environment: process.env.NODE_ENV || 'development'
    });
    
    // Draw a test text to verify rendering
    context.fillStyle = "#000";
    context.fillText("DEBUG: Canvas Text Test", 10, 10);
    
  } catch (error) {
    console.error("Canvas text rendering test failed:", error);
  }

  // Draw header
  context.fillStyle = "#000";
  drawText("TAX INVOICE", width / 2, 30, "20px sans-serif", "center");

  // Company info
  drawText("NIPM TEST COMPANY", 15, 70, "16px sans-serif");
  drawText("123 Test Street", 15, 90, "14px sans-serif");
  drawText("Test City, Test State", 15, 110, "14px sans-serif");

  // Invoice details
  drawText(`Invoice No: ${invoiceNumber}`, 15, 150, "14px sans-serif");
  drawText(`Date: ${date}`, 15, 170, "14px sans-serif");
  
  // Client details
  drawText("Bill To:", 15, 210, "16px sans-serif");
  drawText(clientAddress.line1, 15, 230, "14px sans-serif");
  drawText(clientAddress.line2, 15, 250, "14px sans-serif");
  drawText(`${clientAddress.State} - ${clientAddress.Code}`, 15, 270, "14px sans-serif");
  drawText(`Mobile: ${clientMobile}`, 15, 290, "14px sans-serif");
  drawText(`Email: ${clientEmail}`, 15, 310, "14px sans-serif");

  // Draw table headers
  let y = 350;
  context.strokeStyle = "#000";
  context.lineWidth = 1;
  context.strokeRect(15, y, width - 30, 30);
  
  drawText("S.No", 25, y + 5, "14px sans-serif");
  drawText("Particulars", 100, y + 5, "14px sans-serif");
  drawText("Amount", width - 100, y + 5, "14px sans-serif");

  // Draw items
  y += 30;
  items.forEach(item => {
    context.strokeRect(15, y, width - 30, 30);
    drawText(item.serialNumber, 25, y + 5, "14px sans-serif");
    drawText(item.particulars, 100, y + 5, "14px sans-serif");
    drawText(item.amount.toString(), width - 100, y + 5, "14px sans-serif");
    y += 30;
  });

  // Draw IGST row
  context.strokeRect(15, y, width - 30, 30);
  drawText("", 25, y + 5, "14px sans-serif");
  drawText(igstRow.particulars, 100, y + 5, "14px sans-serif");
  drawText(igstRow.amount.toString(), width - 100, y + 5, "14px sans-serif");
  y += 30;

  // Draw total
  context.strokeRect(15, y, width - 30, 30);
  drawText("TOTAL", 100, y + 5, "16px sans-serif");
  drawText(totalAmount.toString(), width - 100, y + 5, "16px sans-serif");
  y += 30;

  // Amount in words
  drawText(`Amount in words: ${amountInWords}`, 15, y + 20, "14px sans-serif");
  y += 50;

  // Declaration section
  drawMultilineText(
    `Declaration: We declare that this invoice shows the actual\nprice of the services described and that all particulars\nare true and correct.`,
    15,
    y + 20,
    "14px sans-serif",
    "left",
    16
  );

  // Bank details
  drawMultilineText(
    `Bank Details: State Bank of India, Account Number:\n10513447918, IFSC: SBIN0001749, Branch: Park Circus,\nKolkata`,
    15,
    y + 80,
    "14px sans-serif",
    "left",
    16
  );

  // Convert canvas to buffer
  const buffer = canvas.toBuffer('image/jpeg');
  
  return buffer;
};

export default generateInvoice;
```

## Step 4: Create Test API Endpoint

Create `src/pages/api/test-invoice.js`:

```javascript
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
```

## Step 5: Create Debug Endpoint

Create `src/pages/api/test-canvas.js`:

```javascript
import { createCanvas } from "@napi-rs/canvas";

export default async function handler(req, res) {
  try {
    const width = 400;
    const height = 200;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // White background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Draw border
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.strokeRect(5, 5, width - 10, height - 10);

    // Test text rendering
    ctx.fillStyle = "#000000";
    ctx.font = "20px sans-serif";
    ctx.fillText("Canvas Text Test", 20, 50);
    
    ctx.font = "16px monospace";
    ctx.fillText(`Platform: ${process.platform}`, 20, 80);
    ctx.fillText(`Node: ${process.version}`, 20, 110);
    ctx.fillText(`ENV: ${process.env.NODE_ENV}`, 20, 140);

    const buffer = canvas.toBuffer('image/jpeg');
    
    res.setHeader('Content-Type', 'image/jpeg');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      platform: process.platform,
      node: process.version
    });
  }
}
```

## Step 6: Test Locally

```bash
# Run development server
npm run dev

# Test endpoints in browser or Postman:
# http://localhost:3000/api/test-canvas
# http://localhost:3000/api/test-invoice
```

## Step 7: Deploy to Vercel

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Deploy to Vercel
vercel

# Follow the prompts to link/create project
# After deployment, test the endpoints:
# https://your-app.vercel.app/api/test-canvas
# https://your-app.vercel.app/api/test-invoice
```

## Troubleshooting

### If text is not rendering in Vercel:

1. **Check Vercel logs** for any error messages
2. **Try the test-canvas endpoint first** - it's simpler and will help isolate the issue
3. **Check Node.js version** in `package.json`:
```json
{
  "engines": {
    "node": "18.x"
  }
}
```

4. **Alternative: Use @vercel/og for image generation** (if canvas continues to fail):
```bash
npm install @vercel/og
```

### Common Issues and Solutions:

1. **Missing fonts**: The code already includes font fallbacks
2. **Canvas module issues**: Make sure `@napi-rs/canvas` is installed correctly
3. **Memory issues**: Vercel has memory limits, keep images small for testing

## Test with CURL

```bash
# Test locally
curl http://localhost:3000/api/test-canvas -o test-canvas-local.jpg
curl http://localhost:3000/api/test-invoice -o test-invoice-local.jpg

# Test on Vercel
curl https://your-app.vercel.app/api/test-canvas -o test-canvas-vercel.jpg
curl https://your-app.vercel.app/api/test-invoice -o test-invoice-vercel.jpg
```

## Expected Results

- **Local**: Should generate complete invoice with all text visible
- **Vercel**: If text rendering issue exists, you'll see only borders/lines without text
- **Debug Info**: Check console logs in Vercel Functions tab for detailed error messages