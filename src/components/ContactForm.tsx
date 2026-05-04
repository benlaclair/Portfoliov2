import { useState, useRef } from 'react';

const field =
  'w-full bg-white border border-[var(--color-line)] rounded-xl px-4 py-3 text-[var(--color-ink)] placeholder:text-[var(--color-muted-soft)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-pop)] focus:border-transparent transition-shadow';

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
      <div className="border border-[var(--color-line)] rounded-2xl px-8 py-12 text-center bg-white">
        <p className="font-serif text-2xl text-[var(--color-ink)] mb-2">Message sent.</p>
        <p className="text-sm text-[var(--color-muted)] mb-6">I'll get back to you soon.</p>
        <button
          onClick={() => {
            setStatus('idle');
            requestAnimationFrame(() => nameRef.current?.focus());
          }}
          className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
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
        <input ref={nameRef} type="text" name="name" placeholder="Your name" required className={field} />
        <input type="email" name="email" placeholder="your@email.com" required className={field} />
      </div>
      <textarea
        name="message"
        placeholder="Tell me about your project…"
        required
        rows={6}
        className={`${field} resize-none`}
      />
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="bg-[var(--color-ink)] text-[var(--color-bg)] text-sm font-medium px-7 py-3 rounded-full hover:bg-[var(--color-pop)] transition-colors disabled:opacity-50"
        >
          {status === 'sending' ? 'Sending…' : 'Send message →'}
        </button>
        {status === 'error' && (
          <p className="text-sm text-red-600">
            Something went wrong.{' '}
            <button type="button" onClick={() => setStatus('idle')} className="underline">Try again</button>
          </p>
        )}
      </div>
    </form>
  );
}
