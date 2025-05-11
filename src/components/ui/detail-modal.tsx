'use client'

import { Dialog, DialogContent } from "../../components/ui/dialog"
import Image from "next/image"
import { MessageCircle, ChevronLeft, ChevronRight, X } from "lucide-react"
import { useState, useRef, useEffect } from "react"

interface DetailModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  location: string
  description: string
  images: string[]
  whatsappUrl?: string
}

export function DetailModal({
  isOpen,
  onClose,
  title,
  location,
  description,
  images,
  whatsappUrl
}: DetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showLoading, setShowLoading] = useState(false)
  const loadingTimeoutRef = useRef<NodeJS.Timeout>()

  // Handle loading state with delay
  useEffect(() => {
    if (!isImageLoaded) {
      loadingTimeoutRef.current = setTimeout(() => {
        setShowLoading(true)
      }, 300)
    } else {
      setShowLoading(false)
    }

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
      }
    }
  }, [isImageLoaded])

  const nextImage = () => {
    setIsTransitioning(true)
    setIsImageLoaded(false)
    setShowLoading(false)
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setIsTransitioning(true)
    setIsImageLoaded(false)
    setShowLoading(false)
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-0 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4 text-black" />
          <span className="sr-only">Close</span>
        </button>
        <div className="space-y-6">
          <div className="cursor-pointer" onClick={onClose}>
            <h1 className="text-2xl font-bold text-black">{title}</h1>
            <p className="text-gray-500">{location}</p>
          </div>
          
          <div className="relative aspect-[3/2] rounded-lg overflow-hidden group">
            {images.length > 0 ? (
              <>
                <Image
                  src={images[currentImageIndex]}
                  alt={`${title} - Image ${currentImageIndex + 1}`}
                  fill
                  className={`object-cover object-center bg-gray-100 transition-opacity duration-300 ${
                    isImageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onLoad={() => {
                    setIsImageLoaded(true)
                    setIsTransitioning(false)
                  }}
                />
                {(!isImageLoaded || isTransitioning) && showLoading && (
                  <>
                    <div className="absolute inset-0 bg-gray-100 animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
                    </div>
                  </>
                )}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                      disabled={isTransitioning}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                      disabled={isTransitioning}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                      {images.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full ${
                            index === currentImageIndex ? "bg-white" : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <p className="text-gray-600 whitespace-pre-wrap">{description}</p>
          </div>

          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Contatta su WhatsApp</span>
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 