import { forwardRef } from 'react';
import { resolveUrl } from '../../data/urls';
import { useRouter } from '../../context/RouterContext';

/**
 * Universal Link component.
 * Routes internally within the single React app without page reloads or redirects.
 */
const Link = forwardRef(function Link({ to, href, onClick, children, ...rest }, ref) {
  const { navigate } = useRouter();
  const targetHref = resolveUrl(to || href);
  const isExternal =
    targetHref.startsWith('http://') ||
    targetHref.startsWith('https://') ||
    targetHref.startsWith('mailto:') ||
    targetHref.startsWith('tel:');

  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (!isExternal && !targetHref.startsWith('#') && !e.defaultPrevented) {
      e.preventDefault();
      navigate(targetHref);
    }
  };

  return (
    <a
      ref={ref}
      href={isExternal ? targetHref : `#${targetHref}`}
      onClick={handleClick}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      {...rest}
    >
      {children}
    </a>
  );
});

export default Link;