import dynamic from 'next/dynamic';

const AnalyticsDashboard = dynamic(() => import('../components/AnalyticsDashboard'), { ssr: false });

export default function Home() {
  return <AnalyticsDashboard />;
}