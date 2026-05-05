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
      {/* Wordmark — italic Ben. */}
      <a
        href="/"
        data-magnetic="0.3"
        className="inline-block"
        style={{
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontStyle: 'italic',
          fontSize: '24px',
          letterSpacing: '-0.02em',
          color: 'var(--color-ink)',
          lineHeight: 1,
        }}
      >
        Ben<span style={{ color: 'var(--color-accent)' }}>.</span>
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

      {/* Right: live EST clock */}
      <div
        className="hidden md:block"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '11px',
          letterSpacing: '0.08em',
          color: 'var(--color-ink-2)',
        }}
      >
        {time} EST
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

      {/* Mobile menu */}
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
        }}
      >
        <nav className="flex flex-col">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={closeMenu}
              className="py-3 border-b border-[var(--color-line)]"
              style={{
                fontFamily: "'Inter Tight Variable', 'Inter Tight', sans-serif",
                fontWeight: 500,
                fontSize: '32px',
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                color: isActive(href) ? 'var(--color-ink)' : 'var(--color-ink-2)',
              }}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
