// ─────────────────────────────────────────────────────────────
// STL Download Utility
// Shared between AdminDashboard and AcquisitionPortal.
// ─────────────────────────────────────────────────────────────

import type { BuilderParams } from '../types';
import { generateToySTL, generateCoreSTL, generateMoldHalfSTL } from './stlGenerator';

export type STLExportType = 'product' | 'core' | 'mold_left' | 'mold_right';

/**
 * Generates and triggers download of an STL file.
 * @param params - Builder configuration parameters
 * @param type - Which STL variant to generate
 * @param filePrefix - Optional prefix for the download filename
 */
export function downloadSTL(
  params: BuilderParams,
  type: STLExportType,
  filePrefix = 'BAD'
): void {
  let content: string;
  let fileSuffix: string;

  switch (type) {
    case 'product':
      content = generateToySTL(params);
      fileSuffix = 'product';
      break;
    case 'core':
      content = generateCoreSTL(params);
      fileSuffix = 'core';
      break;
    case 'mold_left':
      content = generateMoldHalfSTL(params, 'front');
      fileSuffix = 'mold-left';
      break;
    case 'mold_right':
      content = generateMoldHalfSTL(params, 'back');
      fileSuffix = 'mold-right';
      break;
    default:
      throw new Error(`Unknown STL export type: ${type}`);
  }

  const blob = new Blob([content], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filePrefix}_${fileSuffix}.stl`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
