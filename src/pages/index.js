import dynamic from 'next/dynamic';
require('dotenv').config();

const AnalyticsDashboard = dynamic(() => import('../components/AnalyticsDashboard'), { ssr: false });

export default function Home() {
  return <AnalyticsDashboard />;
}