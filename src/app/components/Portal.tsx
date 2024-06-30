// pages/3dScene.js
import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber'
import { Box } from '@react-three/drei';

const ThreeDScene = () => {
  const cameraRef = useRef();

  useEffect(() => {
    const handleDeviceOrientation = (event) => {
      const { alpha, beta, gamma } = event;
      // Update camera rotation based on device orientation
      if (cameraRef.current) {
        cameraRef.current.rotation.x = beta * Math.PI / 180;
        cameraRef.current.rotation.y = gamma * Math.PI / 180;
        cameraRef.current.rotation.z = alpha * Math.PI / 180;
      }
    };

    window.addEventListener('deviceorientation', handleDeviceOrientation);

    return () => {
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
    };
  }, []);

  return (
    <Canvas>
      <perspectiveCamera ref={cameraRef} position={[0, 0, 5]} />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
    </Canvas>
  );
};

export default ThreeDScene;
