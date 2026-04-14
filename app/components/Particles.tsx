'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  alpha: number
  decay: number
  gravity: number
  rotation: number
  rotationSpeed: number
  shape: 'circle' | 'star' | 'petal'
}

interface BurstParticlesProps {
  active: boolean
  originX?: number
  originY?: number
  count?: number
}

const COLORS = [
  '#ffd700', '#ffaa00', '#ff8c00', '#ffd700',
  '#fffacd', '#f4c430', '#ff6b35', '#ffd700',
  '#ffffff', '#ffee58', '#ffa726', '#fff176',
]

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, rot: number) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rot)
  ctx.beginPath()
  for (let i = 0; i < 5; i++) {
    const outerAngle = (i * 4 * Math.PI) / 5 - Math.PI / 2
    const innerAngle = ((i * 4 + 2) * Math.PI) / 5 - Math.PI / 2
    if (i === 0) ctx.moveTo(Math.cos(outerAngle) * r, Math.sin(outerAngle) * r)
    else ctx.lineTo(Math.cos(outerAngle) * r, Math.sin(outerAngle) * r)
    ctx.lineTo(Math.cos(innerAngle) * (r * 0.4), Math.sin(innerAngle) * (r * 0.4))
  }
  ctx.closePath()
  ctx.restore()
}

function drawPetal(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, rot: number) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rot)
  ctx.beginPath()
  ctx.ellipse(0, -r / 2, r * 0.4, r, 0, 0, Math.PI * 2)
  ctx.restore()
}

export function BurstParticles({ active, originX, originY, count = 80 }: BurstParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number>(0)
  const hasTriggeredRef = useRef(false)

  useEffect(() => {
    if (!active || hasTriggeredRef.current) return
    hasTriggeredRef.current = true

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const cx = originX ?? canvas.width / 2
    const cy = originY ?? canvas.height / 2

    // Create burst particles
    particlesRef.current = Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2
      const speed = 3 + Math.random() * 10
      const shapes: Particle['shape'][] = ['circle', 'star', 'petal']
      return {
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        radius: 3 + Math.random() * 6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: 1,
        decay: 0.012 + Math.random() * 0.015,
        gravity: 0.15 + Math.random() * 0.1,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      }
    })

    // Also add ring waves
    const rings: { r: number; maxR: number; alpha: number }[] = [
      { r: 0, maxR: 200, alpha: 1 },
      { r: 0, maxR: 300, alpha: 0.7 },
      { r: 0, maxR: 400, alpha: 0.5 },
    ]

    let ringFrame = 0

    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw ring waves
      if (ringFrame < 60) {
        rings.forEach((ring, i) => {
          ring.r += ring.maxR / 60
          ring.alpha = Math.max(0, 1 - ring.r / ring.maxR) * (1 - i * 0.25)
          ctx.save()
          ctx.beginPath()
          ctx.arc(cx, cy, ring.r, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(244, 196, 48, ${ring.alpha})`
          ctx.lineWidth = 3 - i
          ctx.stroke()
          ctx.restore()
        })
        ringFrame++
      }

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((p) => p.alpha > 0.02)

      for (const p of particlesRef.current) {
        p.x += p.vx
        p.y += p.vy
        p.vy += p.gravity
        p.vx *= 0.98
        p.alpha -= p.decay
        p.rotation += p.rotationSpeed

        ctx.save()
        ctx.globalAlpha = Math.max(0, p.alpha)
        ctx.fillStyle = p.color

        if (p.shape === 'circle') {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
          ctx.fill()
        } else if (p.shape === 'star') {
          drawStar(ctx, p.x, p.y, p.radius, p.rotation)
          ctx.fill()
        } else {
          drawPetal(ctx, p.x, p.y, p.radius, p.rotation)
          ctx.fill()
        }

        ctx.restore()
      }

      if (particlesRef.current.length > 0 || ringFrame < 60) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [active, originX, originY, count])

  // Reset trigger when active becomes false
  useEffect(() => {
    if (!active) hasTriggeredRef.current = false
  }, [active])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ width: '100vw', height: '100vh' }}
    />
  )
}

// Ambient floating petals (always present)
export function FloatingPetals() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function resize() {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    interface Petal {
      x: number
      y: number
      vx: number
      vy: number
      rotation: number
      rotSpeed: number
      size: number
      alpha: number
      color: string
      sway: number
      swaySpeed: number
      swayOffset: number
    }

    const petalColors = ['#ffd700', '#ffaa00', '#fffacd', '#f4c430', '#ff8c00', '#ffee58']

    function createPetal(): Petal {
      return {
        x: Math.random() * (canvas?.width ?? 800),
        y: -20,
        vx: (Math.random() - 0.5) * 1.5,
        vy: 0.8 + Math.random() * 1.2,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.04,
        size: 4 + Math.random() * 6,
        alpha: 0.4 + Math.random() * 0.5,
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
        sway: 0,
        swaySpeed: 0.02 + Math.random() * 0.02,
        swayOffset: Math.random() * Math.PI * 2,
      }
    }

    const petals: Petal[] = Array.from({ length: 25 }, (_, i) => {
      const p = createPetal()
      p.y = Math.random() * (canvas?.height ?? 600)
      return p
    })

    let frame = 0

    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      frame++

      // Occasionally spawn new petal
      if (frame % 90 === 0 && petals.length < 35) {
        petals.push(createPetal())
      }

      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i]
        p.sway = Math.sin(frame * p.swaySpeed + p.swayOffset) * 1.5
        p.x += p.vx + p.sway * 0.05
        p.y += p.vy
        p.rotation += p.rotSpeed

        if (p.y > canvas.height + 20) {
          petals.splice(i, 1)
          continue
        }

        ctx.save()
        ctx.globalAlpha = p.alpha
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.fillStyle = p.color

        // Draw petal shape
        ctx.beginPath()
        ctx.ellipse(0, 0, p.size * 0.5, p.size, 0, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ width: '100vw', height: '100vh' }}
    />
  )
}
