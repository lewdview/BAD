// ─────────────────────────────────────────────────────────────
// Status Colors — Order status → visual color mapping
// Used by AdminDashboard and any component displaying order status.
// ─────────────────────────────────────────────────────────────

import type { OrderStatus } from '../types';

export const STATUS_COLORS: Record<OrderStatus, string> = {
  'Pending Mold': '#f59e0b',
  'Printing': '#3b82f6',
  'Silicone Pouring': '#ec4899',
  'Shaving/Curing': '#a855f7',
  'Ready for Shipment': '#22c55e',
};

export const STATUS_WORKFLOW: OrderStatus[] = [
  'Pending Mold',
  'Printing',
  'Silicone Pouring',
  'Shaving/Curing',
  'Ready for Shipment',
];
