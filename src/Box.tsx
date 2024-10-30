import React, { useRef, useEffect } from 'react';

const Box: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to full screen
    const cw = window.innerWidth;
    const ch = window.innerHeight;
    canvas.width = cw;
    canvas.height = ch;

    // Initialize variables
    let fireworks: any[] = [];
    let particles: any[] = [];
    let hue = 120;
    let limiterTotal = 5;
    let limiterTick = 0;
    let timerTotal = 80;
    let timerTick = 0;
    let mousedown = false;
    let mx: number, my: number;

    // RequestAnimationFrame shim for cross-browser support
    const requestAnimFrame = (function () {
      return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback: FrameRequestCallback) {
          window.setTimeout(callback, 1000 / 60);
        }
      );
    })();

    // Helper functions
    const random = (min: number, max: number) => Math.random() * (max - min) + min;

    const calculateDistance = (p1x: number, p1y: number, p2x: number, p2y: number) => {
      const xDistance = p1x - p2x;
      const yDistance = p1y - p2y;
      return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
    };

    // Firework class
    function Firework(sx: number, sy: number, tx: number, ty: number) {
      this.x = sx;
      this.y = sy;
      this.sx = sx;
      this.sy = sy;
      this.tx = tx;
      this.ty = ty;
      this.distanceToTarget = calculateDistance(sx, sy, tx, ty);
      this.distanceTraveled = 0;
      this.coordinates = Array.from({ length: 3 }, () => [this.x, this.y]);
      this.angle = Math.atan2(ty - sy, tx - sx);
      this.speed = 2;
      this.acceleration = 1.05;
      this.brightness = random(50, 70);
      this.targetRadius = 1;
    }

    Firework.prototype.update = function (index: number) {
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

      this.distanceTraveled = calculateDistance(this.sx, this.sy, this.x + vx, this.y + vy);

      if (this.distanceTraveled >= this.distanceToTarget) {
        createParticles(this.tx, this.ty);
        fireworks.splice(index, 1);
      } else {
        this.x += vx;
        this.y += vy;
      }
    };

    Firework.prototype.draw = function () {
      ctx.beginPath();
      ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
      ctx.lineTo(this.x, this.y);
      ctx.strokeStyle = `hsl(${hue}, 100%, ${this.brightness}%)`;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(this.tx, this.ty, this.targetRadius, 0, Math.PI * 2);
      ctx.stroke();
    };

    // Particle class
    function Particle(x: number, y: number) {
      this.x = x;
      this.y = y;
      this.coordinates = Array.from({ length: 5 }, () => [this.x, this.y]);
      this.angle = random(0, Math.PI * 2);
      this.speed = random(1, 10);
      this.friction = 0.95;
      this.gravity = 1;
      this.hue = random(hue - 20, hue + 20);
      this.brightness = random(50, 80);
      this.alpha = 1;
      this.decay = random(0.015, 0.03);
    }

    Particle.prototype.update = function (index: number) {
      this.coordinates.pop();
      this.coordinates.unshift([this.x, this.y]);
      this.speed *= this.friction;
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed + this.gravity;
      this.alpha -= this.decay;

      if (this.alpha <= this.decay) {
        particles.splice(index, 1);
      }
    };

    Particle.prototype.draw = function () {
      ctx.beginPath();
      ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
      ctx.lineTo(this.x, this.y);
      ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
      ctx.stroke();
    };

    const createParticles = (x: number, y: number) => {
      let particleCount = 30;
      while (particleCount--) {
        particles.push(new Particle(x, y));
      }
    };

    const loop = () => {
      requestAnimFrame(loop);
      hue += 0.5;

      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, cw, ch);
      ctx.globalCompositeOperation = 'lighter';

      fireworks.forEach((firework, index) => {
        firework.draw();
        firework.update(index);
      });

      particles.forEach((particle, index) => {
        particle.draw();
        particle.update(index);
      });

      if (timerTick >= timerTotal) {
        if (!mousedown) {
          fireworks.push(new Firework(cw / 2, ch, random(0, cw), random(0, ch / 2)));
          timerTick = 0;
        }
      } else {
        timerTick++;
      }

      if (limiterTick >= limiterTotal) {
        if (mousedown) {
          fireworks.push(new Firework(cw / 2, ch, mx, my));
          limiterTick = 0;
        }
      } else {
        limiterTick++;
      }
    };

    canvas.addEventListener('mousemove', (e) => {
      mx = e.pageX - canvas.offsetLeft;
      my = e.pageY - canvas.offsetTop;
    });

    canvas.addEventListener('mousedown', (e) => {
      e.preventDefault();
      mousedown = true;
    });

    canvas.addEventListener('mouseup', (e) => {
      e.preventDefault();
      mousedown = false;
    });

    loop();
  }, []);

  return <canvas ref={canvasRef} id="canvas" style={{ display: 'block' }} />;
};

export default Box;
