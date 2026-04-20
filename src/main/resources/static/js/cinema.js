// src/main/resources/static/js/cinema.js
// Complete player wiring for the fixed video-box + footer layout.
// - Single progress bar (seek)
// - Footer is permanent and visible; video is constrained to the video-box above it
// - Measures footer height and clamps media to the video-box
// - Works for MP4 and MP3; supports optional data-aspect="phone"
// - Requires the HTML structure provided earlier (video-box, playerWrapper, controls footer)

document.addEventListener('DOMContentLoaded', function () {
  const modal = document.getElementById('trailerModal');
  if (!modal) return;

  const videoBox = document.querySelector('.video-box');
  const playerWrapper = document.getElementById('playerWrapper');
  const video = document.getElementById('playerVideo');
  const audio = document.getElementById('playerAudio');
  const audioWrapper = document.getElementById('audioWrapper');
  const controlsFooter = document.querySelector('.controls-footer');

  const btnPlay = document.getElementById('btnPlayPause');
  const btnRepeat = document.getElementById('btnRepeat');
  const btnFs = document.getElementById('btnFullscreen');
  const vol = document.getElementById('volumeRange');
  const rate = document.getElementById('rateSelect');
  const progress = document.getElementById('progressRange');
  const timeDisplay = document.getElementById('timeDisplay');

  let active = null; // 'video' or 'audio'

  function isAudio(src) {
    return /\.(mp3|m4a|wav|ogg)(\?.*)?$/i.test(src);
  }

  function clearMedia() {
    try { if (video) { video.pause(); video.removeAttribute('src'); video.load(); } } catch (e) {}
    try { if (audio) { audio.pause(); audio.removeAttribute('src'); audio.load(); } } catch (e) {}
    active = null;
    if (btnPlay) btnPlay.textContent = 'Play';
    if (progress) progress.value = 0;
    if (timeDisplay) timeDisplay.textContent = '00:00 / 00:00';
    if (playerWrapper) playerWrapper.classList.remove('phone');
    // remove inline sizing so CSS takes over next open
    if (video) {
      video.style.maxHeight = '';
      video.style.width = '';
      video.style.height = '';
      video.style.objectFit = '';
    }
  }

  // Measure footer height and clamp the video-box area
  function updateLayoutClamp() {
    if (!videoBox || !controlsFooter || !playerWrapper) return;
    // compute available height for video-box inside modal-content
    const modalContent = videoBox.closest('.modal-content');
    if (!modalContent) return;

    // footer height (computed)
    const footerRect = controlsFooter.getBoundingClientRect();
    const footerHeight = Math.ceil(footerRect.height) || 80;

    // modal content inner height
    const modalRect = modalContent.getBoundingClientRect();
    const modalInnerHeight = Math.max(0, modalRect.height);

    // compute video-box height = modalInnerHeight - footerHeight - headerHeight (header included in modal)
    const header = modalContent.querySelector('.modal-header');
    const headerHeight = header ? Math.ceil(header.getBoundingClientRect().height) : 0;

    const availableForVideo = Math.max(120, modalInnerHeight - footerHeight - headerHeight);

    // set explicit height on videoBox so media fits exactly
    videoBox.style.height = `${availableForVideo}px`;

    // apply clamp to media element
    if (video) {
      video.style.objectFit = 'contain';
      video.style.width = '100%';
      video.style.height = '100%';
      video.style.maxWidth = '100%';
      video.style.maxHeight = '100%';
    }
  }

  // Open media in modal; aspect optional ('phone' for tall reels)
  function open(src, aspect) {
    if (!src) return;

    // set aspect class before measuring so phone layout is measured correctly
    if (aspect === 'phone') playerWrapper.classList.add('phone');
    else playerWrapper.classList.remove('phone');

    // ensure native controls are off
    if (video) video.controls = false;
    if (audio) audio.controls = false;

    // show modal first so measurements are accurate
    bootstrap.Modal.getOrCreateInstance(modal).show();

    // small delay to allow modal to render, then set sources and play
    setTimeout(() => {
      updateLayoutClamp();

      if (isAudio(src)) {
        active = 'audio';
        audioWrapper.style.display = '';
        video.style.display = 'none';
        audio.src = src;
        audio.load();
        audio.play().catch(()=>{});
      } else {
        active = 'video';
        audioWrapper.style.display = 'none';
        video.style.display = '';
        video.src = src;
        video.load();
        // ensure sizing applied before play
        updateLayoutClamp();
        setTimeout(() => {
          video.play().catch(()=>{});
        }, 80);
      }
      syncControls();
    }, 80);
  }

  // Delegate poster/play clicks (supports optional data-aspect)
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.play-overlay');
    if (!btn) return;
    if (btn.classList.contains('disabled')) return;
    const src = btn.getAttribute('data-src') || btn.getAttribute('data-video-src') || btn.getAttribute('data-audio-src') || '';
    const aspect = btn.getAttribute('data-aspect') || '';
    if (!src) return;
    open(src, aspect);
  });

  // Clear media when modal closes
  modal.addEventListener('hidden.bs.modal', clearMedia);

  // When modal shown, measure and clamp
  modal.addEventListener('shown.bs.modal', function () {
    updateLayoutClamp();
  });

  // Recompute on window resize
  window.addEventListener('resize', function () {
    if (modal && modal.classList.contains('show')) updateLayoutClamp();
  });

  // Play/pause
  btnPlay && btnPlay.addEventListener('click', function () {
    const m = active === 'audio' ? audio : video;
    if (!m) return;
    if (m.paused) m.play().catch(()=>{});
    else m.pause();
    updatePlayLabel();
  });

  // Repeat toggle
  btnRepeat && btnRepeat.addEventListener('click', function () {
    const m = active === 'audio' ? audio : video;
    if (!m) return;
    m.loop = !m.loop;
    btnRepeat.classList.toggle('active', m.loop);
    btnRepeat.setAttribute('aria-pressed', m.loop ? 'true' : 'false');
  });

  // Fullscreen (applies to video-box container)
  btnFs && btnFs.addEventListener('click', function () {
    const el = videoBox || playerWrapper || video;
    if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen().catch(()=>{});
    else document.exitFullscreen().catch(()=>{});
  });

  // Volume & playback rate
  vol && vol.addEventListener('input', () => {
    const v = parseFloat(vol.value);
    if (video) video.volume = v;
    if (audio) audio.volume = v;
  });
  rate && rate.addEventListener('change', () => {
    const r = parseFloat(rate.value);
    if (video) video.playbackRate = r;
    if (audio) audio.playbackRate = r;
  });

  // Time update handler (updates single progress bar)
  function onTimeUpdate() {
    const m = active === 'audio' ? audio : video;
    if (!m || isNaN(m.duration)) return;
    const pct = (m.currentTime / m.duration) * 100 || 0;
    if (progress) progress.value = Math.min(100, Math.max(0, pct));
    if (timeDisplay) timeDisplay.textContent = `${fmt(m.currentTime)} / ${fmt(m.duration)}`;
    updatePlayLabel();
  }
  if (video) video.addEventListener('timeupdate', onTimeUpdate);
  if (audio) audio.addEventListener('timeupdate', onTimeUpdate);

  // Seek via progress bar
  progress && progress.addEventListener('input', function () {
    const m = active === 'audio' ? audio : video;
    if (!m || isNaN(m.duration)) return;
    m.currentTime = (parseFloat(progress.value) / 100) * m.duration;
  });

  // Keyboard shortcuts while modal open
  document.addEventListener('keydown', function (e) {
    if (!modal || !modal.classList.contains('show')) return;
    const m = active === 'audio' ? audio : video;
    if (!m) return;
    switch (e.key) {
      case ' ':
      case 'k':
        e.preventDefault();
        if (m.paused) m.play(); else m.pause();
        updatePlayLabel();
        break;
      case 'ArrowRight':
        m.currentTime = Math.min(m.duration || Infinity, m.currentTime + 5);
        break;
      case 'ArrowLeft':
        m.currentTime = Math.max(0, m.currentTime - 5);
        break;
      case 'f':
        btnFs && btnFs.click();
        break;
      case 'r':
        btnRepeat && btnRepeat.click();
        break;
      case 'm':
        m.muted = !m.muted;
        break;
    }
  });

  function updatePlayLabel() {
    const m = active === 'audio' ? audio : video;
    if (!m) { if (btnPlay) btnPlay.textContent = 'Play'; return; }
    if (btnPlay) btnPlay.textContent = m.paused ? 'Play' : 'Pause';
  }

  function syncControls() {
    const m = active === 'audio' ? audio : video;
    if (!m) return;
    vol && (vol.value = m.volume ?? 0.8);
    rate && (rate.value = m.playbackRate ?? 1);
    btnRepeat && btnRepeat.classList.toggle('active', !!m.loop);
    updatePlayLabel();
  }

  function fmt(s) {
    if (!isFinite(s)) return '00:00';
    const mm = Math.floor(s / 60).toString().padStart(2, '0');
    const ss = Math.floor(s % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  }

  // Initialize volumes
  if (video) video.volume = parseFloat(vol ? vol.value : 0.8);
  if (audio) audio.volume = parseFloat(vol ? vol.value : 0.8);

  // Initial layout clamp in case modal is already visible
  setTimeout(() => updateLayoutClamp(), 120);
});

