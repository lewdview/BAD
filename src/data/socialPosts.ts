import type { SocialPost } from '../types';

export const INITIAL_MOCK_POSTS: SocialPost[] = [
  {
    id: 'post-1',
    creator: 'SatinSiren',
    designName: 'The Royal Wave',
    likes: 542,
    hasLiked: false,
    price: 135.00,
    parameters: {
      baseGeometry: 'wave',
      length: 6.8,
      shaftGirth: 1.4,
      baseGirth: 1.8,
      curvature: 0.8,
      texture: 'smooth',
      suctionCup: true,
      vibrationCore: true,
      colorMode: 1, // Marble
      color1: '#482060', // Royal Plum
      color2: '#d4af37', // Satin Gold
      isVibrating: false,
      showScaleRef: false,
      shapeType: 'classic',
      realisticVeins: 0,
      headType: 'classic',
      headScale: 1.0,
      hasBalls: false,
      fantasyType: 'dragon',
      baseType: 'flared',
      taper: 0.1,
      firmness: 'medium',
      inclusions: 'none',
      thermochromic: false,
      internalTube: false,
      blacklightMode: false,
      arMode: false,
      sceneEnvironment: 'studio'
    },
    commentsCount: 18
  },
  {
    id: 'post-2',
    creator: 'NeonVixen',
    designName: 'Electric G-Spot',
    likes: 821,
    hasLiked: false,
    price: 149.00,
    parameters: {
      baseGeometry: 'ergonomic',
      length: 7.2,
      shaftGirth: 1.6,
      baseGirth: 1.9,
      curvature: 1.2,
      texture: 'smooth',
      suctionCup: false,
      vibrationCore: true,
      colorMode: 2, // Gradient
      color1: '#d946ef', // Orchid Pink
      color2: '#a62b2b', // Crimson
      isVibrating: false,
      showScaleRef: false,
      shapeType: 'targeted',
      realisticVeins: 0,
      headType: 'classic',
      headScale: 1.0,
      hasBalls: false,
      fantasyType: 'dragon',
      baseType: 'flat',
      taper: 0.15,
      firmness: 'medium',
      inclusions: 'none',
      thermochromic: false,
      internalTube: false,
      blacklightMode: false,
      arMode: false,
      sceneEnvironment: 'studio'
    },
    commentsCount: 42
  },
  {
    id: 'post-3',
    creator: 'VelvetLover',
    designName: 'Minimalist Slate',
    likes: 219,
    hasLiked: false,
    price: 109.00,
    parameters: {
      baseGeometry: 'classic',
      length: 5.5,
      shaftGirth: 1.1,
      baseGirth: 1.3,
      curvature: 0.0,
      texture: 'smooth',
      suctionCup: true,
      vibrationCore: false,
      colorMode: 0, // Solid
      color1: '#242426', // Midnight Slate
      color2: '#e2e8f0',
      isVibrating: false,
      showScaleRef: false,
      shapeType: 'classic',
      realisticVeins: 0,
      headType: 'classic',
      headScale: 1.0,
      hasBalls: false,
      fantasyType: 'dragon',
      baseType: 'flared',
      taper: 0.1,
      firmness: 'medium',
      inclusions: 'none',
      thermochromic: false,
      internalTube: false,
      blacklightMode: false,
      arMode: false,
      sceneEnvironment: 'studio'
    },
    commentsCount: 7
  }
];
