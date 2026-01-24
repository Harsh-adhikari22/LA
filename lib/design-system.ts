/**
 * VPrimeTours Design System Constants
 * Centralized design tokens for consistent styling across the application
 */

// Typography
export const typography = {
  // Heading sizes (standardized)
  h1: "text-4xl md:text-5xl font-bold",
  h2: "text-3xl md:text-4xl font-bold",
  h3: "text-2xl md:text-3xl font-semibold",
  h4: "text-xl md:text-2xl font-semibold",
  // Body text
  body: "text-base",
  bodyLarge: "text-lg",
  bodySmall: "text-sm",
  // Font families
  fontRajdhani: "rajdhani",
  fontFancy: "fancy-adventure",
} as const

// Layout
export const layout = {
  container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  sectionPadding: "py-12 md:py-16",
  sectionPaddingLarge: "py-16 md:py-24",
} as const

// Colors (using Tailwind classes that map to CSS variables)
export const colors = {
  primary: "text-primary",
  primaryBg: "bg-primary",
  primaryHover: "hover:bg-primary/90",
  // Consistent hover colors for navigation
  navPlans: "hover:bg-red-500 hover:shadow-[0_0_20px_#ff9d9d]",
  navPlaces: "hover:bg-blue-500 hover:shadow-[0_0_20px_#9ec3ff]",
  navContact: "hover:bg-green-500 hover:shadow-[0_0_20px_#96ffbc]",
  // Active states
  navActivePlans: "bg-red-500 shadow-[0_0_20px_#ff9d9d]",
  navActivePlaces: "bg-blue-500 shadow-[0_0_20px_#9ec3ff]",
  navActiveContact: "bg-green-500 shadow-[0_0_20px_#96ffbc]",
} as const

// Button styles
export const button = {
  base: "rounded-lg transition-all duration-300",
  primary: "bg-primary hover:bg-primary/90 text-white",
  secondary: "bg-secondary hover:bg-secondary/90",
  outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
  rounded: "rounded-full",
  size: {
    sm: "h-9 px-4 text-sm",
    md: "h-10 px-6",
    lg: "h-12 px-8 text-lg",
  },
} as const

// Card styles
export const card = {
  base: "rounded-lg shadow-md",
  withBlur: "backdrop-blur-sm bg-white/90",
  solid: "bg-white",
  dark: "bg-gray-900/80 text-white",
} as const

// Animation classes
export const animations = {
  fadeIn: "animate-fade-in",
  slideUp: "animate-slide-up",
  scaleIn: "animate-scale-in",
} as const

// Search input
export const searchInput = {
  base: "h-12 pl-10 border-0 focus:ring-2 focus:ring-primary",
  large: "h-14 pl-12 text-lg",
} as const


