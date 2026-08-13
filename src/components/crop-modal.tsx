"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  aspect: number;
  outWidth: number;
  onConfirm: (blob: Blob) => void;
  onCancel: () => void;
};

export default function CropModal({ src, aspect, outWidth, onConfirm, onCancel }: Props) {
  const frameRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [fW, setFW] = useState(540);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [drag, setDrag] = useState<{ sx: number; sy: number; px: number; py: number } | null>(null);
  const [loaded, setLoaded] = useState(false);

  const fH = fW / aspect;

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w) setFW(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const img = imgRef.current;
  const base =
    img && img.naturalWidth ? Math.max(fW / img.naturalWidth, fH / img.naturalHeight) : 1;
  const Dw = img ? img.naturalWidth * base * scale : 0;
  const Dh = img ? img.naturalHeight * base * scale : 0;
  const maxX = Math.max(0, (Dw - fW) / 2);
  const maxY = Math.max(0, (Dh - fH) / 2);
  const tx = Math.max(-maxX, Math.min(maxX, pos.x));
  const ty = Math.max(-maxY, Math.min(maxY, pos.y));

  function onPointerDown(e: React.PointerEvent) {
    if (e.button !== 0) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDrag({ sx: e.clientX, sy: e.clientY, px: tx, py: ty });
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!drag) return;
    const nx = Math.max(-maxX, Math.min(maxX, drag.px + e.clientX - drag.sx));
    const ny = Math.max(-maxY, Math.min(maxY, drag.py + e.clientY - drag.sy));
    setPos({ x: nx, y: ny });
  }
  function onPointerUp() {
    setDrag(null);
  }

  function confirm() {
    const el = imgRef.current;
    if (!el || !el.naturalWidth) return;
    const sx = (Dw / 2 - fW / 2 - tx) / (base * scale);
    const sy = (Dh / 2 - fH / 2 - ty) / (base * scale);
    const sw = fW / (base * scale);
    const sh = fH / (base * scale);
    const canvas = document.createElement("canvas");
    canvas.width = outWidth;
    canvas.height = Math.round(outWidth / aspect);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(el, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

    let hasAlpha = false;
    try {
      const px = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      for (let i = 3; i < px.length; i += 4) {
        if (px[i] < 250) {
          hasAlpha = true;
          break;
        }
      }
    } catch {
      /* canvas tidak terbaca */
    }

    if (hasAlpha) {
      canvas.toBlob((b) => b && onConfirm(b), "image/png");
    } else {
      canvas.toBlob((b) => b && onConfirm(b), "image/jpeg", 0.92);
    }
  }

  return (
    <div className="crop" role="dialog" aria-modal="true" aria-label="Sesuaikan foto">
      <div className="crop__card">
        <p className="crop__hint">geser untuk memposisikan, gunakan zoom untuk memperbesar</p>
        <div
          ref={frameRef}
          className="crop__frame"
          style={{ aspectRatio: String(aspect), width: `min(78vw, 540px, calc(72vh * ${aspect}))` }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            className="crop__img"
            src={src}
            alt=""
            draggable={false}
            onLoad={() => setLoaded(true)}
            style={{
              width: Dw,
              height: Dh,
              transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px))`,
              opacity: loaded ? 1 : 0,
            }}
          />
        </div>
        <div className="crop__bar">
          <input
            type="range"
            min="1"
            max="4"
            step="0.01"
            value={scale}
            aria-label="Zoom"
            onChange={(e) => {
              setScale(parseFloat(e.target.value));
              setPos({ x: 0, y: 0 });
            }}
          />
          <span className="crop__zoom">{Math.round(scale * 100)}%</span>
        </div>
        <div className="crop__actions">
          <button className="crop__btn" onClick={onCancel}>
            batal
          </button>
          <button className="crop__btn crop__btn--primary" onClick={confirm} disabled={!loaded}>
            gunakan
          </button>
        </div>
      </div>
    </div>
  );
}
