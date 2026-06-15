import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center } from '@react-three/drei';
import { 
  TrendingUp, 
  Settings, 
  Download, 
  ChevronDown, 
  ChevronUp, 
  ShieldAlert,
  Boxes,
  Activity,
  Layers
} from 'lucide-react';
import { CustomToyMesh } from './ThreeCanvas';
import { 
  generateToySTL, 
  generateCoreSTL, 
  generateMoldHalfSTL
} from '../utils/stlGenerator';
import type { BuilderParams } from '../utils/stlGenerator';

interface CartItem {
  id: string;
  name: string;
  price: number;
  isCustom?: boolean;
  parameters?: any;
  quantity: number;
}

interface OrderItem {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerAddress?: string;
  customerCity?: string;
  customerZip?: string;
  items: CartItem[];
  subtotal: number;
  date: string;
  status: string;
}

interface AdminDashboardProps {
  orders: OrderItem[];
  setOrders: React.Dispatch<React.SetStateAction<OrderItem[]>>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ orders, setOrders }) => {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [batchMultiplier, setBatchMultiplier] = useState<number>(1.0);
  const [showConfigSettings, setShowConfigSettings] = useState<boolean>(false);
  const [moldBrandingText, setMoldBrandingText] = useState<string>('BAD');

  // Production Status List
  const statusWorkflow = [
    'Pending Mold',
    'Printing',
    'Silicone Pouring',
    'Shaving/Curing',
    'Ready for Shipment'
  ];

  // Calculate Aggregated Metrics
  const metrics = useMemo(() => {
    let totalRevenue = 0;
    let totalUnits = 0;
    let activeJobs = 0;
    let totalSiliconeLiters = 0;

    orders.forEach((order) => {
      totalRevenue += order.subtotal;
      if (order.status !== 'Ready for Shipment') {
        activeJobs++;
      }

      order.items.forEach((item) => {
        totalUnits += item.quantity;

        if (item.isCustom && item.parameters) {
          const params = item.parameters;
          // Volume = PI * r^2 * h
          // radius is girth * 1.4 / 2 = girth * 0.7
          const r = params.shaftGirth * 0.7;
          const h = params.length;
          const volCubicInches = Math.PI * r * r * h;
          // 1 cubic inch = 0.016387 Liters
          const volLiters = volCubicInches * 0.016387;
          totalSiliconeLiters += volLiters * item.quantity;
        } else {
          // Standard premade item fallback: 0.25 Liters per unit
          totalSiliconeLiters += 0.25 * item.quantity;
        }
      });
    });

    return {
      totalRevenue,
      totalUnits,
      activeJobs,
      totalSiliconeLiters: totalSiliconeLiters * batchMultiplier
    };
  }, [orders, batchMultiplier]);

  const handleStatusChange = (orderNumber: string, nextStatus: string) => {
    setOrders((prev) => 
      prev.map((o) => o.orderNumber === orderNumber ? { ...o, status: nextStatus } : o)
    );
  };

  const toggleExpandOrder = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  // STL Download triggers
  const downloadSTL = (params: BuilderParams, type: 'product' | 'core' | 'mold_left' | 'mold_right', orderNo: string) => {
    try {
      let content = '';
      let fileSuffix = '';

      if (type === 'product') {
        content = generateToySTL(params);
        fileSuffix = 'Product_Model';
      } else if (type === 'core') {
        content = generateCoreSTL(params);
        fileSuffix = 'Rigid_Core';
      } else if (type === 'mold_left') {
        content = generateMoldHalfSTL(params, 'front');
        fileSuffix = 'Left_Mold';
      } else if (type === 'mold_right') {
        content = generateMoldHalfSTL(params, 'back');
        fileSuffix = 'Right_Mold';
      }

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${orderNo}_${fileSuffix}.stl`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Error building CAD STL schematic.');
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Activity size={10} /> Corporate Production Suite
          </span>
          <h1 style={{ fontSize: '36px', marginTop: '8px', fontFamily: 'var(--font-serif)' }}>Manufacturing Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Monitor high-volume orders, compile 3D-molds, and configure shop floor pipelines.</p>
        </div>

        <button 
          className="btn btn-secondary"
          onClick={() => setShowConfigSettings(!showConfigSettings)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}
        >
          <Settings size={14} /> Shop Settings
        </button>
      </div>

      {/* Shop settings collapsible */}
      {showConfigSettings && (
        <div className="card animate-fade-in" style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <h4 style={{ fontSize: '14px', marginBottom: '12px' }}>Silicone Density Multiplier</h4>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>Adjusts volume estimation based on custom silicon formulations or batch overhead factors.</p>
            <input 
              type="range" 
              min="1.0" 
              max="2.0" 
              step="0.05" 
              value={batchMultiplier} 
              onChange={(e) => setBatchMultiplier(Number(e.target.value))}
              style={{ width: '100%' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginTop: '4px' }}>
              <span>1.0x (Standard)</span>
              <span style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>{batchMultiplier.toFixed(2)}x</span>
              <span>2.0x (High Density)</span>
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: '14px', marginBottom: '12px' }}>Mold Branding Emboss</h4>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>Engraves customized text onto the split mold block STL exports for brand validation.</p>
            <input 
              type="text" 
              value={moldBrandingText}
              onChange={(e) => setMoldBrandingText(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '8px', 
                backgroundColor: 'var(--bg-secondary)', 
                border: '1px solid var(--border-color)', 
                color: 'var(--text-primary)',
                borderRadius: 'var(--radius-sm)'
              }}
            />
          </div>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        
        {/* Total Revenue */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '24px' }}>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Corporate Revenue</span>
          <span style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-serif)' }}>
            ${metrics.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={12} /> B2B Purchase Orders Online
          </span>
        </div>

        {/* Total Units */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '24px' }}>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Total Units Queued</span>
          <span style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-serif)' }}>
            {metrics.totalUnits} Units
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Across all pending and shipped batches
          </span>
        </div>

        {/* Active Production Jobs */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '24px' }}>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Active Mold Queues</span>
          <span style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-serif)' }}>
            {metrics.activeJobs} Jobs
          </span>
          <span style={{ fontSize: '11px', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Activity size={12} /> Running on shop floors
          </span>
        </div>

        {/* Silicone Volume */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '24px' }}>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Medical Silicone Vol.</span>
          <span style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-serif)' }}>
            {metrics.totalSiliconeLiters.toFixed(2)} Liters
          </span>
          <span style={{ fontSize: '11px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Boxes size={12} /> Platinum-Cured formulation
          </span>
        </div>

      </div>

      {/* Orders Table Container */}
      <div className="card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)' }}>
          <h3 style={{ fontSize: '18px', fontFamily: 'var(--font-serif)' }}>Production Order Queue</h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '16px 20px' }}>Order #</th>
                <th style={{ padding: '16px 20px' }}>Customer Entity</th>
                <th style={{ padding: '16px 20px' }}>Date</th>
                <th style={{ padding: '16px 20px' }}>Batch Units</th>
                <th style={{ padding: '16px 20px' }}>Total Price</th>
                <th style={{ padding: '16px 20px' }}>Production status</th>
                <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No orders in queue. Place an order on the storefront to test.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const isExpanded = expandedOrderId === order.orderNumber;
                  const totalItemsQty = order.items.reduce((sum, i) => sum + i.quantity, 0);

                  return (
                    <React.Fragment key={order.orderNumber}>
                      <tr 
                        style={{ 
                          borderBottom: '1px solid var(--border-color)', 
                          backgroundColor: isExpanded ? 'rgba(255,255,255,0.01)' : 'transparent',
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <td style={{ padding: '16px 20px', fontWeight: 700, color: 'var(--accent-gold)' }}>
                          {order.orderNumber}
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <div>{order.customerName}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{order.customerEmail}</div>
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          {new Date(order.date).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '16px 20px', fontWeight: 600 }}>
                          {totalItemsQty} units
                        </td>
                        <td style={{ padding: '16px 20px', fontWeight: 700 }}>
                          ${order.subtotal.toFixed(2)}
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.orderNumber, e.target.value)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: 
                                order.status === 'Pending Mold' ? 'rgba(245, 158, 11, 0.15)' :
                                order.status === 'Printing' ? 'rgba(59, 130, 246, 0.15)' :
                                order.status === 'Silicone Pouring' ? 'rgba(236, 72, 153, 0.15)' :
                                order.status === 'Shaving/Curing' ? 'rgba(139, 92, 246, 0.15)' :
                                'rgba(16, 185, 129, 0.15)',
                              color: 
                                order.status === 'Pending Mold' ? '#f59e0b' :
                                order.status === 'Printing' ? '#3b82f6' :
                                order.status === 'Silicone Pouring' ? '#ec4899' :
                                order.status === 'Shaving/Curing' ? '#8b5cf6' :
                                '#10b981',
                              border: '1px solid currentColor',
                              fontWeight: 600,
                              fontSize: '12px',
                              outline: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            {statusWorkflow.map((status) => (
                              <option 
                                key={status} 
                                value={status}
                                style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                              >
                                {status}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                          <button
                            className="btn btn-secondary"
                            onClick={() => toggleExpandOrder(order.orderNumber)}
                            style={{ padding: '6px 10px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          >
                            {isExpanded ? (
                              <>Close Details <ChevronUp size={12} /></>
                            ) : (
                              <>Open Details <ChevronDown size={12} /></>
                            )}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Details Row */}
                      {isExpanded && (
                        <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)' }}>
                          <td colSpan={7} style={{ padding: '24px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', flexWrap: 'wrap' }}>
                              
                              {/* Left details - Address, item config, specs */}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                  <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>Shipping Destination</h4>
                                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                    {order.customerAddress || 'No shipping address (B2B Pickup)'}<br />
                                    {order.customerCity}, {order.customerZip}
                                  </p>
                                </div>

                                <div>
                                  <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>Order Item Details</h4>
                                  {order.items.map((item, idx) => (
                                    <div key={idx} style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginBottom: '8px' }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                                        <span>{item.name}</span>
                                        <span>{item.quantity} units</span>
                                      </div>
                                      
                                      {item.isCustom && item.parameters && (
                                        <div style={{ marginTop: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px', fontSize: '11px', color: 'var(--text-muted)' }}>
                                          <div>Length: <strong>{item.parameters.length.toFixed(1)} in</strong></div>
                                          <div>Shaft girth: <strong>{item.parameters.shaftGirth.toFixed(2)}x</strong></div>
                                          <div>Base girth: <strong>{item.parameters.baseGirth.toFixed(2)}x</strong></div>
                                          <div>Curvature: <strong>{Math.abs(item.parameters.curvature * 15).toFixed(0)}°</strong></div>
                                          <div>Firmness: <strong>{item.parameters.firmness.toUpperCase()}</strong></div>
                                          <div>Texture: <strong>{item.parameters.texture.toUpperCase()}</strong></div>
                                          <div>Inclusions: <strong>{item.parameters.inclusions.toUpperCase()}</strong></div>
                                          <div>Base flare: <strong>{item.parameters.baseType.toUpperCase()}</strong></div>
                                          <div>Thermochromic: <strong>{item.parameters.thermochromic ? 'YES' : 'NO'}</strong></div>
                                          <div>Ejaculation Tube: <strong>{item.parameters.internalTube ? 'YES' : 'NO'}</strong></div>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>

                                {/* Download Center */}
                                <div>
                                  <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', color: 'var(--text-primary)' }}>CAD Manufacturing downloads</h4>
                                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    {order.items.map((item, idx) => {
                                      if (!item.isCustom || !item.parameters) return null;
                                      return (
                                        <React.Fragment key={idx}>
                                          <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => downloadSTL(item.parameters, 'product', order.orderNumber)}
                                            style={{ fontSize: '12px', padding: '10px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                          >
                                            <Download size={13} /> Product Mesh (.stl)
                                          </button>
                                          
                                          <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => downloadSTL(item.parameters, 'core', order.orderNumber)}
                                            style={{ fontSize: '12px', padding: '10px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                            disabled={item.parameters.firmness !== 'dual-density'}
                                            title={item.parameters.firmness !== 'dual-density' ? 'Only available for Dual-Density items' : ''}
                                          >
                                            <Layers size={13} /> Rigid Inner Core (.stl)
                                          </button>

                                          <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={() => downloadSTL(item.parameters, 'mold_left', order.orderNumber)}
                                            style={{ fontSize: '12px', padding: '10px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                          >
                                            <Download size={13} /> Left Split Mold (.stl)
                                          </button>

                                          <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={() => downloadSTL(item.parameters, 'mold_right', order.orderNumber)}
                                            style={{ fontSize: '12px', padding: '10px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                          >
                                            <Download size={13} /> Right Split Mold (.stl)
                                          </button>
                                        </React.Fragment>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>

                              {/* Right details - Inline 3D Viewport */}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>3D CAD Geometry verification</h4>
                                <div 
                                  style={{ 
                                    width: '100%', 
                                    height: '280px', 
                                    borderRadius: 'var(--radius-md)', 
                                    backgroundColor: 'var(--bg-secondary)', 
                                    border: '1px solid var(--border-color)',
                                    position: 'relative',
                                    overflow: 'hidden'
                                  }}
                                >
                                  {order.items.some(i => i.isCustom && i.parameters) ? (
                                    (() => {
                                      const customItem = order.items.find(i => i.isCustom && i.parameters);
                                      if (!customItem) return null;
                                      return (
                                        <Canvas
                                          camera={{ position: [0, 1.8, 8.0], fov: 40 }}
                                          style={{ width: '100%', height: '100%' }}
                                        >
                                          <ambientLight intensity={0.5} />
                                          <directionalLight position={[5, 7, 5]} intensity={1.2} />
                                          <directionalLight position={[-5, 3, -5]} intensity={0.6} color="#fda4af" />
                                          <Center>
                                            <CustomToyMesh params={customItem.parameters} />
                                          </Center>
                                          <OrbitControls 
                                            enableZoom={true} 
                                            enablePan={false}
                                            minDistance={3.5}
                                            maxDistance={12.0}
                                          />
                                        </Canvas>
                                      );
                                    })()
                                  ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'center', height: '100%', color: 'var(--text-muted)', fontSize: '12px', padding: '40px', textAlign: 'center' }}>
                                      No custom geometric properties. Standard mold blocks do not apply to basic pre-made items.
                                    </div>
                                  )}
                                  
                                  <div 
                                    style={{ 
                                      position: 'absolute', 
                                      bottom: '8px', 
                                      left: '8px', 
                                      backgroundColor: 'var(--bg-glass)', 
                                      backdropFilter: 'blur(4px)',
                                      padding: '4px 8px', 
                                      fontSize: '9px', 
                                      borderRadius: 'var(--radius-sm)',
                                      border: '1px solid var(--border-color)' 
                                    }}
                                  >
                                    DRAG TO ROTATE
                                  </div>
                                </div>
                                
                                <div style={{ display: 'flex', gap: '8px', padding: '12px', backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.15)', borderRadius: 'var(--radius-sm)', fontSize: '11px', color: 'var(--text-secondary)' }}>
                                  <ShieldAlert size={16} color="var(--accent-crimson)" style={{ flexShrink: 0 }} />
                                  <span>
                                    <strong>Manufacturing Notice:</strong> Standard B2B mold STL blocks output watertight split-halves. Check your CNC/3D print slicer limits for tolerances before starting high-volume runs.
                                  </span>
                                </div>
                              </div>

                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
};
