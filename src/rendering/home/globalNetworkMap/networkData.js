// Network hubs, connection paths, and trading statistics accurately aligned with specific financial office cities on globe-map.svg

export const hubs = [
  {
    id: 'usa',
    name: 'USA',
    x: 202,
    y: 118,
    ping: '8ms',
    status: 'OPTIMAL',
    signalsPerSec: '2,480',
    winRate: '96.2%',
    server: 'NY4 Equinix Data Center (New York)',
    region: 'North America'
  },
  {
    id: 'brazil',
    name: 'Brazil',
    x: 275,
    y: 310,
    ping: '28ms',
    status: 'ACTIVE',
    signalsPerSec: '1,120',
    winRate: '94.8%',
    server: 'SP1 B3 Exchange Gateway (São Paulo)',
    region: 'South America'
  },
  {
    id: 'uk',
    name: 'UK',
    x: 408,
    y: 104,
    ping: '6ms',
    status: 'PRIMARY',
    signalsPerSec: '3,890',
    winRate: '97.5%',
    server: 'LD4 Slough Data Center (London)',
    region: 'Europe'
  },
  {
    id: 'nigeria',
    name: 'Nigeria',
    x: 428,
    y: 236,
    ping: '34ms',
    status: 'ACTIVE',
    signalsPerSec: '850',
    winRate: '93.9%',
    server: 'LOS1 MainOne Hub (Lagos)',
    region: 'Africa'
  },
  {
    id: 'uae',
    name: 'UAE',
    x: 526,
    y: 188,
    ping: '14ms',
    status: 'OPTIMAL',
    signalsPerSec: '1,840',
    winRate: '95.8%',
    server: 'DX1 Dubai FinTech Mesh (Dubai)',
    region: 'Middle East'
  },
  {
    id: 'india',
    name: 'India',
    x: 582,
    y: 195,
    ping: '18ms',
    status: 'OPTIMAL',
    signalsPerSec: '2,150',
    winRate: '96.0%',
    server: 'BOM2 GIFT City Gateway (Mumbai / GIFT)',
    region: 'South Asia'
  },
  {
    id: 'hongkong',
    name: 'Hong Kong',
    x: 672,
    y: 212,
    ping: '11ms',
    status: 'OPTIMAL',
    signalsPerSec: '2,920',
    winRate: '96.7%',
    server: 'HK1 Tseung Kwan O (Hong Kong)',
    region: 'East Asia'
  },
  {
    id: 'singapore',
    name: 'Singapore',
    x: 668,
    y: 264,
    ping: '10ms',
    status: 'PRIMARY',
    signalsPerSec: '3,410',
    winRate: '97.1%',
    server: 'SG1 Equinix Core (Singapore)',
    region: 'Southeast Asia'
  },
  {
    id: 'japan',
    name: 'Japan',
    x: 731,
    y: 139,
    ping: '9ms',
    status: 'OPTIMAL',
    signalsPerSec: '2,760',
    winRate: '96.4%',
    server: 'TY3 Tokyo Exchange Mesh (Tokyo)',
    region: 'East Asia'
  },
  {
    id: 'australia',
    name: 'Australia',
    x: 766,
    y: 355,
    ping: '22ms',
    status: 'ACTIVE',
    signalsPerSec: '1,450',
    winRate: '95.2%',
    server: 'SY3 Sydney Equinix Hub (Sydney)',
    region: 'Oceania',
    align: 'left'
  }
];

export const routes = [
  { from: 'usa', to: 'uk', dur: '4.2s', lift: -45 },
  { from: 'usa', to: 'brazil', dur: '5.5s', lift: 25 },
  { from: 'uk', to: 'uae', dur: '4.8s', lift: -30 },
  { from: 'uk', to: 'nigeria', dur: '5.1s', lift: 18 },
  { from: 'uae', to: 'india', dur: '3.6s', lift: -12 },
  { from: 'india', to: 'singapore', dur: '3.8s', lift: 18 },
  { from: 'singapore', to: 'hongkong', dur: '3.2s', lift: -15 },
  { from: 'singapore', to: 'japan', dur: '4.0s', lift: -35 },
  { from: 'singapore', to: 'australia', dur: '5.0s', lift: 35 },
  { from: 'brazil', to: 'australia', dur: '7.5s', lift: 55 }
];

export function buildCurveD(x1, y1, x2, y2, lift = -30) {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2 + lift;
  return `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;
}
