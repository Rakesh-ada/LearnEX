"use client"

import { useRef, useEffect, useState } from "react"
import dynamic from "next/dynamic"
import * as THREE from "three"
import { useHydrationSafe } from "@/hooks/use-hydration-safe"

interface SpaceBackgroundProps {
  density?: number
  speed?: number
  shootingStars?: boolean
  cosmicDust?: boolean
  colorTheme?: "blue" | "purple" | "mixed"
  parallax?: boolean
  twinkleEffects?: boolean
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

interface Star {
  index: number
  twinkleSpeed: number
  twinkleDirection: number
  baseSize: number
  originalColor: THREE.Color
  depth: number
}

// Create the actual background component that will be dynamically imported
function SpaceBackgroundContent({
  density = 1000,
  speed = 0.0005,
  shootingStars = true,
  cosmicDust = true,
  colorTheme = "mixed",
  parallax = true,
  twinkleEffects = true,
}: SpaceBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mousePosition = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    // Add a subtle blue-purple gradient fog to create depth and color in the background
    scene.fog = new THREE.FogExp2(new THREE.Color(0x090418), 0.00035)
    // Add a faint ambient blue light to enhance the space feeling
    const ambientLight = new THREE.AmbientLight(0x0a0a2a, 0.5)
    scene.add(ambientLight)

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // Limit pixel ratio for performance
    containerRef.current.appendChild(renderer.domElement)

    // Color palette based on theme
    const getColor = (variation = 0.3, saturation = 0.7) => {
      if (colorTheme === "blue") {
        return new THREE.Color(
          Math.random() * 0.1, 
          Math.random() * variation + 0.3, 
          Math.random() * variation + saturation
        )
      } else if (colorTheme === "purple") {
        return new THREE.Color(
          Math.random() * variation + 0.3, 
          Math.random() * 0.1, 
          Math.random() * variation + saturation
        )
      } else {
        // Enhanced mixed theme with more blue and purple tones
        const colorType = Math.random()
        if (colorType < 0.3) {
          // Cool blue stars
          return new THREE.Color(
            0.3 + Math.random() * 0.3,
            0.7 + Math.random() * 0.3,
            0.9 + Math.random() * 0.1
          )
        } else if (colorType < 0.65) {
          // Purple stars
          return new THREE.Color(
            0.5 + Math.random() * 0.3,
            0.2 + Math.random() * 0.3,
            0.8 + Math.random() * 0.2
          )
        } else if (colorType < 0.85) {
          // Warm white with slight blue tint
          return new THREE.Color(
            0.7 + Math.random() * 0.3,
            0.7 + Math.random() * 0.3,
            0.9 + Math.random() * 0.1
          )
        } else {
          // Slight pink/magenta tint
          return new THREE.Color(
            0.8 + Math.random() * 0.2,
            0.4 + Math.random() * 0.2,
            0.7 + Math.random() * 0.3
          )
        }
      }
    }

    // Stars with twinkling and color variation
    const starGeometry = new THREE.BufferGeometry()
    const starVertices: number[] = []
    const starColors: number[] = []
    const starSizes: number[] = []

    // Stars distribution with different layers for parallax depth
    const starLayers = 3
    const stars: Star[] = []
    
    // Create stars with varied sizes and colors
    for (let i = 0; i < density; i++) {
      // Distribute stars in a dome-like hemisphere facing the camera
      // This creates a more immersive effect than a uniform distribution
      const theta = THREE.MathUtils.randFloatSpread(360) 
      const phi = THREE.MathUtils.randFloatSpread(180)
      
      // Ensure most stars are far away, but some are closer for depth
      const depth = Math.random() ** 2 // Squared to favor stars being far away
      const radius = 100 + depth * 50 // Distance from center
      
      const x = radius * Math.sin(theta) * Math.cos(phi)
      const y = radius * Math.sin(theta) * Math.sin(phi)
      const z = -Math.abs(radius * Math.cos(theta)) // Negative to ensure stars are in front
      
      starVertices.push(x, y, z)
      
      // Vary star colors
      const starColor = getColor(0.2, 0.8)
      starColors.push(starColor.r, starColor.g, starColor.b)
      
      // Vary star sizes based on brightness
      const brightness = Math.random()
      const size = 0.05 + brightness * brightness * 0.35 // Square brightness for more small stars
      starSizes.push(size)
      
      // Store star properties for twinkling animation
      stars.push({
        index: i,
        twinkleSpeed: 0.003 + Math.random() * 0.01,
        twinkleDirection: Math.random() > 0.5 ? 1 : -1,
        baseSize: size,
        originalColor: starColor.clone(),
        depth: depth
      })
    }

    starGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starVertices, 3))
    starGeometry.setAttribute("color", new THREE.Float32BufferAttribute(starColors, 3))
    starGeometry.setAttribute("size", new THREE.Float32BufferAttribute(starSizes, 1))
    
    const starMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    })

    const starsSystem = new THREE.Points(starGeometry, starMaterial)
    scene.add(starsSystem)

    // Nebula (colored clouds)
    const nebulaCount = 7
    const nebulae = [] as Nebula[]

    for (let i = 0; i < nebulaCount; i++) {
      // Use more complex geometry for nebulae
      const nebulaSize = Math.random() * 8 + 4
      let nebulaGeometry
      
      // Create different types of nebula shapes
      const nebulaType = Math.floor(Math.random() * 3)
      if (nebulaType === 0) {
        // Sphere nebula
        nebulaGeometry = new THREE.SphereGeometry(nebulaSize, 32, 32)
      } else if (nebulaType === 1) {
        // Torus nebula (ring-like)
        const torusRadius = nebulaSize * 0.7
        const tubeRadius = nebulaSize * 0.3
        nebulaGeometry = new THREE.TorusGeometry(torusRadius, tubeRadius, 16, 50)
      } else {
        // Icosahedron (more crystalline structure)
        nebulaGeometry = new THREE.IcosahedronGeometry(nebulaSize, 1)
      }

      // Create a more interesting material with vibrant blue/purple colors
      let nebulaColor;
      const colorChoice = Math.random();
      
      if (colorChoice < 0.4) {
        // Deep blue nebula
        nebulaColor = new THREE.Color(0x0a1a5e).lerp(
          new THREE.Color(0x4060ff), 
          Math.random() * 0.5 + 0.3
        );
      } else if (colorChoice < 0.8) {
        // Purple nebula
        nebulaColor = new THREE.Color(0x3a0a5e).lerp(
          new THREE.Color(0x9040ff), 
          Math.random() * 0.5 + 0.3
        );
      } else {
        // Pinkish/magenta nebula
        nebulaColor = new THREE.Color(0x5a0a5e).lerp(
          new THREE.Color(0xff40ff), 
          Math.random() * 0.5 + 0.3
        );
      }
      
      const nebulaMaterial = new THREE.MeshBasicMaterial({
        color: nebulaColor,
        transparent: true,
        opacity: 0.07 + Math.random() * 0.05,
        wireframe: true,
        // Use different wireframe densities
        wireframeLinewidth: 0.5 + Math.random() * 0.5,
      })

      const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial)
      
      // Place nebulae further out to create depth
      const distance = 30 + Math.random() * 30
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      
      nebula.position.set(
        distance * Math.sin(theta) * Math.cos(phi),
        distance * Math.sin(theta) * Math.sin(phi),
        distance * Math.cos(theta)
      )
      
      // Add random rotation for more natural look
      nebula.rotation.x = Math.random() * Math.PI
      nebula.rotation.y = Math.random() * Math.PI
      nebula.rotation.z = Math.random() * Math.PI

      scene.add(nebula)
      nebulae.push({
        mesh: nebula,
        rotationSpeed: Math.random() * 0.001,
        pulseSpeed: Math.random() * 0.005 + 0.002,
        pulseDirection: 1,
        pulseMin: 0.03,
        pulseMax: 0.12,
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
            (Math.random() - 0.5) * 2,
          ).normalize(),
          speed: Math.random() * 0.2 + 0.1,
          lifetime: 0,
          maxLifetime: Math.random() * 100 + 50,
        })
      }
    }

    // Cosmic dust
    const dustCount = cosmicDust ? 300 : 0
    const dustParticles = [] as DustParticle[]

    if (cosmicDust) {
      const dustGeometry = new THREE.BufferGeometry()
      const dustMaterial = new THREE.PointsMaterial({
        color: getColor(),
        size: 0.05,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending,
      })

      const dustVertices: number[] = []
      const dustColors: number[] = []

      for (let i = 0; i < dustCount; i++) {
        const x = (Math.random() - 0.5) * 50
        const y = (Math.random() - 0.5) * 50
        const z = (Math.random() - 0.5) * 50
        dustVertices.push(x, y, z)

        // Add color variations to dust
        const dustColor = getColor(0.2, 0.5)
        dustColors.push(dustColor.r, dustColor.g, dustColor.b)

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
      dustGeometry.setAttribute("color", new THREE.Float32BufferAttribute(dustColors, 3))

      const dust = new THREE.Points(dustGeometry, dustMaterial)
      dust.name = "cosmicDust"
      scene.add(dust)
    }

    // Mouse movement for parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      }
    }

    if (parallax) {
      window.addEventListener("mousemove", handleMouseMove)
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

      // Apply parallax effect with mouse movement
      if (parallax) {
        const targetX = mousePosition.current.x * 0.15
        const targetY = -mousePosition.current.y * 0.15
        
        camera.position.x += (targetX - camera.position.x) * 0.01
        camera.position.y += (targetY - camera.position.y) * 0.01
        
        // Subtly look at center
        camera.lookAt(0, 0, 0)
      }

      // Rotate stars very slowly
      starsSystem.rotation.y += speed * 0.1

      // Animate star twinkling and sizes
      if (twinkleEffects) {
        const positions = starsSystem.geometry.attributes.position.array as Float32Array
        const sizes = starsSystem.geometry.attributes.size.array as Float32Array
        const colors = starsSystem.geometry.attributes.color.array as Float32Array
        
        stars.forEach((star) => {
          // Twinkle effect (pulsating size)
          const i = star.index
          const sizeFactor = Math.sin(time * 0.001 * star.twinkleSpeed) * 0.3 + 0.7
          sizes[i] = star.baseSize * sizeFactor
          
          // Subtle color fluctuation based on size
          const colorIndex = i * 3
          const colorFactor = 0.8 + sizeFactor * 0.2
          colors[colorIndex] = star.originalColor.r * colorFactor
          colors[colorIndex + 1] = star.originalColor.g * colorFactor
          colors[colorIndex + 2] = star.originalColor.b * colorFactor
          
          // Subtle movement for closer stars only (parallax effect)
          if (parallax && star.depth < 0.4) {
            const movement = Math.sin(time * 0.0005 * star.twinkleSpeed) * 0.2
            const posIndex = i * 3
            positions[posIndex] += movement * (1 - star.depth) * 0.01
            positions[posIndex + 1] += movement * (1 - star.depth) * 0.01
          }
        })
        
        starsSystem.geometry.attributes.position.needsUpdate = true
        starsSystem.geometry.attributes.size.needsUpdate = true
        starsSystem.geometry.attributes.color.needsUpdate = true
      }

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
          if (!star.active && Math.random() < 0.003) {
            // Activate a new shooting star
            star.active = true
            star.lifetime = 0

            const startPoint = new THREE.Vector3(
              (Math.random() - 0.5) * 80,
              (Math.random() - 0.5) * 80,
              (Math.random() - 0.5) * 80,
            )

            star.direction = new THREE.Vector3(
              (Math.random() - 0.5) * 2,
              (Math.random() - 0.5) * 2,
              (Math.random() - 0.5) * 2,
            ).normalize()

            const endPoint = new THREE.Vector3().copy(startPoint).add(star.direction.clone().multiplyScalar(40))

            const trailPoints = [
              new THREE.Vector3().copy(endPoint).add(star.direction.clone().multiplyScalar(-12)),
              startPoint,
              endPoint,
            ]
            
            star.line.geometry.setFromPoints(trailPoints)
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
        const dust = scene.getObjectByName("cosmicDust") as THREE.Points
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
      if (parallax) {
        window.removeEventListener("mousemove", handleMouseMove)
      }
      
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
          nebula.mesh.material.forEach((mat) => mat.dispose())
        } else {
          nebula.mesh.material.dispose()
        }
      })

      orbs.forEach((orb) => {
        orb.mesh.geometry.dispose()
        if (Array.isArray(orb.mesh.material)) {
          orb.mesh.material.forEach((mat) => mat.dispose())
        } else {
          orb.mesh.material.dispose()
        }
      })

      if (shootingStars) {
        shootingStarsArray.forEach((star) => {
          star.line.geometry.dispose()
          if (Array.isArray(star.line.material)) {
            star.line.material.forEach((mat) => mat.dispose())
          } else {
            star.line.material.dispose()
          }
        })
      }

      if (cosmicDust) {
        const dust = scene.getObjectByName("cosmicDust") as THREE.Points
        if (dust) {
          dust.geometry.dispose()
          if (Array.isArray(dust.material)) {
            dust.material.forEach((mat) => mat.dispose())
          } else {
            dust.material.dispose()
          }
        }
      }
    }
  }, [density, speed, shootingStars, cosmicDust, colorTheme, parallax, twinkleEffects])

  return <div ref={containerRef} className="fixed inset-0 -z-10" style={{ pointerEvents: "none" }} />
}

// Create a simple loading placeholder with a blue-purple gradient background
function SpaceBackgroundPlaceholder() {
  return (
    <div className="fixed inset-0 -z-10 bg-gradient-to-b from-black via-indigo-950/20 to-purple-950/30"></div>
  )
}

// Dynamically import the SpaceBackgroundContent component with SSR disabled
const DynamicSpaceBackground = dynamic(() => Promise.resolve(SpaceBackgroundContent), {
  ssr: false,
  loading: () => <SpaceBackgroundPlaceholder />,
})

// Export the dynamic component as default
export default function SpaceBackground(props: SpaceBackgroundProps) {
  const isMounted = useHydrationSafe()

  if (!isMounted) {
    return <SpaceBackgroundPlaceholder />
  }

  return <DynamicSpaceBackground {...props} />
}

