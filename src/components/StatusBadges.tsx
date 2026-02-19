'use client'
import React from 'react'

export const StatusBadge: React.FC<{ cellData: string }> = ({ cellData }) => {
  const isPublished = cellData === 'published'
  
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 10px',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: '700',
      textTransform: 'uppercase',
      backgroundColor: isPublished ? '#ecfdf5' : '#f3f4f6',
      color: isPublished ? '#059669' : '#6b7280',
      border: `1px solid ${isPublished ? '#10b981' : '#d1d5db'}`
    }}>
      {cellData}
    </div>
  )
}

export const EventStatusBadge: React.FC<{ rowData: any }> = ({ rowData }) => {
  const startDate = rowData?.startDate ? new Date(rowData.startDate) : null
  const now = new Date()
  
  if (!startDate) return null

  const isUpcoming = startDate > now
  
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 10px',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: '700',
      textTransform: 'uppercase',
      backgroundColor: isUpcoming ? '#eff6ff' : '#fff1f2',
      color: isUpcoming ? '#2563eb' : '#e11d48',
      border: `1px solid ${isUpcoming ? '#3b82f6' : '#fda4af'}`
    }}>
      {isUpcoming ? 'Upcoming' : 'Expired'}
    </div>
  )
}
