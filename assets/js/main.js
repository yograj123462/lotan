/* Presentation-only interactions. No account, cart or form data is sent. */
(function ($) {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const arrowLabels = ['<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m14 6-6 6 6 6"/></svg>', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m10 6 6 6-6 6"/></svg>'];

  function labelCarousel(event) {
    const root = event.target;
    root.querySelectorAll('.owl-prev').forEach((button) => {
      button.setAttribute('aria-label', 'Previous slide');
      button.type = 'button';
    });
    root.querySelectorAll('.owl-next').forEach((button) => {
      button.setAttribute('aria-label', 'Next slide');
      button.type = 'button';
    });
    root.querySelectorAll('.owl-dot').forEach((button, index) => {
      button.setAttribute('aria-label', 'Go to slide ' + (index + 1));
      button.type = 'button';
    });
    root.querySelectorAll('.owl-item').forEach((item) => {
      const visible = item.classList.contains('active');
      item.setAttribute('aria-hidden', String(!visible));
      item.querySelectorAll('a,button').forEach((link) => (link.tabIndex = visible ? 0 : -1));
    });
  }

  const baseCarousel = {
    smartSpeed: reducedMotion ? 0 : 450,
    navText: arrowLabels,
    onInitialized: labelCarousel,
    onTranslated: labelCarousel,
    onResized: labelCarousel,
  };
  $('.hero-carousel').owlCarousel({
    ...baseCarousel,
    loop: true,
    center: true,
    items: 1,
    dots: true,
    nav: false,
    autoplay: false,
    responsive: {
      0: { autoWidth: false, stagePadding: 0 },
      576: { autoWidth: true, stagePadding: 0 },
    },
  });
  $('.news-carousel').owlCarousel({
    ...baseCarousel,
    items: 2,
    margin: 38,
    loop: true,
    nav: true,
    dots: false,
    responsive: {
      0: { items: 1, margin: 20 },
      768: { items: 2, margin: 25 },
      1600: { items: 2, margin: 38 },
    },
  });
  $('.category-carousel').owlCarousel({
    ...baseCarousel,
    margin: 15,
    nav: true,
    dots: false,
    responsive: {
      0: { items: 3, margin: 10 },
      576: { items: 5 },
      992: { items: 8 },
      1600: { items: 10 },
    },
  });
  $('.related-carousel').owlCarousel({
    ...baseCarousel,
    margin: 36,
    loop: true,
    nav: true,
    dots: false,
    responsive: {
      0: { items: 2, margin: 12 },
      576: { items: 3, margin: 20 },
      992: { items: 4, margin: 25 },
      1200: { items: 5, margin: 36 },
    },
  });
  $('.reviews-carousel').owlCarousel({
    ...baseCarousel,
    items: 1,
    nav: true,
    dots: false,
    loop: true,
  });

  document.querySelectorAll('.preview-form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      form.querySelector('.form-status').textContent =
        'This is a static preview. Your information has not been sent.';
    });
    form.addEventListener('reset', () => {
      form.querySelector('.form-status').textContent = '';
      form.querySelectorAll('[data-rating]').forEach((button) => {
        button.textContent = '☆';
        button.setAttribute('aria-pressed', 'false');
      });
    });
  });

  document.querySelectorAll('[data-quantity]').forEach((button) =>
    button.addEventListener('click', () => {
      const input = document.getElementById('product-quantity');
      input.value = Math.max(
        1,
        Math.min(99, (Number(input.value) || 1) + Number(button.dataset.quantity))
      );
    })
  );
  document.getElementById('product-quantity')?.addEventListener('change', (event) => {
    event.target.value = Math.max(1, Math.min(99, Math.round(Number(event.target.value) || 1)));
  });
  document.querySelectorAll('[data-product-image]').forEach((button, index) =>
    button.addEventListener('click', () => {
      document
        .querySelectorAll('[data-product-image]')
        .forEach((item) => item.classList.toggle('active', item === button));
      document.querySelector('.product-main-image img').style.objectFit = index
        ? 'contain'
        : 'contain';
    })
  );
  document.querySelectorAll('[data-rating]').forEach((button) =>
    button.addEventListener('click', () => {
      const rating = Number(button.dataset.rating);
      button.closest('.review-stars').querySelector('input').value = rating;
      document.querySelectorAll('[data-rating]').forEach((star) => {
        star.textContent = Number(star.dataset.rating) <= rating ? '★' : '☆';
        star.setAttribute('aria-pressed', String(star === button));
      });
    })
  );

  const sortSelect = document.getElementById('product-sort');
  if (sortSelect) {
    const grid = document.querySelector('.shop-products .product-grid');
    const cards = [...grid.children];
    sortSelect.addEventListener('change', () => {
      const sorted = [...cards];
      if (['low', 'high'].includes(sortSelect.value))
        sorted.sort((a, b) => {
          const price = (card) =>
            Number(card.querySelector('.product-order span').textContent.replace('₹', ''));
          return (price(a) - price(b)) * (sortSelect.value === 'low' ? 1 : -1);
        });
      if (sortSelect.value === 'latest') sorted.reverse();
      sorted.forEach((card) => grid.appendChild(card));
    });
  }

  document.getElementById('forgot-password-modal')?.addEventListener('shown.bs.modal', () => {
    const email = document.getElementById('reset-email');
    email.value = document.getElementById('account-email')?.value || '';
    document.querySelector('#forgot-password-form .form-status').textContent = '';
    email.focus();
  });
  document.getElementById('forgot-password-form')?.addEventListener('submit', event => {
    event.preventDefault();
    event.currentTarget.querySelector('.form-status').textContent = 'Password reset is not connected yet. Please contact Lotan at lotan1964@gmail.com for account assistance.';
  });
  const search = document.getElementById('product-search');
  search?.addEventListener('input', () => {
    let visible = 0;
    document.querySelectorAll('.search-results li').forEach((item) => {
      item.hidden = !item.textContent.toLowerCase().includes(search.value.trim().toLowerCase());
      if (!item.hidden) visible++;
    });
    document.querySelector('.search-empty').hidden = visible > 0;
  });
  document.getElementById('search-modal')?.addEventListener('shown.bs.modal', () => search.focus());

  const recipeModal = document.getElementById('recipe-modal');
  let recipeZoom = 1;
  function updateRecipeZoom() {
    if (!recipeModal) return;
    recipeModal.querySelector('.recipe-sheet').style.zoom = recipeZoom;
    recipeModal.querySelector('.recipe-zoom-level').textContent = Math.round(recipeZoom * 100) + '%';
    recipeModal.querySelector('[data-recipe-zoom="out"]').disabled = recipeZoom <= 0.8;
    recipeModal.querySelector('[data-recipe-zoom="in"]').disabled = recipeZoom >= 1.8;
  }
  recipeModal?.addEventListener('show.bs.modal', (event) => {
    const name = event.relatedTarget?.dataset.recipe || 'Jada';
    document.getElementById('recipe-modal-title').textContent = 'How to cook ' + name + ' Poha';
    recipeModal.dataset.recipe = name;
    recipeZoom = 1;
    updateRecipeZoom();
    recipeModal.querySelector('.recipe-share-status').textContent = '';
    recipeModal.querySelector('.recipe-viewport').scrollTo(0, 0);
  });
  document.querySelectorAll('[data-recipe-zoom]').forEach((button) =>
    button.addEventListener('click', () => {
      recipeZoom = Math.round(Math.max(0.8, Math.min(1.8, recipeZoom + (button.dataset.recipeZoom === 'in' ? 0.1 : -0.1))) * 10) / 10;
      updateRecipeZoom();
    })
  );
  document.querySelector('[data-recipe-reset]')?.addEventListener('click', () => {
    recipeZoom = 1;
    updateRecipeZoom();
    recipeModal.querySelector('.recipe-viewport').scrollTo(0, 0);
  });
  const recipeShareButton = document.querySelector('[data-recipe-share]');
  const recipeSocialPanel = document.getElementById('recipe-social-share');
  function closeRecipeShare() {
    if (!recipeSocialPanel) return;
    recipeSocialPanel.hidden = true;
    recipeShareButton.setAttribute('aria-expanded', 'false');
  }
  recipeModal?.addEventListener('show.bs.modal', closeRecipeShare);
  recipeShareButton?.addEventListener('click', () => {
    recipeSocialPanel.hidden = !recipeSocialPanel.hidden;
    recipeShareButton.setAttribute('aria-expanded', String(!recipeSocialPanel.hidden));
    recipeModal.querySelector('.recipe-share-status').textContent = '';
  });
  recipeSocialPanel?.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      closeRecipeShare();
      recipeShareButton.focus();
    }
  });
  document.querySelectorAll('[data-recipe-social]').forEach(button => button.addEventListener('click', async () => {
    const platform = button.dataset.recipeSocial;
    const title = document.getElementById('recipe-modal-title').textContent;
    const url = new URL(location.href);
    url.hash = 'recipe=' + encodeURIComponent(recipeModal.dataset.recipe);
    const status = recipeModal.querySelector('.recipe-share-status');
    if (platform === 'instagram' || location.protocol === 'file:') {
      try {
        await navigator.clipboard.writeText(location.protocol === 'file:' ? recipeModal.querySelector('.recipe-sheet').innerText : title + '\n' + url.href);
        status.textContent = platform === 'instagram' ? 'Recipe copied. Paste it into an Instagram message or caption.' : 'Recipe copied. Paste it into your social post.';
      } catch {
        status.textContent = 'Select and copy the recipe text, then paste it into your social post.';
      }
      return;
    }
    const link = encodeURIComponent(url.href);
    const destinations = {
      facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + link,
      linkedin: 'https://www.linkedin.com/sharing/share-offsite/?url=' + link,
      twitter: 'https://twitter.com/intent/tweet?url=' + link + '&text=' + encodeURIComponent(title)
    };
    window.open(destinations[platform], '_blank', 'noopener,noreferrer');
  }));
  if (recipeModal && location.hash.startsWith('#recipe=')) {
    const recipe = decodeURIComponent(location.hash.slice(8));
    const trigger = [...document.querySelectorAll('[data-recipe]')].find(button => button.dataset.recipe === recipe);
    if (trigger) bootstrap.Modal.getOrCreateInstance(recipeModal).show(trigger);
  }
  document.querySelector('[data-recipe-print]')?.addEventListener('click', () => window.print());

  if (!reducedMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {threshold: 0.08});
    document.querySelectorAll('main > section, main > .content-panel, main > .account-panel, .contact-strip').forEach(element => {
      if (element.classList.contains('home-banner')) return;
      element.classList.add('reveal-section');
      observer.observe(element);
    });
  }
  document.querySelectorAll('[data-share-product]').forEach(button =>
    button.addEventListener('click', async () => {
      const status = document.querySelector('.share-status');
      const platform = button.dataset.shareProduct;
      if (location.protocol !== 'file:' && platform !== 'instagram') {
        const url = encodeURIComponent(location.href);
        window.open(platform === 'facebook' ? 'https://www.facebook.com/sharer/sharer.php?u=' + url : 'https://www.linkedin.com/sharing/share-offsite/?url=' + url, '_blank', 'noopener,noreferrer');
        return;
      }
      try {
        await navigator.clipboard.writeText(location.protocol === 'file:' ? document.querySelector('.product-summary h1').textContent : location.href);
        status.textContent = platform === 'instagram' ? 'Copied. Paste into an Instagram message or caption.' : 'Product copied. Paste into your social post.';
      } catch {
        status.textContent = 'Copy the product name or page address to share.';
      }
    })
  );
})(jQuery);
