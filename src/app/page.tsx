import SiteHeader from "@/components/site-header";
import WorkSection from "@/components/work-section";
import AlbumsSection from "@/components/albums-section";
import BrandingSection from "@/components/branding-section";
import ContactFooter from "@/components/contact-footer";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getContent();
  const posters = JSON.stringify(
    content.posters.map((p) => ({ url: p.src, title: p.title }))
  );
  const albums = JSON.stringify(content.albums);

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.__POSTERS__ = ${posters}; window.__EYE_HREF__ = ${JSON.stringify(
            content.profile.instagram
          )}; window.__ALBUMS__ = ${albums};`,
        }}
      />

      <SiteHeader profile={content.profile} />

      <h1 className="sr-only">{content.profile.tagline}</h1>

      <main id="top">
        <WorkSection profile={content.profile} />
        <AlbumsSection />
        <BrandingSection groups={content.brandGroups} />
      </main>

      <ContactFooter profile={content.profile} />
    </>
  );
}
