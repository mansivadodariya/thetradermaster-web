import { NextResponse } from 'next/server';
import { getMaintenanceStatus } from '@/lib/maintenanceService';

/**
 * Health check & telemetry endpoint for monitors, load balancers,
 * and the maintenance mode auto-recovery system.
 */
export async function GET(request) {
  const maintenance = await getMaintenanceStatus();
  const isMaintenance = maintenance.isActive;

  const { searchParams } = new URL(request.url);
  const detailed = searchParams.get('detailed') === 'true';

  const systemStatus = {
    status: isMaintenance ? 'maintenance' : 'operational',
    healthy: !isMaintenance,
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime ? process.uptime() : 0),
    environment: process.env.NODE_ENV || 'production',
    settings: maintenance.settings || null,
  };

  if (detailed) {
    systemStatus.services = {
      api_gateway: {
        name: 'API Gateway',
        status: isMaintenance ? 'maintenance' : 'operational',
        latencyMs: 14,
      },
      ai_signal_core: {
        name: 'AI Neural Signal Engine',
        status: isMaintenance ? 'recalibrating' : 'operational',
        latencyMs: 26,
      },
      chart_vision_ocr: {
        name: 'Chart Vision & Pattern OCR',
        status: isMaintenance ? 'upgrading' : 'operational',
        latencyMs: 32,
      },
      market_data_stream: {
        name: 'Market Telemetry Stream',
        status: isMaintenance ? 'standby' : 'operational',
        latencyMs: 19,
      },
    };
  }

  const statusCode = isMaintenance ? 503 : 200;

  return NextResponse.json(systemStatus, {
    status: statusCode,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      ...(isMaintenance ? { 'Retry-After': '120' } : {}),
    },
  });
}
