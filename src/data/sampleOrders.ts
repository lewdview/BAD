import type { OrderItem } from '../types';

export const SAMPLE_ORDERS: OrderItem[] = [
  {
    orderNumber: 'BAD-902148',
    customerName: 'LoveHoney Group Procurement',
    customerEmail: 'b2b-procure@lovehoney.co.uk',
    customerAddress: '100 Bath Road',
    customerCity: 'Bath',
    customerZip: 'BA1 1EN',
    items: [
      {
        id: 'custom-lh-01',
        name: 'Custom Realistic Anatomical (B2B Batch 01)',
        price: 154.00,
        isCustom: true,
        quantity: 120,
        parameters: {
          baseGeometry: 'classic',
          length: 7.2,
          shaftGirth: 1.40,
          baseGirth: 1.60,
          curvature: 0.35,
          texture: 'smooth',
          suctionCup: true,
          vibrationCore: false,
          colorMode: 1, // Marble
          color1: '#a62b2b', // Crimson Kiss
          color2: '#d4af37', // Satin Gold
          isVibrating: false,
          showScaleRef: false,
          shapeType: 'realistic',
          realisticVeins: 0.65,
          headType: 'realistic',
          headScale: 1.0,
          hasBalls: true,
          fantasyType: 'dragon',
          baseType: 'flared',
          taper: 0.15,
          firmness: 'dual-density',
          inclusions: 'glitter',
          thermochromic: false,
          internalTube: true,
          blacklightMode: false,
          arMode: false,
          sceneEnvironment: 'studio'
        }
      }
    ],
    subtotal: 18480.00,
    date: '2026-06-14T14:32:00Z',
    status: 'Printing'
  },
  {
    orderNumber: 'BAD-482103',
    customerName: 'Adam & Eve Wholesale Distribution',
    customerEmail: 'wholesale@adameve.com',
    customerAddress: '302 Corporate Drive',
    customerCity: 'Hillsborough',
    customerZip: 'NC 27278',
    items: [
      {
        id: 'custom-ae-02',
        name: 'Custom Fantasy Alien Bulb (B2B Batch 02)',
        price: 187.00,
        isCustom: true,
        quantity: 85,
        parameters: {
          baseGeometry: 'wave',
          length: 8.5,
          shaftGirth: 1.60,
          baseGirth: 1.90,
          curvature: 0.5,
          texture: 'studded',
          suctionCup: false,
          vibrationCore: true,
          colorMode: 3, // Split Pour
          color1: '#22d3ee', // Cyan
          color2: '#a855f7', // Purple
          isVibrating: false,
          showScaleRef: false,
          shapeType: 'fantasy',
          realisticVeins: 0.0,
          headType: 'alien',
          headScale: 1.0,
          hasBalls: false,
          fantasyType: 'alien',
          baseType: 'flat',
          taper: 0.25,
          firmness: 'soft',
          inclusions: 'glow',
          thermochromic: true,
          internalTube: false,
          blacklightMode: false,
          arMode: false,
          sceneEnvironment: 'shower'
        }
      }
    ],
    subtotal: 15895.00,
    date: '2026-06-19T09:15:00Z',
    status: 'Pending Mold'
  },
  {
    orderNumber: 'BAD-110842',
    customerName: 'Wellness Retail Europe SAS',
    customerEmail: 'import-b2b@wellness-retail.eu',
    customerAddress: '12 Rue de la Paix',
    customerCity: 'Paris',
    customerZip: '75002',
    items: [
      {
        id: 'custom-wr-03',
        name: 'Custom Targeted G-Spot (B2B Batch 03)',
        price: 135.00,
        isCustom: true,
        quantity: 50,
        parameters: {
          baseGeometry: 'ergonomic',
          length: 6.5,
          shaftGirth: 1.25,
          baseGirth: 1.45,
          curvature: 0.85,
          texture: 'ribbed',
          suctionCup: true,
          vibrationCore: false,
          colorMode: 2, // Gradient
          color1: '#db2777', // Deep Pink
          color2: '#fbcfe8', // Light Pink
          isVibrating: false,
          showScaleRef: false,
          shapeType: 'targeted',
          realisticVeins: 0.0,
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
        }
      }
    ],
    subtotal: 6750.00,
    date: '2026-06-15T11:04:00Z',
    status: 'Silicone Pouring'
  }
];
