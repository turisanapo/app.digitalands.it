import { createClient } from './client'

const BUCKET_NAME = 'images'

export async function uploadImage(file: File, path: string) {
  const supabase = createClient()
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true
    })

  if (error) throw error
  return data
}

export function getImageUrl(path: string) {
  const supabase = createClient()
  // Remove 'images/' from the path if it's already included
  const cleanPath = path.startsWith('images/') ? path.replace('images/', '') : path
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(cleanPath)
  
  return data.publicUrl
}

export async function deleteImage(path: string) {
  const supabase = createClient()
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([path])

  if (error) throw error
}

export async function getImages(limit = 10) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('images')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching images:', error)
    throw error
  }

  return data.map(image => ({
    ...image,
    url: getImageUrl(image.path)
  }))
} 