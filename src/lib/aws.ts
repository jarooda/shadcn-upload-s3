import { S3Client } from "@aws-sdk/client-s3"

// Initialize S3Client instance
const client = new S3Client({
  region: process.env.NEXT_AWS_REGION || '',
  credentials: {
    accessKeyId: process.env.NEXT_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.NEXT_AWS_SECRET_KEY || '',
  },
})

export { client }