"use client"

import { CategoryGrid } from "./category-grid"



export function FeaturedPackages() {
  return (
    <div>
    <div className="w-full h-[3px] bg-gradient-to-r from-[#6f5714] via-[#d4af37] to-[#6f5714] rounded-full shadow-[0_0_20px_rgba(212,175,55,0.45)]"></div>
    <section className="relative py-12 md:py-16 bg-[url('/Golden_embroidery.png')] bg-cover bg-fixed bg-center bg-no-repeat backdrop-blur-sm">
      <div className="absolute inset-0 bg-black/80" />
      {/* <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover -z-10"
      >
        <source src="/Aurora_borealis.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video> */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-5xl md:text-6xl font-bold text-[#d4af37] mb-4 lit-affairs-font drop-shadow-[0_0_38px_rgba(212,175,55,0.95)]">
            Featured Categories
          </h2>
          <p className="text-2xl md:text-3xl text-[#f2d47a] max-w-3xl mx-auto lit-affairs-font drop-shadow-[0_0_30px_rgba(212,175,55,0.8)]">
            Discover our most popular party categories and create unforgettable celebrations
          </p>
        </div>
        <div className="animate-slide-up">
          <CategoryGrid/>
        </div>
      </div>
    </section>
    <div className="w-full h-[3px] bg-gradient-to-r from-[#6f5714] via-[#d4af37] to-[#6f5714] rounded-full shadow-[0_0_20px_rgba(212,175,55,0.45)]"></div>
    </div>
  )
}
