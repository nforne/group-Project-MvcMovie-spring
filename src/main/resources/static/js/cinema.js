(function () {
  const trailerModalEl = document.getElementById('trailerModal');
  const trailerVideo = document.getElementById('trailerVideo');
  const trailerSource = document.getElementById('trailerSource');

  // Delegate click events for play buttons
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.play-overlay');
    if (!btn) return;
    if (btn.classList.contains('disabled')) return;
    const src = btn.getAttribute('data-video-src') || '';
    if (!src) return;
    if (trailerSource.getAttribute('src') !== src) {
      try { trailerVideo.pause(); } catch (err) {}
      trailerSource.setAttribute('src', src);
      trailerVideo.load();
    }
    // small delay to allow modal animation
    setTimeout(() => { trailerVideo.play().catch(()=>{}); }, 250);
  });

  // Pause and reset when modal closes
  if (trailerModalEl) {
    trailerModalEl.addEventListener('hidden.bs.modal', function () {
      try { trailerVideo.pause(); trailerVideo.currentTime = 0; } catch (e) {}
      // Optionally clear source to free memory:
      // trailerSource.setAttribute('src', '');
      // trailerVideo.load();
    });
  }
})();
