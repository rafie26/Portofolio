"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import type { ContentData } from "@/lib/content";
import type { BrandGroup } from "@/components/data";
import CropModal from "@/components/crop-modal";
import VideoCropModal from "@/components/video-crop-modal";
import { logoutAction, saveContentAction } from "../actions";
function defaultContent(initial: ContentData): ContentData {
  return JSON.parse(JSON.stringify(initial));
}

type Props = {
  initial: ContentData;
};

export default function Dashboard({ initial }: Props) {
  const [content, setContent] = useState<ContentData>(() => defaultContent(initial));
  const [active, setActive] = useState<"profile" | "branding" | "posters" | "albums">("profile");
  const [saving, startSave] = useTransition();
  const [notice, setNotice] = useState<string>("");
  const router = useRouter();

  function mutate(fn: (c: ContentData) => void) {
    setContent((prev) => {
      const next = defaultContent(prev);
      fn(next);
      return next;
    });
    setNotice("");
  }

  function save() {
    startSave(async () => {
      const res = await saveContentAction(content);
      if (res.ok) {
        setNotice("Tersimpan.");
        router.refresh();
      } else {
        setNotice(res.error || "Gagal menyimpan.");
      }
    });
  }

  return (
    <main className="dash">
      <header className="dash__header">
        <span className="dash__logo">rafi / dashboard</span>
        <span className="dash__actions">
          <a className="dash__link" href="/" target="_blank">
            lihat situs
          </a>
          <button className="dash__link" onClick={() => logoutAction()}>
            keluar
          </button>
        </span>
      </header>

      <nav className="dash__tabs">
        <button
          className={`dash__tab${active === "profile" ? " is-on" : ""}`}
          onClick={() => setActive("profile")}
        >
          Profil
        </button>
        <button
          className={`dash__tab${active === "branding" ? " is-on" : ""}`}
          onClick={() => setActive("branding")}
        >
          Project / Galeri
        </button>
        <button
          className={`dash__tab${active === "posters" ? " is-on" : ""}`}
          onClick={() => setActive("posters")}
        >
          Poster
        </button>
        <button
          className={`dash__tab${active === "albums" ? " is-on" : ""}`}
          onClick={() => setActive("albums")}
        >
          Album / DVD
        </button>
      </nav>

      <div className="dash__body">
        {active === "profile" ? (
          <ProfileEditor content={content} mutate={mutate} />
        ) : active === "posters" ? (
          <PostersEditor content={content} mutate={mutate} />
        ) : active === "albums" ? (
          <AlbumsEditor content={content} mutate={mutate} />
        ) : (
          <BrandingEditor content={content} mutate={mutate} />
        )}
      </div>

      <footer className="dash__footer">
        <span className={`dash__notice${notice ? " is-show" : ""}`}>{notice}</span>
        <button className="dash__save" onClick={save} disabled={saving}>
          {saving ? "menyimpan…" : "simpan perubahan"}
        </button>
      </footer>
    </main>
  );
}

const PROFILE_FIELDS: { key: keyof ContentData["profile"]; label: string }[] = [
  { key: "name", label: "Nama" },
  { key: "tagline", label: "Tagline" },
  { key: "email", label: "Email" },
  { key: "location", label: "Lokasi" },
  { key: "copyright", label: "Copyright" },
];

function ProfileEditor({
  content,
  mutate,
}: {
  content: ContentData;
  mutate: (fn: (c: ContentData) => void) => void;
}) {
  return (
    <div className="dash__grid">
      {PROFILE_FIELDS.map((f) => (
        <label className="dash-field" key={f.key}>
          <span className="dash-field__label">{f.label}</span>
          <input
            className="dash-field__input"
            value={content.profile[f.key]}
            onChange={(e) =>
              mutate((c) => {
                (c.profile as Record<string, string>)[f.key] = e.target.value;
              })
            }
          />
        </label>
      ))}

      <label className="dash-field">
        <span className="dash-field__label">Instagram</span>
        <input
          className="dash-field__input"
          value={content.profile.instagram}
          onChange={(e) =>
            mutate((c) => {
              c.profile.instagram = e.target.value;
            })
          }
        />
      </label>
      <label className="dash-field">
        <span className="dash-field__label">LinkedIn</span>
        <input
          className="dash-field__input"
          value={content.profile.linkedin}
          onChange={(e) =>
            mutate((c) => {
              c.profile.linkedin = e.target.value;
            })
          }
        />
      </label>
      <label className="dash-field">
        <span className="dash-field__label">GitHub</span>
        <input
          className="dash-field__input"
          value={content.profile.github}
          onChange={(e) =>
            mutate((c) => {
              c.profile.github = e.target.value;
            })
          }
        />
      </label>
    </div>
  );
}

