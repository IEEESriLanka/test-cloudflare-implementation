import Link from 'next/link';
import CountUp from './CountUp';
import { Users, Rocket, Trophy, Globe } from 'lucide-react';

interface AboutStatsProps {
  description?: string;
  stats?: {
    volunteers: number;
    projects: number;
    awards: number;
    audience: number;
  };
}

export default function AboutStats({ description, stats }: AboutStatsProps) {
  const displayStats = [
    { label: 'Volunteers', value: stats?.volunteers || 200, icon: <Users className="w-6 h-6" /> },
    { label: 'Projects', value: stats?.projects || 6, icon: <Rocket className="w-6 h-6" /> },
    { label: 'Awards', value: stats?.awards || 15, icon: <Trophy className="w-6 h-6" /> },
    { label: 'Audience Reach', value: stats?.audience || 3000, icon: <Globe className="w-6 h-6" /> },
  ];

  return (
    <section className="section-padding bg-white overflow-hidden">
      <div className="container">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
            <h2 className="text-[#111111] font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight flex flex-col leading-tight">
              <span className="text-[#002855]">About</span>
              <span className="text-[#F37C28]">IEEE Young Professionals</span>
              <span className="text-[#002855]">Sri Lanka</span>
            </h2>
            <p className="text-gray-600 text-sm md:text-md leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {description || "IEEE Young Professionals Sri Lanka is a vibrant community of early-career professionals and graduates who are passionate about technical excellence, leadership, and community impact. We provide a platform for networking, skill development, and career growth."}
            </p>
            <div className="pt-4">
              <Link href="/overview" className="inline-block px-8 py-4 rounded-xl text-semibold bg-[#F37C28] text-white font-bold hover:bg-[#d66a1e] tracking-tight transition-all shadow-lg shadow-orange-100 text-xs md:text-sm">
                More Details
              </Link>
            </div>
          </div>
          
          <div className="lg:w-1/2 grid grid-cols-2 sm:grid-cols-2 gap-4 sm:gap-8 w-full">
            {displayStats.map((stat) => (
              <div key={stat.label} className="group bg-gray-50 p-6 sm:p-8 rounded-[32px] border border-gray-100 text-center hover:shadow-xl transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105 flex flex-col items-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-2xl flex items-center justify-center text-[#F37C28] mb-4 shadow-sm group-hover:bg-[#F37C28] group-hover:text-white transition-colors duration-300">
                  {stat.icon}
                </div>
                <div className="text-3xl sm:text-4xl font-black text-[#002855] group-hover:text-[#F37C28] mb-2 leading-none transition-colors">
                  <CountUp end={stat.value} />
                </div>
                <div className="text-gray-500 font-bold text-[10px] sm:text-xs uppercase tracking-tight">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
