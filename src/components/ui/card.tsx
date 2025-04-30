'use client'

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { Button } from "./button";
import { useAuth } from '@/src/components/providers/auth-provider'

interface CardProps {
  images: string[];
  imageAlt: string;
  title: string;
  description: string;
  location: string;
  className?: string;
  href: string;
  whatsappUrl?: string;
}

export function Card({ 
  images, 
  imageAlt, 
  title, 
  description, 
  location,
  className = "", 
  whatsappUrl
}: CardProps) {
  const { user } = useAuth()
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className={`rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow duration-300 ${className}`}>
      <div className="p-4">
        <div className="relative h-48 rounded-lg overflow-hidden group">
          {images.length > 0 ? (
            <>
              <Image
                src={images[currentImageIndex]}
                alt={`${imageAlt} - Image ${currentImageIndex + 1}`}
                fill
                className="object-contain bg-gray-100"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
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
      </div>
      <div className="px-6 py-4">
        <p className="text-sm text-gray-500 mb-1">{location}</p>
        <h2 className="font-semibold text-lg mb-2 text-gray-800">{title}</h2>
        <p className="text-gray-600 text-base mb-4 line-clamp-2">{description}</p>
        <div className="flex justify-end">
          {user && whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Contatta su WhatsApp</span>
            </a>
          ) : (
            <Link href="/login">
              <Button variant="outline" className="text-sm">
                Scopri di più
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}