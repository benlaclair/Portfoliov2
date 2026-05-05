import { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';

const navLinks = [
  { href: '/work', label: 'Work' },
  { href: '/tools', label: 'Tools' },
  { href: '/about', label: 'About' },
];

interface Props {
  pathname?: string;
}

export default function Navbar({ pathname = '' }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = useCallback(() => {
    setOpen(false);
    hamburgerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') { closeMenu(); return; }
      if (e.key !== 'Tab') return;
      const menu = menuRef.current;
      if (!menu) return;
      const focusable = menu.querySelectorAll<HTMLElement>('a, button, [tabindex]:not([tabindex="-1"])');
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
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
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-500 ${
        scrolled
          ? 'border-b border-[var(--color-line)] bg-[var(--color-bg)]/92 backdrop-blur-sm'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div
        className="wrap h-14 flex items-center justify-between"
        style={{ maxWidth: '1360px' }}
      >
        {/* Wordmark */}
        <a
          href="/"
          className="text-[var(--color-ink)] hover:text-[var(--color-accent)] transition-colors duration-200"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 800,
            fontSize: '1rem',
            letterSpacing: '-0.02em',
          }}
        >
          Ben LaClair
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-9">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className={`text-sm transition-colors duration-200 ${
                isActive(href)
                  ? 'text-[var(--color-ink)]'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]'
              }`}
            >
              {label}
            </a>
          ))}
          <a
            href="/contact"
            className="text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors duration-200"
          >
            Contact&nbsp;→
          </a>
        </nav>

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
      </div>

      {/* Mobile menu */}
      <div
        ref={menuRef}
        id="mobile-menu"
        role="dialog"
        aria-label="Navigation"
        className={`md:hidden overflow-hidden transition-all duration-300 bg-[var(--color-bg)] ${
          open ? 'max-h-80 border-b border-[var(--color-line)]' : 'max-h-0'
        }`}
      >
        <nav className="flex flex-col px-5 py-6 gap-0">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={closeMenu}
              className={`py-3 border-b border-[var(--color-line)] transition-colors duration-200 ${
                isActive(href) ? 'text-[var(--color-ink)]' : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]'
              }`}
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 800,
                fontSize: '1.75rem',
                letterSpacing: '-0.025em',
                lineHeight: 1.1,
              }}
            >
              {label}
            </a>
          ))}
          <a
            href="/contact"
            onClick={closeMenu}
            className="py-3 text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors duration-200"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              fontSize: '1.75rem',
              letterSpacing: '-0.025em',
              lineHeight: 1.1,
            }}
          >
            Contact →
          </a>
        </nav>
      </div>
    </header>
  );
}
