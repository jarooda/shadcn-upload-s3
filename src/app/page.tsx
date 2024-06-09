"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form"

import { getAWSSignedUrl } from "@/app/actions"

const MAX_FILE_SIZE = 1000000 // 1MB
const ACCEPTED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/svg+xml",
  "image/webp"
]

const formSchema = z.object({
  file: z.any().refine((file) => {
    if (!file) return false
    if (file.size > MAX_FILE_SIZE) return false
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) return false
    return true
  })
})

export default function Home() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { file } = values

    const formData = new FormData()
    formData.append("file", file)

    const { putUrl } = await getAWSSignedUrl({
      fileName: file.name,
      fileType: file.type
    })

    const response = await fetch(putUrl, {
      body: file,
      method: "PUT",
      headers: { "Content-Type": file.type }
    })

    if (!response.ok) {
      console.error("Failed to upload image")
      return
    }

    console.log("Image uploaded successfully")
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="file"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...fieldProps}
                    type="file"
                    className=" mb-4"
                    accept="image/*"
                    onChange={(event) =>
                      onChange(event.target.files && event.target.files[0])
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className=" w-full" type="submit">
            Upload Image
          </Button>
        </form>
      </Form>
    </main>
  )
}
