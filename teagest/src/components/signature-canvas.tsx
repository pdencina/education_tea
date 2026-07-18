"use client";

import { useRef, useState, useEffect, useCallback } from "react";

interface SignatureCanvasProps {
  onSign: (dataUrl: string) => void;
  existingSignature?: string;
}

export function SignatureCanvas({ onSign, existingSignature }: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.strokeStyle = "#134e4a";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (existingSignature) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
        setHasSignature(true);
      };
      img.src = existingSignature;
    }
  }, [existingSignature]);

  useEffect(() => {
    setupCanvas();
    window.addEventListener("resize", setupCanvas);
    return () => window.removeEventListener("resize", setupCanvas);
  }, [setupCanvas]);

  function getPos(e: React.MouseEvent | React.TouchEvent) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function startDraw(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    setDrawing(true);
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }

  function draw(e: React.MouseEvent | React.TouchEvent) {
    if (!drawing) return;
    e.preventDefault();
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    setHasSignature(true);
  }

  function stopDraw() {
    setDrawing(false);
  }

  function clear() {
    setHasSignature(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setupCanvas();
  }

  function confirm() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    onSign(canvas.toDataURL("image/png"));
  }

  return (
    <div className="space-y-3">
      <p className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider">Firma Digital</p>
      <div className="border-2 border-gray-200 rounded-xl overflow-hidden bg-white relative">
        <canvas
          ref={canvasRef}
          className="w-full h-[160px] cursor-crosshair touch-none block"
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
        />
        {!hasSignature && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-gray-300 text-[13px]">Dibuje su firma aquí</p>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-gray-400">Use mouse o dedo para firmar</p>
        <div className="flex gap-2">
          <button type="button" onClick={clear} className="text-[12px] border border-gray-200 px-4 py-1.5 rounded-lg text-gray-600 hover:bg-gray-50 transition">
            Limpiar
          </button>
          <button type="button" onClick={confirm} disabled={!hasSignature} className="text-[12px] bg-brand-dark text-white px-4 py-1.5 rounded-lg disabled:opacity-40 hover:bg-brand-medium transition">
            Confirmar firma
          </button>
        </div>
      </div>
    </div>
  );
}
