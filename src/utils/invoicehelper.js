import { createCanvas, GlobalFonts } from "@napi-rs/canvas";
import path from "path";

// ✅ Register fonts explicitly for Vercel
GlobalFonts.registerFromPath(
  path.join(process.cwd(), "public/fonts/ARIAL.TTF"),
  "Arial"
);
GlobalFonts.registerFromPath(
  path.join(process.cwd(), "public/fonts/ARIAL.TTF"),
  "Arial-Bold"
);
GlobalFonts.registerFromPath(
  path.join(process.cwd(), "public/fonts/ARIAL.TTF"),
  "Trebuchet MS"
);

 async function generateInvoice(invoiceData) {
  const width = 800;
  const height = 1000;
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  // White background
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);

  // ---------- TEXT HELPERS ----------
  function drawText(text, x, y, font = "14px Arial", align = "left") {
    context.font = font;
    context.textAlign = align;
    context.fillStyle = "#000000";
    context.textBaseline = "top";
    context.fillText(text || "", x, y);
  }

  function drawMultilineText(
    text,
    x,
    y,
    font = "14px Arial",
    align = "left",
    lineHeight = 20
  ) {
    context.font = font;
    context.textAlign = align;
    context.fillStyle = "#000000";
    context.textBaseline = "top";

    const lines = (text || "").split("\n");
    lines.forEach((line, index) => {
      context.fillText(line.trim(), x, y + index * lineHeight);
    });
  }

  // ---------- HEADER ----------
  drawText("INVOICE", width / 2, 40, "28px Arial-Bold", "center");
  drawText(`Invoice #: ${invoiceData.invoiceNumber}`, 50, 100, "16px Arial");
  drawText(`Date: ${invoiceData.date}`, 50, 130, "16px Arial");

  // ---------- BILLING ----------
  drawText("Bill To:", 50, 180, "18px Arial-Bold");
  drawMultilineText(
    `${invoiceData.customerName}\n${invoiceData.customerAddress}`,
    50,
    210,
    "16px Arial"
  );

  // ---------- TABLE HEADER ----------
  let startY = 300;
  drawText("Description", 50, startY, "18px Trebuchet MS");
  drawText("Quantity", 400, startY, "18px Trebuchet MS", "center");
  drawText("Price", 550, startY, "18px Trebuchet MS", "center");
  drawText("Total", 700, startY, "18px Trebuchet MS", "center");

  // ---------- TABLE ROWS ----------
  startY += 40;
  invoiceData.items.forEach((item) => {
    drawText(item.description, 50, startY, "16px Arial");
    drawText(item.quantity.toString(), 400, startY, "16px Arial", "center");
    drawText(`$${item.price}`, 550, startY, "16px Arial", "center");
    drawText(`$${item.total}`, 700, startY, "16px Arial", "center");
    startY += 30;
  });

  // ---------- TOTAL ----------
  startY += 40;
  drawText("Grand Total:", 550, startY, "18px Arial-Bold", "center");
  drawText(`$${invoiceData.grandTotal}`, 700, startY, "18px Arial-Bold", "center");

  return canvas.toBuffer("image/png");
}


export default generateInvoice;

