import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

let serverBuildId = null;

function getDeploymentVersion() {
  if (serverBuildId) return serverBuildId;

  // 1. Check CI/CD / Git / Vercel environment variables
  const envCommit = process.env.VERCEL_GIT_COMMIT_SHA ||
                    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ||
                    process.env.BUILD_ID ||
                    process.env.COMMIT_REF ||
                    process.env.RENDER_GIT_COMMIT;
  if (envCommit) {
    serverBuildId = String(envCommit).slice(0, 16);
    return serverBuildId;
  }

  // 2. Check .next/BUILD_ID generated during next build
  try {
    const buildIdPath = path.join(process.cwd(), '.next', 'BUILD_ID');
    if (fs.existsSync(buildIdPath)) {
      const id = fs.readFileSync(buildIdPath, 'utf8').trim();
      if (id) {
        serverBuildId = id;
        return serverBuildId;
      }
    }
  } catch (_) {}

  // 3. Fallback: unique process deployment timestamp
  serverBuildId = `deploy-${Date.now()}`;
  return serverBuildId;
}

export async function GET() {
  const version = getDeploymentVersion();

  return NextResponse.json(
    {
      version,
      timestamp: Date.now(),
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    }
  );
}
