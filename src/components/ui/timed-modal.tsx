'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
} from '@/src/components/ui/dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import Image from 'next/image'

export function TimedModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const hasShownModal = localStorage.getItem('hasShownModal')
    
    if (!hasShownModal) {
      const timer = setTimeout(() => {
        setIsOpen(true)
        localStorage.setItem('hasShownModal', 'true')
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [])

  const handleImageClick = () => {
    window.open('https://forms.gle/TmUYwteZMktwWLcj6', '_blank')
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogOverlay className="bg-black/50" />
      <DialogContent className="p-0 max-w-2xl w-full bg-transparent border-none shadow-none">
        <VisuallyHidden>
          <DialogTitle>Digital Lands Event Registration</DialogTitle>
        </VisuallyHidden>
        <div className="relative w-full aspect-[3/4] cursor-pointer" onClick={handleImageClick}>
          <Image
            src="/locandina-digital-lands.webp"
            alt="Digital Lands Event"
            fill
            className="object-contain"
            priority
          />
        </div>
      </DialogContent>
    </Dialog>
  )
} 