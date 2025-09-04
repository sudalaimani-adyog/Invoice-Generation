import { createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas";
import path from "path";
import fs from "fs";

GlobalFonts.registerFromPath(
  path.join(process.cwd(), "public/fonts/ARIAL.TTF"),
  "Arial"
);
GlobalFonts.registerFromPath(
  path.join(process.cwd(), "public/fonts/ARIAL.TTF"),
  "Arial-Bold"
);
GlobalFonts.registerFromPath(
  path.join(process.cwd(), "public/fonts/trebuc.ttf"),
  "Trebuchet MS"
);

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

let logo;
  try {
    // Try multiple possible logo paths for different environments
    const possibleLogoPaths = [
      path.join(process.cwd(), "public/images/logo.png"),
      path.join(process.cwd(), "public/images/logo-nipm.png"),
      "./public/images/logo.png",
      "public/images/logo.png"
    ];
    
    let logoPath = null;
    for (const testPath of possibleLogoPaths) {
      if (fs.existsSync(testPath)) {
        logoPath = testPath;
        break;
      }
    }
    
    if (!logoPath) {
      throw new Error("Logo file not found in any expected location");
    }
    
    logo = await loadImage(logoPath);
  } catch (error) {
    console.error("Failed to load logo image:", error);
    // Create a placeholder logo or continue without logo
    logo = null;
  }

  // Helper function to draw text with alignment
  function drawText(text, x, y, font = "20px Arial", align = "left") {
    context.font = font;
    context.textAlign = align;
    context.fillText(text, x, y);
  }

  // Helper function to draw multi-line text
  function drawMultilineText(text, x, y, font = "20px Arial", align = "left", lineHeight = 20) {
    const fallbackFont = font.replace(/Arial/g, 'Arial, Helvetica, "DejaVu Sans", "Liberation Sans", FreeSans, sans-serif');
    
    try {
      context.font = font;
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

  // Set background to white
  context.fillStyle = "#fff";
  context.fillRect(0, 0, width, height);

  // Draw header with logo
  context.fillStyle = "#fff";
  context.fillRect(0, 0, width, 40);
  if (logo) {
    context.drawImage(logo, 15, 55, 80, 80);
  } else {
    // Draw placeholder text or rectangle for logo
    context.fillStyle = "#ccc";
    context.fillRect(15, 55, 80, 80);
    context.fillStyle = "#000";
    drawText("LOGO", 55, 100, "12px Arial", "center");
  }
  context.fillStyle = "#000";
  drawText("TAX INVOICE", width / 2, 30, "20px Arial", "center");

  const halfWidth = width / 2; // Calculate the x-coordinate for the half-width of the canvas

  // Draw vertical line at the half page
  context.strokeStyle = "#000"; // Set the color of the line
  context.lineWidth = 1.5; // Set the width of the line
  context.beginPath();
  context.moveTo(halfWidth, 41); // Start the line at the top of the canvas
  context.lineTo(halfWidth, 300); // Draw the line to the bottom of the canvas
  context.stroke(); // Draw the line

  // Draw a border line below "TAX INVOICE"
  context.strokeStyle = "#000"; // Set border color
  context.lineWidth = 1.5; // Set border width
  context.beginPath();
  context.moveTo(0, 40); // Start position of the line
  context.lineTo(width, 40); // End position of the line
  context.stroke(); // Draw the line

  // Company Details (hardcoded)
  context.fillStyle = "#0000FF";
  drawText("National Institute of Personnel Management", 110, 60, "13px Arial");
  drawText(
    "Southend Conclave, Tower Block (3rd Floor),",
    110,
    75,
    "13px Arial"
  );
  drawText("1582, Rajdanga Main Road Kolkata – 700 107", 110, 90, "13px Arial");
  drawText("State Name : West Bengal, ", 110, 120, "13px Arial");
  drawText("Code : 19", 110, 135, "13px Arial");
  drawText("E-Mail : manager.accounts@nipm.in", 110, 150, "13px Arial");
  drawText("GSTIN/UIN: 19AAATN2126N1ZD", 110, 105, "13px Arial");

  // border line below company details

  context.strokeStyle = "#000"; // Set border color
  context.lineWidth = 1.5; // Set border width
  context.beginPath();
  context.moveTo(0, 170); // Start position of the line
  context.lineTo(400, 170); // End position of the line
  context.stroke(); // Draw the line

  // Client Details
  const safeClientAddress = clientAddress || {};
  context.fillStyle = "#000";
  drawText("Buyer (Bill to):", 10, 190, "12px Arial");
  drawText(safeClientAddress.line1, 10, 220, "12px Arial");
  drawText(safeClientAddress.line2, 10, 235, "12px Arial");
  drawText(`Mobile: ${clientMobile}`, 10, 265, "12px Arial");
  drawText(`Email: ${clientEmail}`, 10, 280, "12px Arial");
  drawText(`State: ${safeClientAddress.State}`, 10, 295, "12px Arial");
  drawText(`Code: ${safeClientAddress.Code}`, 180, 295, "12px Arial");

  // border line below client details

  context.strokeStyle = "#000"; // Set border color
  context.lineWidth = 1.5; // Set border width
  context.beginPath();
  context.moveTo(0, 300); // Start position of the line
  context.lineTo(width, 300); // End position of the line
  context.stroke(); // Draw the line

  // Invoice Details
  // const lastPart = invoiceNumber.split("/").pop(); // => "833"
  const formattedReference = otherReference; // Use the actual otherReference passed from certificateInvoiceGenerator
  drawMultilineText(`Invoice Number:\n${invoiceNumber}`, 405, 60, "14px Arial", "left");
  drawMultilineText(`Dated: \n${date}`, 600, 60, "14px Arial");
  drawMultilineText( `Reference No. & Date: \n${formattedReference}`,
    405,
    115,
    "14px Arial"
  );
  
  drawMultilineText(`Other References: \n${otherReference}`, 600, 115, "14px Arial");

  context.strokeStyle = "#000"; // Set border color
  context.lineWidth = 1.5; // Set border width
  context.beginPath();
  context.moveTo(400, 95); // Start position of the line
  context.lineTo(width, 95); // End position of the line
  context.stroke(); // Draw the line

  // border line after first row of invoice details

  context.strokeStyle = "#000"; // Set border color
  context.lineWidth = 1.5; // Set border width
  context.beginPath();
  context.moveTo(400, 150); // Start position of the line
  context.lineTo(width, 150); // End position of the line
  context.stroke(); // Draw the line

  // Table Header
  context.fillStyle = "#fff";
  context.fillRect(0, 301, width, 30);
  context.fillStyle = "#000";
  drawText("SI No.", 40, 322, "14px Arial");
  drawText("Particulars", 300, 322, "14px Arial");
  drawText("HSN/SAC", 550, 322, "14px Arial");
  drawText("Amount", 680, 322, "14px Arial");

  // border line after headers

  context.strokeStyle = "#000"; // Set border color
  context.lineWidth = 1.5; // Set border width
  context.beginPath();
  context.moveTo(0, 350); // Start position of the line
  context.lineTo(width, 350); // End position of the line
  context.stroke(); // Draw the line

  // Table Rows with borders
  context.fillStyle = "#000";
  context.lineWidth = 1.5;
  let startY = 380;
  if (Array.isArray(items)) {
    items.forEach((item, index) => {
      const y = startY + index * 30;
      drawText(item.serialNumber, 50, y, "14px Arial");
      drawText(item.particulars, 200, y, "bold 14px Arial");
      drawText("999599", 550, y, "14px Arial");

      const amount = parseFloat(item.amount ?? 0); // ✅ Ensure it's a number
      drawText(amount?.toFixed(2), 680, y, "bold 14px Arial");
      // context.strokeRect(20, y - 20, width - 40, 30);
    });
  } else {
    console.log("Expected 'items' to be an array but got:", items);
  }

  // igst row
  if (igstRow && igstRow.particulars) {
    drawText(igstRow.particulars, 430, 445, "bold 14px Arial");
    drawText((igstRow.amount ?? 0)?.toFixed(2), 680, 445, "bold 14px Arial");
  }

  // border line after particulars details

  context.strokeStyle = "#000"; // Set border color
  context.lineWidth = 1.5; // Set border width
  context.beginPath();
  context.moveTo(0, 600); // Start position of the line
  context.lineTo(width, 600); // End position of the line
  context.stroke(); // Draw the line

  // Total amount details - use the passed totalAmount instead of calculating
  drawText("Total", 480, 610, "bold 14px Arial");
  drawText(`₹ ${totalAmount?.toFixed(2)}`, 680, 610, "bold 14px Arial");

  // border line after total details

  context.strokeStyle = "#000"; // Set border color
  context.lineWidth = 1.5; // Set border width
  context.beginPath();
  context.moveTo(0, 630); // Start position of the line
  context.lineTo(width, 630); // End position of the line
  context.stroke(); // Draw the line

  // Amount in words
  console.log('Amount in words:', amountInWords);
  console.log('Total amount:', totalAmount);
  
  drawText("Amount Chargeable (in words)", 30, 640, "14px Arial");
  drawText(`${amountInWords}`, 30, 660, "bold 14px Arial");
  drawText("E. & O.E", 630, 640, "14px Arial");

  // border line after Amount in words

  context.strokeStyle = "#000"; // Set border color
  context.lineWidth = 1.5; // Set border width
  context.beginPath();
  context.moveTo(0, 680); // Start position of the line
  context.lineTo(width, 680); // End position of the line
  context.stroke(); // Draw the line

  // GST details header

  drawText("HSN/SAC", 200, 685, "14px Arial");
  drawMultilineText(`Taxable\nValue`, 490, 685, "14px Arial");
  drawText("IGST", 600, 690, "14px Arial");
  drawText("Rate", 570, 705, "13px Arial");
  drawText("Amount", 620, 705, "13px Arial");
  drawMultilineText(`Total Tax\nAmount`, 710, 685, "14px Arial");

  // border line after GST header

  context.strokeStyle = "#000"; // Set border color
  context.lineWidth = 1.5; // Set border width
  context.beginPath();
  context.moveTo(0, 720); // Start position of the line
  context.lineTo(width, 720); // End position of the line
  context.stroke(); // Draw the line

  // border line for IGST table

  context.strokeStyle = "#000"; // Set border color
  context.lineWidth = 1.5; // Set border width
  context.beginPath();
  context.moveTo(0, 740); // Start position of the line
  context.lineTo(width, 740); // End position of the line
  context.stroke(); // Draw the line

  // GST table details
  console.log('=== GST Table Debug ===');
  console.log('igstDetails:', JSON.stringify(igstDetails, null, 2));
  
  if (Array.isArray(igstDetails)) {
    igstDetails.forEach((item, index) => {
      let startY = 725;
      const y = startY + index * 30;

      drawText("999599", 200, y, "bold 13px Arial");  // Aligned with HSN/SAC header at x=200
      drawText(Number(item.taxableValue || 0)?.toFixed(2), 490, y, "bold 13px Arial");
      drawText(item.igst?.rate ?? "", 570, y, "bold 13px Arial");
      drawText(Number(item.igst?.amount || 0)?.toFixed(2), 620, y, "bold 13px Arial");
      drawText(Number(item.totalTax || 0)?.toFixed(2), 720, y, "bold 13px Arial");
    });
  } else {
    console.log('ERROR: igstDetails is not an array:', typeof igstDetails, igstDetails);
  }

  // totalTaxAmount row details
  if (Array.isArray(igstDetails) && igstDetails.length > 0) {
    // Calculate totals from all items
    const totalTaxableValue = igstDetails.reduce((sum, item) => sum + Number(item.taxableValue || 0), 0);
    const totalIgstAmount = igstDetails.reduce((sum, item) => sum + Number(item.igst?.amount || 0), 0);
    const totalTaxAmount = igstDetails.reduce((sum, item) => sum + Number(item.totalTax || 0), 0);
    
    const y = 745;
    drawText("Total", 440, y, "bold 13px Arial");
    drawText(totalTaxableValue?.toFixed(2), 490, y, "bold 13px Arial");
    drawText(totalIgstAmount?.toFixed(2), 620, y, "bold 13px Arial");
    drawText(totalTaxAmount?.toFixed(2), 720, y, "bold 13px Arial");
  }

  // border line at end for IGST table

  context.strokeStyle = "#000"; // Set border color
  context.lineWidth = 1.5; // Set border width
  context.beginPath();
  context.moveTo(0, 760); // Start position of the line
  context.lineTo(width, 760); // End position of the line
  context.stroke(); // Draw the line

  // Tax amount in words section

  drawText("Tax Amount (in words):", 10, 775, "14px Arial");
  drawText(`${taxAmountInWords}`, 160, 775, "bold 14px Arial");

  // border line after amount in words section

  context.strokeStyle = "#000"; // Set border color
  context.lineWidth = 1.5; // Set border width
  context.beginPath();
  context.moveTo(0, 800); // Start position of the line
  context.lineTo(width, 800); // End position of the line
  context.stroke(); // Draw the line

  // Draw vertical line at the last section page
  context.strokeStyle = "#000"; // Set the color of the line
  context.lineWidth = 1.5; // Set the width of the line
  context.beginPath();
  context.moveTo(halfWidth, 975); // Start the line at the top of the canvas
  context.lineTo(halfWidth, 800); // Draw the line to the bottom of the canvas
  context.stroke(); // Draw the line

  // Declation section

  drawMultilineText(
    `Declaration: We declare that this invoice shows the actual\nprice of the services described and that all particulars\nare true and correct.`,
    10,
    820,
    "14px Arial",
    "left",
    16
  );

  drawMultilineText(
    `Bank Details: State Bank of India, Account Number:\n10513447918, IFSC: SBIN0001749, Branch: Park Circus,\nKolkata`,
    10,
    890,
    "14px Arial",
    "left",
    16
  );

  // Last Section

  drawText(
    "for National Institute of Personnel Management",
    405,
    815,
    "bold 13px Arial"
  );

  drawText("SOMEN ROY ", 405, 850, "bold 19px Trebuchet MS");
  drawText("Digitally signed by SOMEN ROY", 520, 855, "13px Trebuchet MS");
  drawMultilineText(
    "DN: cn=SOMEN ROY, o=National Institute of Personnel\nManagement, ou=Kolkata,\nemail=manager.accounts@nipm.in, c=IN",
    405,
    875,
    "13px Trebuchet MS"
  );

  // drawText("Date: 2024.05.21 10:37:32 +05'30'", 405, 930, "13px Trebuchet MS");
  drawText("Authorised Signatory", 530, 960, "12px Arial");

  // border line at end of Invoice

  context.strokeStyle = "#000"; // Set border color
  context.lineWidth = 1.5; // Set border width
  context.beginPath();
  context.moveTo(0, 975); // Start position of the line
  context.lineTo(width, 975); // End position of the line
  context.stroke(); // Draw the line

  // Footer

  drawText("This is a Computer Generated Invoice", 270, 985, "14px Arial");

  const buffer = canvas.toBuffer("image/png");
  console.log("Invoice generated successfully.");
  return buffer;
  // fs.writeFileSync("invoice.png", buffer);
};


export default generateInvoice;
