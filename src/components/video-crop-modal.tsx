"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  aspect: number;
  outWidth: number;
  onConfirm: (blob: Blob) => void;
  onCancel: () => void;
};

function fmt(s: number) {
  if (!Number.isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${sec}`;
}

export default function VideoCropModal({ src, aspect, outWidth, onConfirm, onCancel }: Props) {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fW, setFW] = useState(540);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [drag, setDrag] = useState<{ sx: number; sy: number; px: number; py: number } | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);

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

  const video = videoRef.current;
  const vw = video?.videoWidth || 0;
  const vh = video?.videoHeight || 0;
  const base = vw ? Math.max(fW / vw, fH / vh) : 1;
  const Dw = vw * base * scale;
  const Dh = vh * base * scale;
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

  function toggle() {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) el.play();
    else el.pause();
  }

  function seek(t: number) {
    const el = videoRef.current;
    if (!el) return;
    el.currentTime = t;
    setTime(t);
  }

  async function confirm() {
    const el = videoRef.current;
    if (!el || !el.videoWidth) return;
    el.pause();
    setPlaying(false);
    try {
      await new Promise<void>((resolve) => {
        if (el.seeking) el.addEventListener("seeked", () => resolve(), { once: true });
        else resolve();
      });
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
      );
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
      canvas.toBlob((b) => b && onConfirm(b), "image/jpeg", 0.92);
    } catch {
      /* noop */
    }
  }

  return (
    <div className="crop" role="dialog" aria-modal="true" aria-label="Sesuaikan video">
      <div className="crop__card">
        <p className="crop__hint">
          pilih momen, lalu geser untuk memposisikan dan gunakan zoom untuk memperbesar
        </p>
        <div
          ref={frameRef}
          className="crop__frame"
          style={{ aspectRatio: String(aspect), width: `min(78vw, 540px, calc(72vh * ${aspect}))` }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <video
            ref={videoRef}
            className="crop__video"
            src={src}
            muted
            playsInline
            preload="auto"
            onLoadedMetadata={(e) => {
              setDur(e.currentTarget.duration);
              setReady(true);
            }}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
            onSeeked={(e) => setTime(e.currentTarget.currentTime)}
            style={{
              width: Dw,
              height: Dh,
              transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px))`,
              opacity: ready ? 1 : 0,
            }}
          />
        </div>
        <div className="crop__bar">
          <button className="crop__play" onClick={toggle} disabled={!ready}>
            {playing ? "jeda" : "putar"}
          </button>
          <input
            type="range"
            min="0"
            max={dur || 1}
            step="0.01"
            value={Math.min(time, dur || 0)}
            aria-label="Momen video"
            disabled={!ready}
            onChange={(e) => seek(parseFloat(e.target.value))}
          />
          <span className="crop__zoom">
            {fmt(time)} / {fmt(dur)}
          </span>
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
          <button className="crop__btn crop__btn--primary" onClick={confirm} disabled={!ready}>
            gunakan
          </button>
        </div>
      </div>
    </div>
  );
}
