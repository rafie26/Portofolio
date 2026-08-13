"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import type { ContentData } from "@/lib/content";
import type { BrandGroup } from "@/components/data";
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

  function uploadFile(i: number, file: File) {
    setUploading(i);
    const fd = new FormData();
    fd.append("file", file, file.name);
    fetch("/api/upload", { method: "POST", body: fd })
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
      .finally(() => setUploading(null));
  }

  return (
    <div className="dash__posters">
      <div className="dash__posters-list">
        {content.posters.map((p, i) => (
          <div className="dash-poster" key={i}>
            <div className="dash-poster__img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt="" />
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
                    if (f) uploadFile(i, f);
                    e.target.value = "";
                  }}
                />
                <span className="dash-img__add">{uploading === i ? "mengunggah…" : "ganti foto"}</span>
              </label>
            </div>
          </div>
        ))}
      </div>
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

  function uploadFile(i: number, kind: "cover" | "vinyl", file: File) {
    setUploading({ i, kind });
    const fd = new FormData();
    fd.append("file", file, file.name);
    fetch("/api/upload", { method: "POST", body: fd })
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
      .finally(() => setUploading(null));
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
                return (
                  <div className="dash-album__img" key={kind}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={a[kind]} alt="" />
                    <label className="dash-poster__replace">
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        disabled={uploading !== null}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) uploadFile(i, kind, f);
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
  const replaceRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [replaceIdx, setReplaceIdx] = useState<number | null>(null);

  function uploadFile(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file, file.name);
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
      .finally(() => setUploading(false));
  }

  function replaceFile(ii: number, file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file, file.name);
    fetch("/api/upload", { method: "POST", body: fd })
      .then((r) => r.json())
      .then((res) => {
        if (res.url) {
          const prev = group.images[ii];
          onImages((list) => void (list[ii].src = res.url));
          if (prev?.src?.includes("/storage/v1/object/public/portfolio/")) {
            fetch(`/api/upload?url=${encodeURIComponent(prev.src)}`, { method: "DELETE" }).catch(() => {});
          }
        }
      })
      .finally(() => {
        setUploading(false);
        setReplaceIdx(null);
      });
  }

  function uploadVideo(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file, file.name);
    fetch("/api/upload", { method: "POST", body: fd })
      .then((r) => r.json())
      .then((res) => {
        if (res.url) {
          onImages((im) =>
            im.push({
              src: res.url,
              side: im.length % 2 === 0 ? "r" : "l",
              video: true,
            })
          );
        }
      })
      .finally(() => setUploading(false));
  }

  function pick(file: File) {
    if (file.type.startsWith("video/")) {
      uploadVideo(file);
    } else {
      uploadFile(file);
    }
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
              <label className="dash-img__edit">
                <input
                  type="file"
                  accept="image/*,video/*"
                  hidden
                  disabled={uploading}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setReplaceIdx(ii);
                      replaceFile(ii, f);
                    }
                    e.target.value = "";
                  }}
                />
                {replaceIdx === ii && uploading ? "mengunggah…" : "ganti"}
              </label>
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
    </section>
  );
}
