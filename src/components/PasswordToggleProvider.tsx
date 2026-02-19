'use client'
import React, { useEffect } from 'react'

/**
 * PasswordToggleProvider - Injects an eye button into password fields 
 * for both Login and User creation pages.
 */
export const PasswordToggleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const attachToggles = () => {
      const passwordFields = document.querySelectorAll('input[type="password"], input[data-password-toggle="true"]');
      
      passwordFields.forEach((field) => {
        const input = field as HTMLInputElement;
        
        // Prevent multiple buttons
        if (input.dataset.hasToggle === 'true') return;
        input.dataset.hasToggle = 'true';

        // Create toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'password-toggle-btn';
        toggleBtn.setAttribute('aria-label', 'Toggle password visibility');
        
        // Initial icon (Eye)
        toggleBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        `;

        // Wrap input if needed or just place next to it
        // Payload inputs are usually inside a div.field-type
        const parent = input.parentElement;
        if (parent) {
          parent.style.position = 'relative';
          parent.appendChild(toggleBtn);

          toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            
            // Update icon
            if (isPassword) {
              // View Off Icon
              toggleBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              `;
            } else {
              // Eye Icon
              toggleBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              `;
            }
          });
        }
      });
    };

    // Initial run
    attachToggles();

    // Watch for dynamic changes (e.g. navigating to User creation page)
    const observer = new MutationObserver(attachToggles);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return <>{children}</>;
};

export default PasswordToggleProvider;
