import type { ProfileData } from "@/lib/content";

const marqueeWords = ["Contact Me", "Contact Me", "Contact Me", "Contact Me"];

export default function ContactFooter({ profile }: { profile: ProfileData }) {
  return (
    <>
      <footer className="contact" id="contact">
        <a
          className="contact__marquee"
          href={`mailto:${profile.email}`}
          aria-label={`Contact me — ${profile.email}`}
        >
          <span className="contact__track" id="contactMarquee" aria-hidden="true">
            {marqueeWords.map((word, i) => (
              <span className="contact__word" key={i}>
                {word}
              </span>
            ))}
          </span>
        </a>

        <span className="contact__copy">{profile.copyright}</span>

        <a className="contact__link contact__link--impressum" href="#impressum">
          About me
        </a>
      </footer>

      <dialog className="legal-dialog" id="dlgImpressum" aria-label="Informasi Hukum">
        <div className="legal-dialog__inner">
          <button className="legal-dialog__close" aria-label="Tutup">
            &times;
          </button>

          <h2 className="legal-dialog__title">Informasi Hukum</h2>

          <div className="legal-dialog__body">
            <p>
              <strong>{profile.name}</strong>
              <br />
              Frontend & Backend Development
              <br />
              Malang
            </p>

            <p>
              Email: <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </p>

            <p>
              <strong>Bidang usaha:</strong> Frontend & Backend Development, Marketing, Mobile App Development
            </p>

            <p className="legal-dialog__note">
              Design Webstite ini Terinspirasi dari meinhardtaxer
            </p>
          </div>
        </div>
      </dialog>
    </>
  );
}