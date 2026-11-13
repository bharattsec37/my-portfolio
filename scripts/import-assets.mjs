import { copyFile, mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const sourceDirectory = path.resolve(process.argv[2] ?? "C:/Users/BHARAT/Downloads/Protfolio");
const downloadsDirectory = path.dirname(sourceDirectory);
const projectDirectory = process.cwd();
const publicDirectory = path.join(projectDirectory, "public");
const certificateDirectory = path.join(publicDirectory, "certificates");
const imageDirectory = path.join(publicDirectory, "images");

const galleryAssets = [
  { source: "Devsprint.jpeg", output: "devsprint-winner.webp", event: "DevSprint Mini Hackathon", kind: "Certificate", usage: "Winner certificate", crop: true },
  { source: "Devsprint (1).jpg", output: "devsprint-team-photo.webp", event: "DevSprint Mini Hackathon", kind: "Event photo", usage: "Team photo with certificate", crop: false },
  { source: "Devsprint (2).jpg", output: "devsprint-event-photo.webp", event: "DevSprint Mini Hackathon", kind: "Event photo", usage: "Hackathon room photo", crop: false },
  { source: "Hack-it-out.png", output: "hack-it-out-winner.webp", event: "Hack-It-Out 2.0", kind: "Certificate", usage: "Winner - Logical Track certificate", crop: true },
  { source: "Hack-it-out  (1).jpg", output: "hack-it-out-team-photo.webp", event: "Hack-It-Out 2.0", kind: "Event photo", usage: "Team recognition photo", crop: false },
  { source: "Hack-it-out  (2).jpg", output: "hack-it-out-event-photo.webp", event: "Hack-It-Out 2.0", kind: "Event photo", usage: "Hack-It-Out team photo with trophies", crop: false },
  { source: "Robotic and automation.jpeg", output: "robotics-workshop-certificate.webp", event: "Robotics and Automation Workshop", kind: "Certificate", usage: "Workshop completion certificate", crop: true },
  { source: "Robotic and automation (1).jpeg", output: "robotics-prototype-photo.webp", event: "Robotics and Automation Workshop", kind: "Project photo", usage: "Robot prototype photo", crop: false },
  { source: "Robotic and automation (2).jpeg", output: "robotics-workshop-group.webp", event: "Robotics and Automation Workshop", kind: "Event photo", usage: "Workshop group photo", crop: false },
  { source: "SIH 1 internal.jpeg", fallbacks: ["TSEC hackthon.jpeg"], output: "sih-2025-certificate-1.webp", event: "SIH Internal Hackathon 2025", kind: "Certificate", usage: "Team Syntex Error participation certificate", crop: true },
  { source: "SIH 2 internal.jpeg", output: "sih-2026-certificate.webp", event: "AICTE SIH Internal Hackathon 2026", kind: "Certificate", usage: "Team MINE-X participation certificate", crop: true },
  { source: "Hackspark 2.0.jpeg", output: "hackspark-participation.webp", event: "HACKSPARK 2.0", kind: "Certificate", usage: "Participation certificate", crop: true },
  { source: "Yatri.png", output: "yatri-round1-certificate.webp", event: "Yatri Hackathon 2025", kind: "Certificate", usage: "Round 1 qualification certificate", crop: true },
  { source: "Yatri (1).jpeg", output: "yatri-collaboration-screenshot.webp", event: "Yatri Hackathon 2025", kind: "Project photo", usage: "Journey Coders collaboration screenshot", crop: false },
  { source: "Technical paper presentaion.jpeg", output: "vortex-paper-presentation.webp", event: "VORTEX 2025 - Technical Paper Presentation", kind: "Certificate", usage: "Participation certificate", crop: true },
  { source: "Tech teatoir.jpeg", output: "tech-traitors.webp", event: "Tech Traitors", kind: "Certificate", usage: "Participation certificate", crop: true },
  { source: "Modle making.jpeg", output: "model-making.webp", event: "SYNAPSE 2025 - Model Making", kind: "Certificate", usage: "Participation certificate", crop: true },
  { source: "Mistrey event - Tech hunt.jpeg", output: "tech-hunt-participant.webp", event: "Mystery Event - Tech Hunt", kind: "Certificate", usage: "Participation wording; third-place claim withheld pending review", crop: true },
  { source: "Innovriti.jpeg", output: "innovritti.webp", event: "INNOVRITTI 2025", kind: "Certificate", usage: "Pitching competition participation certificate", crop: true },
  { source: "DCA.jpeg", output: "diploma-computer-applications.webp", event: "Diploma in Computer Applications", kind: "Certificate", usage: "Grade A, 84% completion record", crop: true },
  { source: "Brand storming.jpeg", output: "brand-storming.webp", event: "Brand Storming", kind: "Certificate", usage: "Participation certificate", crop: true },
];

await mkdir(certificateDirectory, { recursive: true });
await mkdir(imageDirectory, { recursive: true });

const portraitSource = path.join(downloadsDirectory, "Professional Portrait with Blue Halo.png");
if (existsSync(portraitSource)) {
  await sharp(portraitSource).rotate().resize(1000, 1000, { fit: "cover", position: "attention" }).webp({ quality: 88, effort: 5 }).toFile(path.join(imageDirectory, "bharat-patel.webp"));
}

const inventory = [];

for (const asset of galleryAssets) {
  let sourcePath = path.join(sourceDirectory, asset.source);
  if (!existsSync(sourcePath) && asset.fallbacks) {
    for (const fb of asset.fallbacks) {
      const fbPath = path.join(sourceDirectory, fb);
      if (existsSync(fbPath)) {
        sourcePath = fbPath;
        break;
      }
    }
  }

  if (!existsSync(sourcePath)) {
    // If output file already exists in public/certificates, keep it in inventory
    const destPath = path.join(certificateDirectory, asset.output);
    if (existsSync(destPath)) {
      inventory.push({
        originalFilename: asset.source,
        category: asset.kind,
        associatedEvent: asset.event,
        format: path.extname(asset.source).slice(1).toUpperCase(),
        recommendedUsage: asset.usage,
        processingStatus: "Preserved existing WebP derivative in public/certificates",
      });
    }
    continue;
  }

  const input = sharp(sourcePath).rotate();
  const prepared = asset.crop ? input.trim({ threshold: 22 }) : input;
  const width = asset.kind === "Certificate" ? 2200 : 1800;
  await prepared.resize({ width, withoutEnlargement: true }).webp({ quality: asset.kind === "Certificate" ? 93 : 86, effort: 6 }).toFile(path.join(certificateDirectory, asset.output));

  inventory.push({
    originalFilename: asset.source,
    category: asset.kind,
    associatedEvent: asset.event,
    format: path.extname(asset.source).slice(1).toUpperCase(),
    recommendedUsage: asset.usage,
    processingStatus: asset.crop ? "Cropped to paper edges and exported as readable WebP" : "Resized and exported as WebP; original preserved",
  });
}

const yatriPdf = path.join(downloadsDirectory, "Yatri.pdf");
if (existsSync(yatriPdf)) {
  await copyFile(yatriPdf, path.join(certificateDirectory, "yatri.pdf"));
  inventory.push({ originalFilename: "Yatri.pdf", category: "Certificate document", associatedEvent: "Yatri Hackathon 2025", format: "PDF", recommendedUsage: "Original Round 1 qualification certificate viewer", processingStatus: "Copied unchanged to public/certificates/yatri.pdf" });
}

const resumePdf = path.join(downloadsDirectory, "Bharat_Patel_Resume_General.pdf");
const resumeSource = existsSync(resumePdf) ? resumePdf : path.join(downloadsDirectory, "Bharat_Patel_Resume.pdf");
if (existsSync(resumeSource)) {
  await copyFile(resumeSource, path.join(publicDirectory, "bharat-patel-resume.pdf"));
  inventory.push({ originalFilename: path.basename(resumeSource), category: "Resume", associatedEvent: "Profile", format: "PDF", recommendedUsage: "Public resume download", processingStatus: "Copied unchanged to public/bharat-patel-resume.pdf" });
}

await writeFile(path.join(publicDirectory, "asset-inventory.json"), JSON.stringify(inventory, null, 2), "utf8");
console.log(`Successfully processed ${inventory.length} assets.`);
await writeFile(path.join(publicDirectory, "asset-inventory.json"), `${JSON.stringify(inventory, null, 2)}\n`);

console.log(`Processed ${galleryAssets.length} achievement media files, portrait, resume and inventory.`);