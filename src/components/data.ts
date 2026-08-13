export const PROFILE = {
  name: "Rafi Iqbal Firmansyah",
  tagline:
    "Rafi-Portofolio.",
  email: "rafiiqbalfirmansyahh@gmail.com",
  instagram: "https://www.instagram.com/Rafie.2",
  linkedin: "",
  github: "",
  shop: "",
  pstr: "",
  drool: "",
  location: "Malang, Indonesia",
  copyright: "© Rafi Iqbal 2026",
};

export type BrandImage = {
  src: string;
  side: "r" | "l";
  video?: boolean;
  poster?: string;
};

export type BrandGroup = {
  num: string;
  title: string;
  desc: string;
  images: BrandImage[];
};

export const brandGroups: BrandGroup[] = [
  {
    num: "01",
    title: "Die Goldene Schindel",
    desc: "Complete visual identity for Austria's only music video award — reinvented from scratch every year. Keyvisual, motion design, and a full system across web, print, and social.",
    images: [
      { src: "/branding/goldene-schindel-final-01.webp", side: "r" },
      { src: "/branding/goldene-schindel-final-02.mp4", side: "l", video: true },
      { src: "/branding/goldene-schindel-final-03.webp", side: "r" },
      { src: "/branding/goldene-schindel-final-04.mp4", side: "l", video: true },
    ],
  },
  {
    num: "02",
    title: "Tribaun",
    desc: "Brand identity and merch for Tribaun — Innsbruck's craft beer institution. Four designs built around the bar's underground-premium character. Made to wear, made to last.",
    images: [
      { src: "/branding/tribaun-final-02.webp", side: "r" },
      { src: "/branding/tribaun-final-01.mp4", side: "l", video: true },
      { src: "/branding/tribaun-final-03.webp", side: "r" },
      { src: "/branding/tribaun-final-04.webp", side: "l" },
    ],
  },
  {
    num: "03",
    title: "TAT Festival",
    desc: "Festival identity for TAT – Festival for Contemporary Jazz in Innsbruck. Poster, social media campaign and print — reinvented every year since 2024.",
    images: [
      { src: "/branding/tat-final-01.mp4", side: "r", video: true },
      { src: "/branding/tat-final-02.webp", side: "l" },
      { src: "/branding/tat-final-03.webp", side: "r" },
      { src: "/branding/tat-final-04.mp4", side: "l", video: true },
    ],
  },
];

export type Poster = {
  src: string;
  title: string;
};

export const posters: Poster[] = [
  { src: "/posters/meinhard-taxer-poster_bloom_portfolio.webp", title: "Bloom" },
  { src: "/posters/meinhard-taxer-poster_the-bondsmen_portfolio.webp", title: "The Bondsmen" },
  { src: "/posters/meinhard-taxer-poster_portfolio_fuse.webp", title: "Fuse" },
  { src: "/posters/meinhard-taxer-poster_die-erkenntnis_portfolio.webp", title: "Die Erkenntnis" },
  { src: "/posters/meinhard-taxer-poster_disconnected_portfolio.webp", title: "Disconnected" },
  { src: "/posters/meinhard-taxer-poster_ex-stellaris_portfolio.webp", title: "Ex Stellaris" },
  { src: "/posters/meinhard-taxer-poster_portfolio_future.webp", title: "Future" },
  { src: "/posters/meinhard-taxer-poster_licht-und-schatten_portfolio.webp", title: "Licht & Schatten" },
  { src: "/posters/meinhard-taxer-poster_portfolio_big-question.webp", title: "Big Question" },
  { src: "/posters/meinhard-taxer-poster_noir_portfolio.webp", title: "Noir" },
  { src: "/posters/meinhard-taxer-poster_portfolio_1984.webp", title: "1984" },
  { src: "/posters/meinhard-taxer-poster_love_portfolio.webp", title: "Love" },
  { src: "/posters/meinhard-taxer-poster_portfolio_boom.webp", title: "Boom" },
  { src: "/posters/meinhard-taxer-poster_portfolio_freiheit.webp", title: "Freiheit" },
  { src: "/posters/meinhard-taxer-poster_consume_portfolio.webp", title: "Consume" },
  { src: "/posters/meinhard-taxer-poster_lange-naechte_portfolio.webp", title: "Lange Nächte" },
  { src: "/posters/meinhard-taxer-poster_portfolio_moon.webp", title: "Moon" },
  { src: "/posters/meinhard-taxer-poster_portfolio_neighborhood.webp", title: "Neighborhood" },
  { src: "/posters/meinhard-taxer-poster_portfolio_run.webp", title: "Run" },
  { src: "/posters/meinhard-taxer-poster_portfolio_secret.webp", title: "Secret" },
  { src: "/posters/meinhard-taxer-poster_portfolio_thought.webp", title: "Thought" },
  { src: "/posters/meinhard-taxer-poster_portfolio_yang.webp", title: "Yang" },
  { src: "/posters/meinhard-taxer-poster_portfolio_yin.webp", title: "Yin" },
  { src: "/posters/meinhard-taxer-poster_brainwashed_portfolio.webp", title: "Brainwashed" },
];

export type Album = {
  title: string;
  cover: string;
  vinyl: string;
  info: string;
};

export const albums: Album[] = [
  { title: "Devil Electric — Thalia", cover: "/albums/devil-electric-cover.webp", vinyl: "/albums/devil-electric-vinyl.webp", info: "vinyl artwork" },
  { title: "Yellow Fleet — Stranded", cover: "/albums/yellow-fleet-cover.webp", vinyl: "/albums/yellow-fleet-vinyl.webp", info: "vinyl artwork" },
  { title: "Tripsitter — The Other Side Of Sadness", cover: "/albums/tripsitter-cover.webp", vinyl: "/albums/tripsitter-vinyl.webp", info: "vinyl artwork" },
  { title: "Spilif — Elouise", cover: "/albums/spilif-cover.webp", vinyl: "/albums/spilif-vinyl.webp", info: "vinyl artwork" },
  { title: "Acres — Burning Throne", cover: "/albums/acres-cover.webp", vinyl: "/albums/acres-vinyl.webp", info: "vinyl artwork" },
  { title: "Alexander Liebe — Spielautomat", cover: "/albums/alexander-liebe-cover.webp", vinyl: "/albums/alexander-liebe-vinyl.webp", info: "vinyl artwork" },
];
