'use client'

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { Button } from "./button";
import { useAuth } from '@/src/components/providers/auth-provider'
import { useRouter } from 'next/navigation'
import { DetailModal } from "./detail-modal";

interface CardProps {
  images: string[];
  all_images?: string[];
  imageAlt: string;
  title: string;
  description: string;
  location: string;
  className?: string;
  whatsappUrl?: string;
}

function PreloadImages({ images }: { images: string[] }) {
  useEffect(() => {
    // Preload next and previous images
    const preloadImage = (src: string) => {
      const img = new window.Image();
      img.src = src;
    };

    // Preload all images in the background
    images.forEach(preloadImage);
  }, [images]);

  return null;
}

export function Card({ 
  images, 
  all_images,
  imageAlt, 
  title, 
  description, 
  location,
  className = "", 
  whatsappUrl
}: CardProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [nextImageIndex, setNextImageIndex] = useState(1);
  const loadingTimeoutRef = useRef<NodeJS.Timeout>();

  // Handle loading state with delay
  useEffect(() => {
    if (!isImageLoaded) {
      loadingTimeoutRef.current = setTimeout(() => {
        setShowLoading(true);
      }, 300);
    } else {
      setShowLoading(false);
    }

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [isImageLoaded]);

  // Preload next image
  useEffect(() => {
    if (images.length > 1) {
      const nextIndex = (currentImageIndex + 1) % images.length;
      setNextImageIndex(nextIndex);
    }
  }, [currentImageIndex, images.length]);

  const nextImage = () => {
    setIsTransitioning(true);
    setIsImageLoaded(false);
    setShowLoading(false);
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setIsTransitioning(true);
    setIsImageLoaded(false);
    setShowLoading(false);
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleClick = (e: React.MouseEvent) => {
    // Prevent click if the target is a button or link
    if (
      (e.target as HTMLElement).closest('button') ||
      (e.target as HTMLElement).closest('a')
    ) {
      return;
    }

    if (!user) {
      router.push('/login');
      return;
    }

    setIsModalOpen(true);
  };

  return (
    <>
      <div 
        className={`rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow duration-300 ${className}`}
      >
        <div className="p-4">
          <div 
            className="relative aspect-[3/2] rounded-lg overflow-hidden group cursor-pointer"
            onClick={handleClick}
          >
            {images.length > 0 ? (
              <>
                <Image
                  src={images[currentImageIndex]}
                  alt={`${imageAlt} - Image ${currentImageIndex + 1}`}
                  fill
                  className={`object-cover object-center bg-gray-100 transition-opacity duration-300 ${
                    isImageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={currentImageIndex === 0}
                  quality={80}
                  loading={currentImageIndex === 0 ? 'eager' : 'lazy'}
                  onLoad={() => {
                    setIsImageLoaded(true);
                    setIsTransitioning(false);
                  }}
                />
                {/* Preload next image */}
                {images.length > 1 && (
                  <Image
                    src={images[nextImageIndex]}
                    alt=""
                    fill
                    className="hidden"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    quality={80}
                    loading="eager"
                  />
                )}
                {(!isImageLoaded || isTransitioning) && showLoading && (
                  <>
                    <div className="absolute inset-0 bg-gray-100 animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
                    </div>
                  </>
                )}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage();
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                      disabled={isTransitioning}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage();
                      }}
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
        </div>
        <div className="px-6 py-4">
          <p className="text-sm text-gray-500 mb-1">{location}</p>
          <h2 
            className="font-semibold text-lg mb-2 text-gray-800 cursor-pointer"
            onClick={handleClick}
          >
            {title}
          </h2>
          <p 
            className="text-gray-600 text-base mb-4 line-clamp-2 cursor-pointer"
            onClick={handleClick}
          >
            {description}
          </p>
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

      <DetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        location={location}
        description={description}
        images={all_images || images}
        whatsappUrl={whatsappUrl}
      />

      <PreloadImages images={images} />
    </>
  );
}