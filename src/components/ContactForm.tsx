import { useState, useRef } from 'react';

const field =
  'w-full bg-[var(--color-surface)] border border-[var(--color-line)] px-4 py-3 text-[var(--color-ink)] placeholder:text-[var(--color-muted)] text-sm focus:outline-none focus:border-[var(--color-ink)] transition-colors duration-200';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const nameRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/contact', { method: 'POST', body: data });
      if (res.ok) {
        setStatus('sent');
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div className="border-t border-[var(--color-line)] pt-10">
        <p
          className="text-[var(--color-ink)] mb-2"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '1.75rem', letterSpacing: '-0.025em', lineHeight: 1.1 }}
        >Message sent.</p>
        <p className="text-sm text-[var(--color-muted)] mb-8">I’ll get back to you soon.</p>
        <button
          onClick={() => {
            setStatus('idle');
            requestAnimationFrame(() => nameRef.current?.focus());
          }}
          className="text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors duration-200"
        >
          Send another →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          ref={nameRef}
          type="text"
          name="name"
          placeholder="Your name"
          required
          className={field}
        />
        <input
          type="email"
          name="email"
          placeholder="your@email.com"
          required
          className={field}
        />
      </div>
      <textarea
        name="message"
        placeholder="Tell me about your project…"
        required
        rows={6}
        className={`${field} resize-none`}
      />

      <div className="flex items-center gap-6 mt-1">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="text-sm text-[var(--color-ink)] border border-[var(--color-ink)] px-6 py-3 hover:bg-[var(--color-ink)] hover:text-[var(--color-bg)] transition-colors duration-200 disabled:opacity-40"
        >
          {status === 'sending' ? 'Sending…' : 'Send message →'}
        </button>
        {status === 'error' && (
          <p className="text-sm" style={{ color: '#dc2626' }}>
            Something went wrong.{' '}
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="underline"
            >Try again</button>
          </p>
        )}
      </div>
    </form>
  );
}
