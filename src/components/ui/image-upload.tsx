'use client'

import { useState } from 'react'
import { Upload } from 'lucide-react'
import { Button } from './button'
import { uploadImage, getImageUrl } from '@/src/lib/supabase/storage'

interface ImageUploadProps {
  onUpload: (url: string) => void
  folder: string
}

export function ImageUpload({ onUpload, folder }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${folder}/${fileName}`

      await uploadImage(file, filePath)
      const url = getImageUrl(filePath)
      onUpload(url)
    } catch (error) {
      alert('Error uploading image!')
      console.error('Error:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label htmlFor="image-upload">
        <Button
          variant="outline"
          className="cursor-pointer"
          disabled={uploading}
        >
          <Upload className="mr-2 h-4 w-4" />
          {uploading ? 'Uploading...' : 'Upload Image'}
        </Button>
      </label>
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
        disabled={uploading}
      />
    </div>
  )
} 