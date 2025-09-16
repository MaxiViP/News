import type { Directive } from 'vue'

export const reveal: Directive<HTMLElement, string | void> = {
  mounted(el, binding) {
    el.style.opacity = '0'
    const delay = binding.value ? Number(binding.value) : 0
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          setTimeout(() => {
            el.classList.add('animate-fade-up')
            el.style.opacity = '1'
          }, delay)
          obs.unobserve(el)
        }
      })
    }, { rootMargin: '0px 0px -10% 0px' })
    io.observe(el)
  }
}
