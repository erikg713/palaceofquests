import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { usePiPayment } from '../hooks/usePiPayment';

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

export default function GameCanvas({ shopItems }) {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Stars />
      <OrbitControls />
      {shopItems.map((it, i) => (
        <Box key={it.id} position={[i * 2 - 4, 1, 0]} item={it} />
      ))}
    </Canvas>
  );
}