/**
 * Generates 150×150 placeholder PNG images for each reference function.
 * The user will replace these with their own hand-drawn graph images.
 *
 * Run: node generate-placeholders.js
 */
const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

function createChunk(type, data) {
  const typeBuffer = Buffer.from(type, 'ascii');
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const chunkData = Buffer.concat([typeBuffer, data]);
  const crc = zlib.crc32(chunkData);
  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc >>> 0, 0);
  return Buffer.concat([length, chunkData, crcBuffer]);
}

function createPNG(width, height, bgColor) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 2; // color type: RGB
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  const ihdr = createChunk('IHDR', ihdrData);

  // IDAT — raw pixel data with filter byte per row
  const rowSize = 1 + width * 3;
  const rawData = Buffer.alloc(height * rowSize);
  for (let y = 0; y < height; y++) {
    rawData[y * rowSize] = 0; // filter: none
    for (let x = 0; x < width; x++) {
      const offset = y * rowSize + 1 + x * 3;
      rawData[offset] = bgColor[0];
      rawData[offset + 1] = bgColor[1];
      rawData[offset + 2] = bgColor[2];
    }
  }
  const compressed = zlib.deflateSync(rawData);
  const idat = createChunk('IDAT', compressed);

  // IEND
  const iend = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

const functions = [
  { id: 'identity', color: [225, 235, 250] },
  { id: 'neg_identity', color: [225, 245, 230] },
  { id: 'quadratic', color: [255, 230, 225] },
  { id: 'neg_quadratic', color: [240, 225, 250] },
  { id: 'reciprocal', color: [255, 240, 225] },
  { id: 'square_root', color: [225, 245, 250] },
  { id: 'cubic', color: [250, 225, 240] },
  { id: 'natural_log', color: [230, 235, 240] },
  { id: 'exponential', color: [240, 230, 225] },
  { id: 'absolute_value', color: [225, 230, 255] },
  { id: 'sine', color: [225, 245, 245] },
  { id: 'cosine', color: [255, 235, 225] },
];

const dir = path.join(__dirname, 'assets', 'graphs');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

for (const func of functions) {
  const png = createPNG(150, 150, func.color);
  const filePath = path.join(dir, `${func.id}.png`);
  fs.writeFileSync(filePath, png);
  console.log(`Created ${filePath}`);
}

console.log('\nAll placeholder images created. Replace them with your own graph images!');
