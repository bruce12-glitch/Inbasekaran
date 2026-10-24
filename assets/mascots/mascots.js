/**
 * Notion-Inspired Mascot Interaction System
 * Handles: idle animations, hover, click (navigate/highlight/reveal), keyboard accessibility, reduced motion
 */
(function() {
  'use strict';

  // Configuration for each mascot
  const MASCOt_CONFIG = {
    research: {
      sectionId: 'research',
      tooltip: 'Research — LLM inference efficiency, EntroPrefill & Page-EntroKV',
      action: 'navigate', // navigate | highlight | reveal
      description: 'I study efficient LLM inference, information-theoretic attention and context pruning, hardware-aligned KV-cache allocation under grouped-query attention, and zero-trust cryptographic systems.'
    },
    awards: {
      sectionId: 'awards',
      tooltip: 'Awards — Raccoon AI Hackathon, Shark Tank Nationals, Young Turks 99.32%',
      action: 'navigate',
      description: 'Recognized as Winner of the Raccoon AI Hackathon, National Finalist at Shark Tank Nationals, Top 10 at Hack Rush, and ranked in the 99.32 national percentile in Naukri Campus Young Turks.'
    },
    writing: {
      sectionId: 'writing',
      tooltip: 'Writing — "Neither Living Nor Dying: Reflection of the Middle" on Amazon',
      action: 'navigate',
      description: 'Beyond computer science and ML systems, I explore philosophical and reflective writing. My book is available on Amazon.'
    },
    contact: {
      sectionId: 'contact',
      tooltip: 'Contact — Let\'s connect for research, collaborations, or a thoughtful hello',
      action: 'navigate',
      description: 'For research, collaborations, or a thoughtful hello. Email: inba.research.ilrl.labs@gmail.com'
    }
  };

  // State
  let reducedMotion = false;
  let activeMascot = null;

  // Initialize
  function init() {
    // Check reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotion = mediaQuery.matches;
    mediaQuery.addEventListener('change', (e) => {
      reducedMotion = e.matches;
      updateReducedMotionState();
    });

    // Create mascot hosts for each section
    createMascotHosts();

    // Add keyboard navigation
    setupKeyboardNavigation();

    // Handle click outside to close tooltips
    document.addEventListener('click', handleClickOutside);

    // Update reduced motion state on init
    updateReducedMotionState();
  }

  function createMascotHosts() {
    Object.entries(MASCOt_CONFIG).forEach(([key, config]) => {
      const section = document.getElementById(config.sectionId);
      if (!section) return;

      // Make section a highlight target
      section.classList.add('section-highlight');

      // Create host element
      const host = document.createElement('div');
      host.className = 'mascot-host';
      host.dataset.mascot = key;
      host.setAttribute('role', 'button');
      host.setAttribute('tabindex', '0');
      host.setAttribute('aria-label', config.tooltip);
      host.setAttribute('aria-expanded', 'false');

      // Load SVG
      fetch(`/assets/mascots/mascot-${key}.svg`)
        .then(res => res.text())
        .then(svgText => {
          const parser = new DOMParser();
          const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
          const svg = svgDoc.documentElement;
          svg.classList.add('mascot');
          host.appendChild(svg);

          // Add tooltip
          const tooltip = document.createElement('div');
          tooltip.className = 'mascot-tooltip';
          tooltip.textContent = config.tooltip;
          host.appendChild(tooltip);

          // Attach events
          attachMascotEvents(host, key, config);
        })
        .catch(err => console.warn(`Failed to load mascot ${key}:`, err));

      // Append to section
      section.appendChild(host);
    });
  }

  function attachMascotEvents(host, key, config) {
    // Click handler
    host.addEventListener('click', (e) => {
      e.stopPropagation();
      handleMascotClick(host, key, config);
    });

    // Keyboard handler
    host.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleMascotClick(host, key, config);
      }
    });

    // Focus/blur for aria
    host.addEventListener('focus', () => {
      host.setAttribute('aria-expanded', 'true');
    });

    host.addEventListener('blur', () => {
      host.setAttribute('aria-expanded', 'false');
    });
  }

  function handleMascotClick(host, key, config) {
    // Toggle active state
    const isActive = host.classList.toggle('mascot--active');
    host.setAttribute('aria-expanded', isActive);

    // Manage single active mascot
    if (isActive) {
      if (activeMascot && activeMascot !== host) {
        activeMascot.classList.remove('mascot--active');
        activeMascot.setAttribute('aria-expanded', 'false');
        const activeSection = document.getElementById(MASCOt_CONFIG[activeMascot.dataset.mascot]?.sectionId);
        if (activeSection) activeSection.classList.remove('mascot--highlighted');
      }
      activeMascot = host;
    } else {
      activeMascot = null;
    }

    // Perform action based on config
    const section = document.getElementById(config.sectionId);
    switch (config.action) {
      case 'navigate':
        if (section) {
          section.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
          // Highlight briefly
          section.classList.add('mascot--highlighted');
          setTimeout(() => section.classList.remove('mascot--highlighted'), 3000);
        }
        break;

      case 'highlight':
        if (section) {
          section.classList.toggle('mascot--highlighted', isActive);
        }
        break;

      case 'reveal':
        // Could reveal a hidden description panel
        revealDescription(config.sectionId, config.description, isActive);
        break;
    }
  }

  function revealDescription(sectionId, description, show) {
    let descEl = document.getElementById(`mascot-desc-${sectionId}`);
    if (!descEl) {
      descEl = document.createElement('div');
      descEl.id = `mascot-desc-${sectionId}`;
      descEl.className = 'mascot-description';
      descEl.style.cssText = `
        margin-top: 16px;
        padding: 16px;
        background: var(--bg-elevated);
        border: 1px solid var(--border);
        border-radius: var(--rounded-lg, 12px);
        font-size: 14px;
        line-height: 1.6;
        color: var(--text-secondary);
        opacity: 0;
        transform: translateY(-8px);
        transition: opacity 0.3s ease, transform 0.3s ease;
      `;
      descEl.textContent = description;
      const section = document.getElementById(sectionId);
      const title = section?.querySelector('.section-title');
      if (title) title.insertAdjacentElement('afterend', descEl);
    }
    if (show) {
      descEl.style.opacity = '1';
      descEl.style.transform = 'translateY(0)';
    } else {
      descEl.style.opacity = '0';
      descEl.style.transform = 'translateY(-8px)';
    }
  }

  function handleClickOutside(e) {
    if (activeMascot && !activeMascot.contains(e.target)) {
      activeMascot.classList.remove('mascot--active');
      activeMascot.setAttribute('aria-expanded', 'false');
      const section = document.getElementById(MASCOt_CONFIG[activeMascot.dataset.mascot]?.sectionId);
      if (section) section.classList.remove('mascot--highlighted');
      activeMascot = null;
    }
  }

  function setupKeyboardNavigation() {
    // Arrow key navigation between mascots
    document.addEventListener('keydown', (e) => {
      if (!activeMascot) return;

      const mascots = Array.from(document.querySelectorAll('.mascot-host'));
      const currentIndex = mascots.indexOf(activeMascot);
      if (currentIndex === -1) return;

      let nextIndex = currentIndex;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextIndex = (currentIndex + 1) % mascots.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        nextIndex = (currentIndex - 1 + mascots.length) % mascots.length;
      } else {
        return;
      }

      e.preventDefault();
      mascots[nextIndex].focus();
      mascots[nextIndex].click();
    });
  }

  function updateReducedMotionState() {
    document.querySelectorAll('.mascot-host').forEach(host => {
      if (reducedMotion) {
        host.classList.add('mascot--reduced');
      } else {
        host.classList.remove('mascot--reduced');
      }
    });
  }

  // Expose for debugging
  window.MascotSystem = {
    init,
    config: MASCOt_CONFIG,
    setReducedMotion: (val) => { reducedMotion = val; updateReducedMotionState(); }
  };

  // Auto-init when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();