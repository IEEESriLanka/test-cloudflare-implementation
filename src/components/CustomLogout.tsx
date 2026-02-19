'use client'
import React from 'react'
import { Button, ConfirmationModal, useModal, useAuth } from '@payloadcms/ui'
import { Logout01Icon } from 'hugeicons-react'

const modalSlug = 'logout-confirmation'

export const CustomLogout: React.FC = () => {
  const { logOut } = useAuth()
  const { toggleModal } = useModal()

  return (
    <div className="custom-logout-wrapper" style={{ padding: '0 0.5rem', width: '100%' }}>
      <Button
        buttonStyle="primary"
        className="w-full flex items-center justify-center gap-3"
        icon={<Logout01Icon size={18} />}
        iconPosition="left"
        onClick={(e) => {
          e.preventDefault()
          toggleModal(modalSlug)
        }}
        size="medium"
      >
        Logout
      </Button>
      <ConfirmationModal
        body="Are you sure you want to log out? Any unsaved changes on the current page might be lost."
        cancelLabel="Cancel"
        confirmLabel="Confirm"
        heading="Confirm Logout"
        modalSlug={modalSlug}
        onConfirm={async () => {
          if (logOut) {
            await logOut()
            window.location.href = '/admin/login'
          }
        }}
      />
    </div>
  )
}
