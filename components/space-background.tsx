"use client"

import { useRef, useEffect, useState } from "react"
import dynamic from 'next/dynamic'
import * as THREE from "three"
import { useHydrationSafe } from "@/hooks/use-hydration-safe"

interface SpaceBackgroundProps {
  density?: number
  speed?: number
  shootingStars?: boolean
  cosmicDust?: boolean
  colorTheme?: "blue" | "purple" | "mixed"
}

// Define types for our objects
interface Nebula {
  mesh: THREE.Mesh
  rotationSpeed: number
  pulseSpeed: number
  pulseDirection: number
  pulseMin: number
  pulseMax: number
}

interface Orb {
  mesh: THREE.Mesh
  speed: {
    x: number
    y: number
    z: number
  }
}

interface ShootingStar {
  line: THREE.Line
  active: boolean
  direction: THREE.Vector3
  speed: number
  lifetime: number
  maxLifetime: number
}

interface DustParticle {
  index: number
  speed: {
    x: number
    y: number
    z: number
  }
}

// Create the actual background component that will be dynamically imported
function SpaceBackgroundContent({
  density = 1000,
  speed = 0.0005,
  shootingStars = true,
  cosmicDust = true,
  colorTheme = "mixed"
}: SpaceBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // Limit pixel ratio for performance
    containerRef.current.appendChild(renderer.domElement)

    // Color palette based on theme
    const getColor = () => {
      if (colorTheme === "blue") {
        return new THREE.Color(
          Math.random() * 0.2,
          Math.random() * 0.2 + 0.3,
          Math.random() * 0.3 + 0.7
        )
      } else if (colorTheme === "purple") {
        return new THREE.Color(
          Math.random() * 0.3 + 0.4,
          Math.random() * 0.2,
          Math.random() * 0.3 + 0.7
        )
      } else {
        // Mixed theme
        return new THREE.Color(
          Math.random() * 0.3 + (Math.random() > 0.5 ? 0.4 : 0.1),
          Math.random() * 0.3 + (Math.random() > 0.5 ? 0.1 : 0.3),
          Math.random() * 0.3 + 0.7
        )
      }
    }

    // Stars
    const starGeometry = new THREE.BufferGeometry()
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
      transparent: true,
    })

    const starVertices: number[] = []
    for (let i = 0; i < density; i++) {
      const x = (Math.random() - 0.5) * 100
      const y = (Math.random() - 0.5) * 100
      const z = (Math.random() - 0.5) * 100
      starVertices.push(x, y, z)
    }

    starGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starVertices, 3))

    const stars = new THREE.Points(starGeometry, starMaterial)
    scene.add(stars)

    // Nebula (colored clouds)
    const nebulaCount = 5
    const nebulae = [] as Nebula[]

    for (let i = 0; i < nebulaCount; i++) {
      const nebulaGeometry = new THREE.SphereGeometry(Math.random() * 5 + 3, 32, 32)
      const nebulaMaterial = new THREE.MeshBasicMaterial({
        color: getColor(),
        transparent: true,
        opacity: 0.05,
        wireframe: true,
      })

      const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial)
      nebula.position.set((Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50)

      scene.add(nebula)
      nebulae.push({
        mesh: nebula,
        rotationSpeed: Math.random() * 0.001,
        pulseSpeed: Math.random() * 0.01,
        pulseDirection: 1,
        pulseMin: 0.03,
        pulseMax: 0.07,
      })
    }

    // Glowing orbs
    const orbCount = 15
    const orbs = [] as Orb[]

    for (let i = 0; i < orbCount; i++) {
      const orbGeometry = new THREE.SphereGeometry(Math.random() * 0.2 + 0.1, 16, 16)
      const orbMaterial = new THREE.MeshBasicMaterial({
        color: getColor(),
        transparent: true,
        opacity: 0.7,
      })

      const orb = new THREE.Mesh(orbGeometry, orbMaterial)
      orb.position.set((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20)

      scene.add(orb)
      orbs.push({
        mesh: orb,
        speed: {
          x: (Math.random() - 0.5) * 0.01,
          y: (Math.random() - 0.5) * 0.01,
          z: (Math.random() - 0.5) * 0.01,
        },
      })
    }

    // Shooting stars
    const shootingStarCount = shootingStars ? 20 : 0
    const shootingStarsArray = [] as ShootingStar[]

    if (shootingStars) {
      for (let i = 0; i < shootingStarCount; i++) {
        const geometry = new THREE.BufferGeometry()
        const material = new THREE.LineBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0,
        })

        const line = new THREE.Line(geometry, material)
        scene.add(line)

        shootingStarsArray.push({
          line,
          active: false,
          direction: new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
          ).normalize(),
          speed: Math.random() * 0.2 + 0.1,
          lifetime: 0,
          maxLifetime: Math.random() * 100 + 50,
        })
      }
    }

    // Cosmic dust
    const dustCount = cosmicDust ? 200 : 0
    const dustParticles = [] as DustParticle[]

    if (cosmicDust) {
      const dustGeometry = new THREE.BufferGeometry()
      const dustMaterial = new THREE.PointsMaterial({
        color: getColor(),
        size: 0.05,
        transparent: true,
        opacity: 0.3,
      })

      const dustVertices: number[] = []
      for (let i = 0; i < dustCount; i++) {
        const x = (Math.random() - 0.5) * 50
        const y = (Math.random() - 0.5) * 50
        const z = (Math.random() - 0.5) * 50
        dustVertices.push(x, y, z)

        dustParticles.push({
          index: i * 3,
          speed: {
            x: (Math.random() - 0.5) * 0.005,
            y: (Math.random() - 0.5) * 0.005,
            z: (Math.random() - 0.5) * 0.005,
          },
        })
      }

      dustGeometry.setAttribute("position", new THREE.Float32BufferAttribute(dustVertices, 3))
      const dust = new THREE.Points(dustGeometry, dustMaterial)
      scene.add(dust)
    }

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleResize)

    // Animation loop
    let lastTime = 0
    const animate = (time: number) => {
      const delta = time - lastTime
      lastTime = time
      
      requestAnimationFrame(animate)

      // Rotate stars
      stars.rotation.x += speed * 0.2
      stars.rotation.y += speed

      // Animate nebulae
      nebulae.forEach((nebula) => {
        nebula.mesh.rotation.x += nebula.rotationSpeed
        nebula.mesh.rotation.y += nebula.rotationSpeed * 1.5
        
        // Pulse effect
        const material = nebula.mesh.material as THREE.MeshBasicMaterial
        material.opacity += nebula.pulseDirection * nebula.pulseSpeed
        
        if (material.opacity > nebula.pulseMax) {
          material.opacity = nebula.pulseMax
          nebula.pulseDirection = -1
        } else if (material.opacity < nebula.pulseMin) {
          material.opacity = nebula.pulseMin
          nebula.pulseDirection = 1
        }
      })

      // Animate orbs
      orbs.forEach((orb) => {
        orb.mesh.position.x += orb.speed.x
        orb.mesh.position.y += orb.speed.y
        orb.mesh.position.z += orb.speed.z

        // Bounce off invisible boundaries
        if (Math.abs(orb.mesh.position.x) > 10) orb.speed.x *= -1
        if (Math.abs(orb.mesh.position.y) > 10) orb.speed.y *= -1
        if (Math.abs(orb.mesh.position.z) > 10) orb.speed.z *= -1
      })

      // Animate shooting stars
      if (shootingStars) {
        shootingStarsArray.forEach((star) => {
          if (!star.active && Math.random() < 0.005) {
            // Activate a new shooting star
            star.active = true
            star.lifetime = 0
            
            const startPoint = new THREE.Vector3(
              (Math.random() - 0.5) * 40,
              (Math.random() - 0.5) * 40,
              (Math.random() - 0.5) * 40
            )
            
            star.direction = new THREE.Vector3(
              (Math.random() - 0.5) * 2,
              (Math.random() - 0.5) * 2,
              (Math.random() - 0.5) * 2
            ).normalize()
            
            const endPoint = new THREE.Vector3().copy(startPoint).add(
              star.direction.clone().multiplyScalar(10)
            )
            
            const points = [startPoint, endPoint]
            star.line.geometry.setFromPoints(points)
            star.line.position.set(0, 0, 0)
            
            const material = star.line.material as THREE.LineBasicMaterial
            material.opacity = 0
          }
          
          if (star.active) {
            star.lifetime++
            
            const progress = star.lifetime / star.maxLifetime
            const material = star.line.material as THREE.LineBasicMaterial
            
            if (progress < 0.2) {
              // Fade in
              material.opacity = progress * 5
            } else if (progress > 0.8) {
              // Fade out
              material.opacity = (1 - progress) * 5
            } else {
              material.opacity = 1
            }
            
            star.line.position.add(star.direction.clone().multiplyScalar(star.speed))
            
            if (star.lifetime >= star.maxLifetime) {
              star.active = false
              material.opacity = 0
            }
          }
        })
      }

      // Animate cosmic dust
      if (cosmicDust && dustParticles.length > 0) {
        const dust = scene.children.find(child => child instanceof THREE.Points && child !== stars) as THREE.Points
        if (dust) {
          const positions = dust.geometry.attributes.position.array as Float32Array
          
          dustParticles.forEach((particle) => {
            positions[particle.index] += particle.speed.x
            positions[particle.index + 1] += particle.speed.y
            positions[particle.index + 2] += particle.speed.z
            
            // Wrap around if out of bounds
            if (Math.abs(positions[particle.index]) > 25) positions[particle.index] *= -0.9
            if (Math.abs(positions[particle.index + 1]) > 25) positions[particle.index + 1] *= -0.9
            if (Math.abs(positions[particle.index + 2]) > 25) positions[particle.index + 2] *= -0.9
          })
          
          dust.geometry.attributes.position.needsUpdate = true
        }
      }

      renderer.render(scene, camera)
    }

    animate(0)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }

      // Dispose resources
      scene.clear()
      starGeometry.dispose()
      starMaterial.dispose()

      nebulae.forEach((nebula) => {
        nebula.mesh.geometry.dispose()
        if (Array.isArray(nebula.mesh.material)) {
          nebula.mesh.material.forEach(mat => mat.dispose())
        } else {
          nebula.mesh.material.dispose()
        }
      })

      orbs.forEach((orb) => {
        orb.mesh.geometry.dispose()
        if (Array.isArray(orb.mesh.material)) {
          orb.mesh.material.forEach(mat => mat.dispose())
        } else {
          orb.mesh.material.dispose()
        }
      })

      if (shootingStars) {
        shootingStarsArray.forEach((star) => {
          star.line.geometry.dispose()
          if (Array.isArray(star.line.material)) {
            star.line.material.forEach(mat => mat.dispose())
          } else {
            star.line.material.dispose()
          }
        })
      }

      if (cosmicDust) {
        const dust = scene.children.find(child => child instanceof THREE.Points && child !== stars) as THREE.Points
        if (dust) {
          dust.geometry.dispose()
          if (Array.isArray(dust.material)) {
            dust.material.forEach(mat => mat.dispose())
          } else {
            dust.material.dispose()
          }
        }
      }
    }
  }, [density, speed, shootingStars, cosmicDust, colorTheme])

  return <div ref={containerRef} className="fixed inset-0 -z-10" style={{ pointerEvents: "none" }} />
}

// Create a simple loading placeholder
function SpaceBackgroundPlaceholder() {
  return (
    <div className="fixed inset-0 -z-10 bg-gradient-to-b from-black via-purple-950/20 to-black">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(white,rgba(255,255,255,0)_2px)] bg-[length:50px_50px]"></div>
      </div>
    </div>
  )
}

// Dynamically import the SpaceBackgroundContent component with SSR disabled
const DynamicSpaceBackground = dynamic(
  () => Promise.resolve(SpaceBackgroundContent),
  { 
    ssr: false,
    loading: () => <SpaceBackgroundPlaceholder />
  }
)

// Export the dynamic component as default
export default function SpaceBackground(props: SpaceBackgroundProps) {
  const isMounted = useHydrationSafe()
  
  if (!isMounted) {
    return <SpaceBackgroundPlaceholder />
  }
  
  return <DynamicSpaceBackground {...props} />
} remove all white star
