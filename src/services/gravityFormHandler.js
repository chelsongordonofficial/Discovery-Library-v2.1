import { useEffect, useState } from 'react';

/**
 * Gravity Forms Lifecycle and Confirmation Handler for WordPress Integration
 * 
 * Supports:
 * - Native WordPress Gravity Forms jQuery hook: `gform_confirmation_loaded`
 * - DOM MutationObserver detection for AJAX injected confirmation messages (.gform_confirmation_message, .gform_confirmation_wrapper)
 * - Auto-detection of form injection to seamlessly conceal placeholders
 * - Auto-scroll and confirmation event notifications
 */
export function useGravityFormMount(mountId, onConfirmation) {
  const [hasConfirmed, setHasConfirmed] = useState(false);

  useEffect(() => {
    if (!mountId || typeof window === 'undefined') return;

    let targetEl = document.getElementById(mountId);
    if (!targetEl) return;

    const handleConfirmationFound = (confEl) => {
      setHasConfirmed(true);
      targetEl.classList.add('gform-confirmed');
      if (confEl && typeof confEl.scrollIntoView === 'function') {
        confEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      if (onConfirmation) {
        onConfirmation(confEl?.textContent || 'Submission confirmed!');
      }
    };

    // 1. Check if confirmation message is already present
    const existing = targetEl.querySelector(
      '.gform_confirmation_message, .gform_confirmation_wrapper, [id^="gform_confirmation_message_"]'
    );
    if (existing) {
      handleConfirmationFound(existing);
    }

    // 2. MutationObserver: listen for AJAX injection of Gravity Form and confirmation container
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'childList' && m.addedNodes.length > 0) {
          const conf = targetEl.querySelector(
            '.gform_confirmation_message, .gform_confirmation_wrapper, [id^="gform_confirmation_message_"]'
          );
          if (conf) {
            handleConfirmationFound(conf);
            break;
          }
        }
      }
    });

    observer.observe(targetEl, { childList: true, subtree: true });

    // 3. WordPress jQuery hook: gform_confirmation_loaded
    const handleJQueryConfirmation = (event, formId) => {
      const conf = targetEl.querySelector(
        '.gform_confirmation_message, .gform_confirmation_wrapper, [id^="gform_confirmation_message_"]'
      );
      handleConfirmationFound(conf);
    };

    if (window.jQuery) {
      window.jQuery(document).on('gform_confirmation_loaded', handleJQueryConfirmation);
    }

    // 4. Native DOM event listener
    const handleNativeEvent = (e) => {
      if (e.target && targetEl.contains(e.target)) {
        handleConfirmationFound(e.target);
      }
    };
    document.addEventListener('gform_confirmation_loaded', handleNativeEvent);

    return () => {
      observer.disconnect();
      if (window.jQuery) {
        window.jQuery(document).off('gform_confirmation_loaded', handleJQueryConfirmation);
      }
      document.removeEventListener('gform_confirmation_loaded', handleNativeEvent);
    };
  }, [mountId, onConfirmation]);

  return { hasConfirmed };
}
