import { useState, useEffect, useRef, useCallback } from 'react';

const navLinks = [
  { href: '/work', label: 'Work' },
  { href: '/tools', label: 'Tools' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

interface Props {
  pathname?: string;
}

const displayFont = 'var(--font-sans)';
const monoFont = 'var(--font-mono)';

export default function Navbar({ pathname = '' }: Props) {
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState('-- : --');
  const [coords, setCoords] = useState('X:000 · Y:000');
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const tick = () => {
      try {
        const fmt = new Intl.DateTimeFormat('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone: 'America/New_York',
        });
        const parts = fmt.formatToParts(new Date());
        const h = parts.find((p) => p.type === 'hour')?.value ?? '00';
        const m = parts.find((p) => p.type === 'minute')?.value ?? '00';
        setTime(`${h} : ${m}`);
      } catch {
        const d = new Date();
        setTime(`${String(d.getHours()).padStart(2, '0')} : ${String(d.getMinutes()).padStart(2, '0')}`);
      }
    };

    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const isDesktop = window.matchMedia('(min-width: 1100px)').matches;
    if (!isDesktop) return;

    const handler = (e: MouseEvent) => {
      setCoords(`X:${String(e.clientX).padStart(3, '0')} · Y:${String(e.clientY).padStart(3, '0')}`);
    };

    window.addEventListener('pointermove', handler);
    return () => window.removeEventListener('pointermove', handler);
  }, []);

  const closeMenu = useCallback(() => {
    setOpen(false);
    hamburgerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        closeMenu();
        return;
      }
      if (e.key !== 'Tab') return;

      const menu = menuRef.current;
      if (!menu) return;

      const focusable = menu.querySelectorAll<HTMLElement>('a, button, [tabindex]:not([tabindex="-1"])');
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    const firstLink = menuRef.current?.querySelector<HTMLElement>('a');
    firstLink?.focus();

    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, closeMenu]);

  const isActive = (href: string) => (href === '/about' ? pathname === href : pathname.startsWith(href));

  return (
    <>
      <header
        ref={headerRef}
        id="site-nav"
        className="fixed top-0 inset-x-0 z-50 px-6 md:px-10 py-5 md:py-6 flex items-center justify-between"
        style={{ opacity: 0 }}
      >
        <a href="/" data-magnetic="0.3" aria-label="Ben LaClair — home" className="flex items-center gap-2.5 group">
          <svg
            viewBox="0 0 44 44"
            width="36"
            height="36"
            aria-hidden="true"
            style={{ color: 'var(--color-ink)', display: 'block', transition: 'color 0.3s ease' }}
          >
            <rect x="3" y="3" width="38" height="38" rx="12" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <path
              d="M13 31V12h10.2c4 0 6.4 1.9 6.4 5.1 0 1.9-1 3.4-2.8 4.2 2.4.6 3.8 2.3 3.8 4.8 0 3.3-2.6 4.9-7.2 4.9H13Zm5-11.1h4.1c1.5 0 2.4-.7 2.4-1.9s-.9-1.8-2.5-1.8H18v3.7Zm0 7h4.9c1.7 0 2.6-.7 2.6-2s-.9-2-2.7-2H18v4Z"
              fill="currentColor"
            />
            <circle cx="32" cy="12" r="3.2" fill="var(--color-accent)" />
          </svg>
          <span
            className="hidden md:block"
            style={{
              fontFamily: displayFont,
              fontWeight: 600,
              fontSize: '14px',
              letterSpacing: '-0.02em',
              color: 'var(--color-ink)',
            }}
          >
            Ben LaClair
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              data-magnetic="0.25"
              className="nav-link relative"
              style={{
                fontFamily: displayFont,
                fontSize: '13px',
                fontWeight: 500,
                letterSpacing: '-0.01em',
                color: isActive(href) ? 'var(--color-ink)' : 'var(--color-muted)',
                padding: '4px 0',
                transition: 'color 0.3s ease',
              }}
            >
              {label}
              {isActive(href) && (
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: '1px',
                    background: 'var(--color-accent)',
                  }}
                />
              )}
            </a>
          ))}
        </nav>

        <div
          className="hidden md:flex items-center gap-4"
          style={{
            fontFamily: monoFont,
            fontSize: '11px',
            letterSpacing: '0.08em',
            color: 'var(--color-muted)',
          }}
        >
          <span className="hidden lg:block">{coords}</span>
          <span>{time} EST</span>
        </div>

        <button
          ref={hamburgerRef}
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 -mr-2 flex flex-col justify-center gap-[5px]"
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <span
            className="block w-5 h-px bg-[var(--color-ink)] transition-all duration-200 origin-center"
            style={{ transform: open ? 'rotate(45deg) translateY(3px)' : 'none' }}
          />
          <span
            className="block w-5 h-px bg-[var(--color-ink)] transition-all duration-200 origin-center"
            style={{ transform: open ? 'rotate(-45deg) translateY(-3px)' : 'none' }}
          />
        </button>
      </header>

      <div
        ref={menuRef}
        id="mobile-menu"
        role="dialog"
        aria-label="Navigation"
        className="md:hidden"
        style={{
          position: 'fixed',
          inset: '64px 0 0 0',
          background: 'var(--color-bg)',
          transform: open ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 0.45s cubic-bezier(.7,0,.2,1)',
          padding: '40px 24px',
          zIndex: 49,
        }}
      >
        <nav className="flex flex-col">
          {navLinks.map(({ href, label }, index) => (
            <a
              key={href}
              href={href}
              onClick={closeMenu}
              className="py-3 border-b border-[var(--color-line)] flex items-baseline gap-4"
              style={{
                fontFamily: displayFont,
                fontWeight: 600,
                fontSize: '32px',
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                color: isActive(href) ? 'var(--color-ink)' : 'var(--color-ink-2)',
              }}
            >
              <span
                style={{
                  fontFamily: monoFont,
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  color: 'var(--color-muted)',
                  flexShrink: 0,
                }}
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              {label}
            </a>
          ))}
        </nav>
        <a
          href="mailto:hello@benlaclair.com"
          style={{
            display: 'block',
            marginTop: '40px',
            fontFamily: monoFont,
            fontSize: '13px',
            letterSpacing: '0.04em',
            color: 'var(--color-muted)',
          }}
        >
          hello@benlaclair.com →
        </a>
      </div>
    </>
  );
}
