"use client";

import { useEffect, useRef, useState } from "react";

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const TRAIL_LENGTH = 60;
    const OVERLAY = "rgba(0,0,0,0.42)";

    let headRadius = 190;
    const mouse = { x: -9999, y: -9999 };
    const smooth = { x: -9999, y: -9999 };
    const trail: { x: number; y: number }[] = [];

    const bottomImage = new Image();
    const topImage = new Image();

    let loadedCount = 0;
    const onLoad = () => {
      loadedCount++;
      if (loadedCount === 2) {
        setIsLoaded(true);
        resize();
        draw();
      }
    };

    bottomImage.onload = onLoad;
    topImage.onload = onLoad;

    bottomImage.src = "/images/luffy-gear5.jpg";
    topImage.src = "/images/luffy-base.jpg";

    const offscreen = document.createElement("canvas");
    const offCtx = offscreen.getContext("2d");

    const resize = () => {
      if (!canvas || !offscreen) return;
      
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";

      offscreen.width = canvas.width;
      offscreen.height = canvas.height;

      headRadius = Math.min(width, height) * 0.18;
      if (headRadius < 80) headRadius = 80;
      if (headRadius > 250) headRadius = 250;
      headRadius *= dpr;
    };

    const handlePointerMove = (e: PointerEvent | MouseEvent | TouchEvent) => {
      const x = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const y = "touches" in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      mouse.x = x * dpr;
      mouse.y = y * dpr;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("touchmove", handlePointerMove, { passive: false });

    const drawImageCover = (
      context: CanvasRenderingContext2D,
      img: HTMLImageElement,
      cw: number,
      ch: number
    ) => {
      const imgRatio = img.width / img.height;
      const canvasRatio = cw / ch;
      let drawW = cw;
      let drawH = ch;
      let offsetX = 0;
      let offsetY = 0;

      if (imgRatio > canvasRatio) {
        drawW = ch * imgRatio;
        offsetX = (cw - drawW) / 2;
      } else {
        drawH = cw / imgRatio;
        offsetY = (ch - drawH) / 2;
      }
      context.drawImage(img, offsetX, offsetY, drawW, drawH);
    };

    const draw = () => {
      if (!ctx || !offCtx) return;

      const w = canvas.width;
      const h = canvas.height;

      // 1. Draw bottom (Gear 5) + Overlay
      ctx.globalCompositeOperation = "source-over";
      drawImageCover(ctx, bottomImage, w, h);
      ctx.fillStyle = OVERLAY;
      ctx.fillRect(0, 0, w, h);

      // Smooth cursor
      if (smooth.x === -9999) {
        smooth.x = mouse.x;
        smooth.y = mouse.y;
      } else {
        smooth.x += (mouse.x - smooth.x) * 0.13;
        smooth.y += (mouse.y - smooth.y) * 0.13;
      }

      trail.unshift({ x: smooth.x, y: smooth.y });
      if (trail.length > TRAIL_LENGTH) {
        trail.pop();
      }

      if (trail.length > 0 && trail[0].x !== -9999) {
        // 2. Draw trail circles on offscreen canvas
        offCtx.clearRect(0, 0, w, h);
        offCtx.globalCompositeOperation = "source-over";
        offCtx.lineJoin = "round";
        offCtx.lineCap = "round";

        for (let i = 0; i < trail.length; i++) {
          const pt = trail[i];
          const progress = 1 - i / trail.length;
          const radius = headRadius * Math.pow(progress, 0.6);
          const alpha = Math.pow(progress, 1.2);

          offCtx.beginPath();
          offCtx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
          offCtx.fillStyle = `rgba(0,0,0,${alpha})`;
          offCtx.fill();
        }

        // 3. Mask top image (Base Luffy) into offscreen trail
        offCtx.globalCompositeOperation = "source-in";
        drawImageCover(offCtx, topImage, w, h);

        // 4. Apply overlay to masked area
        offCtx.globalCompositeOperation = "source-atop";
        offCtx.fillStyle = OVERLAY;
        offCtx.fillRect(0, 0, w, h);

        // 5. Draw masked trail to main canvas
        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(offscreen, 0, 0);

        // 5. Draw awakening glow on main canvas
        const head = trail[0];
        const g = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, headRadius * 1.45);
        g.addColorStop(0, "rgba(255,245,215,0.30)");
        g.addColorStop(0.45, "rgba(244,196,48,0.14)");
        g.addColorStop(1, "rgba(0,0,0,0)");

        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(head.x, head.y, headRadius * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0">
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-none"
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#04060c] z-50">
          <p className="text-white font-bebas text-2xl tracking-[0.2em] animate-pulse">
            Awakening Nika...
          </p>
        </div>
      )}
    </div>
  );
}
