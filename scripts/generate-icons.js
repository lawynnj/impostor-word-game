import sharp from "sharp";
import { readFileSync } from "fs";
import { join } from "path";

// Generate PNG icons from the SVG file
const createIcon = async (size, svgPath, outputPath) => {
  await sharp(svgPath)
    .resize(size, size, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .png()
    .toFile(outputPath);

  console.log(`Generated ${outputPath}`);
};

const generateIcons = async () => {
  const publicDir = join(process.cwd(), "public");
  const svgPath = join(publicDir, "icon.svg");

  await createIcon(180, svgPath, join(publicDir, "pwa-180x180.png"));
  await createIcon(192, svgPath, join(publicDir, "pwa-192x192.png"));
  await createIcon(512, svgPath, join(publicDir, "pwa-512x512.png"));

  console.log("All icons generated successfully!");
};

generateIcons().catch(console.error);
