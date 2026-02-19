'use client'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@payloadcms/ui'

/**
 * HeaderUserProvider - Injects the logged-in user's name/email into the Payload header bar.
 */
export const HeaderUserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && user) {
      const injectUser = () => {
        // Broaden the search for the account/profile section and the header bar
        // Payload 3.0 uses various classes like .app-header, .template-default__header, etc.
        const accountSection = document.querySelector('.account, a[href*="/account"], .nav__controls .account');
        const header = document.querySelector('header, .app-header, .template-default__header');
        
        if (header && accountSection && !document.getElementById('custom-header-user')) {
          const userElement = document.createElement('div');
          userElement.id = 'custom-header-user';
          userElement.className = 'custom-header-user';
          userElement.innerText = user.name || user.email;

          // Standard is to place the name to the left of the profile icon
          accountSection.parentNode?.insertBefore(userElement, accountSection);
        } else if (header && !accountSection && !document.getElementById('custom-header-user')) {
          // Fallback: If we find the header but not the account icon, append to the right
          const userElement = document.createElement('div');
          userElement.id = 'custom-header-user';
          userElement.className = 'custom-header-user fallback';
          userElement.innerText = user.name || user.email;
          header.appendChild(userElement);
        }
      };

      // Periodic check as a fallback to MutationObserver
      const intervalId = setInterval(injectUser, 1000);

      // Mutation observer to handle dynamic rendering
      const observer = new MutationObserver(injectUser);
      observer.observe(document.body, { childList: true, subtree: true });

      return () => {
        clearInterval(intervalId);
        observer.disconnect();
      };
    }
  }, [mounted, user]);

  return <>{children}</>
}

export default HeaderUserProvider;
