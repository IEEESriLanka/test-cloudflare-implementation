'use client'
import React from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

const categories = [
  { label: 'YPSL', value: 'ypsl', icon: '📁' },
  { label: 'ExCom', value: 'executive-committees', icon: '📁' },
  { label: 'SubCom', value: 'standing-committees', icon: '📁' },
  { label: 'AI Driven', value: 'ai-driven-sri-lanka', icon: '📁' },
  { label: 'SL Inspire', value: 'sl-inspire', icon: '📁' },
  { label: 'Lets Talk', value: 'lets-talk', icon: '📁' },
  { label: 'INSL', value: 'insl', icon: '📁' },
  { label: 'StudPro', value: 'studpro', icon: '📁' },
  { label: 'Y2NPro', value: 'y2npro', icon: '📁' },
]

export const MediaFolders: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  // Extract current category from URL search params
  const currentCategory = searchParams.get('where[category][equals]')

  const handleCategoryClick = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (currentCategory === value) {
      params.delete('where[category][equals]')
    } else {
      params.set('where[category][equals]', value)
    }
    
    // Reset to page 1 when changing filters
    params.delete('page')
    
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div style={{ marginBottom: '2rem', marginTop: '1rem' }}>
      <h4 style={{ marginBottom: '1rem', fontWeight: 700, fontSize: '1.25rem' }}>Media Sections</h4>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', 
        gap: '1rem' 
      }}>
        {categories.map((cat) => {
          const isActive = currentCategory === cat.value;
          return (
            <div
              key={cat.value}
              onClick={() => handleCategoryClick(cat.value)}
              style={{
                padding: '1rem',
                borderRadius: '12px',
                backgroundColor: isActive ? 'var(--theme-primary-500)' : 'var(--theme-elevation-0)',
                color: isActive ? '#ffffff' : 'var(--theme-text)',
                border: isActive ? '1px solid var(--theme-primary-500)' : '1px solid var(--theme-elevation-150)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease',
                boxShadow: isActive ? '0 4px 12px rgba(243, 124, 40, 0.2)' : 'none',
              }}
              onMouseOver={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = 'var(--theme-primary-500)'
                  e.currentTarget.style.backgroundColor = 'var(--theme-elevation-50)'
                }
              }}
              onMouseOut={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = 'var(--theme-elevation-150)'
                  e.currentTarget.style.backgroundColor = 'var(--theme-elevation-0)'
                }
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>{cat.icon}</span>
              <span style={{ fontWeight: 600, fontSize: '0.85rem', textAlign: 'center' }}>{cat.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  )
}