// src/main/resources/static/js/cinema.js
// Play hidden background audios once per page load. Track with localStorage; clear on unload/next launch.

(function () {
  const PLAYED_KEY_PREFIX = 'bgAudioPlayed:';
  // session id stored in sessionStorage so it resets on tab close / new launch
  let sessionId = sessionStorage.getItem('mvcmovie_session_id');
  if (!sessionId) {
    sessionId = String(Date.now()) + '-' + Math.random().toString(36).slice(2, 9);
    sessionStorage.setItem('mvcmovie_session_id', sessionId);
  }
  const playedKey = PLAYED_KEY_PREFIX + sessionId;

  // Clear any leftover flag for this session on load (defensive)
  // (we rely on beforeunload to remove after play; this ensures a fresh start)
  localStorage.removeItem(playedKey);

  function tryPlayOnce() {
    if (localStorage.getItem(playedKey)) return; // already played this session

    const audios = Array.from(document.querySelectorAll('audio[data-play-invisible="true"]'));
    if (!audios.length) return;

    // Attempt to play all hidden audios once
    const playAll = () => {
      const promises = audios.map(a => {
        a.loop = false; // play only once
        a.muted = false;
        try {
          const p = a.play();
          return p && typeof p.then === 'function' ? p : Promise.resolve();
        } catch (e) {
          return Promise.reject(e);
        }
      });

      return Promise.allSettled(promises).then(results => {
        // If at least one succeeded, mark as played
        const succeeded = results.some(r => r.status === 'fulfilled');
        if (succeeded) {
          localStorage.setItem(playedKey, String(Date.now()));
        }
        return succeeded;
      });
    };

    // Try immediate play
    tryPlayImmediate();

    function tryPlayImmediate() {
      playAll().then(succeeded => {
        if (succeeded) return;
        // If blocked by autoplay policy, wait for first user gesture then play once
        const onFirstGesture = () => {
          playAll().finally(() => {
            window.removeEventListener('click', onFirstGesture, true);
            window.removeEventListener('touchstart', onFirstGesture, true);
            window.removeEventListener('keydown', onFirstGesture, true);
          });
        };
        window.addEventListener('click', onFirstGesture, true);
        window.addEventListener('touchstart', onFirstGesture, true);
        window.addEventListener('keydown', onFirstGesture, true);
      });
    }
  }

  // Remove played flag and session id on unload/close so next launch is fresh
  function clearSessionFlags() {
    try {
      localStorage.removeItem(playedKey);
    } catch (e) {}
    try {
      sessionStorage.removeItem('mvcmovie_session_id');
    } catch (e) {}
  }

  // Start after DOM ready
  document.addEventListener('DOMContentLoaded', function () {
    tryPlayOnce();
  });

  // Clear on page unload/close
  window.addEventListener('beforeunload', clearSessionFlags);
  // Also clear on visibilitychange when page is being unloaded in some browsers
  window.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') {
      // small timeout to allow navigation to proceed, then clear
      setTimeout(clearSessionFlags, 200);
    }
  });
})();

