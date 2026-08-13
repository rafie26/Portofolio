import type { ProfileData } from "@/lib/content";

export default function SiteHeader({ profile }: { profile: ProfileData }) {
  return (
    <>
      <header className="site-header" id="siteHeader">
        <a className="site-header__name" href="#top">
          {profile.name.replace(/ /g, "\u00a0")}
          <sup>©</sup>
        </a>

        <nav className="site-header__col site-header__col--portfolio">
          <span className="site-header__label">work</span>
          <a href="#posterWorld">poster</a>
          <a href="#albums">albums</a>
          <a href="#brand2">project</a>
        </nav>

        <nav className="site-header__col site-header__col--prints">
          <span className="site-header__label">sosial media</span>
          <a href={profile.instagram} target="_blank" rel="noopener">
            instagram
          </a>
          <a href={profile.linkedin || "#"} target="_blank" rel="noopener">
            linkedin
          </a>
          <a href={profile.github || "#"} target="_blank" rel="noopener">
            github
          </a>
        </nav>

        <nav className="site-header__col site-header__col--contact">
          <span className="site-header__label">contact</span>
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <a href={profile.instagram} target="_blank" rel="noopener">
            instagram
          </a>
        </nav>

        <button
          className="nav-toggle"
          id="navToggle"
          type="button"
          aria-label="Open menu"
          aria-expanded="false"
          aria-controls="navOverlay"
        >
          <span className="nav-toggle__mask">
            <span className="nav-toggle__word nav-toggle__word--menu">menu</span>
            <span className="nav-toggle__word nav-toggle__word--close" aria-hidden="true">
              close
            </span>
          </span>
        </button>
      </header>

      <nav className="nav-overlay" id="navOverlay" aria-hidden="true">
        <ul className="nav-overlay__list" id="navList">
          <li>
            <a href="#posterWorld">
              <span>poster</span>
            </a>
          </li>
          <li>
            <a href="#albums">
              <span>albums</span>
            </a>
          </li>
          <li>
            <a href="#brand2">
              <span>project</span>
            </a>
          </li>
          <li className="nav-overlay__prints">
            <button type="button" className="nav-overlay__prints-toggle" id="navPrints" aria-expanded="false">
              <span>sosial media</span>
            </button>
            <ul className="nav-overlay__sub" id="navSub">
              <li>
                <a href={profile.instagram} target="_blank" rel="noopener">
                  <span>Instagram</span>
                </a>
              </li>
              <li>
                <a href={profile.linkedin || "#"} target="_blank" rel="noopener">
                  <span>LinkedIn</span>
                </a>
              </li>
              <li>
                <a href={profile.github || "#"} target="_blank" rel="noopener">
                  <span>GitHub</span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
        <div className="nav-overlay__contact">
          <a href={profile.instagram} target="_blank" rel="noopener">
            <span>instagram</span>
          </a>
          <a href={`mailto:${profile.email}`}>
            <span>{profile.email}</span>
          </a>
        </div>
      </nav>
    </>
  );
}
