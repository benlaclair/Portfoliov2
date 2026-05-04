import { useState, useEffect, useRef, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
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
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = useCallback(() => {
    setOpen(false);
    hamburgerRef.current?.focus();
  }, []);

  useGSAP(() => {
    if (!headerRef.current) return;
    gsap.from(headerRef.current, {
      y: -12,
      opacity: 0,
      duration: 0.5,
      ease: 'power3.out',
    });
  }, { scope: headerRef });

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
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[var(--color-bg)]/85 backdrop-blur-md border-b border-[var(--color-line)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 h-16 md:h-20 flex items-center justify-between">
        <a href="/" className="font-serif text-xl md:text-2xl tracking-tight text-[var(--color-ink)] hover:text-[var(--color-pop)] transition-colors">
          Ben&nbsp;LaClair
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className={`text-sm transition-colors relative ${
                isActive(href)
                  ? 'text-[var(--color-ink)] font-medium'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]'
              }`}
            >
              {label}
              {isActive(href) && (
                <span className="absolute -bottom-1.5 left-0 right-0 h-px bg-[var(--color-ink)]" />
              )}
            </a>
          ))}
          <a
            href="/contact"
            className="text-sm font-medium px-4 py-2 rounded-full bg-[var(--color-ink)] text-[var(--color-bg)] hover:bg-[var(--color-pop)] transition-colors"
          >
            Get in touch
          </a>
        </nav>

        <button
          ref={hamburgerRef}
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-1.5 p-2 -mr-2"
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <span className={`w-5 h-px bg-[var(--color-ink)] transition-transform duration-300 origin-center ${open ? 'rotate-45 translate-y-[3px]' : ''}`} />
          <span className={`w-5 h-px bg-[var(--color-ink)] transition-transform duration-300 origin-center ${open ? '-rotate-45 -translate-y-[3px]' : ''}`} />
        </button>
      </div>

      <div
        ref={menuRef}
        id="mobile-menu"
        role="dialog"
        aria-label="Navigation menu"
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? 'max-h-96 opacity-100 border-t border-[var(--color-line)]' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col gap-1 px-6 py-4 bg-[var(--color-bg)]">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={closeMenu}
              className={`text-lg py-3 transition-colors ${
                isActive(href)
                  ? 'font-medium text-[var(--color-ink)]'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]'
              }`}
            >
              {label}
            </a>
          ))}
          <a
            href="/contact"
            onClick={closeMenu}
            className="text-base font-medium mt-2 px-4 py-3 rounded-full bg-[var(--color-ink)] text-[var(--color-bg)] text-center"
          >
            Get in touch
          </a>
        </div>
      </div>
    </header>
  );
}
