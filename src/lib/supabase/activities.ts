import { createClient } from './client'
import { getImageUrl } from './storage'

export interface Activity {
  id: string
  title: string
  description: string
  location: string
  whatsapp_url: string | null
  images: string[]
  created_at: string
}

export async function getActivities() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Supabase error:', error)
    throw error
  }

  // Transform image paths to full URLs, handling empty arrays
  const transformedData = (data || []).map(activity => {
    // Take only first 3 images if there are more
    const limitedImages = (activity.images || []).slice(0, 5)
    const images = limitedImages.map((path: string) => {
      const url = getImageUrl(path)
      return url
    })
    return {
      ...activity,
      images
    }
  })

  return transformedData
} 