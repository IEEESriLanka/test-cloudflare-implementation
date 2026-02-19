'use client'
import React from 'react'
import Image from 'next/image'
import { useTheme } from '@payloadcms/ui'

export const PayloadLogo: React.FC = () => {
  const { theme } = useTheme()
  const logoSrc = theme === 'dark' ? '/media/IEEE-YP-SL-Logo white.png' : '/media/IEEE-YP-SL-Logo.png'

  return (
    <div className="payload-logo">
      <Image
        src={logoSrc}
        alt="IEEE YP Sri Lanka Logo"
        width={300}
        height={150}
        style={{ width: '100%', height: 'auto', maxWidth: '250px' }}
      />
    </div>
  )
}
