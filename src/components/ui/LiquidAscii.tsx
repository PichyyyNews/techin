import React, { useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

class FluidSimulation {
  medium: number;
  gx: number;
  gy: number;
  step: number;
  invStep: number;
  totalCells: number;
  hx: Float32Array;
  hy: Float32Array;
  dhx: Float32Array;
  dhy: Float32Array;
  oldHx: Float32Array;
  oldHy: Float32Array;
  tension: Float32Array;
  wall: Float32Array;
  kind: Int32Array;
  shade: Float32Array;
  maxParts: number;
  pos: Float32Array;
  vel: Float32Array;
  partDensity: Float32Array;
  restDensity: number;
  pRad: number;
  pInvH: number;
  pNx: number;
  pNy: number;
  pTotal: number;
  bucketCount: Int32Array;
  bucketStart: Int32Array;
  bucketIds: Int32Array;
  count: number;

  constructor(
    medium: number,
    simW: number,
    simH: number,
    gridH: number,
    particleRadius: number,
    maxParticles: number
  ) {
    this.medium = medium;
    this.gx = Math.floor(simW / gridH);
    this.gy = Math.floor(simH / gridH);
    this.step = Math.max(simW / this.gx, simH / this.gy);
    this.invStep = 1 / this.step;
    this.totalCells = this.gx * this.gy;
    this.hx = new Float32Array(this.totalCells);
    this.hy = new Float32Array(this.totalCells);
    this.dhx = new Float32Array(this.totalCells);
    this.dhy = new Float32Array(this.totalCells);
    this.oldHx = new Float32Array(this.totalCells);
    this.oldHy = new Float32Array(this.totalCells);
    this.tension = new Float32Array(this.totalCells);
    this.wall = new Float32Array(this.totalCells);
    this.kind = new Int32Array(this.totalCells);
    this.shade = new Float32Array(3 * this.totalCells);
    this.maxParts = maxParticles;
    this.pos = new Float32Array(2 * maxParticles);
    this.vel = new Float32Array(2 * maxParticles);
    this.partDensity = new Float32Array(this.totalCells);
    this.restDensity = 0;
    this.pRad = particleRadius;
    this.pInvH = 1 / (2.2 * particleRadius);
    this.pNx = Math.floor(simW * this.pInvH) + 1;
    this.pNy = Math.floor(simH * this.pInvH) + 1;
    this.pTotal = this.pNx * this.pNy;
    this.bucketCount = new Int32Array(this.pTotal);
    this.bucketStart = new Int32Array(this.pTotal + 1);
    this.bucketIds = new Int32Array(maxParticles);
    this.count = 0;
  }

  push(dt: number, gravity: number) {
    for (let i = 0; i < this.count; i++) {
      this.vel[2 * i + 1] += dt * gravity;
      this.pos[2 * i] += this.vel[2 * i] * dt;
      this.pos[2 * i + 1] += this.vel[2 * i + 1] * dt;
    }
  }

  separate(iterations: number) {
    this.bucketCount.fill(0);
    for (let i = 0; i < this.count; i++) {
      const bx = clamp(Math.floor(this.pos[2 * i] * this.pInvH), 0, this.pNx - 1);
      const by = clamp(Math.floor(this.pos[2 * i + 1] * this.pInvH), 0, this.pNy - 1);
      this.bucketCount[bx * this.pNy + by]++;
    }
    let total = 0;
    for (let i = 0; i < this.pTotal; i++) {
      total += this.bucketCount[i];
      this.bucketStart[i] = total;
    }
    this.bucketStart[this.pTotal] = total;
    for (let i = 0; i < this.count; i++) {
      const bx = clamp(Math.floor(this.pos[2 * i] * this.pInvH), 0, this.pNx - 1);
      const by = clamp(Math.floor(this.pos[2 * i + 1] * this.pInvH), 0, this.pNy - 1);
      const bucket = bx * this.pNy + by;
      this.bucketStart[bucket]--;
      this.bucketIds[this.bucketStart[bucket]] = i;
    }
    const dMin = 2 * this.pRad;
    const dMinSq = dMin * dMin;
    for (let iter = 0; iter < iterations; iter++) {
      for (let i = 0; i < this.count; i++) {
        const px = this.pos[2 * i];
        const py = this.pos[2 * i + 1];
        const bx = Math.floor(px * this.pInvH);
        const by = Math.floor(py * this.pInvH);
        const x0 = Math.max(bx - 1, 0);
        const y0 = Math.max(by - 1, 0);
        const x1 = Math.min(bx + 1, this.pNx - 1);
        const y1 = Math.min(by + 1, this.pNy - 1);
        for (let xi = x0; xi <= x1; xi++) {
          for (let yi = y0; yi <= y1; yi++) {
            const bucket = xi * this.pNy + yi;
            const start = this.bucketStart[bucket];
            const end = this.bucketStart[bucket + 1];
            for (let k = start; k < end; k++) {
              const j = this.bucketIds[k];
              if (j === i) continue;
              let dx = this.pos[2 * j] - px;
              let dy = this.pos[2 * j + 1] - py;
              const distSq = dx * dx + dy * dy;
              if (distSq > dMinSq || distSq === 0) continue;
              const dist = Math.sqrt(distSq);
              const factor = (0.5 * (dMin - dist)) / dist;
              dx *= factor;
              dy *= factor;
              this.pos[2 * i] -= dx;
              this.pos[2 * i + 1] -= dy;
              this.pos[2 * j] += dx;
              this.pos[2 * j + 1] += dy;
            }
          }
        }
      }
    }
  }

  clampWalls() {
    const s = 1 / this.invStep;
    const r = this.pRad;
    const minX = s + r;
    const maxX = (this.gx - 1) * s - r;
    const minY = s + r;
    const maxY = (this.gy - 1) * s - r;
    for (let i = 0; i < this.count; i++) {
      let x = this.pos[2 * i];
      let y = this.pos[2 * i + 1];
      if (x < minX) {
        x = minX;
        this.vel[2 * i] = 0;
      }
      if (x > maxX) {
        x = maxX;
        this.vel[2 * i] = 0;
      }
      if (y < minY) {
        y = minY;
        this.vel[2 * i + 1] = 0;
      }
      if (y > maxY) {
        y = maxY;
        this.vel[2 * i + 1] = 0;
      }
      this.pos[2 * i] = x;
      this.pos[2 * i + 1] = y;
    }
  }

  impulse(cx: number, cy: number, vx: number, vy: number, radius: number) {
    if (radius <= 0) return;
    const rSq = radius * radius;
    const speed = Math.sqrt(vx * vx + vy * vy);
    let normVx = vx;
    let normVy = vy;
    if (speed > 2) {
      normVx = (vx / speed) * 2;
      normVy = (vy / speed) * 2;
    }
    for (let i = 0; i < this.count; i++) {
      const dx = this.pos[2 * i] - cx;
      const dy = this.pos[2 * i + 1] - cy;
      const distSq = dx * dx + dy * dy;
      if (distSq < rSq && distSq > 1e-4) {
        const falloff = 1 - Math.sqrt(distSq) / radius;
        const factor = falloff * falloff;
        this.vel[2 * i] += normVx * factor;
        this.vel[2 * i + 1] += normVy * factor;
      }
    }
  }

  measureDensity() {
    const gy = this.gy;
    const step = this.step;
    const invStep = this.invStep;
    const hStep = 0.5 * step;
    const pd = this.partDensity;
    pd.fill(0);
    for (let i = 0; i < this.count; i++) {
      const x = clamp(this.pos[2 * i], step, (this.gx - 1) * step);
      const y = clamp(this.pos[2 * i + 1], step, (this.gy - 1) * step);
      const bx = Math.floor((x - hStep) * invStep);
      const fx = (x - hStep - bx * step) * invStep;
      const bx1 = Math.min(bx + 1, this.gx - 2);
      const by = Math.floor((y - hStep) * invStep);
      const fy = (y - hStep - by * step) * invStep;
      const by1 = Math.min(by + 1, this.gy - 2);
      const w00 = 1 - fx;
      const w01 = 1 - fy;
      if (bx < this.gx && by < this.gy) pd[bx * gy + by] += w00 * w01;
      if (bx1 < this.gx && by < this.gy) pd[bx1 * gy + by] += fx * w01;
      if (bx1 < this.gx && by1 < this.gy) pd[bx1 * gy + by1] += fx * fy;
      if (bx < this.gx && by1 < this.gy) pd[bx * gy + by1] += w00 * fy;
    }
    if (this.restDensity === 0) {
      let sum = 0;
      let cnt = 0;
      for (let i = 0; i < this.totalCells; i++) {
        if (this.kind[i] === 0) {
          sum += pd[i];
          cnt++;
        }
      }
      if (cnt > 0) this.restDensity = sum / cnt;
    }
  }

  gridTransfer(toGrid: boolean, flipRatio: number) {
    const gy = this.gy;
    const step = this.step;
    const invStep = this.invStep;
    const hStep = 0.5 * step;
    if (toGrid) {
      this.oldHx.set(this.hx);
      this.oldHy.set(this.hy);
      this.dhx.fill(0);
      this.dhy.fill(0);
      this.hx.fill(0);
      this.hy.fill(0);
      for (let i = 0; i < this.totalCells; i++) {
        this.kind[i] = this.wall[i] === 0 ? 2 : 1;
      }
      for (let i = 0; i < this.count; i++) {
        const cx = clamp(Math.floor(this.pos[2 * i] * invStep), 0, this.gx - 1);
        const cy = clamp(Math.floor(this.pos[2 * i + 1] * invStep), 0, this.gy - 1);
        if (this.kind[cx * gy + cy] === 1) {
          this.kind[cx * gy + cy] = 0;
        }
      }
    }
    for (let comp = 0; comp < 2; comp++) {
      const offsetX = comp === 0 ? 0 : hStep;
      const offsetY = comp === 0 ? hStep : 0;
      const grid = comp === 0 ? this.hx : this.hy;
      const oldGrid = comp === 0 ? this.oldHx : this.oldHy;
      const weightGrid = comp === 0 ? this.dhx : this.dhy;
      for (let i = 0; i < this.count; i++) {
        const px = clamp(this.pos[2 * i], step, (this.gx - 1) * step);
        const py = clamp(this.pos[2 * i + 1], step, (this.gy - 1) * step);
        const bx = Math.min(Math.floor((px - offsetX) * invStep), this.gx - 2);
        const fx = (px - offsetX - bx * step) * invStep;
        const bx1 = Math.min(bx + 1, this.gx - 2);
        const by = Math.min(Math.floor((py - offsetY) * invStep), this.gy - 2);
        const fy = (py - offsetY - by * step) * invStep;
        const by1 = Math.min(by + 1, this.gy - 2);
        const w00 = (1 - fx) * (1 - fy);
        const w10 = fx * (1 - fy);
        const w11 = fx * fy;
        const w01 = (1 - fx) * fy;
        const c00 = bx * gy + by;
        const c10 = bx1 * gy + by;
        const c11 = bx1 * gy + by1;
        const c01 = bx * gy + by1;
        if (toGrid) {
          const v = this.vel[2 * i + comp];
          grid[c00] += v * w00;
          weightGrid[c00] += w00;
          grid[c10] += v * w10;
          weightGrid[c10] += w10;
          grid[c11] += v * w11;
          weightGrid[c11] += w11;
          grid[c01] += v * w01;
          weightGrid[c01] += w01;
        } else {
          const offsetIdx = comp === 0 ? gy : 1;
          const k00 = +(this.kind[c00] !== 1 || this.kind[c00 - offsetIdx] !== 1);
          const k10 = +(this.kind[c10] !== 1 || this.kind[c10 - offsetIdx] !== 1);
          const k11 = +(this.kind[c11] !== 1 || this.kind[c11 - offsetIdx] !== 1);
          const k01 = +(this.kind[c01] !== 1 || this.kind[c01 - offsetIdx] !== 1);
          const wTotal = k00 * w00 + k10 * w10 + k11 * w11 + k01 * w01;
          if (wTotal > 0) {
            const pic = (k00 * w00 * grid[c00] + k10 * w10 * grid[c10] + k11 * w11 * grid[c11] + k01 * w01 * grid[c01]) / wTotal;
            const flipDelta =
              (k00 * w00 * (grid[c00] - oldGrid[c00]) +
                k10 * w10 * (grid[c10] - oldGrid[c10]) +
                k11 * w11 * (grid[c11] - oldGrid[c11]) +
                k01 * w01 * (grid[c01] - oldGrid[c01])) /
              wTotal;
            const flip = this.vel[2 * i + comp] + flipDelta;
            this.vel[2 * i + comp] = (1 - flipRatio) * pic + flipRatio * flip;
          }
        }
      }
      if (toGrid) {
        for (let idx = 0; idx < grid.length; idx++) {
          if (weightGrid[idx] > 0) grid[idx] /= weightGrid[idx];
        }
        for (let x = 0; x < this.gx; x++) {
          for (let y = 0; y < this.gy; y++) {
            const isSolid = this.kind[x * gy + y] === 2;
            if (isSolid || (x > 0 && this.kind[(x - 1) * gy + y] === 2)) {
              this.hx[x * gy + y] = this.oldHx[x * gy + y];
            }
            if (isSolid || (y > 0 && this.kind[x * gy + y - 1] === 2)) {
              this.hy[x * gy + y] = this.oldHy[x * gy + y];
            }
          }
        }
      }
    }
  }

  solvePressure(iterations: number, dt: number, overRelaxation: number, applyDensity: boolean) {
    this.tension.fill(0);
    this.oldHx.set(this.hx);
    this.oldHy.set(this.hy);
    const gy = this.gy;
    const coeff = (this.medium * this.step) / dt;
    for (let iter = 0; iter < iterations; iter++) {
      for (let x = 1; x < this.gx - 1; x++) {
        for (let y = 1; y < this.gy - 1; y++) {
          if (this.kind[x * gy + y] !== 0) continue;
          const center = x * gy + y;
          const left = (x - 1) * gy + y;
          const right = (x + 1) * gy + y;
          const bottom = x * gy + y - 1;
          const top = x * gy + y + 1;
          const sLeft = this.wall[left];
          const sRight = this.wall[right];
          const sBottom = this.wall[bottom];
          const sTop = this.wall[top];
          const sTotal = sLeft + sRight + sBottom + sTop;
          if (sTotal === 0) continue;
          let div = this.hx[right] - this.hx[center] + this.hy[top] - this.hy[center];
          if (this.restDensity > 0 && applyDensity) {
            const comp = this.partDensity[center] - this.restDensity;
            if (comp > 0) div -= comp;
          }
          const p = (-div / sTotal) * overRelaxation;
          this.tension[center] += coeff * p;
          this.hx[center] -= sLeft * p;
          this.hx[right] += sRight * p;
          this.hy[center] -= sBottom * p;
          this.hy[top] += sTop * p;
        }
      }
    }
  }

  computeShade() {
    this.shade.fill(0);
    for (let i = 0; i < this.totalCells; i++) {
      if (this.kind[i] === 2) {
        this.shade[3 * i] = 0.5;
        this.shade[3 * i + 1] = 0.5;
        this.shade[3 * i + 2] = 0.5;
      } else if (this.kind[i] === 0) {
        let d = this.partDensity[i];
        if (this.restDensity > 0) d /= this.restDensity;
        const clampedD = clamp(d, 0, 1.9999);
        const segment = Math.floor(clampedD / 0.25);
        const frac = (clampedD - 0.25 * segment) / 0.25;
        const val = segment % 2 === 0 ? frac : 1 - frac;
        this.shade[3 * i] = val;
        this.shade[3 * i + 1] = val;
        this.shade[3 * i + 2] = val;
      }
    }
  }

  tick(dt: number, gravity: number, flipRatio: number, pressureIters: number, separationIters: number, overRelaxation: number) {
    this.push(dt, gravity);
    this.separate(separationIters);
    this.clampWalls();
    this.gridTransfer(true, flipRatio);
    this.measureDensity();
    this.solvePressure(pressureIters, dt, overRelaxation, true);
    this.gridTransfer(false, flipRatio);
    this.computeShade();
  }
}

export interface LiquidAsciiProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  children?: React.ReactNode;
  speed?: number;
  cellSize?: number;
  gravity?: number;
  flipRatio?: number;
  pressureIters?: number;
  separationIters?: number;
  overRelaxation?: number;
  fillHeight?: number;
  cursorRadius?: number;
  cursorForce?: number;
  characters?: string;
  color?: string;
  backgroundColor?: string;
  fontFamily?: string;
  opacity?: number;
  autoWave?: boolean;
}

