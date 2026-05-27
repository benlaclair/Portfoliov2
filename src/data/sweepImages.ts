/**
 * SWEEP_IMAGES — curated subset of graphic-design pieces shown in the
 * homepage horizontal-sweep transition (see index.astro). 16 hand-picked
 * entries pulled from src/data/graphicDesign.ts, balanced across
 * Client Work, Esports, and Educational/Brand.
 *
 * Swap freely without touching the sweep animation logic.
 */
export const SWEEP_IMAGES: { src: string; alt: string }[] = [
  // Client Work — strong poster compositions, varied palette
  { src: '/graphics/Client Work/imgi_7_BTr1FxMZARNjTfEw.webp', alt: 'Sunshine Slam basketball tournament promo on orange van' },
  { src: '/graphics/Client Work/imgi_10_pfyuuZO054VVMcfE.webp', alt: 'Rutgers basketball presale poster, player celebrating' },
  { src: '/graphics/Client Work/imgi_11_r0Vw54d8euvtUMXZ.webp', alt: 'Empire Classic billboard at Prudential Center' },
  { src: '/graphics/Client Work/imgi_29_kf3A3fYh5nXUw1VQ.webp', alt: 'Legends Classic logo with Brooklyn Bridge silhouette' },
  { src: '/graphics/Client Work/imgi_34_NFkXe0lJMcgYeEEi.webp', alt: 'Saatva Empire Classic poster, four players, NYC backdrop' },
  { src: '/graphics/Client Work/imgi_37_KqGvRsQIoWnqCa8o.webp', alt: 'Sunshine Slam dynamic poster, player dunking' },

  // Esports — typographic 3D pieces
  { src: '/graphics/esports/imgi_5_AQOWqiuvdcFGurVR (1).webp', alt: 'Glossy 3D liquid type with purple-blue bubbles' },
  { src: '/graphics/esports/imgi_9_nXOT2Lcgpom1h3qv (1).webp', alt: 'Cyan 3D Curfew text with neon glow' },
  { src: '/graphics/esports/imgi_12_i7UboH02GkFto8t8 (1).webp', alt: 'Ornate silver-blue 3D North Phenom text' },
  { src: '/graphics/esports/imgi_15_PHrjrzpkWThxU8dW (1).webp', alt: 'Magenta and dark purple 3D North Keeb text' },

  // Educational / Brand — Adidas + Retro Vision + Hokkaido
  { src: '/graphics/Educational Projects/imgi_3_0YOtGBhlKpAem5sW.webp', alt: 'Pink and black Adidas Originals windbreaker with paint splatter' },
  { src: '/graphics/Educational Projects/imgi_6_TK2hJ7rFIelXA947.webp', alt: 'Coral Adidas Originals RYV hoodie with geometric accents' },
  { src: '/graphics/Educational Projects/imgi_25_i2l0HYbFNS7RIiKw.webp', alt: 'Synthwave Retro Vision poster with VR headset and neon grid' },
  { src: '/graphics/Educational Projects/imgi_28_xotMrKKm5BuZTuvf.webp', alt: 'Line 7 fashion poster with model masked inside letterforms' },
  { src: '/graphics/Educational Projects/imgi_37_9EjolePIQ0cJ3F5U.webp', alt: 'Hokkaido brand oval hanging sign mockup' },
  { src: '/graphics/Educational Projects/imgi_39_pS3lVNHGDwP9XgEp.webp', alt: 'Blue geometric pattern with Hokkaido Japanese kanji' },
];
