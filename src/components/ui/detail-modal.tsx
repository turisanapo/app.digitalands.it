'use client'

import { Dialog, DialogContent } from "../../components/ui/dialog"
import Image from "next/image"
import { MessageCircle } from "lucide-react"
import { useState } from "react"

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

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <div className="space-y-6">
          <div className="cursor-pointer" onClick={onClose}>
            <h1 className="text-2xl font-bold text-black">{title}</h1>
            <p className="text-gray-500">{location}</p>
          </div>
          
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            {images.length > 0 ? (
              <>
                <Image
                  src={images[currentImageIndex]}
                  alt={`${title} - Image ${currentImageIndex + 1}`}
                  fill
                  className="object-contain bg-gray-100"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
                    >
                      ←
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
                    >
                      →
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