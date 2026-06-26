/**
 * Seed Firestore with sample equipment and categories.
 *
 * Prerequisites:
 * 1. Download Firebase service account JSON from Firebase Console
 * 2. Save as firebase-service-account.json in project root
 * 3. Run: npm run seed
 */

import { readFileSync } from "fs";
import { resolve } from "path";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

const serviceAccountPath =
  process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
  resolve(process.cwd(), "firebase-service-account.json");

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

async function main() {
  let serviceAccount;
  try {
    serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf-8"));
  } catch {
    console.error(
      "Could not read service account file at:",
      serviceAccountPath,
      "\nDownload from Firebase Console > Project Settings > Service Accounts"
    );
    process.exit(1);
  }

  if (getApps().length === 0) {
    initializeApp({ credential: cert(serviceAccount) });
  }

  const db = getFirestore();
  const samplePath = resolve(process.cwd(), "firebase/sample-data.json");
  const sampleData = JSON.parse(readFileSync(samplePath, "utf-8"));

  console.log("Seeding categories...");
  for (const category of sampleData.categories) {
    await db.collection("categories").add(category);
    console.log(`  + ${category.name}`);
  }

  console.log("\nSeeding equipment...");
  const baseDate = new Date("2025-06-01");
  for (let i = 0; i < sampleData.equipment.length; i++) {
    const item = sampleData.equipment[i];
    const dateAdded = new Date(baseDate);
    dateAdded.setDate(dateAdded.getDate() + i * 3);

    await db.collection("equipment").add({
      ...item,
      slug: slugify(`${item.brand}-${item.model}-${item.title}`),
      dateAdded: Timestamp.fromDate(dateAdded),
    });
    console.log(`  + ${item.title} — £${item.price}`);
  }

  console.log("\nDone! Seeded", sampleData.categories.length, "categories and", sampleData.equipment.length, "equipment items.");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
