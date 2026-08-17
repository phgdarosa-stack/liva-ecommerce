import { readdirSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const DIR = join(process.cwd(), "public", "images", "campaign");

async function main() {
  const files = readdirSync(DIR).filter((f) => f.toLowerCase().endsWith(".png"));

  for (const file of files) {
    const inputPath = join(DIR, file);
    const outputPath = join(DIR, file.replace(/\.png$/i, ".jpg"));

    await sharp(inputPath)
      .resize({ width: 1600, withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(outputPath);

    unlinkSync(inputPath);
    console.log(`✓ ${file} -> ${file.replace(/\.png$/i, ".jpg")}`);
  }

  console.log(`Concluído: ${files.length} imagens comprimidas.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
