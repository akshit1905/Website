(function () {
  var carousel = document.querySelector('.supporters');
  if (!carousel) return;
  var slides = Array.from(carousel.querySelectorAll('.supporter-slide'));
  if (!slides.length) return;
  var stage = carousel.querySelector('.supporter-stage');
  var play = carousel.querySelector('.supporter-play');
  var motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var paused = motion.matches;
  var hovering = false;
  var current = 0;
  var timer;

  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.hidden = i !== current;
      slide.setAttribute('aria-label', (i + 1) + ' of ' + slides.length);
    });
    carousel.querySelector('.supporter-count').textContent = (current + 1) + ' / ' + slides.length;
  }

  function schedule() {
    clearInterval(timer);
    play.textContent = paused ? 'Play slideshow' : 'Pause slideshow';
    var automatic = !paused && !hovering && !document.hidden && !carousel.contains(document.activeElement);
    stage.setAttribute('aria-live', automatic ? 'off' : 'polite');
    if (automatic && slides.length > 1) {
      timer = setInterval(function () { show(current + 1); }, 3000);
    }
  }

  function navigate(direction) {
    show(current + direction);
    schedule();
  }

  carousel.querySelector('.supporter-prev').addEventListener('click', function () { navigate(-1); });
  carousel.querySelector('.supporter-next').addEventListener('click', function () { navigate(1); });
  play.addEventListener('click', function () { paused = !paused; schedule(); });
  carousel.addEventListener('mouseenter', function () { hovering = true; schedule(); });
  carousel.addEventListener('mouseleave', function () { hovering = false; schedule(); });
  carousel.addEventListener('focusin', schedule);
  carousel.addEventListener('focusout', function () { setTimeout(schedule, 0); });
  carousel.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      navigate(event.key === 'ArrowRight' ? 1 : -1);
    }
  });
  document.addEventListener('visibilitychange', schedule);
  motion.addEventListener('change', function () { paused = motion.matches; schedule(); });
  show(0);
  carousel.querySelector('.supporter-controls').hidden = slides.length < 2;
  schedule();
})();
