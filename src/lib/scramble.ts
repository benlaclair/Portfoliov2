/**
 * scramble — per-character scramble-then-settle text reveal.
 *
 * Each codepoint of `finalText` is wrapped in a span. The span cycles
 * through random glyphs at `tickInterval` ms until its scramble window
 * (delay = index * charStagger, duration = charDuration) expires; then
 * it snaps to the final glyph and switches state from .is-scrambling
 * (dimmed) to .is-settled (full color). Spaces and newlines pass through
 * unscrambled. Returns a handle that can `cancel()` mid-animation.
 *
 * No GSAP, no Splitting.js. ~80 lines including types.
 */

const DEFAULT_GLYPHS = '!<>-_\\/[]{}—=+*^?#';

export interface ScrambleOptions {
  /** ms between adjacent character starts (default 30) */
  charStagger?: number;
  /** ms each character scrambles before settling (default 600) */
  charDuration?: number;
  /** ms between random glyph swaps during scramble (default 30) */
  tickInterval?: number;
  /** pool of random chars (default '!<>-_\\/[]{}—=+*^?#') */
  glyphs?: string;
  /** fires once the last character has settled */
  onComplete?: () => void;
}

export interface ScrambleHandle {
  /** bail out, snap to final text immediately */
  cancel: () => void;
}

export function scramble(
  el: HTMLElement,
  finalText: string,
  options: ScrambleOptions = {},
): ScrambleHandle {
  const charStagger = options.charStagger ?? 30;
  const charDuration = options.charDuration ?? 600;
  const tickInterval = options.tickInterval ?? 30;
  const glyphs = options.glyphs ?? DEFAULT_GLYPHS;
  const onComplete = options.onComplete;

  const chars = Array.from(finalText);
  const charSpans: HTMLSpanElement[] = [];
  el.textContent = '';

  for (const char of chars) {
    const span = document.createElement('span');
    span.className = 'scramble-char';
    if (char === ' ' || char === '\n' || char === '\t') {
      span.textContent = char;
      span.classList.add('is-settled');
    } else {
      span.textContent = char;
      span.classList.add('is-scrambling');
    }
    el.appendChild(span);
    charSpans.push(span);
  }

  const intervals: number[] = [];
  const timeouts: number[] = [];
  let settledCount = 0;
  const total = chars.filter((c) => c !== ' ' && c !== '\n' && c !== '\t').length;
  let cancelled = false;

  const finishOne = (span: HTMLSpanElement, finalGlyph: string) => {
    span.textContent = finalGlyph;
    span.classList.remove('is-scrambling');
    span.classList.add('is-settled');
    settledCount += 1;
    if (settledCount >= total && onComplete) onComplete();
  };

  chars.forEach((char, idx) => {
    if (char === ' ' || char === '\n' || char === '\t') return;
    const span = charSpans[idx];
    const startDelay = idx * charStagger;

    const startTimeout = window.setTimeout(() => {
      if (cancelled) return;
      const intervalId = window.setInterval(() => {
        span.textContent = glyphs[(Math.random() * glyphs.length) | 0];
      }, tickInterval);
      intervals.push(intervalId);

      const settleTimeout = window.setTimeout(() => {
        window.clearInterval(intervalId);
        finishOne(span, char);
      }, charDuration);
      timeouts.push(settleTimeout);
    }, startDelay);
    timeouts.push(startTimeout);
  });

  return {
    cancel() {
      if (cancelled) return;
      cancelled = true;
      intervals.forEach((id) => window.clearInterval(id));
      timeouts.forEach((id) => window.clearTimeout(id));
      chars.forEach((char, idx) => {
        const span = charSpans[idx];
        if (!span) return;
        span.textContent = char;
        span.classList.remove('is-scrambling');
        span.classList.add('is-settled');
      });
    },
  };
}
