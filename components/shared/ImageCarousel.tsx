// 'use client';

// import { useState, useRef, useEffect } from 'react';
// import Image from 'next/image';
// import { ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
// import { cn } from '@/lib/utils';

// interface ImageCarouselProps {
//   images: string[];
//   title: string;
//   className?: string;
//   autoplay?: boolean;
//   autoplayDelay?: number;
// }

// export function ImageCarousel({
//   images,
//   title,
//   className,
//   autoplay = true,
//   autoplayDelay = 6000,
// }: ImageCarouselProps) {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isAutoPlaying, setIsAutoPlaying] = useState(autoplay);
//   const intervalRef = useRef<NodeJS.Timeout | null>(null);

//   if (!images || images.length === 0) {
//     return (
//       <div
//         className={cn(
//           'flex items-center justify-center w-full bg-muted/40 rounded-sm aspect-video',
//           className,
//         )}
//       >
//         <div className="flex flex-col items-center gap-2">
//           <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
//           <p className="text-xs text-muted-foreground">No images</p>
//         </div>
//       </div>
//     );
//   }

//   const startAutoPlay = () => {
//     if (intervalRef.current) clearInterval(intervalRef.current);
//     intervalRef.current = setInterval(() => {
//       setCurrentIndex((prev) => (prev + 1) % images.length);
//     }, autoplayDelay);
//   };

//   const stopAutoPlay = () => {
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//       intervalRef.current = null;
//     }
//   };

//   const handlePrev = () => {
//     stopAutoPlay();
//     setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
//     setIsAutoPlaying(false);
//   };

//   const handleNext = () => {
//     stopAutoPlay();
//     setCurrentIndex((prev) => (prev + 1) % images.length);
//     setIsAutoPlaying(false);
//   };

//   const handleDotClick = (index: number) => {
//     stopAutoPlay();
//     setCurrentIndex(index);
//     setIsAutoPlaying(false);
//   };

//   const handleMouseEnter = () => {
//     if (isAutoPlaying) {
//       stopAutoPlay();
//     }
//   };

//   const handleMouseLeave = () => {
//     if (autoplay && !isAutoPlaying) {
//       setIsAutoPlaying(true);
//       startAutoPlay();
//     }
//   };

//   useEffect(() => {
//     if (isAutoPlaying) {
//       startAutoPlay();
//     }
//     return () => {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//     };
//   }, [isAutoPlaying, autoplayDelay]);

//   return (
//     <div
//       className={cn(
//         'relative w-full rounded-sm overflow-hidden bg-muted/40 group',
//         className,
//       )}
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={handleMouseLeave}
//     >
//       {/* Main Image Container */}
//       <div className="relative aspect-video w-full overflow-hidden">
//         <div
//           className="flex transition-transform duration-500 ease-out"
//           style={{
//             transform: `translateX(-${currentIndex * 100}%)`,
//           }}
//         >
//           {images.map((image, index) => (
//             <div
//               key={`${title}-image-${index}`}
//               className="relative w-full h-full shrink-0 aspect-video"
//             >
//               <Image
//                 src={image}
//                 alt={`${title} - Image ${index + 1}`}
//                 fill
//                 className="object-cover"
//                 quality={85}
//                 priority={index === 0}
//                 sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 800px"
//               />
//             </div>
//           ))}
//         </div>

//         {/* Navigation Arrows */}
//         {images.length > 1 && (
//           <>
//             <button
//               onClick={handlePrev}
//               className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none"
//               aria-label="Previous image"
//             >
//               <ChevronLeft className="h-5 w-5" />
//             </button>
//             <button
//               onClick={handleNext}
//               className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none"
//               aria-label="Next image"
//             >
//               <ChevronRight className="h-5 w-5" />
//             </button>
//           </>
//         )}

//         {/* Image Counter */}
//         {images.length > 1 && (
//           <div className="absolute bottom-3 right-3 z-10 px-3 py-1.5 rounded-full bg-black/50 text-white text-xs font-semibold backdrop-blur-sm">
//             {currentIndex + 1} / {images.length}
//           </div>
//         )}
//       </div>

//       {/* Dot Indicators */}
//       {images.length > 1 && (
//         <div className="flex items-center justify-center gap-2 py-3 bg-muted/20 backdrop-blur-sm">
//           {images.map((_, index) => (
//             <button
//               key={`dot-${index}`}
//               onClick={() => handleDotClick(index)}
//               className={cn(
//                 'h-2 rounded-full transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-foreground/50',
//                 index === currentIndex
//                   ? 'bg-foreground w-6'
//                   : 'bg-foreground/30 w-2 hover:bg-foreground/50',
//               )}
//               aria-label={`Go to image ${index + 1}`}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }




'use client';

import React from 'react';
import Image from 'next/image';
import { ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, A11y } from 'swiper/modules';
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
        modules={[Pagination, A11y]}
        slidesPerView={1}
        loop={images.length > 1}
        pagination={{
          clickable: true,
        }}
        className="w-full aspect-video"
        style={
          {
            '--swiper-pagination-color': '#facc15', // active yellow
            '--swiper-pagination-bullet-active-width': '30px',
            '--swiper-pagination-bullet-inactive-color': '#facc15',
            '--swiper-pagination-bullet-width': '20px', // base width
            '--swiper-pagination-bullet-height': '2px',
            '--swiper-pagination-bullet-horizontal-gap': '6px',
          } as React.CSSProperties
        }
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
        {/* Pagination – ქვემოთ, animate width */}
        {images.length > 1 && (
          <div className="swiper-pagination static mb-2 mt-2 flex items-center justify-center" />
        )}
      </Swiper>
    </div>
  );
}