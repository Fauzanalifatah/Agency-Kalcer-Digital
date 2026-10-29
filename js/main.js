/**
 * Kalcer Digital - Interactive Engine
 * Build the Brand, Grow the Business
 * Handles responsive buttons, mobile drawer, interactive estimator,
 * portfolio filtering, FAQ accordion, and WhatsApp inquiries.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Keep portfolio cards presentable until an optional project image is added.
  document.querySelectorAll('.portfolio-image').forEach(image => {
    image.addEventListener('error', () => {
      image.remove();
    });
  });

  // Turn the services list into a continuous, responsive marquee.
  const servicesGrid = document.querySelector('.services-grid');
  if (servicesGrid) {
    const serviceCards = [...servicesGrid.querySelectorAll('.service-card')];
    const marquee = document.createElement('div');
    const track = document.createElement('div');
    const group = document.createElement('div');
    const duplicateGroup = document.createElement('div');

    marquee.className = 'services-marquee-wrapper';
    track.className = 'services-marquee-track';
    group.className = 'services-marquee-group';
    duplicateGroup.className = 'services-marquee-group';
    duplicateGroup.setAttribute('aria-hidden', 'true');

    serviceCards.forEach(card => group.appendChild(card));
    serviceCards.forEach(card => duplicateGroup.appendChild(card.cloneNode(true)));
    track.append(group, duplicateGroup);
    marquee.appendChild(track);
    servicesGrid.replaceWith(marquee);
  }

  // 1. Mobile Menu Drawer Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-drawer-btn, .drawer-cta-btn');

  function toggleMobileMenu() {
    const isOpen = mobileDrawer.classList.toggle('open');
    if (drawerOverlay) drawerOverlay.classList.toggle('open', isOpen);
    mobileToggle.classList.toggle('active', isOpen);
    mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMobileMenu() {
    mobileDrawer.classList.remove('open');
    if (drawerOverlay) drawerOverlay.classList.remove('open');
    mobileToggle.classList.remove('active');
    mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', toggleMobileMenu);
  }

  // Close button inside drawer
  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', closeMobileMenu);
  }

  // Close on overlay click
  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', closeMobileMenu);
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close drawer on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  // 2. Sticky Header with Scroll Shadow
  const header = document.querySelector('.header');
  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Header styling on scroll
    if (scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Back to top visibility
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }

    // Scroll Spy for Nav Links
    highlightCurrentSection();
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 3. Scroll Spy Navigation Highlight
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function highlightCurrentSection() {
    const scrollPosition = window.scrollY + 120;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // 4. Portfolio Filter Tabs
  const tabButtons = document.querySelectorAll('.tab-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 5. Interactive Project Estimator
  const estimatorCheckboxes = document.querySelectorAll('.service-checkbox');
  const estimatedPriceEl = document.getElementById('estimatedPrice');
  const estimatedTimelineEl = document.getElementById('estimatedTimeline');
  const estimatorWaBtn = document.getElementById('estimatorWaBtn');

  const basePrice = 1200000; // Starter baseline
  const serviceRates = {
    'branding': { price: 950000, days: 5, name: 'Branding & Identitas Visual' },
    'social-media': { price: 1500000, days: 14, name: 'Social Media Management' },
    'website': { price: 2200000, days: 7, name: 'Website Landing Page' },
    'ads': { price: 1200000, days: 7, name: 'Meta & TikTok Ads Strategy' },
    'seo': { price: 800000, days: 10, name: 'SEO & Copywriting' }
  };

  function updateEstimator() {
    let totalPrice = 0;
    let maxDays = 5;
    let selectedNames = [];

    estimatorCheckboxes.forEach(cb => {
      const parentCard = cb.closest('.option-card');
      if (cb.checked) {
        parentCard.classList.add('selected');
        const item = serviceRates[cb.value];
        if (item) {
          totalPrice += item.price;
          maxDays = Math.max(maxDays, item.days);
          selectedNames.push(item.name);
        }
      } else {
        parentCard.classList.remove('selected');
      }
    });

    if (selectedNames.length === 0) {
      totalPrice = basePrice;
      maxDays = 5;
      selectedNames.push('Konsultasi Dasar');
    }

    // Format currency to IDR
    const formatted = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(totalPrice);

    if (estimatedPriceEl) {
      estimatedPriceEl.textContent = formatted;
    }
    if (estimatedTimelineEl) {
      estimatedTimelineEl.textContent = `Estimasi pengerjaan: ~${maxDays} - ${maxDays + 5} hari kerja`;
    }

    if (estimatorWaBtn) {
      const msg = encodeURIComponent(
        `Halo Tim Kalcer Digital! 👋\nSaya ingin konsultasi estimasi paket proyek berikut:\n` +
        `• Pilihan Layanan: ${selectedNames.join(', ')}\n` +
        `• Estimasi Biaya: ${formatted}\n` +
        `Bisa diskusi lebih lanjut mengenai detail dan jadwal mulainya? Terima kasih!`
      );
      estimatorWaBtn.href = `https://wa.me/6282399213651?text=${msg}`;
    }
  }

  estimatorCheckboxes.forEach(cb => {
    cb.addEventListener('change', updateEstimator);
  });
  updateEstimator();

  // 6. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all others
      faqItems.forEach(other => {
        other.classList.remove('active');
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // 7. Contact Form Submission (Direct to WhatsApp + Feedback)
  const contactForm = document.getElementById('contactForm');
  const toastNotification = document.getElementById('toastNotification');

  function showToast(message) {
    if (!toastNotification) return;
    toastNotification.querySelector('.toast-msg').textContent = message;
    toastNotification.classList.add('show');
    setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 4000);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const service = document.getElementById('service').value;
      const message = document.getElementById('message').value.trim();

      if (!name || !phone) {
        alert('Mohon isi nama dan nomor WhatsApp Anda.');
        return;
      }

      showToast('Membuka WhatsApp Anda untuk mengirim pesan...');

      const text = encodeURIComponent(
        `Halo Kalcer Digital! 👋\n\nNama: ${name}\nNo. WhatsApp: ${phone}\nLayanan yang diminati: ${service}\n\nPesan:\n${message || 'Saya ingin konsultasi mengenai pertumbuhan brand saya.'}`
      );

      setTimeout(() => {
        window.open(`https://wa.me/6282399213651?text=${text}`, '_blank');
        contactForm.reset();
      }, 700);
    });
  }

  // 8. Package WhatsApp Direct Order Buttons
  const packageButtons = document.querySelectorAll('.package-order-btn');
  packageButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const pkg = btn.getAttribute('data-package') || 'Paket Layanan';
      const msg = encodeURIComponent(
        `Halo Tim Kalcer Digital! 👋 Saya tertarik untuk memilih "${pkg}". Bisakah kita diskusikan langkah awal onboarding?`
      );
      btn.href = `https://wa.me/6282399213651?text=${msg}`;
    });
  });

  // 9. Tactile Button Click Sound / Haptic if available
  const interactiveButtons = document.querySelectorAll('.btn, .fab-btn, .tab-btn');
  interactiveButtons.forEach(btn => {
    btn.addEventListener('touchstart', () => {
      btn.style.transform = 'scale(0.97)';
    }, { passive: true });

    btn.addEventListener('touchend', () => {
      btn.style.transform = '';
    }, { passive: true });
  });

  // 10. Testimonials Auto-Scrolling Marquee - Pause on Hover & Touch
  const marqueeTrack = document.querySelector('.testimonials-marquee-track');
  const testimonialCards = document.querySelectorAll('.testimonial-card');

  if (marqueeTrack && testimonialCards.length > 0) {
    testimonialCards.forEach(card => {
      // Pause immediately when cursor hovers over any card
      card.addEventListener('mouseenter', () => {
        marqueeTrack.classList.add('is-paused');
      });

      // Resume smooth scrolling when cursor leaves
      card.addEventListener('mouseleave', () => {
        marqueeTrack.classList.remove('is-paused');
      });

      // Accessible keyboard focus support
      card.addEventListener('focus', () => {
        marqueeTrack.classList.add('is-paused');
      });

      card.addEventListener('blur', () => {
        marqueeTrack.classList.remove('is-paused');
      });

      // Mobile touch toggle support
      card.addEventListener('touchstart', () => {
        marqueeTrack.classList.toggle('is-paused');
      }, { passive: true });
    });
  }
});
