import type { ProfileData } from "@/lib/content";

export default function WorkSection({ profile }: { profile: ProfileData }) {
  return (
    <section className="work" id="work">
      <div className="work__sticky" aria-hidden="false">
        <canvas className="work__eye" id="eyeCanvas" aria-label="Eye animation — get in touch" />
        <div className="work__corner work__corner--bl">
          <span>{profile.copyright}</span>
        </div>
        <div className="work__corner work__corner--br">
          <span className="work__scrollhint">
            <i />
          </span>
        </div>
      </div>

      <div className="work__spacer" />

      <div className="work__world" id="posterWorld" />
    </section>
  );
}
