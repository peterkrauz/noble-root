/* ============================================
   SCROLL-DRIVEN ANIMATION CONTROLLER
   ============================================
   Controls the envelope opening and card emergence
   based on scroll position
   ============================================ */

(function () {
  'use strict';

  // ============================================
  // CONFIGURATION
  // Adjust these values to fine-tune animations
  // ============================================
  const CONFIG = {
    // Scroll thresholds (as percentage of scroll height)
    scrollHintFade: 0.05,        // When scroll hint starts fading
    flapStartOpen: 0.08,         // When flap starts opening
    flapFullyOpen: 0.22,         // When flap is fully open
    sealBreak: 0.12,             // When wax seal breaks
    linerReveal: 0.18,           // When envelope liner reveals
    introFade: 0.10,             // When intro text fades
    floralReveal: 0.30,          // When floral decorations appear

    // Envelope movement (moves to bottom as it opens)
    envelopeMoveStart: 0.08,     // When envelope starts moving down
    envelopeMoveEnd: 0.25,       // When envelope reaches final position
    envelopeFinalY: 25,          // Final Y position (vh from center, 25 = 10% higher than before)

    // Stacking cards - emergence and flip thresholds
    stackingCards: {
      abertura: { emerge: 0.25, flip: 0.38 },
      local: { emerge: 0.42, flip: 0.55 },
      info: { emerge: 0.58, flip: 0.70 },
      rsvp: { emerge: 0.73, flip: 0.85 },
    },

    // Envelope shadow removal threshold
    envelopeOpenedThreshold: 0.20, // When to remove heavy shadow

    // Animation values
    flapMaxRotation: 200,        // Degrees the flap rotates (200 = goes behind envelope)
  };

  // ============================================
  // DOM ELEMENTS
  // ============================================
  const elements = {
    scrollHint: document.getElementById('scrollHint'),
    introText: document.getElementById('introText'),
    envelopeScene: document.querySelector('.envelope-scene'),
    envelope: document.querySelector('.envelope'),
    envelopeBody: document.querySelector('.envelope-body'),
    envelopeFlap: document.getElementById('envelopeFlap'),
    envelopeFlapBack: document.querySelector('.envelope-flap-back'),
    envelopeLiner: document.getElementById('envelopeLiner'),
    waxSeal: document.getElementById('waxSeal'),
    floralLeft: document.getElementById('floralLeft'),
    floralRight: document.getElementById('floralRight'),
    // Stacking cards
    stackingCardsContainer: document.getElementById('stackingCards'),
    cardAbertura: document.getElementById('cardAbertura'),
    cardLocal: document.getElementById('cardLocal'),
    cardInfo: document.getElementById('cardInfo'),
    cardRsvpNew: document.getElementById('cardRsvpNew'),
    siteFooter: document.getElementById('siteFooter'),
  };

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  /**
   * Clamp a value between min and max
   */
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * Linear interpolation
   */
  function lerp(start, end, progress) {
    return start + (end - start) * progress;
  }

  /**
   * Map a value from one range to another
   */
  function mapRange(value, inMin, inMax, outMin, outMax) {
    const progress = clamp((value - inMin) / (inMax - inMin), 0, 1);
    return lerp(outMin, outMax, progress);
  }

  /**
   * Ease out cubic for smoother animations
   */
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  /**
   * Ease in out cubic for envelope movement
   */
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  /**
   * Get scroll progress (0 to 1)
   */
  function getScrollProgress() {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight <= 0) return 0;
    return clamp(window.scrollY / scrollHeight, 0, 1);
  }

  // ============================================
  // ANIMATION FUNCTIONS
  // ============================================

  /**
   * Animate the scroll hint visibility
   */
  function animateScrollHint(progress) {
    if (progress > CONFIG.scrollHintFade) {
      elements.scrollHint.classList.add('hidden');
    } else {
      elements.scrollHint.classList.remove('hidden');
    }
  }

  /**
   * Animate the intro text
   */
  function animateIntroText(progress) {
    if (progress > CONFIG.introFade) {
      elements.introText.classList.add('hidden');
    } else {
      elements.introText.classList.remove('hidden');
    }
  }

  /**
   * Animate the envelope moving down to the bottom of viewport
   */
  function animateEnvelopePosition(progress) {
    const moveProgress = clamp(
      (progress - CONFIG.envelopeMoveStart) / (CONFIG.envelopeMoveEnd - CONFIG.envelopeMoveStart),
      0,
      1
    );
    const easedProgress = easeInOutCubic(moveProgress);

    // Move from center (0) to bottom third of viewport
    const translateY = lerp(0, CONFIG.envelopeFinalY, easedProgress);

    elements.envelopeScene.style.transform = `translateY(${translateY}vh)`;
  }

  /**
   * Animate the envelope flap opening
   */
  function animateEnvelopeFlap(progress) {
    const rotation = mapRange(
      progress,
      CONFIG.flapStartOpen,
      CONFIG.flapFullyOpen,
      0,
      CONFIG.flapMaxRotation
    );

    elements.envelopeFlap.style.transform = `rotateX(${rotation}deg)`;
    
    // Quando a aba abre mais de 90 graus, ela vai para trás do envelope
    if (rotation > 90) {
      elements.envelopeFlap.classList.add('behind');
      elements.envelope.classList.add('flap-open');
      elements.envelopeFlapBack.classList.add('visible');
    } else {
      elements.envelopeFlap.classList.remove('behind');
      elements.envelope.classList.remove('flap-open');
      elements.envelopeFlapBack.classList.remove('visible');
    }
  }

  /**
   * Animate envelope shadow (remove pyramid effect after opening)
   */
  function animateEnvelopeShadow(progress) {
    if (progress > CONFIG.envelopeOpenedThreshold) {
      elements.envelopeBody.classList.add('opened');
    } else {
      elements.envelopeBody.classList.remove('opened');
    }
  }

  /**
   * Animate the wax seal breaking
   */
  function animateWaxSeal(progress) {
    if (progress > CONFIG.sealBreak) {
      elements.waxSeal.classList.add('broken');
    } else {
      elements.waxSeal.classList.remove('broken');
    }
  }

  /**
   * Animate the envelope liner reveal
   */
  function animateEnvelopeLiner(progress) {
    if (progress > CONFIG.linerReveal) {
      elements.envelopeLiner.classList.add('visible');
    } else {
      elements.envelopeLiner.classList.remove('visible');
    }
  }

  /**
   * Animate floral decorations
   */
  function animateFloralDecorations(progress) {
    if (progress > CONFIG.floralReveal) {
      elements.floralLeft.classList.add('visible');
      elements.floralRight.classList.add('visible');
    } else {
      elements.floralLeft.classList.remove('visible');
      elements.floralRight.classList.remove('visible');
    }
  }

  /**
   * Animate a single stacking card (emerge and flip)
   */
  function animateStackingCard(card, progress, cardConfig) {
    if (!card) return;

    const { emerge, flip } = cardConfig;

    // Check if card should emerge
    if (progress >= emerge) {
      card.classList.add('emerged');
    } else {
      card.classList.remove('emerged');
    }

    // Check if card should flip
    if (progress >= flip) {
      card.classList.add('flipped');
    } else {
      card.classList.remove('flipped');
    }
  }

  /**
   * Animate all stacking cards
   */
  function animateStackingCards(progress) {
    animateStackingCard(elements.cardAbertura, progress, CONFIG.stackingCards.abertura);
    animateStackingCard(elements.cardLocal, progress, CONFIG.stackingCards.local);
    animateStackingCard(elements.cardInfo, progress, CONFIG.stackingCards.info);
    animateStackingCard(elements.cardRsvpNew, progress, CONFIG.stackingCards.rsvp);
  }

  // ============================================
  // MAIN ANIMATION LOOP
  // ============================================

  let ticking = false;

  function updateAnimations() {
    const progress = getScrollProgress();

    // Run all animations
    animateScrollHint(progress);
    animateIntroText(progress);
    animateEnvelopePosition(progress);
    animateEnvelopeFlap(progress);
    animateEnvelopeShadow(progress);
    animateWaxSeal(progress);
    animateEnvelopeLiner(progress);
    animateFloralDecorations(progress);
    animateStackingCards(progress);

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateAnimations);
      ticking = true;
    }
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  function init() {
    // Set initial states
    updateAnimations();

    // Listen for scroll events
    window.addEventListener('scroll', onScroll, { passive: true });

    // Handle resize
    window.addEventListener('resize', updateAnimations, { passive: true });

    console.log('Wedding scroll animation initialized');
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
