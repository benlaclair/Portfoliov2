import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  window.addEventListener('resize', () => ScrollTrigger.refresh());
}

export const ease = {
  out: 'power3.out',
  expo: 'expo.out',
  expoInOut: 'expo.inOut',
  power2: 'power2.out',
  power1InOut: 'power1.inOut',
} as const;

const mq = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-reduced-motion: reduce)')
  : null;

export const reduceMotion = {
  get current() {
    return mq?.matches ?? false;
  },
  onChange(cb: (reduced: boolean) => void) {
    mq?.addEventListener('change', (e) => cb(e.matches));
  },
};

export function revealLines(
  selector: string,
  opts: { delay?: number; stagger?: number; duration?: number } = {},
) {
  if (reduceMotion.current) return;
  gsap.set(selector, { y: '110%' });
  gsap.to(selector, {
    y: '0%',
    duration: opts.duration ?? 1.1,
    ease: ease.expo,
    stagger: opts.stagger ?? 0,
    delay: opts.delay ?? 0.1,
  });
}

export { gsap, ScrollTrigger };