function BrandingEditor({
  content,
  mutate,
}: {
  content: ContentData;
  mutate: (fn: (c: ContentData) => void) => void;
}) {
  return (
    <div className="dash__groups">
      {content.brandGroups.map((group, gi) => (
        <BrandGroupEditor
          key={group.num + gi}
          group={group}
          onGroup={(fn) => mutate((c) => fn(c.brandGroups[gi]))}
          onImages={(fn) => mutate((c) => fn(c.brandGroups[gi].images))}
          onDelete={() =>
            mutate((c) => {
              const g = c.brandGroups.find((x) => x === group);
              if (g) removeUploaded(g.images);
              c.brandGroups.splice(gi, 1);
            })
          }
        />
      ))}
      <button
        className="dash__add"
        onClick={() =>
          mutate((c) =>
            c.brandGroups.push({
              num: String(c.brandGroups.length + 1).padStart(2, "0"),
              title: "Proyek Baru",
              desc: "",
              images: [],
            })
          )
        }
      >
        + tambah grup
      </button>
    </div>
  );
}

function removeUploaded(images: BrandGroup["images"]) {
  images.forEach((img) => {
    [img.src, img.poster].forEach((url) => {
      if (url?.includes("/storage/v1/object/public/portfolio/")) {
        fetch(`/api/upload?url=${encodeURIComponent(url)}`, { method: "DELETE" }).catch(() => {});
      }
    });
  });
}

function PostersEditor({
  content,
  mutate,
}: {
  content: ContentData;
  mutate: (fn: (c: ContentData) => void) => void;
}) {
  const [uploading, setUploading] = useState<number | null>(null);
  const [crop, setCrop] = useState<{ i: number; file: File; url: string } | null>(null);
  const [cropOpen, setCropOpen] = useState(false);

  function upload(i: number, filename: string, blob: Blob, objUrl: string) {
    setUploading(i);
    const fd = new FormData();
    fd.append("file", blob, filename);
    fetch("/api/upload?size=poster", { method: "POST", body: fd })
      .then((r) => r.json())
      .then((res) => {
        if (res.url) {
          const prev = content.posters[i].src;
          if (prev.includes("/storage/v1/object/public/portfolio/")) {
            fetch(`/api/upload?url=${encodeURIComponent(prev)}`, { method: "DELETE" }).catch(() => {});
          }
          mutate((c) => void (c.posters[i].src = res.url));
        }
      })
      .finally(() => {
        setUploading(null);
        setCrop(null);
        URL.revokeObjectURL(objUrl);
      });
  }

  function pick(i: number, file: File) {
    setCrop({ i, file, url: URL.createObjectURL(file) });
    setCropOpen(true);
  }

  return (
    <div className="dash__posters">
      <div className="dash__posters-list">
        {content.posters.map((p, i) => (
          <div className="dash-poster" key={i}>
            <div className="dash-poster__img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={crop?.i === i ? crop.url : p.src} alt="" />
            </div>
            <div className="dash-poster__fields">
              <label className="dash-field">
                <span className="dash-field__label">Judul</span>
                <input
                  className="dash-field__input"
                  value={p.title}
                  onChange={(e) => mutate((c) => void (c.posters[i].title = e.target.value))}
                />
              </label>
              <label className="dash-poster__replace">
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  disabled={uploading !== null}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) pick(i, f);
                    e.target.value = "";
                  }}
                />
                <span className="dash-img__add">{uploading === i ? "mengunggah…" : "ganti foto"}</span>
              </label>
            </div>
          </div>
        ))}
      </div>

      {crop && cropOpen && (
        <CropModal
          src={crop.url}
          aspect={1139 / 1611}
          outWidth={1139}
          onCancel={() => {
            URL.revokeObjectURL(crop.url);
            setCrop(null);
            setCropOpen(false);
          }}
          onConfirm={(blob) => {
            const { i, file, url } = crop;
            setCropOpen(false);
            upload(i, file.name, blob, url);
          }}
        />
      )}
    </div>
  );
}

