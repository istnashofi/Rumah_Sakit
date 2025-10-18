document.addEventListener("DOMContentLoaded", () => {
  // Highlight link aktif berdasarkan lokasi file
  try {
    const current = location.pathname.split("/").pop() || "index.html"
    document.querySelectorAll(".menu a").forEach((a) => {
      const href = a.getAttribute("href")
      if (href === current) a.setAttribute("aria-current", "page")
    })
  } catch {}

  // Modal Login
  const modal = document.getElementById("loginModal")
  const openers = document.querySelectorAll("[data-login-open]")
  const closers = document.querySelectorAll("[data-login-close]")
  let lastFocus = null

  function openModal() {
    lastFocus = document.activeElement
    modal?.setAttribute("aria-hidden", "false")
    // fokus ke input pertama
    const firstInput = modal?.querySelector("input,button,textarea,select")
    if (firstInput instanceof HTMLElement) firstInput.focus()
    document.body.style.overflow = "hidden"
  }
  function closeModal() {
    modal?.setAttribute("aria-hidden", "true")
    document.body.style.overflow = ""
    if (lastFocus && lastFocus instanceof HTMLElement) lastFocus.focus()
  }
  openers.forEach((btn) => btn.addEventListener("click", openModal))
  closers.forEach((btn) => btn.addEventListener("click", closeModal))
  modal?.addEventListener("click", (e) => {
    if (e.target?.matches?.(".modal-backdrop")) closeModal()
  })
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal()
  })
  // Set default hidden
  if (modal && !modal.hasAttribute("aria-hidden")) modal.setAttribute("aria-hidden", "true")

  // Back to top
  const backToTop = document.getElementById("backToTop")
  const toggleTop = () => {
    if (window.scrollY > 240) backToTop?.classList.add("visible")
    else backToTop?.classList.remove("visible")
  }
  window.addEventListener("scroll", toggleTop, { passive: true })
  backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }))
  toggleTop()

  // Carousel (hanya jika ada)
  const carousel = document.querySelector("[data-carousel]")
  if (carousel) initCarousel(carousel)
})

function initCarousel(root) {
  const track = root.querySelector(".carousel-track")
  const slides = Array.from(root.querySelectorAll(".carousel-slide"))
  const prevBtn = root.querySelector("[data-carousel-prev]")
  const nextBtn = root.querySelector("[data-carousel-next]")
  const dotsWrap = root.querySelector(".carousel-dots")
  let index = 0
  let timer = null
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches

  // Build dots
  slides.forEach((_, i) => {
    const btn = document.createElement("button")
    btn.type = "button"
    btn.setAttribute("role", "tab")
    btn.setAttribute("aria-label", `Slide ${i + 1}`)
    btn.addEventListener("click", () => goTo(i))
    dotsWrap.appendChild(btn)
  })

  function update() {
    const width = root.querySelector(".carousel-viewport").clientWidth
    track.style.transform = `translateX(-${index * width}px)`
    slides.forEach((s, i) => s.classList.toggle("is-active", i === index))
    dotsWrap.querySelectorAll("button").forEach((b, i) => {
      if (i === index) b.setAttribute("aria-selected", "true")
      else b.removeAttribute("aria-selected")
    })
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length
    update()
  }
  function next() {
    goTo(index + 1)
  }
  function prev() {
    goTo(index - 1)
  }

  nextBtn?.addEventListener("click", next)
  prevBtn?.addEventListener("click", prev)
  window.addEventListener("resize", update)

  // Autoplay
  function start() {
    if (reduceMotion) return
    stop()
    timer = setInterval(next, 5000)
  }
  function stop() {
    if (timer) clearInterval(timer)
    timer = null
  }
  root.addEventListener("mouseenter", stop)
  root.addEventListener("mouseleave", start)

  // init
  update()
  start()
}
