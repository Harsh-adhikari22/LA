"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"

const STORAGE_KEY = "litaffairs-intro-seen"
const SITE_NAME = "LitAffairs"
const TYPEWRITER_MS = 120
const LOGO_FLY_MS = 900

type Phase = "blackScreen" | "logoFly" | "hidden"

interface Rect {
  left: number
  top: number
  width: number
  height: number
}

export function IntroVideoOverlay() {
  const [phase, setPhase] = useState<Phase>("blackScreen")
  const [mounted, setMounted] = useState(false)
  const [typedLength, setTypedLength] = useState(0)
  const [logoFlyTarget, setLogoFlyTarget] = useState<Rect | null>(null)
  const [logoFlyStarted, setLogoFlyStarted] = useState(false)

  useEffect(() => {
    let alreadySeen = false
    try {
      if (typeof window !== "undefined" && sessionStorage.getItem(STORAGE_KEY) === "1") {
        alreadySeen = true
      }
    } catch {
      // ignore
    }
    if (alreadySeen) setPhase("hidden")
    setMounted(true)
  }, [])

  // Typewriter: reveal "LitAffairs" character by character when on blackScreen
  useEffect(() => {
    if (phase !== "blackScreen" || typedLength >= SITE_NAME.length) return
    const id = setInterval(() => {
      setTypedLength((n) => (n >= SITE_NAME.length ? n : n + 1))
    }, TYPEWRITER_MS)
    return () => clearInterval(id)
  }, [phase, typedLength])

  // Scroll-up (or touch) to trigger logo fly
  useEffect(() => {
    if (phase !== "blackScreen") return

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY < 0) {
        e.preventDefault()
        startLogoFly()
      }
    }
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
    }
    const touchStartY = { current: 0 }
    const handleTouchEnd = (e: TouchEvent) => {
      const endY = e.changedTouches[0].clientY
      if (endY > touchStartY.current + 30) startLogoFly() // swipe up = finger moved up = endY smaller... no, finger up means endY < touchStartY. So scroll "up" in content terms = finger moves up = endY < touchStartY. So if endY < touchStartY - 30 we consider it scroll up.
      if (touchStartY.current - endY > 30) startLogoFly()
    }

    const startLogoFly = () => {
      const el = document.getElementById("navbar-logo-slot")
      if (el) {
        const r = el.getBoundingClientRect()
        setLogoFlyTarget({ left: r.left, top: r.top, width: r.width, height: r.height })
        setPhase("logoFly")
      } else {
        setPhase("logoFly")
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: false })
    window.addEventListener("touchstart", handleTouchStart, { passive: true })
    window.addEventListener("touchend", handleTouchEnd, { passive: true })
    return () => {
      window.removeEventListener("wheel", handleWheel)
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchend", handleTouchEnd)
    }
  }, [phase])

  // When entering logoFly, measure target then trigger animation on next frame
  useEffect(() => {
    if (phase !== "logoFly") return
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setLogoFlyStarted(true))
    })
    return () => cancelAnimationFrame(id)
  }, [phase])

  // When logo fly animation ends, hide overlay
  const handleLogoFlyTransitionEnd = useCallback(() => {
    if (phase !== "logoFly" || !logoFlyStarted) return
    setPhase("hidden")
    try {
      sessionStorage.setItem(STORAGE_KEY, "1")
    } catch {
      // ignore
    }
  }, [phase, logoFlyStarted])

  if (!mounted || phase === "hidden") {
    return null
  }

  const showBlackContent = phase === "blackScreen" || phase === "logoFly"
  const isFlying = phase === "logoFly" && logoFlyTarget
  const logoStyle: React.CSSProperties = isFlying
    ? {
        position: "fixed",
        left: logoFlyStarted && logoFlyTarget ? logoFlyTarget.left + logoFlyTarget.width / 2 : "50%",
        top: logoFlyStarted && logoFlyTarget ? logoFlyTarget.top + logoFlyTarget.height / 2 : "50%",
        width: logoFlyStarted && logoFlyTarget ? logoFlyTarget.width : 220,
        height: logoFlyStarted && logoFlyTarget ? logoFlyTarget.height : 220,
        transform: "translate(-50%, -50%)",
        transition: `left ${LOGO_FLY_MS}ms ease-in-out, top ${LOGO_FLY_MS}ms ease-in-out, width ${LOGO_FLY_MS}ms ease-in-out, height ${LOGO_FLY_MS}ms ease-in-out`,
        zIndex: 10000,
      }
    : {}

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
      style={{
        pointerEvents: phase === "hidden" ? "none" : "auto",
      }}
      aria-hidden="true"
    >
      {/* Black overlay */}
      <div
        className="absolute inset-0 bg-black"
      />

      {/* Black screen content: logo + typewriter name */}
      {showBlackContent && (
        <>
          {/* Logo - centered on blackScreen, flies to navbar on logoFly */}
          <div
            className="relative z-10 flex flex-col items-center justify-center"
            style={
              isFlying
                ? { ...logoStyle, pointerEvents: "none" }
                : { position: "relative", width: 220, height: 220 }
            }
            onTransitionEnd={isFlying ? handleLogoFlyTransitionEnd : undefined}
          >
            <Image
              src="/Logo.JPG"
              alt="LitAffairs"
              width={220}
              height={220}
              className="object-contain w-full h-full"
              priority
              unoptimized={false}
            />
          </div>

          {/* Site name - typewriter + glow, hidden when flying */}
          {phase === "blackScreen" && (
            <div className="relative z-10 mt-6 text-center">
              <span
                className="great-vibes-regular inline-block text-4xl md:text-5xl text-[#FFD700] select-none"
                style={{
                  textShadow: "0 0 20px #FFD700, 0 0 40px #FFD700, 0 0 60px rgba(255,215,0,0.6)",
                  animation: "intro-name-glow 2s ease-in-out infinite alternate",
                }}
              >
                {SITE_NAME.slice(0, typedLength)}
                {typedLength < SITE_NAME.length && (
                  <span className="inline-block w-0.5 h-[0.9em] bg-[#FFD700] align-middle animate-pulse" />
                )}
              </span>
            </div>
          )}

          {/* Scroll hint - only on blackScreen */}
          {phase === "blackScreen" && typedLength >= SITE_NAME.length && (
            <p className="absolute bottom-12 left-0 right-0 text-center text-white/50 text-sm rajdhani z-10 animate-pulse">
              Scroll up to enter
            </p>
          )}
        </>
      )}

    </div>
  )
}
