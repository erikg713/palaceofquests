import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { usePiPayment } from '../hooks/usePiPayment';

function Vehicle({ position }) {
  const ref = useRef();
  useFrame(() => (ref.current.rotation.y += 0.005));

  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[1.5, 0.5, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

function Fireball({ position }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshStandardMaterial emissive="red" color="yellow" />
    </mesh>
  );
}

function Box({ position, item }) {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);
  const payWithPi = usePiPayment();

  useFrame(() => {
    ref.current.rotation.x += 0.005;
    ref.current.rotation.y += 0.01;
  });

  return (
    <mesh
      ref={ref}
      position={position}
      onClick={() => payWithPi(item)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.2 : 1}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'gold' : 'orange'} />
    </mesh>
  );
}

export default function GameCanvas({ activeItem, shopItems }) {
  const [spawned, setSpawned] = useState([]);

  useEffect(() => {
    if (!activeItem) return;

    setSpawned((prev) => [
      ...prev,
      activeItem.category === 'vehicle' ? (
        <Vehicle key={Date.now()} position={[0, 0.5, 0]} />
      ) : (
        <Fireball key={Date.now()} position={[0, 1, -2]} />
      ),
    ]);
  }, [activeItem]);

  return (
    <Canvas camera={{ position: [0, 3, 6] }} shadowMap>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} castShadow />
      <OrbitControls />
      <Stars />
      {spawned}
      {shopItems &&
        shopItems.map((it, i) => (
          <Box key={it.id} position={[i * 2 - 4, 1, 0]} item={it} />
        ))}
    </Canvas>
  );
}
