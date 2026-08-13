"use client";

import { useEffect } from "react";

let injected = false;

export default function TemplateScript() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.pathname !== "/") return;
    if (injected) return;
    injected = true;
    const s = document.createElement("script");
    s.type = "module";
    s.src = "/index-BJB-7Miz.js";
    document.body.appendChild(s);
  }, []);

  return null;
}
