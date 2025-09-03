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
  function drawText(text, x, y, font = "16px monospace", align = "left") {
    try {
      // Reset context properties for each text draw
      context.save();
      
      // Set font with multiple fallbacks
      context.font = font;
      context.textAlign = align;
      context.fillStyle = "#000000";
      context.textBaseline = "top";
      
      // Verify font is set correctly
      const testMetrics = context.measureText("test");
      if (testMetrics.width === 0) {
        // Font failed, use system monospace
        context.font = "16px monospace";
      }
      
      // Draw the text
      context.fillText(String(text || ""), x, y);
      
      context.restore();
    } catch (error) {
      console.error("Error drawing text:", error);
      // Emergency fallback
      context.font = "12px monospace";
      context.fillStyle = "#000000";
      context.textAlign = align;
      context.fillText(String(text || ""), x, y);
    }
  }

  // Helper function to draw multi-line text
  function drawMultilineText(text, x, y, font = "14px monospace", align = "left", lineHeight = 18) {
    try {
      context.save();
      
      context.font = font;
      context.textAlign = align;
      context.fillStyle = "#000000";
      context.textBaseline = "top";
      
      // Verify font works
      const testMetrics = context.measureText("test");
      if (testMetrics.width === 0) {
        context.font = "14px monospace";
      }
      
      const lines = String(text || "").split('\n');
      lines.forEach((line, index) => {
        context.fillText(line.trim(), x, y + (index * lineHeight));
      });
      
      context.restore();
    } catch (error) {
      console.error("Error drawing multiline text:", error);
      context.font = "12px monospace";
      context.fillStyle = "#000000";
      context.textAlign = align;
      const lines = String(text || "").split('\n');
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
  
  // Test canvas text rendering capabilities
  try {
    context.font = "12px monospace";
    const testText = "Test";
    const metrics = context.measureText(testText);
    console.log("Canvas text rendering test:", {
      font: context.font,
      textWidth: metrics.width,
      status: metrics.width > 0 ? "OK" : "FAILED",
      environment: process.env.NODE_ENV || 'development',
      platform: process.platform
    });
    
    // Force a simple text render to verify
    context.fillStyle = "#000000";
    context.textAlign = "left";
    context.textBaseline = "top";
    context.fillText("DEBUG: Text Render Test", 10, 10);
    
  } catch (error) {
    console.error("Canvas text rendering test failed:", error);
  }

  // Draw header
  context.fillStyle = "#000";
  drawText("TAX INVOICE", width / 2, 30, "18px monospace", "center");

  // Company info
  drawText("NIPM TEST COMPANY", 15, 70, "14px monospace");
  drawText("123 Test Street", 15, 90, "12px monospace");
  drawText("Test City, Test State", 15, 110, "12px monospace");

  // Invoice details
  drawText(`Invoice No: ${invoiceNumber}`, 15, 150, "12px monospace");
  drawText(`Date: ${date}`, 15, 170, "12px monospace");
  
  // Client details
  drawText("Bill To:", 15, 210, "14px monospace");
  drawText(clientAddress.line1, 15, 230, "12px monospace");
  drawText(clientAddress.line2, 15, 250, "12px monospace");
  drawText(`${clientAddress.State} - ${clientAddress.Code}`, 15, 270, "12px monospace");
  drawText(`Mobile: ${clientMobile}`, 15, 290, "12px monospace");
  drawText(`Email: ${clientEmail}`, 15, 310, "12px monospace");

  // Draw table headers
  let y = 350;
  context.strokeStyle = "#000";
  context.lineWidth = 1;
  context.strokeRect(15, y, width - 30, 30);
  
  drawText("S.No", 25, y + 5, "12px monospace");
  drawText("Particulars", 100, y + 5, "12px monospace");
  drawText("Amount", width - 100, y + 5, "12px monospace");

  // Draw items
  y += 30;
  items.forEach(item => {
    context.strokeRect(15, y, width - 30, 30);
    drawText(item.serialNumber, 25, y + 5, "12px monospace");
    drawText(item.particulars, 100, y + 5, "12px monospace");
    drawText(item.amount.toString(), width - 100, y + 5, "12px monospace");
    y += 30;
  });

  // Draw IGST row
  context.strokeRect(15, y, width - 30, 30);
  drawText("", 25, y + 5, "12px monospace");
  drawText(igstRow.particulars, 100, y + 5, "12px monospace");
  drawText(igstRow.amount.toString(), width - 100, y + 5, "12px monospace");
  y += 30;

  // Draw total
  context.strokeRect(15, y, width - 30, 30);
  drawText("TOTAL", 100, y + 5, "14px monospace");
  drawText(totalAmount.toString(), width - 100, y + 5, "14px monospace");
  y += 30;

  // Amount in words
  drawText(`Amount in words: ${amountInWords}`, 15, y + 20, "12px monospace");
  y += 50;

  // Declaration section
  drawMultilineText(
    `Declaration: We declare that this invoice shows the actual\nprice of the services described and that all particulars\nare true and correct.`,
    15,
    y + 20,
    "12px monospace",
    "left",
    16
  );

  // Bank details
  drawMultilineText(
    `Bank Details: State Bank of India, Account Number:\n10513447918, IFSC: SBIN0001749, Branch: Park Circus,\nKolkata`,
    15,
    y + 80,
    "12px monospace",
    "left",
    16
  );

  // Convert canvas to buffer
  const buffer = canvas.toBuffer('image/jpeg');
  
  return buffer;
};

export default generateInvoice;