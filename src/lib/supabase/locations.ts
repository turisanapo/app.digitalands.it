import { createClient } from './client'
import { getImageUrl } from './storage'
import { PostgrestError } from '@supabase/supabase-js'

export interface Location {
  id: string
  title: string
  description: string
  location: string
  whatsapp_url: string | null
  images: string[]
  created_at: string
}

export async function getLocations() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .order('created_at', { ascending: true }) as { data: Location[] | null, error: PostgrestError | null }

  if (error) {
    console.error('Supabase error:', error)
    throw error
  }

  // Transform image paths to full URLs, handling empty arrays
  const transformedData = (data || []).map(location => {
    // Take only first 3 images if there are more
    const limitedImages = ((location.images as string[]) || []).slice(0, 5)
    const images = limitedImages.map((path: string) => {
      const url = getImageUrl(path)
      return url
    })
    return {
      ...location,
      images
    }
  })

  return transformedData
} 