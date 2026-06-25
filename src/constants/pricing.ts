import type { BuilderParams } from '../types';

export function calculatePrice(params: BuilderParams, demoMode: boolean): number {
  let price = demoMode ? 25.00 : 99.00; // Base price is cheaper for crafts

  // Dimensions
  if (params.length > 5.0) {
    price += (params.length - 5.0) * (demoMode ? 3.00 : 12.00);
  }
  if (params.shaftGirth > 1.2) {
    price += (params.shaftGirth - 1.2) * (demoMode ? 4.00 : 15.00);
  }
  if (params.taper > 0.1) {
    price += params.taper * (demoMode ? 2.00 : 8.00);
  }

  if (!demoMode) {
    // Anatomy & Shapes
    if (params.shapeType === 'realistic' || params.shapeType === 'fantasy') {
      price += 15.00;
    }
    if (params.shapeType === 'realistic') {
      price += params.realisticVeins * 10.00;
      if (params.realisticGlans) price += 8.00;
      if (params.hasBalls) price += 20.00;
    }
  } else {
    if (params.shapeType === 'collectible') {
      price += 10.00; // higher density resin
    }
  }

  // Color pours & details
  if (params.colorMode > 0) {
    price += demoMode ? 5.00 : 15.00;
  }

  // Inclusions & Effects
  if (params.inclusions !== 'none') {
    price += demoMode ? 4.00 : 12.00;
  }
  if (params.thermochromic) {
    price += demoMode ? 6.00 : 18.00;
  }

  // Firmness / Dual-density
  if (params.firmness === 'dual-density') {
    price += demoMode ? 10.00 : 30.00;
  }

  if (!demoMode) {
    // Add-on components
    if (params.baseType === 'flared') price += 10.00;
    if (params.vibrationCore) price += 25.00;
    if (params.internalTube) price += 25.00;
    if (params.hasOrifice) price += 35.00;
  }

  return Number(price.toFixed(2));
}
