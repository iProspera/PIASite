/* ═══════════════════════════════════════════════════════════
   ProsperaInvestmentAdvisors.com — Main JavaScript
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

  // ── Mobile menu toggle ──
  const toggle = document.getElementById('pMobileToggle');
  const mobileMenu = document.getElementById('pMobileMenu');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', function () {
      mobileMenu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', mobileMenu.classList.contains('open'));
    });
  }

  // ── More dropdown ──
  const moreBtn = document.getElementById('pMoreBtn');
  const moreLi = moreBtn ? moreBtn.closest('.p-nav-more') : null;
  if (moreBtn && moreLi) {
    moreBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      moreLi.classList.toggle('open');
      moreBtn.setAttribute('aria-expanded', moreLi.classList.contains('open'));
    });
    document.addEventListener('click', function () {
      moreLi.classList.remove('open');
      moreBtn.setAttribute('aria-expanded', 'false');
    });
  }

  // ── Sticky nav shadow on scroll ──
  const nav = document.getElementById('mainNav');
  if (nav) {
    let lastScroll = 0;
    window.addEventListener('scroll', function () {
      const y = window.scrollY;
      if (y > 10) {
        nav.style.boxShadow = '0 2px 16px rgba(0,0,0,.2)';
      } else {
        nav.style.boxShadow = '0 2px 12px rgba(0,0,0,.15)';
      }
      lastScroll = y;
    }, { passive: true });
  }

  // ── Close mobile menu on link click ──
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Cookie consent banner ──
  if (!localStorage.getItem('cookieConsent')) {
    const banner = document.createElement('div');
    banner.id = 'cookieBanner';
    banner.innerHTML = `
      <div style="position:fixed;bottom:0;left:0;right:0;z-index:200;background:#2f3b2d;color:rgba(255,255,255,.9);padding:1rem 1.5rem;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.75rem;font-size:.85rem;box-shadow:0 -2px 12px rgba(0,0,0,.2)">
        <p style="margin:0;max-width:700px">We use cookies to analyze website traffic and optimize your website experience. By accepting our use of cookies, your data will be aggregated with all other user data.</p>
        <div style="display:flex;gap:.5rem;flex-shrink:0">
          <button onclick="document.getElementById('cookieBanner').remove();localStorage.setItem('cookieConsent','declined')" style="padding:.5rem 1rem;border:1px solid rgba(255,255,255,.3);border-radius:6px;color:#fff;background:none;cursor:pointer;font-size:.8rem">Decline</button>
          <button onclick="document.getElementById('cookieBanner').remove();localStorage.setItem('cookieConsent','accepted')" style="padding:.5rem 1rem;border:none;border-radius:6px;color:#2f3b2d;background:#fff;cursor:pointer;font-weight:600;font-size:.8rem">Accept</button>
        </div>
      </div>`;
    document.body.appendChild(banner);
  }
});
