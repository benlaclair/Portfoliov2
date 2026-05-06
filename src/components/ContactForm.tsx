import { useState, useRef } from 'react';

const field: React.CSSProperties = {
  width: '100%',
  background: 'var(--color-paper)',
  border: '1px solid var(--color-line)',
  padding: '14px 16px',
  color: 'var(--color-ink)',
  fontSize: '14px',
  fontFamily: "var(--font-body)",
  outline: 'none',
  borderRadius: 0,
};

const fieldFocus: React.CSSProperties = {
  borderColor: 'var(--color-ink)',
};

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [focused, setFocused] = useState<string | null>(null);
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
      <div
        style={{
          border: '1px solid var(--color-line)',
          padding: '60px 40px',
          textAlign: 'center',
          background: 'var(--color-paper)',
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: '40px',
            color: 'var(--color-ink)',
            marginBottom: '12px',
            letterSpacing: '-0.02em',
          }}
        >
          Message sent.
        </p>
        <p style={{ fontSize: '14px', color: 'var(--color-ink-2)', marginBottom: '32px' }}>
          I'll get back to you soon.
        </p>
        <button
          onClick={() => {
            setStatus('idle');
            requestAnimationFrame(() => nameRef.current?.focus());
          }}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--color-ink-2)',
            border: 'none',
            background: 'transparent',
            cursor: 'none',
            borderBottom: '1px solid var(--color-line)',
            paddingBottom: '4px',
          }}
        >
          Send another →
        </button>
      </div>
    );
  }

  const fld = (name: string): React.CSSProperties => ({
    ...field,
    ...(focused === name ? fieldFocus : {}),
  });

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <input type="text" name="_gotcha" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <input
          ref={nameRef}
          type="text"
          name="name"
          placeholder="Your name"
          required
          style={fld('name')}
          onFocus={() => setFocused('name')}
          onBlur={() => setFocused(null)}
        />
        <input
          type="email"
          name="email"
          placeholder="your@email.com"
          required
          style={fld('email')}
          onFocus={() => setFocused('email')}
          onBlur={() => setFocused(null)}
        />
      </div>
      <textarea
        name="message"
        placeholder="Tell me about your project…"
        required
        rows={6}
        style={{ ...fld('message'), resize: 'none' }}
        onFocus={() => setFocused('message')}
        onBlur={() => setFocused(null)}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '8px' }}>
        <button
          type="submit"
          disabled={status === 'sending'}
          data-cursor="Send"
          data-magnetic="0.3"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            background: 'var(--color-ink)',
            color: 'var(--color-paper)',
            fontSize: '14px',
            fontWeight: 500,
            padding: '14px 28px',
            border: 'none',
            borderRadius: 0,
            opacity: status === 'sending' ? 0.5 : 1,
            transition: 'background 0.4s ease',
            cursor: 'none',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-accent)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--color-ink)')}
        >
          {status === 'sending' ? 'Sending…' : 'Send message'}
          <span>→</span>
        </button>
        {status === 'error' && (
          <p style={{ fontSize: '13px', color: '#c2410c' }}>
            Something went wrong.{' '}
            <button
              type="button"
              onClick={() => setStatus('idle')}
              style={{ textDecoration: 'underline', background: 'transparent', border: 'none', color: 'inherit', cursor: 'none' }}
            >
              Try again
            </button>
          </p>
        )}
      </div>
    </form>
  );
}
