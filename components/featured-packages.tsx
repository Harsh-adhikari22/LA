"use client"

import { CategoryGrid } from "./category-grid"



export function FeaturedPackages() {
  return (
    <div>
    <div className="w-full h-[3px] bg-gradient-to-r from-blue-400/40 via-white/80 to-blue-400/40 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.6)]"></div>
    <section className="py-12 md:py-16 bg-[url('/Aurora2.jpeg')] bg-cover bg-fixed bg-center bg-no-repeat backdrop-blur-sm">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 fancy-adventure text-white-300">Featured Categories</h2>
          <p className="text-lg md:text-xl text-gray-50 max-w-2xl mx-auto font-semibold rajdhani text-shadow-[0_0_20px_#ffffff]">
            Discover our most popular party categories and create unforgettable celebrations
          </p>
        </div>
        <div className="animate-slide-up">
          <CategoryGrid/>
        </div>
      </div>
    </section>
    <div className="w-full h-[3px] bg-gradient-to-r from-blue-400/40 via-white/80 to-pink-400/40 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.6)]"></div>
    </div>
  )
}
