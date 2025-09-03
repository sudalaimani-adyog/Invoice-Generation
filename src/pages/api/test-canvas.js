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