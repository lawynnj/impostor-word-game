import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { join } from 'path';

// Create a simple icon with text "I!" for Impostor
const createIcon = async (size, outputPath) => {
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="#6366f1" rx="${size * 0.2}"/>
      <text 
        x="50%" 
        y="50%" 
        font-family="Arial, sans-serif" 
        font-size="${size * 0.5}" 
        font-weight="bold" 
        fill="white" 
        text-anchor="middle" 
        dominant-baseline="central"
      >I!</text>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(outputPath);
  
  console.log(`Generated ${outputPath}`);
};

const generateIcons = async () => {
  const publicDir = join(process.cwd(), 'public');
  
  await createIcon(192, join(publicDir, 'pwa-192x192.png'));
  await createIcon(512, join(publicDir, 'pwa-512x512.png'));
  
  console.log('All icons generated successfully!');
};

generateIcons().catch(console.error);

