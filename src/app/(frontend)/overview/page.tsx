import Breadcrumbs from '@/components/Breadcrumbs';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import Image from 'next/image';
import RichText from '@/components/RichText';
import Link from 'next/link';

// Helper function to extract YouTube video ID
function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function OverviewPage() {
  const payload = await getPayload({ config: configPromise });

  // Fetch Overview Page content
  const data = await payload.findGlobal({
    slug: 'overview-page',
    depth: 2,
  });

  const videoId = data?.globalVideoUrl ? getYouTubeId(data.globalVideoUrl as string) : null;

  return (
    <main className="min-h-screen py-8">
      <div className="container">
        <Breadcrumbs />
        
        {/* Hero Section */}
        <div className="mb-10 md:mb-16 space-y-4">
          {/*<h4 className="text-[#F37C28] font-bold uppercase tracking-widest text-sm">About Us</h4>*/}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#002855] leading-tight">
            {data?.heroTitle ? (
              data.heroTitle.includes('IEEE Young Professionals Sri Lanka') ? (
                <>
                  {data.heroTitle.split('IEEE Young Professionals Sri Lanka')[0]}
                  <span className="text-[#F37C28]">IEEE Young Professionals Sri Lanka</span>
                  {data.heroTitle.split('IEEE Young Professionals Sri Lanka')[1]}
                </>
              ) : (
                data.heroTitle
              )
            ) : (
              <>
                About <span className="text-[#F37C28]">IEEE Young Professionals Sri Lanka</span>
              </>
            )}
          </h1>
          <p className="text-gray-500 max-w-3xl text-sm md:text-lg">
            {data?.heroSubtitle || 'Empowering early-career professionals through innovation, leadership, and impact.'}
          </p>
        </div>

        {/* Who We Are */}
        {data?.whoWeAreContent && (
          <section className="mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-extrabold text-gray-900">
                  {data?.whoWeAreHeading || 'Who We Are'}
                </h2>
                <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                  <RichText content={data.whoWeAreContent} />
                </div>
              </div>
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-xl bg-gray-100">
                {data?.whoWeAreImage && typeof data.whoWeAreImage === 'object' ? (
                  <Image
                    src={(data.whoWeAreImage as any).url}
                    alt="Who We Are"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-200">
                    <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Vision & Mission Cards */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
            {/* Vision Card */}
            <div className="bg-gray-50 rounded-3xl p-10 border border-gray-100">
              <div className="text-4xl mb-4">{data?.visionIcon || '👁'}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {data?.visionTitle || 'Vision'}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {data?.visionText || 'Be the leading professional organization for young professionals and industries in Sri Lanka.'}
              </p>
            </div>

            {/* Mission Card */}
            <div className="bg-gray-50 rounded-3xl p-10 border border-gray-100">
              <div className="text-4xl mb-4">{data?.missionIcon || '🎯'}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {data?.missionTitle || 'Mission'}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {data?.missionText || 'Increasing the industry members\' involvement and enhancing recognition among industries to attract and benefit fresh graduates.'}
              </p>
            </div>
          </div>
        </section>

        {/* What We Do - Icon Grid */}
        {data?.whatWeDoItems && (data.whatWeDoItems as any[]).length > 0 && (
          <section className="mb-20">
            <h2 className="text-3xl font-extrabold text-[#002855] mb-12">
              {data?.whatWeDoHeading || 'What We Do'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
              {(data.whatWeDoItems as any[]).map((item: any, idx: number) => (
                <div 
                  key={idx}
                  className="bg-white rounded-3xl p-8 border border-gray-100 hover:border-[#F37C28] transition-all duration-300 hover:shadow-xl shadow-sm flex flex-col h-full"
                >
                  <div className="text-3xl mb-4 p-4 bg-gray-50 rounded-2xl w-fit group-hover:bg-orange-50 transition-colors">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Flagship Initiatives */}
        {data?.initiatives && (data.initiatives as any[]).length > 0 && (
          <section className="mb-20">
            <h2 className="text-3xl font-extrabold text-[#002855] mb-12">
              {data?.initiativesHeading || 'Our Flagship Initiatives'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
              {(data.initiatives as any[]).map((initiative: any, idx: number) => (
                <div 
                  key={idx}
                  className="bg-white rounded-[32px] p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full"
                >
                  {initiative.logo && typeof initiative.logo === 'object' && (
                    <div className="relative h-24 mb-8 bg-gray-50 rounded-2xl p-4">
                      <Image
                        src={(initiative.logo as any).url}
                        alt={initiative.name}
                        fill
                        className="object-contain p-4"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl md:text-2xl font-black text-gray-900">{initiative.name}</h3>
                      {initiative.tag && (
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          initiative.tag === 'ai' ? 'bg-purple-100 text-purple-700' :
                          initiative.tag === 'career' ? 'bg-blue-100 text-blue-700' :
                          initiative.tag === 'innovation' ? 'bg-orange-100 text-orange-700' :
                          initiative.tag === 'education' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {initiative.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6">{initiative.description}</p>
                  </div>
                  {initiative.link && (
                    <a 
                      href={initiative.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#F37C28] font-bold text-sm hover:text-[#d66a1f] transition-colors inline-flex items-center gap-2 mt-auto"
                    >
                      VISIT WEBSITE →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Impact & Stats */}
        {data?.stats && (data.stats as any[]).length > 0 && (
          <section className="mb-20">
            {data?.statsHeading && (
              <h2 className="text-3xl font-extrabold text-gray-900 mb-12">
                {data.statsHeading}
              </h2>
            )}
            <div className="bg-gray-50 rounded-3xl p-12 border border-gray-100">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {(data.stats as any[]).map((stat: any, idx: number) => (
                  <div key={idx} className="text-center">
                    {stat.icon && <div className="text-3xl mb-2">{stat.icon}</div>}
                    <div className="text-4xl font-black text-[#F37C28] mb-2">{stat.value}</div>
                    <div className="text-gray-600 font-medium text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* IEEE YP Worldwide */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              {data?.globalHeading || 'IEEE Young Professionals Worldwide'}
            </h2>
            <p className="text-gray-500 max-w-3xl mx-auto text-lg">
              {data?.globalIntro || 'IEEE Young Professionals is a global community spanning over 100 countries.'}
            </p>
          </div>

          {data?.globalMapImage && typeof data.globalMapImage === 'object' && (
            <div className="relative h-64 mb-8 rounded-3xl overflow-hidden bg-gray-50 border border-gray-100">
              <Image
                src={(data.globalMapImage as any).url}
                alt="World Map"
                fill
                className="object-contain"
              />
            </div>
          )}

          {videoId && (
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border-8 border-white bg-white">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="IEEE Young Professionals Worldwide"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0"
              />
            </div>
          )}
        </section>

        {/* Call to Action */}
        {data?.ctaButtons && (data.ctaButtons as any[]).length > 0 && (
          <section className="mb-20">
            <div className="bg-gray-50 rounded-3xl p-12 text-center border border-gray-100">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                {data?.ctaHeading || 'Want to be part of IEEE YPSL?'}
              </h2>
              {data?.ctaSubtext && (
                <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                  {data.ctaSubtext}
                </p>
              )}
              <div className="flex flex-wrap justify-center gap-4">
                {(data.ctaButtons as any[]).map((button: any, idx: number) => (
                  <Link
                    key={idx}
                    href={button.url}
                    className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 ${
                      button.style === 'primary' 
                        ? 'bg-[#F37C28] text-white hover:bg-[#d66a1f] shadow-lg hover:shadow-xl' 
                        : button.style === 'secondary'
                        ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg hover:shadow-xl'
                        : 'border-2 border-[#F37C28] text-[#F37C28] hover:bg-[#F37C28] hover:text-white'
                    }`}
                  >
                    {button.label}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
