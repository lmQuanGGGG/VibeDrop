export async function uploadImageToR2(
  file: File,
  folder: "prompts" | "avatars"
): Promise<{ key: string; publicUrl: string }> {
  const MAX_SIZE = 2 * 1024 * 1024; // 2MB fallback
  const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error("Invalid file type. Only JPEG, PNG, and WebP are allowed.");
  }

  // Phase 1: Request Presigned URL
  const response = await fetch("/api/r2/presign", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type,
      folder,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to generate presigned URL.");
  }

  const { uploadUrl, key, publicUrl, maxSize } = await response.json();
  const maxAllowedSize = maxSize || MAX_SIZE;

  if (file.size > maxAllowedSize) {
    throw new Error(`File is too large. Maximum size is ${maxAllowedSize / 1024 / 1024}MB.`);
  }

  // Phase 2: Upload File directly to R2
  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!uploadResponse.ok) {
    throw new Error("Failed to upload file to storage.");
  }

  return { key, publicUrl };
}
