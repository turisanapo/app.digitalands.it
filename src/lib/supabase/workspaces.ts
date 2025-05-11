import { createClient } from './client'
import { getImageUrl } from './storage'
import { PostgrestError } from '@supabase/supabase-js'

export interface Workspace {
  id: string
  title: string
  description: string
  location: string
  whatsapp_url: string | null
  images: string[]
  all_images: string[]
  created_at: string
}

export async function getWorkspaces() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('workspaces')
    .select('*')
    .order('created_at', { ascending: true }) as { data: Workspace[] | null, error: PostgrestError | null }

  if (error) {
    console.error('Supabase error:', error)
    throw error
  }

  // Transform image paths to full URLs, handling empty arrays
  const transformedData = (data || []).map(workspace => {
    const allImages = ((workspace.images as string[]) || []).map((path: string) => {
      const url = getImageUrl(path)
      return url
    })

    // Get up to 5 random images
    const randomImages = [...allImages]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5)

    return {
      ...workspace,
      images: randomImages,
      all_images: allImages
    }
  })

  return transformedData
} 