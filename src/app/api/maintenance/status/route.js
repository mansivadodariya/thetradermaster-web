import { NextResponse } from 'next/server';
import { getMaintenanceStatus } from '@/lib/maintenanceService';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const force = searchParams.get('force') === 'true';
  const status = await getMaintenanceStatus(force);

  return NextResponse.json(status, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache',
    },
  });
}
