import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { isAuthenticated } from "@/lib/auth";
import { adminClient, isSupabaseConfigured } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase belum dikonfigurasi" }, { status: 500 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File diperlukan" }, { status: 400 });
  }

  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");
  if (!isImage && !isVideo) {
    return NextResponse.json({ error: "Hanya gambar atau video" }, { status: 400 });
  }

  const raw = Buffer.from(await file.arrayBuffer());

  const size = new URL(req.url).searchParams.get("size");
  const dims: Record<string, [number, number]> = {
    poster: [1139, 1611],
    albumCover: [1737, 1719],
    albumVinyl: [1024, 1024],
    brandingCover: [1878, 2154],
  };
  const [width, height] = dims[size ?? ""] || [1600, 2400];

  let name: string;
  let buf: Buffer;
  let contentType: string;

  if (isImage) {
    const resized = await sharp(raw).resize(width, height, { fit: "cover" }).webp({ quality: 85 }).toBuffer();
    name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
    buf = resized;
    contentType = "image/webp";
  } else {
    const ext = file.name.split(".").pop() || "mp4";
    name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    buf = raw;
    contentType = file.type;
  }

  const supabase = adminClient();
  const { error } = await supabase.storage
    .from("portfolio")
    .upload(`images/${name}`, buf, {
      contentType,
      upsert: false,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = supabase.storage
    .from("portfolio")
    .getPublicUrl(`images/${name}`);

  return NextResponse.json({ url: data.publicUrl });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase belum dikonfigurasi" }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  if (!url || !url.includes(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/portfolio/`)) {
    return NextResponse.json({ error: "URL tidak valid" }, { status: 400 });
  }

  const path = url.split("/portfolio/")[1];
  if (!path) {
    return NextResponse.json({ error: "Path tidak valid" }, { status: 400 });
  }

  const supabase = adminClient();
  const { error } = await supabase.storage.from("portfolio").remove([path]);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
