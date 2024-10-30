import React, { useEffect, useRef, useState } from 'react';

const FireworkCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [fireworks, setFireworks] = useState<Firework[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [hue, setHue] = useState(120);
  const [mousedown, setMousedown] = useState(false);
  const [mx, setMx] = useState(0);
  const [my, setMy] = useState(0);
  const cw = window.innerWidth;
  const ch = window.innerHeight;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = cw;
    canvas.height = ch;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const requestAnimFrame =
    window.requestAnimationFrame ||
    (window as any).webkitRequestAnimationFrame ||
    (window as any).mozRequestAnimationFrame ||
      function (callback: FrameRequestCallback) {
        window.setTimeout(callback, 1000 / 60);
      };

    let timerTick = 0;
    let limiterTick = 0;
    const limiterTotal = 5;
    const timerTotal = 80;

    const loop = () => {
      requestAnimFrame(loop);
      setHue((prev) => prev + 0.5);

      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, cw, ch);
      ctx.globalCompositeOperation = 'lighter';

      fireworks.forEach((firework, index) => {
        firework.update(index, setFireworks);
        firework.draw(ctx, hue);
      });

      particles.forEach((particle, index) => {
        particle.update(index, setParticles);
        particle.draw(ctx);
      });

      if (timerTick >= timerTotal) {
        if (!mousedown) {
          setFireworks((prev) => [
            ...prev,
            new Firework(cw / 2, ch, random(0, cw), random(0, ch / 2)),
          ]);
          timerTick = 0;
        }
      } else {
        timerTick++;
      }

      if (limiterTick >= limiterTotal) {
        if (mousedown) {
          setFireworks((prev) => [
            ...prev,
            new Firework(cw / 2, ch, mx, my),
          ]);
          limiterTick = 0;
        }
      } else {
        limiterTick++;
      }
    };

    loop();

    const handleMouseMove = (e: MouseEvent) => {
      setMx(e.pageX - canvas.offsetLeft);
      setMy(e.pageY - canvas.offsetTop);
    };

    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      setMousedown(true);
    };

    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      setMousedown(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [fireworks, particles, mousedown, mx, my, cw, ch]);

  // Utility functions
  const random = (min: number, max: number) => Math.random() * (max - min) + min;

  // Firework class
  class Firework {
    x: number;
    y: number;
    sx: number;
    sy: number;
    tx: number;
    ty: number;
    distanceToTarget: number;
    distanceTraveled: number;
    coordinates: number[][];
    coordinateCount: number;
    angle: number;
    speed: number;
    acceleration: number;
    brightness: number;
    targetRadius: number;

    constructor(sx: number, sy: number, tx: number, ty: number) {
      this.x = sx;
      this.y = sy;
      this.sx = sx;
      this.sy = sy;
      this.tx = tx;
      this.ty = ty;
      this.distanceToTarget = Math.sqrt(
        Math.pow(sx - tx, 2) + Math.pow(sy - ty, 2)
      );
      this.distanceTraveled = 0;
      this.coordinates = [];
      this.coordinateCount = 3;

      while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
      }
      this.angle = Math.atan2(ty - sy, tx - sx);
      this.speed = 2;
      this.acceleration = 1.05;
      this.brightness = random(50, 70);
      this.targetRadius = 1;
    }

    update(index: number, setFireworks: React.Dispatch<React.SetStateAction<Firework[]>>) {
      this.coordinates.pop();
      this.coordinates.unshift([this.x, this.y]);

      if (this.targetRadius < 8) {
        this.targetRadius += 0.3;
      } else {
        this.targetRadius = 1;
      }

      this.speed *= this.acceleration;
      const vx = Math.cos(this.angle) * this.speed;
      const vy = Math.sin(this.angle) * this.speed;
      this.distanceTraveled = Math.sqrt(
        Math.pow(this.sx - this.x - vx, 2) + Math.pow(this.sy - this.y - vy, 2)
      );

      if (this.distanceTraveled >= this.distanceToTarget) {
        createParticles(this.tx, this.ty, setParticles);
        setFireworks((prev) => {
          const newFireworks = [...prev];
          newFireworks.splice(index, 1);
          return newFireworks;
        });
      } else {
        this.x += vx;
        this.y += vy;
      }
    }

    draw(ctx: CanvasRenderingContext2D, hue: number) {
      ctx.beginPath();
      ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
      ctx.lineTo(this.x, this.y);
      ctx.strokeStyle = `hsl(${hue}, 100%, ${this.brightness}%)`;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(this.tx, this.ty, this.targetRadius, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // Particle class
  class Particle {
    x: number;
    y: number;
    coordinates: number[][];
    coordinateCount: number;
    angle: number;
    speed: number;
    friction: number;
    gravity: number;
    hue: number;
    brightness: number;
    alpha: number;
    decay: number;

    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
      this.coordinates = [];
      this.coordinateCount = 5;

      while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
      }

      this.angle = random(0, Math.PI * 2);
      this.speed = random(1, 10);
      this.friction = 0.95;
      this.gravity = 1;
      this.hue = random(hue - 20, hue + 20);
      this.brightness = random(50, 80);
      this.alpha = 1;
      this.decay = random(0.015, 0.03);
    }

    update(index: number, setParticles: React.Dispatch<React.SetStateAction<Particle[]>>) {
      this.coordinates.pop();
      this.coordinates.unshift([this.x, this.y]);
      this.speed *= this.friction;
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed + this.gravity;
      this.alpha -= this.decay;

      if (this.alpha <= this.decay) {
        setParticles((prev) => {
          const newParticles = [...prev];
          newParticles.splice(index, 1);
          return newParticles;
        });
      }
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.beginPath();
      ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
      ctx.lineTo(this.x, this.y);
      ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
      ctx.stroke();
    }
  }

  // Create particles on explosion
  const createParticles = (x: number, y: number, setParticles: React.Dispatch<React.SetStateAction<Particle[]>>) => {
    const particleCount = 30;
    const newParticles: Particle[] = []; // Specify the type here


    for (let i = 0; i < particleCount; i++) {
      newParticles.push(new Particle(x, y));
    }
    setParticles((prev) => [...prev, ...newParticles]);
  };

  return <canvas ref={canvasRef} />;
};

export default FireworkCanvas;
