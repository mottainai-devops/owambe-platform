import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid";

// Configure AWS S3 client
// In production, these variables will be provided by the environment
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || "owambe-storage";

/**
 * Upload a file to S3 storage
 * @param relKey The relative key/path for the file (ignored in this implementation, we generate a unique key)
 * @param data The file content
 * @param contentType The MIME type of the file
 * @returns Object containing the key and public URL
 */
export async function storagePut(
  relKey: string, // Kept for signature compatibility, but we generate unique keys
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  const key = `${nanoid()}-${Date.now()}`;
  
  // Convert data to Buffer if it's a string
  const body = typeof data === 'string' ? Buffer.from(data) : data;

  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: contentType,
      // ACL: "public-read", // Note: Many S3 buckets block public ACLs by default now
    });

    await s3Client.send(command);

    // If the bucket is public, we can construct the URL directly
    // Otherwise, we might need to generate a signed URL or use CloudFront
    const url = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || "us-east-1"}.amazonaws.com/${key}`;
    
    return { key, url };
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error("Failed to upload file to storage");
  }
}

/**
 * Get a signed URL for reading a file (if bucket is private)
 * or return the public URL
 */
export async function storageGet(
  relKey: string,
  _expiresIn = 300
): Promise<{ key: string; url: string }> {
  // For public buckets, just return the URL if it's already a full URL
  if (relKey.startsWith("http")) {
    return { key: relKey, url: relKey };
  }
  
  // If it's just a key, generate a signed URL
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: relKey,
    });
    
    // URL expires in 1 hour
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return { key: relKey, url };
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return { key: relKey, url: relKey }; // Fallback
  }
}
