'use client'
import React from 'react'
import { Home01Icon } from 'hugeicons-react'

export const PayloadIcon: React.FC = () => {
  return (
    <div className="payload-icon flex items-center justify-center">
      <Home01Icon 
        size={20} 
        variant="solid"
        className="text-[#002855] dark:text-[#f1f5f9]"
      />
    </div>
  )
}
