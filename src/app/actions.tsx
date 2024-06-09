"use server"

import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { client } from "@/lib/aws"

export async function getAWSSignedUrl({
  fileName,
  fileType
}: {
  fileName: string
  fileType: string
}): Promise<{ status: boolean; putUrl: string }> {
  try {
    const command = new PutObjectCommand({
      Key: `uploads/${fileName}`,
      ContentType: fileType,
      Bucket: process.env.NEXT_AWS_BUCKET_NAME
    })

    // Generate pre-signed PUT URL
    const putUrl = await getSignedUrl(client, command, { expiresIn: 500 })

    return {
      status: true,
      putUrl
    }
  } catch (error) {
    return {
      status: false,
      putUrl: ""
    }
  }
}
