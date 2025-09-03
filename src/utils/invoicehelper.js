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