// @ts-nocheck
import { useRef, useMemo, type FC } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';
import { RelationshipType, CosmicShape, CosmicMotion } from '../types';



interface SoulCoreProps {
  colors: string[];
  type: RelationshipType;
  qShape: CosmicShape;
  qMotion: CosmicMotion;
}

export const SoulCore: FC<SoulCoreProps> = ({ colors, type }) => {
  const primaryColor = colors[0];
  const secondaryColor = colors[1] || '#ffffff';

  const count = 3000;

  const { positions, colors: particleColors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const colorA = new THREE.Color(primaryColor as THREE.ColorRepresentation);
    const colorB = new THREE.Color(secondaryColor as THREE.ColorRepresentation);
    const tempColor = new THREE.Color();

    for (let i = 0; i < count; i++) {
      let x = 0, y = 0, z = 0;

      if (type === RelationshipType.LOVE) {
        const phi = Math.acos(-1 + (2 * i) / count);
        const theta = Math.sqrt(count * Math.PI) * phi;
        const r = 1.5;
        x = r * 16 * Math.pow(Math.sin(theta), 3) * Math.sin(phi);
        y = r * (13 * Math.cos(theta) - 5 * Math.cos(2 * theta) - 2 * Math.cos(3 * theta) - Math.cos(4 * theta)) * Math.sin(phi);
        z = r * 4 * Math.cos(phi);
        x /= 10; y /= 10; z /= 10;
      }
      else if (type === RelationshipType.FRIENDSHIP) {
        const radius = Math.random() * 2.5;
        const spin = radius * 3;
        const branchAngle = (Math.PI * 2) / 3;
        const branch = (i % 3) * branchAngle;
        x = Math.cos(spin + branch) * radius;
        y = (Math.random() - 0.5) * 0.4;
        z = Math.sin(spin + branch) * radius;
      }
      else if (type === RelationshipType.FAMILY) {
        const t = (i / count) * Math.PI * 2;
        const scale = 3;
        const denom = 1 + Math.sin(t) * Math.sin(t);
        x = (scale * Math.cos(t)) / denom;
        z = (scale * Math.cos(t) * Math.sin(t)) / denom;
        y = (Math.random() - 0.5) * 0.5;
      }
      else if (type === RelationshipType.RIVALRY) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        const r = 1.0 + (Math.random() * 0.5); // Reduced size for Rivalry
        x = r * Math.sin(phi) * Math.cos(theta);
        y = r * Math.sin(phi) * Math.sin(theta);
        z = r * Math.cos(phi);
      }
      else {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        const r = 1.8 + (Math.random() * 0.8);
        x = r * Math.sin(phi) * Math.cos(theta);
        y = r * Math.sin(phi) * Math.sin(theta);
        z = r * Math.cos(phi);
      }

      x += (Math.random() - 0.5) * 0.1;
      y += (Math.random() - 0.5) * 0.1;
      z += (Math.random() - 0.5) * 0.1;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      tempColor.lerpColors(colorA, colorB, Math.random());
      // Boost colors for bloom
      col[i * 3] = tempColor.r * 2.0;
      col[i * 3 + 1] = tempColor.g * 2.0;
      col[i * 3 + 2] = tempColor.b * 2.0;
    }
    return { positions: pos, colors: col };
  }, [type, primaryColor, secondaryColor]);

  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  // Rotation Fix: Rotate 90deg on X to face camera for flat shapes
  const initialRotation: [number, number, number] =
    (type === RelationshipType.FRIENDSHIP || type === RelationshipType.FAMILY)
      ? [Math.PI / 2, 0, 0]
      : [0, 0, 0];

  return (
    <group>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <group rotation={initialRotation}>
          {/* @ts-ignore */}
          <points ref={ref}>
            {/* @ts-ignore */}
            <bufferGeometry>
              {/* @ts-ignore */}
              <bufferAttribute
                attach="attributes-position"
                count={positions.length / 3}
                array={positions}
                itemSize={3}
              />
              {/* @ts-ignore */}
              <bufferAttribute
                attach="attributes-color"
                count={particleColors.length / 3}
                array={particleColors}
                itemSize={3}
              />
            </bufferGeometry>
            {/* @ts-ignore */}
            <PointMaterial
              transparent
              vertexColors
              size={0.05}
              sizeAttenuation={true}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </points>
        </group>
      </Float>
    </group>
  );
};