export const LiquidAscii: React.FC<LiquidAsciiProps> = ({
  width = '100%',
  height = '100%',
  className,
  children,
  speed = 0.9,
  cellSize = 14,
  gravity = -25,
  flipRatio = 0.3,
  pressureIters = 30,
  separationIters = 3,
  overRelaxation = 1.5,
  fillHeight = 0.35,
  cursorRadius = 0.25,
  cursorForce = 66,
  characters = ' ·:-~=+*#%@',
  color = '#000000',
  backgroundColor = 'transparent',
  fontFamily = 'monospace',
  opacity = 1,
  autoWave = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const simRef = useRef<FluidSimulation | null>(null);

  const stateRef = useRef({
    cursorX: -999,
    cursorY: -999,
    cursorVX: 0,
    cursorVY: 0,
    lastMoveTime: 0,
    autoTime: 0,
    cols: 0,
    rows: 0,
    simH: 2,
    scale: 1,
    letterSpacing: 0,
  });

  const propsRef = useRef({
    speed,
    gravity,
    flipRatio,
    pressureIters,
    separationIters,
    overRelaxation,
    fillHeight,
    cursorRadius,
    cursorForce,
    characters,
    color,
    backgroundColor,
    fontFamily,
    opacity,
    cellSize,
    autoWave,
  });

  useEffect(() => {
    propsRef.current = {
      speed,
      gravity,
      flipRatio,
      pressureIters,
      separationIters,
      overRelaxation,
      fillHeight,
      cursorRadius,
      cursorForce,
      characters,
      color,
      backgroundColor,
      fontFamily,
      opacity,
      cellSize,
      autoWave,
    };
  }, [
    speed,
    gravity,
    flipRatio,
    pressureIters,
    separationIters,
    overRelaxation,
    fillHeight,
    cursorRadius,
    cursorForce,
    characters,
    color,
    backgroundColor,
    fontFamily,
    opacity,
    cellSize,
    autoWave,
  ]);

  const initSim = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const cSize = propsRef.current.cellSize;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let charW = 0.6 * cSize;
    if (ctx) {
      ctx.font = `${cSize}px ${propsRef.current.fontFamily}`;
      const metrics = ctx.measureText('@');
      if (metrics.width > 0) charW = metrics.width;
    }
    const letterSpacing = cSize - charW;
    const cols = Math.ceil(rect.width / cSize) + 4;
    const rows = Math.ceil(rect.height / cSize) + 4;
    const scale = (rows * cSize) / 2;
    const simW = (cols * cSize) / scale;
    const gridH = 2 / rows;
    const pRad = 0.3 * gridH;
    const dMin = 2 * pRad;
    const rowH = (Math.sqrt(3) / 2) * dMin;
    const fHeight = propsRef.current.fillHeight;
    const pCols = Math.floor((simW - 2 * gridH - 2 * pRad) / dMin);
    const pRows = Math.floor((2 * fHeight - 2 * gridH - 2 * pRad) / rowH);
    const totalP = pCols * pRows;

    const sim = new FluidSimulation(1000, simW, 2, gridH, pRad, totalP);
    sim.count = totalP;
    let ptr = 0;
    const startX = (simW - pCols * dMin) / 2;
    for (let x = 0; x < pCols; x++) {
      for (let y = 0; y < pRows; y++) {
        sim.pos[ptr++] = gridH + pRad + dMin * x + (y % 2 === 0 ? 0 : pRad) + startX;
        sim.pos[ptr++] = gridH + pRad + rowH * y + 0;
      }
    }
    const gy = sim.gy;
    for (let x = 0; x < sim.gx; x++) {
      for (let y = 0; y < sim.gy; y++) {
        let isWall = 1;
        if (x === 0 || x === sim.gx - 1 || y === 0 || y === sim.gy - 1) {
          isWall = 0;
        }
        sim.wall[x * gy + y] = isWall;
      }
    }
    simRef.current = sim;
    const s = stateRef.current;
    s.cols = cols;
    s.rows = rows;
    s.simH = 2;
    s.scale = scale;
    s.letterSpacing = letterSpacing;
  }, []);

  useEffect(() => {
    initSim();
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => initSim());
    observer.observe(el);
    return () => observer.disconnect();
  }, [initSim, cellSize, fillHeight]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updatePointer = (clientX: number, clientY: number) => {
      const rect = el.getBoundingClientRect();
      const s = stateRef.current;
      const px = clientX - rect.left;
      const py = clientY - rect.top;
      const x = px / s.scale;
      const y = (s.rows * propsRef.current.cellSize - py) / s.scale;

      if (s.cursorX > -900) {
        s.cursorVX += x - s.cursorX;
        s.cursorVY += y - s.cursorY;
      }
      s.cursorX = x;
      s.cursorY = y;
      s.lastMoveTime = performance.now();
    };

    const resetPointer = () => {
      const s = stateRef.current;
      s.cursorX = -999;
      s.cursorY = -999;
      s.cursorVX = 0;
      s.cursorVY = 0;
    };

    const handleMouseMove = (e: MouseEvent) => updatePointer(e.clientX, e.clientY);
    const handleTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updatePointer(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', resetPointer);
    el.addEventListener('touchstart', handleTouch, { passive: true });
    el.addEventListener('touchmove', handleTouch, { passive: true });
    el.addEventListener('touchend', resetPointer);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', resetPointer);
      el.removeEventListener('touchstart', handleTouch);
      el.removeEventListener('touchmove', handleTouch);
      el.removeEventListener('touchend', resetPointer);
    };
  }, []);

  useEffect(() => {
    const pre = preRef.current;
    if (!pre) return;
    let animId = 0;

    const renderFrame = () => {
      const sim = simRef.current;
      const s = stateRef.current;
      const p = propsRef.current;

      if (!sim) {
        animId = requestAnimationFrame(renderFrame);
        return;
      }

      const dt = (1 / 120) * p.speed;
      if (s.cursorX > -900) {
        const fx = s.cursorVX * p.cursorForce;
        const fy = s.cursorVY * p.cursorForce;
        const simMin = Math.min(sim.gx * sim.step, sim.gy * sim.step);
        const radius = p.cursorRadius * simMin;
        sim.impulse(s.cursorX, s.cursorY, fx, fy, radius);
      }
      s.cursorVX = 0;
      s.cursorVY = 0;

      const idleTime = performance.now() - s.lastMoveTime;
      if (p.autoWave && idleTime > 2000) {
        s.autoTime += dt;
        const t = s.autoTime;
        const simW = sim.gx * sim.step;
        const simH = sim.gy * sim.step;
        const simMin = Math.min(simW, simH);
        const radius = p.cursorRadius * simMin * 1.5;
        const cx = simW * (0.5 + 0.35 * Math.sin(0.7 * t));
        const cy = simH * (0.3 + 0.15 * Math.sin(1.1 * t));
        const vx = 0.35 * Math.cos(0.7 * t) * simW * 0.7;
        const vy = 0.15 * Math.cos(1.1 * t) * simH * 1.1;
        const ramp = Math.min((idleTime - 2000) / 1000, 1) * p.cursorForce * 0.4;
        sim.impulse(cx, cy, vx * ramp, vy * ramp, radius);
      } else {
        s.autoTime = 0;
      }

      sim.tick(dt, p.gravity, p.flipRatio, p.pressureIters, p.separationIters, p.overRelaxation);

      const chars = p.characters;
      const charLen = chars.length;
      const gy = sim.gy;
      let text = '';
      const maxX = sim.gx - 1;
      const maxY = gy - 2;

      for (let y = maxY; y > 0; y--) {
        let rowStr = '';
        for (let x = 1; x < maxX; x++) {
          const shadeVal = sim.shade[3 * (x * gy + y)];
          const charIdx = Math.min(Math.floor(shadeVal * charLen), charLen - 1);
          rowStr += chars[charIdx];
        }
        text += rowStr + '\n';
      }

      pre.textContent = text;
      pre.style.color = p.color;
      pre.style.backgroundColor = p.backgroundColor;
      pre.style.fontFamily = p.fontFamily;
      pre.style.opacity = String(p.opacity);
      pre.style.fontSize = p.cellSize + 'px';
      pre.style.lineHeight = p.cellSize + 'px';
      pre.style.letterSpacing = s.letterSpacing + 'px';

      animId = requestAnimationFrame(renderFrame);
    };

    animId = requestAnimationFrame(renderFrame);
    return () => cancelAnimationFrame(animId);
  }, []);

  const widthStyle = typeof width === 'number' ? `${width}px` : width;
  const heightStyle = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden select-none', className)}
      style={{ width: widthStyle, height: heightStyle, backgroundColor }}
    >
      <pre
        ref={preRef}
        className="absolute inset-0 m-0 p-0 overflow-hidden select-none whitespace-pre pointer-events-none"
        style={{
          fontFamily,
          fontSize: `${cellSize}px`,
          lineHeight: `${cellSize}px`,
          letterSpacing: '0px',
          color,
          opacity,
        }}
      />
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
};

LiquidAscii.displayName = 'LiquidAscii';

export default LiquidAscii;
