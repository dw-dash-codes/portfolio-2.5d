import React, { useRef } from 'react';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  depthIntensity?: number;
}

export const Card3D: React.FC<Card3DProps> = ({
  children,
  className = '',
  depthIntensity = 15,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -depthIntensity;
    const rotateY = ((x - centerX) / centerX) * depthIntensity;

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transition: 'transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)',
        transformStyle: 'preserve-3d',
      }}
      className={`rounded-xl border border-sand-400/20 bg-navy-900/70 backdrop-blur-xl p-6 shadow-2xl ${className}`}
    >
      {children}
    </div>
  );
};
