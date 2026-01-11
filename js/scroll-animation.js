/* ============================================
   SCROLL-DRIVEN ANIMATION CONTROLLER
   ============================================
   Controls the envelope opening and card emergence
   based on scroll position
   ============================================ */

(function() {
  'use strict';

  // ============================================
  // CONFIGURATION
  // Adjust these values to fine-tune animations
  // ============================================
  const CONFIG = {
    // Scroll thresholds (as percentage of scroll height)
    scrollHintFade: 0.05,        // When scroll hint starts fading
    flapStartOpen: 0.08,         // When flap starts opening
    flapFullyOpen: 0.20,         // When flap is fully open
    sealBreak: 0.12,             // When wax seal breaks
    linerReveal: 0.18,           // When envelope liner reveals
    introFade: 0.15,             // When intro text fades
    floralReveal: 0.25,          // When floral decorations appear
    
    // Card emergence thresholds
    cards: {
      names:   { start: 0.22, end: 0.35 },
      date:    { start: 0.30, end: 0.45 },
      details: { start: 0.38, end: 0.55 },
      rsvp:    { start: 0.46, end: 0.63 },
      photo1:  { start: 0.54, end: 0.70 },
      photo2:  { start: 0.58, end: 0.75 },
    },
    
    // Animation values
    flapMaxRotation: 180,        // Degrees the flap rotates
    cardStartY: 150,             // Initial Y offset for cards (inside envelope)
    cardStartScale: 0.85,        // Initial scale for cards
  };

  // ============================================
  // DOM ELEMENTS
  // ============================================
  const elements = {
    scrollHint: document.getElementById('scrollHint'),
    introText: document.getElementById('introText'),
    envelopeFlap: document.getElementById('envelopeFlap'),
    envelopeLiner: document.getElementById('envelopeLiner'),
    waxSeal: document.getElementById('waxSeal'),
    floralLeft: document.getElementById('floralLeft'),
    floralRight: document.getElementById('floralRight'),
    cardNames: document.getElementById('cardNames'),
    cardDate: document.getElementById('cardDate'),
    cardDetails: document.getElementById('cardDetails'),
    cardRsvp: document.getElementById('cardRsvp'),
    cardPhoto1: document.getElementById('cardPhoto1'),
    cardPhoto2: document.getElementById('cardPhoto2'),
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
   * Animate a single card emerging from envelope
   */
  function animateCard(card, progress, cardConfig) {
    if (!card) return;
    
    const { start, end } = cardConfig;
    
    // Calculate card animation progress
    const cardProgress = clamp((progress - start) / (end - start), 0, 1);
    const easedProgress = easeOutCubic(cardProgress);
    
    // Get final position from CSS custom properties
    const style = getComputedStyle(card);
    const finalX = parseFloat(style.getPropertyValue('--final-x')) || 0;
    const finalY = parseFloat(style.getPropertyValue('--final-y')) || 0;
    const finalRotate = parseFloat(style.getPropertyValue('--final-rotate')) || 0;
    
    // Calculate current values
    const currentY = lerp(CONFIG.cardStartY, finalY, easedProgress);
    const currentX = lerp(0, finalX, easedProgress);
    const currentScale = lerp(CONFIG.cardStartScale, 1, easedProgress);
    const currentRotate = lerp(0, finalRotate, easedProgress);
    const currentOpacity = easedProgress;
    
    // Apply transforms
    card.style.transform = `
      translateX(${currentX}px)
      translateY(${currentY}px)
      scale(${currentScale})
      rotate(${currentRotate}deg)
    `;
    card.style.opacity = currentOpacity;
    
    // Add visible class when card is mostly visible
    if (cardProgress > 0.5) {
      card.classList.add('visible');
    } else {
      card.classList.remove('visible');
    }
  }

  /**
   * Animate all cards
   */
  function animateCards(progress) {
    animateCard(elements.cardNames, progress, CONFIG.cards.names);
    animateCard(elements.cardDate, progress, CONFIG.cards.date);
    animateCard(elements.cardDetails, progress, CONFIG.cards.details);
    animateCard(elements.cardRsvp, progress, CONFIG.cards.rsvp);
    animateCard(elements.cardPhoto1, progress, CONFIG.cards.photo1);
    animateCard(elements.cardPhoto2, progress, CONFIG.cards.photo2);
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
    animateEnvelopeFlap(progress);
    animateWaxSeal(progress);
    animateEnvelopeLiner(progress);
    animateFloralDecorations(progress);
    animateCards(progress);
    
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

