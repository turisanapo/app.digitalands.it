import { createClient } from './client'
import { getImageUrl } from './storage'

export interface Workspace {
  id: string
  title: string
  description: string
  location: string
  whatsapp_url: string | null
  images: string[]
  created_at: string
}

export async function getWorkspaces() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('workspaces')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Supabase error:', error)
    throw error
  }

  // Transform image paths to full URLs, handling empty arrays
  const transformedData = (data || []).map(workspace => {
    // Take only first 3 images if there are more
    const limitedImages = (workspace.images || []).slice(0, 5)
    const images = limitedImages.map((path: string) => {
      const url = getImageUrl(path)
      return url
    })
    return {
      ...workspace,
      images
    }
  })

  return transformedData
} 