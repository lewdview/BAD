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
import { ToyModel } from './canvas/ToyModel';
import { downloadSTL } from '../utils/stlDownloader';
import type { OrderItem, OrderStatus } from '../types';
import { STATUS_COLORS, STATUS_WORKFLOW } from '../constants/statusColors';

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
  const statusWorkflow = STATUS_WORKFLOW;

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

  const handleStatusChange = (orderNumber: string, nextStatus: OrderStatus) => {
    setOrders((prev) => 
      prev.map((o) => o.orderNumber === orderNumber ? { ...o, status: nextStatus } : o)
    );
  };

  const toggleExpandOrder = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
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
            <label htmlFor="density-multiplier" style={{ display: 'block', fontSize: '14px', marginBottom: '12px', fontWeight: 600, cursor: 'pointer' }}>Silicone Density Multiplier</label>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>Adjusts volume estimation based on custom silicon formulations or batch overhead factors.</p>
            <input 
              id="density-multiplier"
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
            <label htmlFor="branding-emboss" style={{ display: 'block', fontSize: '14px', marginBottom: '12px', fontWeight: 600, cursor: 'pointer' }}>Mold Branding Emboss</label>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>Engraves customized text onto the split mold block STL exports for brand validation.</p>
            <input 
              id="branding-emboss"
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
        <div className="card" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '8px', 
          padding: '24px',
          borderLeft: '4px solid var(--accent-gold)',
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.03) 0%, var(--bg-secondary) 100%)'
        }}>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>Corporate Revenue</span>
          <span style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', letterSpacing: '-0.02em' }}>
            ${metrics.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
            <TrendingUp size={12} /> B2B Purchase Orders Online
          </span>
        </div>

        {/* Total Units */}
        <div className="card" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '8px', 
          padding: '24px',
          borderLeft: '4px solid var(--accent-pink)',
          background: 'linear-gradient(135deg, rgba(224, 76, 224, 0.03) 0%, var(--bg-secondary) 100%)'
        }}>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>Total Units Queued</span>
          <span style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', letterSpacing: '-0.02em' }}>
            {metrics.totalUnits} Units
          </span>
          <span style={{ fontSize: '11px', color: 'var(--accent-pink)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
            <Boxes size={12} /> Across all production batches
          </span>
        </div>

        {/* Active Production Jobs */}
        <div className="card" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '8px', 
          padding: '24px',
          borderLeft: '4px solid #3b82f6',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, var(--bg-secondary) 100%)'
        }}>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>Active Mold Queues</span>
          <span style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', letterSpacing: '-0.02em' }}>
            {metrics.activeJobs} Jobs
          </span>
          <span style={{ fontSize: '11px', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
            <Activity size={12} /> Running on shop floors
          </span>
        </div>

        {/* Silicone Volume */}
        <div className="card" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '8px', 
          padding: '24px',
          borderLeft: '4px solid #10b981',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.03) 0%, var(--bg-secondary) 100%)'
        }}>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>Medical Silicone Vol.</span>
          <span style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', letterSpacing: '-0.02em' }}>
            {metrics.totalSiliconeLiters.toFixed(2)} Liters
          </span>
          <span style={{ fontSize: '11px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
            <Layers size={12} /> Platinum-Cured formulation
          </span>
        </div>

      </div>

      {/* Orders Table Container */}
      <div className="card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)' }}>
          <h3 style={{ fontSize: '18px', fontFamily: 'var(--font-serif)' }}>Production Order Queue</h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)', backgroundColor: 'var(--bg-secondary)' }}>
                <th style={{ padding: '16px 20px', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.08em', fontWeight: 700 }}>Order #</th>
                <th style={{ padding: '16px 20px', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.08em', fontWeight: 700 }}>Customer Entity</th>
                <th style={{ padding: '16px 20px', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.08em', fontWeight: 700 }}>Date</th>
                <th style={{ padding: '16px 20px', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.08em', fontWeight: 700 }}>Batch Units</th>
                <th style={{ padding: '16px 20px', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.08em', fontWeight: 700 }}>Total Price</th>
                <th style={{ padding: '16px 20px', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.08em', fontWeight: 700 }}>Production status</th>
                <th style={{ padding: '16px 20px', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.08em', fontWeight: 700, textAlign: 'right' }}>Actions</th>
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
                  const currentStepIndex = statusWorkflow.indexOf(order.status);

                  return (
                    <React.Fragment key={order.orderNumber}>
                      <tr 
                        style={{ 
                          borderBottom: '1px solid var(--border-color)', 
                          backgroundColor: isExpanded ? 'rgba(255,255,255,0.01)' : 'transparent',
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <td style={{ padding: '16px 20px', fontWeight: 700 }}>
                          <span style={{ 
                            padding: '4px 8px', 
                            backgroundColor: 'rgba(212, 175, 55, 0.1)', 
                            border: '1px solid rgba(212, 175, 55, 0.2)', 
                            borderRadius: '4px',
                            color: 'var(--accent-gold)',
                            fontFamily: 'monospace',
                            fontSize: '12px'
                          }}>
                            {order.orderNumber}
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{order.customerName}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{order.customerEmail}</div>
                        </td>
                        <td style={{ padding: '16px 20px', color: 'var(--text-secondary)' }}>
                          {new Date(order.date).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {totalItemsQty} units
                        </td>
                        <td style={{ padding: '16px 20px', fontWeight: 700, color: 'var(--accent-gold)' }}>
                          ${order.subtotal.toFixed(2)}
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '150px' }}>
                            <div style={{ position: 'relative' }}>
                              <select
                                value={order.status}
                                onChange={(e) => handleStatusChange(order.orderNumber, e.target.value as OrderStatus)}
                                style={{
                                  width: '100%',
                                  padding: '6px 28px 6px 12px',
                                  borderRadius: 'var(--radius-sm)',
                                  backgroundColor: 'var(--bg-tertiary)',
                                  color: 
                                   STATUS_COLORS[order.status],
                                  border: '1px solid var(--border-color)',
                                  fontWeight: 600,
                                  fontSize: '12px',
                                  outline: 'none',
                                  cursor: 'pointer',
                                  appearance: 'none',
                                  WebkitAppearance: 'none',
                                  transition: 'all var(--transition-fast)'
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
                              <div style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                                <ChevronDown size={14} />
                              </div>
                            </div>
                            
                            {/* Mini progress bar */}
                            <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '2px', overflow: 'hidden' }}>
                              <div 
                                style={{ 
                                  height: '100%', 
                                  width: `${((currentStepIndex + 1) / statusWorkflow.length) * 100}%`,
                                  backgroundColor: 
                                    STATUS_COLORS[order.status],
                                  transition: 'width 0.4s ease'
                                }} 
                              />
                            </div>
                          </div>
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
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                              
                              {/* Full visual status workflow stepper */}
                              <div className="card" style={{ gridColumn: 'span 2', padding: '20px 24px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                                <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '16px' }}>Manufacturing Status Pipeline</h4>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                                  {statusWorkflow.map((step, idx) => {
                                    const isCompleted = idx <= currentStepIndex;
                                    const isCurrent = idx === currentStepIndex;
                                    
                                    return (
                                      <React.Fragment key={step}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 2, flex: 1 }}>
                                          <div 
                                            style={{ 
                                              width: '28px', 
                                              height: '28px', 
                                              borderRadius: '50%', 
                                              backgroundColor: isCurrent ? 'var(--accent-gold)' : isCompleted ? 'rgba(212, 175, 55, 0.15)' : 'var(--bg-tertiary)',
                                              border: isCurrent ? '2px solid #ffffff' : isCompleted ? '1px solid var(--accent-gold)' : '1px solid var(--border-color)',
                                              color: isCurrent ? '#000000' : isCompleted ? 'var(--accent-gold)' : 'var(--text-muted)',
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              fontWeight: 700,
                                              fontSize: '11px',
                                              boxShadow: isCurrent ? '0 0 15px var(--accent-gold-glow)' : 'none',
                                              transition: 'all 0.3s'
                                            }}
                                          >
                                            {idx + 1}
                                          </div>
                                          <span style={{ 
                                            fontSize: '11px', 
                                            fontWeight: isCurrent ? 600 : 500,
                                            color: isCurrent ? 'var(--text-primary)' : isCompleted ? 'var(--text-secondary)' : 'var(--text-muted)',
                                            textAlign: 'center'
                                          }}>
                                            {step}
                                          </span>
                                        </div>
                                        
                                        {idx < statusWorkflow.length - 1 && (
                                          <div 
                                            style={{ 
                                              height: '2px', 
                                              flex: 1, 
                                              backgroundColor: idx < currentStepIndex ? 'var(--accent-gold)' : 'var(--border-color)',
                                              alignSelf: 'center',
                                              marginTop: '-20px',
                                              zIndex: 1,
                                              transition: 'all 0.3s'
                                            }} 
                                          />
                                        )}
                                      </React.Fragment>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Left details - Address, item config, specs */}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                  <h4 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '8px' }}>Shipping Destination</h4>
                                  <div className="card" style={{ padding: '16px', backgroundColor: 'var(--bg-secondary)' }}>
                                    <p style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>
                                      {order.customerName}
                                    </p>
                                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.5' }}>
                                      {order.customerAddress || 'No shipping address (B2B Pickup)'}<br />
                                      {order.customerCity && `${order.customerCity}, `}{order.customerZip}
                                    </p>
                                  </div>
                                </div>

                                <div>
                                  <h4 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '8px' }}>Order Item Details</h4>
                                  {order.items.map((item, idx) => (
                                    <div key={idx} className="card" style={{ padding: '16px', backgroundColor: 'var(--bg-secondary)', marginBottom: '8px' }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '8px' }}>
                                        <span style={{ color: 'var(--text-primary)' }}>{item.name}</span>
                                        <span style={{ color: 'var(--accent-gold)' }}>{item.quantity} units</span>
                                      </div>
                                      
                                      {item.isCustom && item.parameters && (
                                        <div style={{ 
                                          marginTop: '12px', 
                                          display: 'grid', 
                                          gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', 
                                          gap: '8px', 
                                          fontSize: '11px',
                                        }}>
                                          {[
                                            { label: 'Length', value: `${item.parameters.length.toFixed(1)} in` },
                                            { label: 'Shaft Girth', value: `${item.parameters.shaftGirth.toFixed(2)}x` },
                                            { label: 'Base Girth', value: `${item.parameters.baseGirth.toFixed(2)}x` },
                                            { label: 'Curvature', value: `${Math.abs(item.parameters.curvature * 15).toFixed(0)}°` },
                                            { label: 'Firmness', value: item.parameters.firmness.toUpperCase() },
                                            { label: 'Texture', value: item.parameters.texture.toUpperCase() },
                                            { label: 'Inclusions', value: item.parameters.inclusions.toUpperCase() },
                                            { label: 'Base Flare', value: item.parameters.baseType.toUpperCase() },
                                            { label: 'Thermochromic', value: item.parameters.thermochromic ? 'YES' : 'NO' },
                                            { label: 'Ejaculation Tube', value: item.parameters.internalTube ? 'YES' : 'NO' },
                                          ].map((spec, sidx) => (
                                            <div 
                                              key={sidx} 
                                              style={{ 
                                                padding: '6px 10px', 
                                                backgroundColor: 'var(--bg-tertiary)', 
                                                borderRadius: '6px', 
                                                border: '1px solid var(--border-color)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '2px'
                                              }}
                                            >
                                              <span style={{ color: 'var(--text-muted)', fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{spec.label}</span>
                                              <strong style={{ color: 'var(--text-primary)', fontSize: '11px' }}>{spec.value}</strong>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>

                                {/* Download Center */}
                                <div>
                                  <h4 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '8px' }}>CAD Manufacturing downloads</h4>
                                  <div className="card" style={{ padding: '16px', backgroundColor: 'var(--bg-secondary)' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                      {order.items.map((item, idx) => {
                                        const params = item.parameters;
                                        if (!item.isCustom || !params) return null;
                                        return (
                                          <React.Fragment key={idx}>
                                            <button
                                              type="button"
                                              className="btn btn-secondary"
                                              onClick={() => downloadSTL(params, 'product', order.orderNumber)}
                                              style={{ fontSize: '11px', padding: '10px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                            >
                                              <Download size={13} /> Product Mesh (.stl)
                                            </button>
                                            
                                            <button
                                              type="button"
                                              className="btn btn-secondary"
                                              onClick={() => downloadSTL(params, 'core', order.orderNumber)}
                                              style={{ fontSize: '11px', padding: '10px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                              disabled={params.firmness !== 'dual-density'}
                                              title={params.firmness !== 'dual-density' ? 'Only available for Dual-Density items' : ''}
                                            >
                                              <Layers size={13} /> Rigid Inner Core (.stl)
                                            </button>

                                            <button
                                              type="button"
                                              className="btn btn-secondary"
                                              onClick={() => downloadSTL(params, 'orifice_plug', order.orderNumber)}
                                              style={{ fontSize: '11px', padding: '10px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                              disabled={!params.hasOrifice}
                                              title={!params.hasOrifice ? 'Only available for items with a Molded Orifice Cavity' : ''}
                                            >
                                              <Layers size={13} /> Orifice Core Plug (.stl)
                                            </button>

                                            <button
                                              type="button"
                                              className="btn btn-primary"
                                              onClick={() => downloadSTL(params, 'mold_left', order.orderNumber)}
                                              style={{ fontSize: '11px', padding: '10px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                            >
                                              <Download size={13} /> Left Split Mold (.stl)
                                            </button>

                                            <button
                                              type="button"
                                              className="btn btn-primary"
                                              onClick={() => downloadSTL(params, 'mold_right', order.orderNumber)}
                                              style={{ fontSize: '11px', padding: '10px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                            >
                                              <Download size={13} /> Right Split Mold (.stl)
                                            </button>
                                          </React.Fragment>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Right details - Inline 3D Viewport */}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                  <h4 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '8px' }}>3D CAD Geometry verification</h4>
                                  <div 
                                    style={{ 
                                      width: '100%', 
                                      height: '320px', 
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
                                        if (!customItem || !customItem.parameters) return null;
                                        const params = customItem.parameters;
                                        return (
                                          <Canvas
                                            camera={{ position: [0, 1.8, 8.0], fov: 40 }}
                                            style={{ width: '100%', height: '100%' }}
                                          >
                                            <ambientLight intensity={0.5} />
                                            <directionalLight position={[5, 7, 5]} intensity={1.2} />
                                            <directionalLight position={[-5, 3, -5]} intensity={0.6} color="#fda4af" />
                                            <Center>
                                              <ToyModel params={params} />
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
                                        bottom: '12px', 
                                        left: '12px', 
                                        backgroundColor: 'rgba(0, 0, 0, 0.6)', 
                                        backdropFilter: 'blur(8px)',
                                        padding: '4px 10px', 
                                        fontSize: '9px', 
                                        borderRadius: '4px',
                                        border: '1px solid var(--border-color)',
                                        color: 'var(--accent-gold)',
                                        letterSpacing: '0.08em',
                                        fontWeight: 600
                                      }}
                                    >
                                      INTERACTIVE 3D COMPILER
                                    </div>
                                  </div>
                                </div>
                                
                                <div style={{ display: 'flex', gap: '10px', padding: '16px', backgroundColor: 'rgba(197, 48, 48, 0.04)', border: '1px solid rgba(197, 48, 48, 0.15)', borderRadius: 'var(--radius-md)', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                                  <ShieldAlert size={18} color="var(--accent-crimson)" style={{ flexShrink: 0, marginTop: '2px' }} />
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
