(function () {
  var gallery = document.querySelector('.gallery-slideshow');
  if (!gallery) return;
  var slides = Array.from(gallery.querySelectorAll('.gallery-item'));
  var dots = gallery.querySelector('.gallery-dots');
  var play = gallery.querySelector('.gallery-play');
  var current = 0;
  var timer;
  var paused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hovering = false;

  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) { slide.hidden = i !== current; });
    Array.from(dots.children).forEach(function (dot, i) {
      dot.setAttribute('aria-current', i === current ? 'true' : 'false');
    });
    gallery.querySelector('.gallery-count').textContent = (current + 1) + ' / ' + slides.length;
  }

  function schedule() {
    clearInterval(timer);
    play.textContent = paused ? 'Play slideshow' : 'Pause slideshow';
    if (!paused && !hovering && !document.hidden && !gallery.contains(document.activeElement)) {
      timer = setInterval(function () {
        if (!document.querySelector('.mfp-wrap')) show(current + 1);
      }, 4500);
    }
  }

  function navigate(index) { show(index); schedule(); }
  slides.forEach(function (slide, i) {
    var dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'gallery-dot';
    dot.setAttribute('aria-label', 'Show photo ' + (i + 1));
    dot.addEventListener('click', function () { navigate(i); });
    dots.appendChild(dot);
  });
  gallery.querySelector('.gallery-prev').addEventListener('click', function () { navigate(current - 1); });
  gallery.querySelector('.gallery-next').addEventListener('click', function () { navigate(current + 1); });
  play.addEventListener('click', function () { paused = !paused; schedule(); });
  gallery.addEventListener('mouseenter', function () { hovering = true; schedule(); });
  gallery.addEventListener('mouseleave', function () { hovering = false; schedule(); });
  gallery.addEventListener('focusin', schedule);
  gallery.addEventListener('focusout', function () { setTimeout(schedule, 0); });
  document.addEventListener('visibilitychange', schedule);
  gallery.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      navigate(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  show(0);
  schedule();
})();
