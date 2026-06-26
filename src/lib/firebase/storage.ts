import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { getFirebaseStorage } from "./config";

export async function uploadEquipmentPhoto(
  file: File,
  equipmentId: string
): Promise<string> {
  const storage = getFirebaseStorage();
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const path = `equipment/${equipmentId}/${timestamp}-${safeName}`;
  const storageRef = ref(storage, path);

  await uploadBytes(storageRef, file, {
    contentType: file.type,
  });

  return getDownloadURL(storageRef);
}

export async function uploadMultiplePhotos(
  files: File[],
  equipmentId: string,
  onProgress?: (completed: number, total: number) => void
): Promise<string[]> {
  const urls: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const url = await uploadEquipmentPhoto(files[i], equipmentId);
    urls.push(url);
    onProgress?.(i + 1, files.length);
  }

  return urls;
}

export async function deletePhoto(photoUrl: string): Promise<void> {
  try {
    const storage = getFirebaseStorage();
    const storageRef = ref(storage, photoUrl);
    await deleteObject(storageRef);
  } catch {
    // Photo may be external URL — ignore deletion errors
  }
}

export function validateImageFile(file: File): string | null {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    return "Only JPEG, PNG, WebP and GIF images are allowed.";
  }
  if (file.size > maxSize) {
    return "Image must be smaller than 5MB.";
  }
  return null;
}
