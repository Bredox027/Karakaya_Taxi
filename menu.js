// Language Switcher HTML Generator
function createLanguageSwitcher() {
  const currentPath = window.location.pathname;
  let currentPage = currentPath.split('/').pop() || 'index.html';
  
  // Entferne .html wenn vorhanden
  currentPage = currentPage.replace('.html', '');
  if (!currentPage || currentPage === '') currentPage = 'index.html';
  if (!currentPage.includes('.html')) currentPage = currentPage + '.html';
  
  const languages = [
    { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
    { code: 'en', flag: '🇬🇧', name: 'English' },
    { code: 'ru', flag: '🇷🇺', name: 'Русский' },
    { code: 'ar', flag: '🇸🇦', name: 'العربية' },
    { code: 'he', flag: '🇮🇱', name: 'עברית' }
  ];

  const langSwitch = document.querySelector('.lang-switch');
  if (!langSwitch) return;

  let html = '<div class="lang-dropdown">';
  html += '<button class="lang-dropdown-btn" title="Sprache ändern">🌐</button>';
  html += '<div class="lang-dropdown-content">';
  
  languages.forEach(lang => {
    let href;
    if (lang.code === 'de') {
      href = `/${currentPage}`;
    } else {
      href = `/${lang.code}/${currentPage}`;
    }
    
    html += `<a href="${href}"><span class="flag">${lang.flag}</span> ${lang.name}</a>`;
  });
  
  html += '</div></div>';
  
  langSwitch.innerHTML = html;
  initLanguageSwitcher();
}

// Navigation
function initNavigation() {
  const burgerBtn = document.getElementById('burgerBtn');
  const nav = document.querySelector('.nav');

  if (!nav || !burgerBtn) return;

  burgerBtn.addEventListener('click', () => {
    burgerBtn.classList.toggle('active');
    nav.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('nav') && !e.target.closest('.burger-menu')) {
      burgerBtn.classList.remove('active');
      nav.classList.remove('active');
    }
  });

  document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', () => {
      burgerBtn.classList.remove('active');
      nav.classList.remove('active');
    });
  });
}

// Language Switcher
function initLanguageSwitcher() {
  const langDropdowns = document.querySelectorAll('.lang-dropdown');
  
  langDropdowns.forEach(dropdown => {
    const btn = dropdown.querySelector('.lang-dropdown-btn');
    const content = dropdown.querySelector('.lang-dropdown-content');
    
    if (!btn || !content) return;

    // Toggle dropdown on button click
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('active');
    });

    // Close when clicking on a language link
    content.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        dropdown.classList.remove('active');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('active');
      }
    });
  });
}

// Cookie Banner
function initCookieBanner() {
  const banner = document.getElementById('cookieBanner');
  const modal = document.getElementById('cookieModal');
  const consentKey = 'cookieConsent';
  
  if (!banner || !modal) return;

  const showBanner = () => banner.classList.add('visible');
  const hideBanner = () => banner.classList.remove('visible');
  
  const saveConsent = (settings) => {
    localStorage.setItem(consentKey, JSON.stringify(settings));
    hideBanner();
    modal.classList.remove('active');
  };

  if (!localStorage.getItem(consentKey)) {
    showBanner();
  }

  const actions = {
    'cookieAccept': () => saveConsent({ necessary: true, analytics: true, marketing: true }),
    'cookieReject': () => saveConsent({ necessary: true, analytics: false, marketing: false }),
    'cookieSettings': () => modal.classList.add('active'),
    'cookieModalClose': () => modal.classList.remove('active'),
    'cookieModalSave': () => {
      const settings = {
        necessary: true,
        analytics: document.getElementById('cookieAnalytics')?.checked || false,
        marketing: document.getElementById('cookieMarketing')?.checked || false
      };
      saveConsent(settings);
    }
  };

  Object.keys(actions).forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', actions[id]);
    }
  });

  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  // Restore consent checkboxes
  const saved = JSON.parse(localStorage.getItem(consentKey) || '{}');
  if (document.getElementById('cookieAnalytics')) {
    document.getElementById('cookieAnalytics').checked = saved.analytics || false;
  }
  if (document.getElementById('cookieMarketing')) {
    document.getElementById('cookieMarketing').checked = saved.marketing || false;
  }
}

// Initialize all on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  createLanguageSwitcher();
  initNavigation();
  initLanguageSwitcher();
  initCookieBanner();
});