function AlbumsEditor({
  content,
  mutate,
}: {
  content: ContentData;
  mutate: (fn: (c: ContentData) => void) => void;
}) {
  const [uploading, setUploading] = useState<{ i: number; kind: "cover" | "vinyl" } | null>(null);
  const [removing, setRemoving] = useState<number | null>(null);
  const [crop, setCrop] = useState<{ i: number; kind: "cover" | "vinyl"; file: File; url: string } | null>(null);
  const [cropOpen, setCropOpen] = useState(false);

  function upload(i: number, kind: "cover" | "vinyl", filename: string, blob: Blob, objUrl: string) {
    setUploading({ i, kind });
    const fd = new FormData();
    fd.append("file", blob, filename);
    const size = kind === "cover" ? "albumCover" : "albumVinyl";
    fetch(`/api/upload?size=${size}`, { method: "POST", body: fd })
      .then((r) => r.json())
      .then((res) => {
        if (res.url) {
          const prev = content.albums[i][kind];
          if (prev.includes("/storage/v1/object/public/portfolio/")) {
            fetch(`/api/upload?url=${encodeURIComponent(prev)}`, { method: "DELETE" }).catch(() => {});
          }
          mutate((c) => void (c.albums[i][kind] = res.url));
        }
      })
      .finally(() => {
        setUploading(null);
        setCrop(null);
        URL.revokeObjectURL(objUrl);
      });
  }

  function pick(i: number, kind: "cover" | "vinyl", file: File) {
    setCrop({ i, kind, file, url: URL.createObjectURL(file) });
    setCropOpen(true);
  }

  function removeBackdrop(i: number) {
    const src = content.albums[i].vinyl;
    if (removing !== null) return;
    setRemoving(i);
    fetch(src)
      .then((r) => {
        if (!r.ok) throw new Error("tidak bisa memuat foto");
        return r.blob();
      })
      .then((blob) => import("@imgly/background-removal").then(({ removeBackground }) => removeBackground(blob)))
      .then((result) => {
        const fd = new FormData();
        fd.append("file", result, "vinyl-bg.png");
        return fetch("/api/upload?size=albumVinyl", { method: "POST", body: fd }).then((r) => r.json());
      })
      .then((res) => {
        if (res.url) {
          if (src.includes("/storage/v1/object/public/portfolio/")) {
            fetch(`/api/upload?url=${encodeURIComponent(src)}`, { method: "DELETE" }).catch(() => {});
          }
          mutate((c) => void (c.albums[i].vinyl = res.url));
        }
      })
      .catch(() => {})
      .finally(() => setRemoving(null));
  }

  return (
    <div className="dash__posters">
      <div className="dash__posters-list">
        {content.albums.map((a, i) => (
          <div className="dash-album" key={i}>
            <label className="dash-field">
              <span className="dash-field__label">Judul</span>
              <input
                className="dash-field__input"
                value={a.title}
                onChange={(e) => mutate((c) => void (c.albums[i].title = e.target.value))}
              />
            </label>
            <div className="dash-album__imgs">
              {(["cover", "vinyl"] as const).map((kind) => {
                const busy = uploading?.i === i && uploading.kind === kind;
                const isCrop = crop?.i === i && crop.kind === kind;
                return (
                  <div className="dash-album__img" key={kind}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={isCrop ? crop!.url : a[kind]} alt="" />
                    <label className="dash-poster__replace">
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        disabled={uploading !== null}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) pick(i, kind, f);
                          e.target.value = "";
                        }}
                      />
                      <span className="dash-img__add">{busy ? "mengunggah…" : `ganti ${kind === "cover" ? "cover" : "DVD"}`}</span>
                    </label>
                    {kind === "vinyl" && (
                      <button
                        className="dash-img__add dash-img__add--bg"
                        disabled={removing !== null || !a.vinyl}
                        onClick={() => removeBackdrop(i)}
                      >
                        {removing === i ? "hapus latar…" : "hapus latar"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {crop && cropOpen && (
        <CropModal
          src={crop.url}
          aspect={1}
          outWidth={1200}
          onCancel={() => {
            URL.revokeObjectURL(crop.url);
            setCrop(null);
            setCropOpen(false);
          }}
          onConfirm={(blob) => {
            const { i, kind, file, url } = crop;
            setCropOpen(false);
            upload(i, kind, file.name, blob, url);
          }}
        />
      )}
    </div>
  );
}

function BrandGroupEditor({
  group,
  onGroup,
  onImages,
  onDelete,
}: {
  group: BrandGroup;
  onGroup: (fn: (g: BrandGroup) => void) => void;
  onImages: (fn: (im: BrandGroup["images"]) => void) => void;
  onDelete: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [crop, setCrop] = useState<{ file: File; url: string } | null>(null);
  const [cropOpen, setCropOpen] = useState(false);
  const [videoCrop, setVideoCrop] = useState<{ file: File; url: string } | null>(null);
  const [videoCropOpen, setVideoCropOpen] = useState(false);
  const [editCrop, setEditCrop] = useState<{ i: number; src: string; url: string } | null>(null);
  const [editCropOpen, setEditCropOpen] = useState(false);

  function upload(filename: string, blob: Blob, objUrl?: string) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", blob, filename);
    fetch("/api/upload", { method: "POST", body: fd })
      .then((r) => r.json())
      .then((res) => {
        if (res.url) {
          onImages((im) =>
            im.push({
              src: res.url,
              side: im.length % 2 === 0 ? "r" : "l",
            })
          );
        }
      })
      .finally(() => {
        if (objUrl) URL.revokeObjectURL(objUrl);
        setUploading(false);
        setCrop(null);
        setCropOpen(false);
      });
  }

  function uploadVideo(file: File, poster: Blob, objUrl: string) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file, file.name);
    fetch("/api/upload", { method: "POST", body: fd })
      .then((r) => r.json())
      .then(async (res) => {
        if (!res.url) return;
        const posterFd = new FormData();
        posterFd.append("file", poster, "cover.jpg");
        const pr = await fetch("/api/upload?size=brandingCover", {
          method: "POST",
          body: posterFd,
        }).then((r) => r.json());
        onImages((im) =>
          im.push({
            src: res.url,
            side: im.length % 2 === 0 ? "r" : "l",
            video: true,
            poster: pr.url || undefined,
          })
        );
      })
      .finally(() => {
        URL.revokeObjectURL(objUrl);
        setUploading(false);
        setVideoCrop(null);
        setVideoCropOpen(false);
      });
  }

  function pick(file: File) {
    if (file.type.startsWith("video/")) {
      setVideoCrop({ file, url: URL.createObjectURL(file) });
      setVideoCropOpen(true);
      return;
    }
    setCrop({ file, url: URL.createObjectURL(file) });
    setCropOpen(true);
  }

  async function editImage(i: number, src: string) {
    try {
      const res = await fetch(src);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setEditCrop({ i, src, url });
      setEditCropOpen(true);
    } catch {
      /* tidak bisa memuat foto */
    }
  }

  function replaceImage(i: number, prevSrc: string, blob: Blob, objUrl?: string) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", blob, "edit.jpg");
    fetch("/api/upload", { method: "POST", body: fd })
      .then((r) => r.json())
      .then((res) => {
        if (res.url) {
          onImages((list) => void (list[i].src = res.url));
          if (prevSrc.includes("/storage/v1/object/public/portfolio/")) {
            fetch(`/api/upload?url=${encodeURIComponent(prevSrc)}`, { method: "DELETE" }).catch(() => {});
          }
        }
      })
      .finally(() => {
        if (objUrl) URL.revokeObjectURL(objUrl);
        setUploading(false);
        setEditCrop(null);
        setEditCropOpen(false);
      });
  }

  return (
    <section className="dash-group">
      <div className="dash-group__head">
        <span className="dash-group__num">{group.num}</span>
        <button className="dash-group__del" onClick={onDelete}>
          hapus grup
        </button>
      </div>

      <label className="dash-field">
        <span className="dash-field__label">Nomor (01, 02…)</span>
        <input
          className="dash-field__input"
          value={group.num}
          onChange={(e) => onGroup((g) => void (g.num = e.target.value))}
        />
      </label>
      <label className="dash-field">
        <span className="dash-field__label">Judul</span>
        <input
          className="dash-field__input"
          value={group.title}
          onChange={(e) => onGroup((g) => void (g.title = e.target.value))}
        />
      </label>
      <label className="dash-field">
        <span className="dash-field__label">Deskripsi</span>
        <textarea
          className="dash-field__input dash-field__input--area"
          value={group.desc}
          onChange={(e) => onGroup((g) => void (g.desc = e.target.value))}
        />
      </label>

      <div className="dash-imgs">
        {group.images.map((img, ii) => (
          <div className="dash-img" key={ii}>
            {img.video ? (
              <video className="dash-img__media" src={img.src} poster={img.poster} muted preload="metadata" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="dash-img__media" src={img.src} alt="" />
            )}
            <div className="dash-img__meta">
              <label className="dash-img__toggle">
                <input
                  type="checkbox"
                  checked={!!img.video}
                  onChange={(e) => onImages((list) => void (list[ii].video = e.target.checked))}
                />
                video
              </label>
              <label className="dash-img__toggle">
                <input
                  type="checkbox"
                  checked={img.side === "r"}
                  onChange={(e) => onImages((list) => void (list[ii].side = e.target.checked ? "r" : "l"))}
                />
                kanan
              </label>
              {!img.video && (
                <button className="dash-img__edit" onClick={() => editImage(ii, img.src)} disabled={uploading}>
                  edit
                </button>
              )}
              <button
                className="dash-img__del"
                onClick={() => {
                  [img.src, img.poster].forEach((url) => {
                    if (url?.includes("/storage/v1/object/public/portfolio/")) {
                      fetch(`/api/upload?url=${encodeURIComponent(url)}`, {
                        method: "DELETE",
                      }).catch(() => {});
                    }
                  });
                  onImages((list) => {
                    list.splice(ii, 1);
                    return list;
                  });
                }}
              >
                hapus
              </button>
            </div>
          </div>
        ))}

        {crop && cropOpen && (
          <div className="dash-img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="dash-img__media" src={crop.url} alt="" />
            <div className="dash-img__meta">
              <span className="dash-img__uploading">menyesuaikan…</span>
            </div>
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) pick(f);
            e.target.value = "";
          }}
        />
        <button className="dash-img__add" onClick={() => fileRef.current?.click()} disabled={uploading}>
          {uploading ? "mengunggah…" : "+ tambah gambar"}
        </button>
      </div>

      {crop && cropOpen && (
        <CropModal
          src={crop.url}
          aspect={1878 / 2154}
          outWidth={1878}
          onCancel={() => {
            URL.revokeObjectURL(crop.url);
            setCrop(null);
            setCropOpen(false);
          }}
          onConfirm={(blob) => {
            const { file, url } = crop;
            upload(file.name, blob, url);
          }}
        />
      )}

      {editCrop && editCropOpen && (
        <CropModal
          src={editCrop.url}
          aspect={1878 / 2154}
          outWidth={1878}
          onReplace={(file) => {
            URL.revokeObjectURL(editCrop.url);
            setEditCrop({ i: editCrop.i, src: editCrop.src, url: URL.createObjectURL(file) });
          }}
          onCancel={() => {
            URL.revokeObjectURL(editCrop.url);
            setEditCrop(null);
            setEditCropOpen(false);
          }}
          onConfirm={(blob) => {
            const { i, src, url } = editCrop;
            setEditCropOpen(false);
            replaceImage(i, src, blob, url);
          }}
        />
      )}

      {videoCrop && videoCropOpen && (
        <VideoCropModal
          src={videoCrop.url}
          aspect={1878 / 2154}
          outWidth={1878}
          onCancel={() => {
            URL.revokeObjectURL(videoCrop.url);
            setVideoCrop(null);
            setVideoCropOpen(false);
          }}
          onConfirm={(blob) => {
            const { file, url } = videoCrop;
            uploadVideo(file, blob, url);
          }}
        />
      )}
    </section>
  );
}
