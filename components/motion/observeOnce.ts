/**
 * Fires `onEnter` once when `el` first crosses into the viewport, then
 * disconnects. Replaces gsap ScrollTrigger's `once: true` triggers.
 */
export function observeOnce(el: Element, onEnter: () => void, rootMargin = '0px 0px -12% 0px') {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      onEnter()
      observer.disconnect()
    }
  }, { rootMargin })
  observer.observe(el)
  return () => observer.disconnect()
}
