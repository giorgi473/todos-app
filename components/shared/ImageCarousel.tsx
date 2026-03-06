'use client';

import Image from 'next/image';
import { ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

interface ImageCarouselProps {
  images: string[];
  title: string;
  className?: string;
  autoplay?: boolean;
  autoplayDelay?: number;
}

export function ImageCarousel({
  images,
  title,
  className,
}: ImageCarouselProps) {
  if (!images || images.length === 0) {
    return (
      <div
        className={cn(
          'flex items-center justify-center w-full bg-muted/40 rounded-sm aspect-video',
          className,
        )}
      >
        <div className="flex flex-col items-center gap-2">
          <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
          <p className="text-xs text-muted-foreground">No images</p>
        </div>
      </div>
    );
  }

  const swiperId = `carousel-${title}`;

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-sm bg-muted/40 group',
        className,
      )}
    >
      {images.length > 1 && (
        <>
          <button
            type="button"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-yellow-400 cursor-pointer transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label="Previous image"
            onClick={() => {
              const el = document.getElementById(swiperId) as any;
              el?.swiper?.slidePrev();
            }}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-yellow-400 cursor-pointer transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label="Next image"
            onClick={() => {
              const el = document.getElementById(swiperId) as any;
              el?.swiper?.slideNext();
            }}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}
      <Swiper
        id={swiperId}
        modules={[A11y]}
        slidesPerView={1}
        loop={images.length > 1}
        className="w-full aspect-video"
      >
        {images.map((image, index) => (
          <SwiperSlide key={`${title}-image-${index}`} className="w-full!">
            <div className="relative w-full h-full aspect-video">
              <Image
                src={image}
                alt={`${title} - Image ${index + 1}`}
                fill
                className="object-cover"
                quality={85}
                priority={index === 0}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 800px"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
