import { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';

const navLinks = [
  { href: '/work', label: 'Work' },
  { href: '/tools', label: 'Tools' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

interface Props {
  pathname?: string;
}

export default function Navbar({ pathname = '' }: Props) {
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState('—— : ——');
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  // Live EST clock
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

  // GSAP mobile menu link stagger on open
  useEffect(() => {
    if (!open || !menuRef.current) return;
    const links = menuRef.current.querySelectorAll<HTMLElement>('.mobile-menu__link');
    gsap.fromTo(
      links,
      { y: 30, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, stagger: 0.05, duration: 0.55, ease: 'power3.out', delay: 0.15 }
    );
  }, [open]);

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

  const isActive = (href: string) =>
    href === '/about' ? pathname === href : pathname.startsWith(href);

  return (
    <header
      ref={headerRef}
      id="site-nav"
      className="fixed top-0 inset-x-0 z-50 px-6 md:px-10 py-6 md:py-7 flex items-center justify-between"
      style={{ opacity: 0 }}
    >
      {/* SVG B-mark + wordmark */}
      <a
        href="/"
        data-magnetic="0.3"
        className="inline-flex items-center gap-3"
        aria-label="Ben LaClair — Home"
      >
        <svg
          className="brand-mark"
          viewBox="0 0 44 44"
          aria-hidden="true"
          width="36"
          height="36"
          style={{ color: 'var(--color-ink)', flexShrink: 0 }}
        >
          <rect x="3" y="3" width="38" height="38" rx="12" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <path d="M13 31V12h10.2c4 0 6.4 1.9 6.4 5.1 0 1.9-1 3.4-2.8 4.2 2.4.6 3.8 2.3 3.8 4.8 0 3.3-2.6 4.9-7.2 4.9H13Zm5-11.1h4.1c1.5 0 2.4-.7 2.4-1.9s-.9-1.8-2.5-1.8H18v3.7Zm0 7h4.9c1.7 0 2.6-.7 2.6-2s-.9-2-2.7-2H18v4Z" fill="currentColor" />
          <circle cx="32" cy="12" r="3.2" fill="var(--color-accent)" />
        </svg>
        <span
          style={{
            fontFamily: "'Clash Display', sans-serif",
            fontWeight: 600,
            fontSize: '15px',
            letterSpacing: '-0.02em',
            color: 'var(--color-ink)',
            lineHeight: 1,
          }}
        >
          Ben LaClair
        </span>
      </a>

      {/* Desktop links */}
      <nav className="hidden md:flex items-center gap-9">
        {navLinks.map(({ href, label }) => (
          <a
            key={href}
            href={href}
            data-magnetic="0.25"
            className="nav-link relative"
            style={{
              fontSize: '13px',
              fontWeight: 500,
              fontFamily: "'Satoshi', sans-serif",
              color: isActive(href) ? 'var(--color-ink)' : 'var(--color-ink-2)',
              padding: '4px 0',
              transition: 'color 0.3s ease',
            }}
          >
            {label}
            {isActive(href) && (
              <span
                style={{
                  position: 'absolute',
                  left: 0, right: 0, bottom: 0,
                  height: '1px',
                  background: 'var(--color-ink)',
                }}
              />
            )}
          </a>
        ))}
      </nav>

      {/* Right: coordinate readout + clock */}
      <div className="hidden md:flex items-center gap-6">
        <span
          data-coordinates
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '10px',
            letterSpacing: '0.08em',
            color: 'var(--color-muted)',
            minWidth: '130px',
            textAlign: 'right',
          }}
        >
          X:000 · Y:000
        </span>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            letterSpacing: '0.08em',
            color: 'var(--color-ink-2)',
          }}
        >
          {time} EST
        </span>
      </div>

      {/* Mobile toggle */}
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

      {/* Mobile menu — clip-path circle reveal from top-right */}
      <div
        ref={menuRef}
        id="mobile-menu"
        role="dialog"
        aria-label="Navigation"
        className="md:hidden"
        style={{
          position: 'fixed',
          inset: 0,
          background: 'var(--color-dark-bg)',
          clipPath: open
            ? 'circle(140% at calc(100% - 32px) 32px)'
            : 'circle(0% at calc(100% - 32px) 32px)',
          transition: 'clip-path 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: open ? 'auto' : 'none',
          padding: '100px 24px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <nav className="flex flex-col">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={closeMenu}
              className="mobile-menu__link py-4 border-b"
              style={{
                borderColor: 'var(--color-dark-line)',
                fontFamily: "'Clash Display', sans-serif",
                fontWeight: 500,
                fontSize: '40px',
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                color: isActive(href) ? 'var(--color-accent)' : 'var(--color-dark-ink)',
                opacity: 0,
              }}
            >
              {label}
            </a>
          ))}
        </nav>

        <div
          style={{
            marginTop: 'auto',
            paddingTop: '40px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            letterSpacing: '0.08em',
            color: 'var(--color-dark-muted)',
          }}
        >
          {time} EST
        </div>
      </div>
    </header>
  );
}
