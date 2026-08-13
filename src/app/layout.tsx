import type { Metadata } from "next";
import TemplateScript from "@/components/template-script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portofolio - Rafi",
  description:
    "Portofolio karya Rafi Iqbal Firmansyah — graphic designer, poster art, album artwork dan branding.",
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    type: "website",
    url: "https://meinhardtaxer.com/",
    title: "Portofolio - Rafi",
    description:
      "Portofolio karya Rafi Iqbal Firmansyah — graphic designer, poster art, album artwork dan branding.",
    images: [
      {
        url: "https://meinhardtaxer.com/share-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Portofolio - Rafi",
    description:
      "Portofolio karya Rafi Iqbal Firmansyah — graphic designer, poster art, album artwork dan branding.",
    images: ["https://meinhardtaxer.com/share-image.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
              window.scrollTo(0, 0);
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Meinhard Taxer",
              alternateName: "Meindl Taxer",
              url: "https://meinhardtaxer.com/",
              image: "https://meinhardtaxer.com/share-image.jpg",
              jobTitle: "Graphic Designer & Poster Artist",
              description:
                "Graphic designer and poster artist from Tyrol, Austria, specialized in graphic-surreal poster art, album artwork and branding.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Sistrans",
                addressRegion: "Tyrol",
                addressCountry: "AT",
              },
              email: "mailto:office@meinhardtaxer.com",
              sameAs: [
                "https://www.instagram.com/meindltaxer",
                "https://shop.meinhardtaxer.com",
                "https://pstrstudio.com/collections/meindl-taxer",
                "https://drool-art.com/collections/meindl-taxer",
              ],
            }),
          }}
        />
        {children}
        <TemplateScript />
      </body>
    </html>
  );
}
