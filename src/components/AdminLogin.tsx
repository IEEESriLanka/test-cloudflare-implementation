'use client'
import React from 'react';
import Image from 'next/image';
import { useTheme } from '@payloadcms/ui';

/**
 * Custom Login Header Component
 * This component handles the header of the login card.
 */
export const AdminLoginHeader: React.FC = () => {
  const { theme } = useTheme();
  
  // Determine which logo to use based on theme
  const logoSrc = theme === 'dark' 
    ? '/media/IEEE-YP-SL-Logo white.png' 
    : '/media/IEEE-YP-SL-Logo.png';

  return (
    <div className="custom-login-wrapper">
      <div className="login-visuals">
        <Image 
          src={logoSrc}
          alt="IEEE Young Professionals Sri Lanka" 
          width={320} 
          height={120} 
          className="login-header-logo"
          priority
        />
        <h1 className="login-main-title">CMS Login</h1>
        <p className="login-main-subtitle">Access your project management hub</p>
      </div>
    </div>
  );
};

// Also export as AdminLogin to satisfy existing import maps and avoid build errors
export const AdminLogin = AdminLoginHeader;

/**
 * Custom Login Footer Component
 * This component handles the footer content (legal text) below the login form.
 */
export const AdminLoginFooter: React.FC = () => {
  return (
    <div className="login-footer-legal">
      <p className="legal-warning">Authorized Personnel Only</p>
      <p className="legal-copyright">© {new Date().getFullYear()} IEEE Young Professionals Sri Lanka</p>
    </div>
  );
};

export default AdminLogin;
