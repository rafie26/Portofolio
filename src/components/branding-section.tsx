import type { BrandGroup } from "./data";

export default function BrandingSection({ groups }: { groups: BrandGroup[] }) {
  const first = groups[0];

  return (
    <>
      <section className="branding" id="branding">
        <h2 className="branding__big" id="brandingBig">
          Project
        </h2>
      </section>

      <section className="brand2" id="brand2" aria-label="Project showcase">
        <div className="brand2__hud" aria-hidden="true">
          <h3 className="brand2__title">
            <span className="brand2__titleinner">
              <sup className="brand2__num">{first?.num}</sup>
              <span className="brand2__name">{first?.title}</span>
            </span>
          </h3>
          <p className="brand2__desc">{first?.desc}</p>
        </div>

        <div className="brand2__groups">
          {groups.map((group) => (
            <div
              className="brand2__group"
              data-num={group.num}
              data-title={group.title}
              data-desc={group.desc}
              key={group.num}
            >
              {group.images.map((img, i) =>
                img.video ? (
                  <figure className={`brand2__img brand2__img--${img.side}`} key={i}>
                    <video src={img.src} poster={img.poster} loop muted playsInline preload="metadata" />
                  </figure>
                ) : (
                  <figure className={`brand2__img brand2__img--${img.side}`} key={i}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.src} alt={group.title} width="1600" height="2400" loading="lazy" />
                  </figure>
                )
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
