import Image from 'next/image';
import { IeeeProject } from '@/payload-types';

interface ProjectsShowcaseProps {
  projects: IeeeProject[];
}

export default function ProjectsShowcase({ projects }: ProjectsShowcaseProps) {
  return (
    <section className="section-padding bg-gray-50 border-y border-gray-100/50">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16 space-y-4">
          <h4 className="text-[#F37C28] font-semibold uppercase tracking-tight text-sm">Our Initiatives</h4>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#002855] leading-tight text-center">IEEE YPSL Projects</h2>
          <p className="text-gray-500 text-sm md:text-md px-4 sm:px-0">
            We run several flagship projects designed to impact different sectors of the youth and professional community in Sri Lanka.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects?.length > 0 ? projects.map((project, index) => (
            <div key={index} className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group flex flex-col items-center text-center">
              <div className="relative w-20 h-20 mb-6 transition-transform duration-500 group-hover:scale-110">
                {project.logo && typeof project.logo !== 'string' && (
                  <Image
                    src={project.logo.url}
                    alt={project.name}
                    fill
                    className="object-contain"
                  />
                )}
              </div>
              <h3 className="text-xl font-black mb-4 text-gray-900">{project.name}</h3>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed line-clamp-3">
                {project.description}
              </p>
              <div className="mt-auto">
                <a 
                  href={project.websiteUrl || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#F37C28] font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all uppercase tracking-tight"
                >
                  Discover More
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-200 rounded-[32px] text-gray-400 font-medium">
              No projects added yet. Check back soon!
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
