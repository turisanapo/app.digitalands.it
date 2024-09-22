import Image from "next/image";
import Link from "next/link";

interface CardProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  className?: string;
  href: string;
}

export function Card({ imageSrc, imageAlt, title, description, className = "", href }: CardProps) {
  return (
    <Link href={href} className={`block rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow duration-300 ${className}`}>
      <div className="p-4">
        <div className="relative h-48 rounded-lg overflow-hidden">
          <Image
            src={imageSrc}
            alt={imageAlt}
            layout="fill"
            objectFit="cover"
          />
        </div>
      </div>
      <div className="px-6 py-4">
        <h2 className="font-semibold text-sm mb-2 text-gray-500">{title}</h2>
        <p className="text-gray-600 text-base">{description}</p>
      </div>
    </Link>
  );
}