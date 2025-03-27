"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

// Starfield with subtle movement
function Stars({ count = 1500 }) {
  const mesh = useRef();

  const particles = Array.from({ length: count }, () => ({
    position: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 20],
    size: Math.random() * 0.03 + 0.008,
    color: new THREE.Color().setHSL(Math.random(), 0.8, Math.random() * 0.6 + 0.3),
  }));

  useFrame((state) => {
    const time = state.clock.getElapsedTime() * 0.01;
    mesh.current.rotation.y = time;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length}
          array={new Float32Array(particles.flatMap((p) => p.position))}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles.length}
          array={new Float32Array(particles.flatMap((p) => [p.color.r, p.color.g, p.color.b]))}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors transparent blending={THREE.AdditiveBlending} />
    </points>
  );
}

// Small Floating Debris
function FloatingDebris() {
  const group = useRef();
  const objects = Array.from({ length: 6 }, () => ({
    position: [(Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 5 - 2],
    scale: Math.random() * 0.15 + 0.04,
    speed: Math.random() * 0.08 + 0.02,
    color: new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.8, 0.6),
  }));

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    group.current.children.forEach((mesh, i) => {
      mesh.position.y += Math.sin(time * objects[i].speed) * 0.0015;
      mesh.rotation.x += 0.002;
      mesh.rotation.y += 0.002;
    });
  });

  return (
    <group ref={group}>
      {objects.map((obj, i) => (
        <mesh key={i} position={obj.position} scale={obj.scale}>
          <tetrahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={obj.color} metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

// Mouse-reactive Soft Glow Light
function MouseLight() {
  const light = useRef();

  useFrame(({ mouse, viewport }) => {
    light.current.position.x = (mouse.x * viewport.width) / 2;
    light.current.position.y = (mouse.y * viewport.height) / 2;
  });

  return <pointLight ref={light} distance={6} intensity={1.8} color="#5f86ff" position={[0, 0, 2]} />;
}

// Main Space Scene
export default function SpaceScene() {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
      <color attach="background" args={["#02040a"]} />
      <ambientLight intensity={0.1} />
      <Stars />
      <FloatingDebris />
      <MouseLight />
      <EffectComposer>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.8} intensity={0.6} />
        <Noise opacity={0.02} />
        <Vignette eskil={false} offset={0.1} darkness={0.6} />
      </EffectComposer>
    </Canvas>
  );
}

