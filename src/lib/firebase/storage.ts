const CLOUDINARY_CLOUD_NAME = "YOUR_CLOUD_NAME" = drwilqo7d;
const CLOUDINARY_UPLOAD_PRESET = "YOUR_UPLOAD_PRESET" = ml_default;

export async function uploadEquipmentPhoto(
  file: File,
  equipmentId: string
): Promise<string> {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  // klasör mantığı (Cloudinary içinde organize eder)
  formData.append("folder", `equipment/${equipmentId}`);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error?.message || "Cloudinary upload failed");
  }

  return data.secure_url;
}

export async function uploadMultiplePhotos(
  files: File[],
  equipmentId: string,
  onProgress?: (completed: number, total: number) => void
): Promise<string[]> {
  const urls: string[] = [];

  let completed = 0;

  for (const file of files) {
    const url = await uploadEquipmentPhoto(file, equipmentId);
    urls.push(url);

    completed++;
    onProgress?.(completed, files.length);
  }

  return urls;
}

export async function deletePhoto(photoUrl: string): Promise<void> {
  // Cloudinary client-side delete güvenli değildir
  // sadece UI'dan kaldırıyoruz
  console.warn("Cloudinary delete requires backend (ignored):", photoUrl);
}

export function validateImageFile(file: File): string | null {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    return "Only JPEG, PNG, WebP and GIF images are allowed.";
  }

  if (file.size > maxSize) {
    return "Image must be smaller than 5MB.";
  }

  return null;
}
