(function () {
  'use strict';

  /* ── Helpers ── */
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); };

  /* ── Tab Navigation ── */
  var tabBtns = $$('.tab-btn');
  var tabPanels = $$('.tab-panel');

  function switchTab(id) {
    tabBtns.forEach(function (b) {
      var active = b.dataset.tab === id;
      b.classList.toggle('active', active);
      b.setAttribute('aria-selected', active);
    });
    tabPanels.forEach(function (p) {
      p.classList.toggle('active', p.id === id);
    });
    if (id === 'tab-map') initMap();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () { switchTab(btn.dataset.tab); });
  });

  /* ── Leaflet Map ── */
  var map = null;
  var locations = [
    { lat: 26.8721, lng: 100.2255, title: 'Lijiang Old Town (D1-D4)', day: 'D1-D4', desc: 'Dayan Old Town — UNESCO World Heritage, Naxi canals, Mu Mansion' },
    { lat: 26.8837, lng: 100.1649, title: 'Black Dragon Pool (D2)', day: 'D2', desc: 'Spring-fed pool with iconic Jade Dragon Snow Mountain reflection' },
    { lat: 26.9216, lng: 100.1720, title: 'Baisha Old Town (D2)', day: 'D2', desc: 'Original Naxi capital, 14th-16th century Buddhist/Taoist/Dongba murals' },
    { lat: 26.8612, lng: 100.1112, title: 'Lashi Lake (D3)', day: 'D3', desc: 'Tea Horse Road horseback riding, migratory bird wetland' },
    { lat: 26.9050, lng: 100.2070, title: 'Shuhe Old Town (D3)', day: 'D3', desc: 'Older than Dayan, Tea Horse Road leather-working hub' },
    { lat: 27.0863, lng: 100.1874, title: 'Jade Dragon Snow Mtn (D4)', day: 'D4', desc: '5,596m — sacred to Naxi, never summited, cable car to 4,506m' },
    { lat: 27.0690, lng: 100.2130, title: 'Blue Moon Valley (D4)', day: 'D4', desc: 'Glacier-fed turquoise lakes, Rayleigh scattering from glacial flour' },
    { lat: 27.0210, lng: 100.1630, title: 'Yuhu Village / Rock (D4)', day: 'D4', desc: 'Joseph Rock\'s home for 27 years, now a small museum' },
    { lat: 27.1695, lng: 100.1065, title: 'Tiger Leaping Gorge (D5)', day: 'D5', desc: '3,900m deep — one of Earth\'s deepest gorges, Jinsha River' },
    { lat: 26.3268, lng: 99.9202, title: 'Shaxi / Sideng Square (D5-D6)', day: 'D5-D6', desc: 'Only intact Tea Horse Road market square, UNESCO restored' },
    { lat: 25.6897, lng: 100.1537, title: 'Dali Old Town (D6-D7)', day: 'D6-D7', desc: 'Ming-era walls, Nanzhao/Dali Kingdom legacy, Catholic church' },
    { lat: 25.7193, lng: 100.1208, title: 'Three Pagodas (D6)', day: 'D6', desc: 'Chongsheng Temple — main tower 69m, built 823-840 AD under Nanzhao' },
    { lat: 25.8445, lng: 100.1505, title: 'Xizhou / Tie-Dye (D7)', day: 'D7', desc: 'Best-preserved Bai architecture, ornate zhàobì walls, tie-dye workshops' },
    { lat: 25.7060, lng: 100.1900, title: 'Erhai Lake (D7)', day: 'D7', desc: '250 km² ear-shaped lake, Bai fishing culture, Cangshan views' },
  ];

  var routeCoords = [
    [26.8721, 100.2255], // Lijiang
    [26.8837, 100.1649], // Black Dragon Pool
    [26.9216, 100.1720], // Baisha
    [26.8612, 100.1112], // Lashi Lake
    [26.9050, 100.2070], // Shuhe
    [27.0210, 100.1630], // Yuhu
    [27.0863, 100.1874], // Jade Dragon
    [27.0690, 100.2130], // Blue Moon Valley
    [27.1695, 100.1065], // Tiger Leaping Gorge
    [26.3268, 99.9202],  // Shaxi
    [25.6897, 100.1537], // Dali
    [25.7193, 100.1208], // Three Pagodas
    [25.8445, 100.1505], // Xizhou
    [25.7060, 100.1900], // Erhai
  ];

  function initMap() {
    if (map) return;
    var el = $('#yunnan-map');
    if (!el) return;
    el.style.height = '70vh';
    map = L.map(el, { scrollWheelZoom: false }).setView([26.5, 100.1], 8);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 18
    }).addTo(map);

    locations.forEach(function (loc) {
      L.marker([loc.lat, loc.lng])
        .addTo(map)
        .bindPopup('<strong>' + loc.title + '</strong><br>' + loc.desc);
    });

    L.polyline(routeCoords, { color: '#c2583a', weight: 2, dashArray: '8 6', opacity: 0.7 }).addTo(map);
    map.fitBounds(routeCoords, { padding: [30, 30] });
    setTimeout(function () { map.invalidateSize(); }, 200);
  }

  /* ── Day Card Expand / Collapse ── */
  $$('.day-card-header').forEach(function (header) {
    header.addEventListener('click', function () {
      var card = header.closest('.day-card');
      var expanded = !card.classList.contains('collapsed');
      card.classList.toggle('collapsed', expanded);
      header.setAttribute('aria-expanded', !expanded);
    });
  });

  /* ── Collapsible Toggles (inside day cards) ── */
  $$('.collapsible-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', !expanded);
      var content = btn.nextElementSibling;
      if (content) {
        content.style.display = expanded ? 'none' : 'block';
      }
      var chevron = btn.querySelector('.chevron');
      if (chevron) chevron.textContent = expanded ? '▼' : '▲';
    });
  });

  /* ── Info Section Expand / Collapse ── */
  $$('#tab-info .section-header').forEach(function (header) {
    header.addEventListener('click', function () {
      var section = header.closest('.section');
      section.classList.toggle('collapsed');
    });
  });

  /* ── Info TOC Cards ── */
  $$('.info-toc-card').forEach(function (card) {
    card.addEventListener('click', function () {
      var target = card.dataset.target;
      var section = $('#' + target);
      if (section) {
        section.classList.remove('collapsed');
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Conversation Cards ── */
  $$('.convo-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', !expanded);
      var answer = btn.nextElementSibling;
      if (answer) answer.style.display = expanded ? 'none' : 'block';
    });
  });

  /* ── Day Strip Pills ── */
  $$('.day-pill').forEach(function (pill) {
    pill.addEventListener('click', function (e) {
      e.preventDefault();
      var target = pill.getAttribute('href');
      var dayCard = $(target);
      if (dayCard) {
        dayCard.classList.remove('collapsed');
        var header = dayCard.querySelector('.day-card-header');
        if (header) header.setAttribute('aria-expanded', 'true');
        dayCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Expand All / Collapse All ── */
  var expandBtn = $('#expand-all-btn');
  var collapseBtn = $('#collapse-all-btn');

  if (expandBtn) {
    expandBtn.addEventListener('click', function () {
      $$('.day-card').forEach(function (card) {
        card.classList.remove('collapsed');
        var h = card.querySelector('.day-card-header');
        if (h) h.setAttribute('aria-expanded', 'true');
      });
    });
  }
  if (collapseBtn) {
    collapseBtn.addEventListener('click', function () {
      $$('.day-card').forEach(function (card) {
        card.classList.add('collapsed');
        var h = card.querySelector('.day-card-header');
        if (h) h.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── Language Toggle ── */
  var langBtn = $('#lang-btn');
  var isZh = false;

  function applyTranslations() {
    if (typeof TRANSLATIONS_ZH === 'undefined') return;
    var zh = TRANSLATIONS_ZH;

    // Translate info sections
    $$('#tab-info .section').forEach(function (sec) {
      var id = sec.id;
      if (zh[id]) {
        var body = sec.querySelector('.section-body');
        if (body) {
          if (!body.dataset.origHtml) body.dataset.origHtml = body.innerHTML;
          body.innerHTML = isZh ? zh[id] : body.dataset.origHtml;
        }
      }
    });

    // Translate day cards
    for (var i = 1; i <= 8; i++) {
      var key = 'day' + i;
      if (zh[key]) {
        var card = $('#' + key);
        if (card) {
          var cardBody = card.querySelector('.day-card-body');
          if (cardBody) {
            if (!cardBody.dataset.origHtml) cardBody.dataset.origHtml = cardBody.innerHTML;
            cardBody.innerHTML = isZh ? zh[key] : cardBody.dataset.origHtml;
          }
        }
      }
    }

    // Translate conversation section
    if (zh.conversation) {
      var convoSec = $('#conversation');
      if (convoSec) {
        var body = convoSec.querySelector('.section-body');
        if (body) {
          if (!body.dataset.origHtml) body.dataset.origHtml = body.innerHTML;
          body.innerHTML = isZh ? zh.conversation : body.dataset.origHtml;
        }
      }
    }

    // UI strings
    if (zh._ui) {
      var ui = zh._ui;
      if (isZh) {
        var hero = $('.hero h1');
        if (hero) { if (!hero.dataset.orig) hero.dataset.orig = hero.innerHTML; hero.innerHTML = ui.heroTitle || hero.dataset.orig; }
        var heroMeta = $('.hero-meta');
        if (heroMeta) { if (!heroMeta.dataset.orig) heroMeta.dataset.orig = heroMeta.innerHTML; heroMeta.innerHTML = ui.heroMeta || heroMeta.dataset.orig; }
        if (expandBtn) { if (!expandBtn.dataset.orig) expandBtn.dataset.orig = expandBtn.textContent; expandBtn.textContent = ui.expandAll || expandBtn.dataset.orig; }
        if (collapseBtn) { if (!collapseBtn.dataset.orig) collapseBtn.dataset.orig = collapseBtn.textContent; collapseBtn.textContent = ui.collapseAll || collapseBtn.dataset.orig; }
        var infoHint = $('#tab-info .info-hint p');
        if (infoHint) { if (!infoHint.dataset.orig) infoHint.dataset.orig = infoHint.innerHTML; infoHint.innerHTML = ui.infoHint || infoHint.dataset.orig; }
        var searchInput = $('#search-input');
        if (searchInput) { if (!searchInput.dataset.orig) searchInput.dataset.orig = searchInput.placeholder; searchInput.placeholder = ui.searchPlaceholder || searchInput.dataset.orig; }
        // Tab labels
        tabBtns.forEach(function (b) {
          var label = b.querySelector('.tab-label');
          if (!label) return;
          if (!label.dataset.orig) label.dataset.orig = label.textContent;
          if (b.dataset.tab === 'tab-map') label.textContent = ui.tabMap || label.dataset.orig;
          if (b.dataset.tab === 'tab-itinerary') label.textContent = ui.tabItinerary || label.dataset.orig;
          if (b.dataset.tab === 'tab-info') label.textContent = ui.tabInfo || label.dataset.orig;
        });
      } else {
        // Restore originals
        var hero = $('.hero h1');
        if (hero && hero.dataset.orig) hero.innerHTML = hero.dataset.orig;
        var heroMeta = $('.hero-meta');
        if (heroMeta && heroMeta.dataset.orig) heroMeta.innerHTML = heroMeta.dataset.orig;
        if (expandBtn && expandBtn.dataset.orig) expandBtn.textContent = expandBtn.dataset.orig;
        if (collapseBtn && collapseBtn.dataset.orig) collapseBtn.textContent = collapseBtn.dataset.orig;
        var infoHint = $('#tab-info .info-hint p');
        if (infoHint && infoHint.dataset.orig) infoHint.innerHTML = infoHint.dataset.orig;
        var searchInput = $('#search-input');
        if (searchInput && searchInput.dataset.orig) searchInput.placeholder = searchInput.dataset.orig;
        tabBtns.forEach(function (b) {
          var label = b.querySelector('.tab-label');
          if (label && label.dataset.orig) label.textContent = label.dataset.orig;
        });
      }
    }

    langBtn.textContent = isZh ? '繁中' : 'EN';
  }

  if (langBtn) {
    langBtn.addEventListener('click', function () {
      isZh = !isZh;
      applyTranslations();
    });
  }

  /* ── Dark Mode ── */
  var themeBtn = $('#theme-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var html = document.documentElement;
      var current = html.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      themeBtn.textContent = next === 'dark' ? '☀️' : '🌙';
      try { localStorage.setItem('yunnan-theme', next); } catch (e) {}
    });
    // Restore saved theme
    try {
      var saved = localStorage.getItem('yunnan-theme');
      if (saved) {
        document.documentElement.setAttribute('data-theme', saved);
        themeBtn.textContent = saved === 'dark' ? '☀️' : '🌙';
      }
    } catch (e) {}
  }

  /* ── Search ── */
  var searchBtn = $('#search-btn');
  var searchOverlay = $('#search-overlay');
  var searchInput = $('#search-input');
  var searchResults = $('#search-results');
  var searchableEls = null;

  function buildSearchIndex() {
    if (searchableEls) return;
    searchableEls = $$('[data-search]').map(function (el) {
      return { el: el, text: el.textContent.toLowerCase(), label: el.dataset.search };
    });
  }

  function openSearch() {
    searchOverlay.classList.add('active');
    searchInput.value = '';
    searchInput.focus();
    searchResults.innerHTML = '';
    buildSearchIndex();
  }

  function closeSearch() {
    searchOverlay.classList.remove('active');
  }

  if (searchBtn && searchOverlay) {
    searchBtn.addEventListener('click', openSearch);
    searchOverlay.addEventListener('click', function (e) {
      if (e.target === searchOverlay) closeSearch();
    });
    document.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
      if (e.key === 'Escape' && searchOverlay.classList.contains('active')) closeSearch();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      var q = searchInput.value.toLowerCase().trim();
      if (!q || q.length < 2) { searchResults.innerHTML = ''; return; }
      var matches = searchableEls.filter(function (item) { return item.text.indexOf(q) !== -1; }).slice(0, 20);
      if (matches.length === 0) {
        searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
        return;
      }
      searchResults.innerHTML = matches.map(function (m) {
        var snippet = m.text.length > 120 ? m.text.substring(0, 120) + '…' : m.text;
        return '<button class="search-result-item" data-id="' + (m.el.id || '') + '"><strong>' + m.label + '</strong><br><span class="snippet">' + snippet + '</span></button>';
      }).join('');
      $$('.search-result-item', searchResults).forEach(function (btn) {
        btn.addEventListener('click', function () {
          var idx = Array.from(searchResults.children).indexOf(btn);
          var match = matches[idx];
          if (match && match.el) {
            closeSearch();
            // Make sure the parent tab is visible
            var panel = match.el.closest('.tab-panel');
            if (panel) switchTab(panel.id);
            // Expand parent containers
            var dayCard = match.el.closest('.day-card');
            if (dayCard) { dayCard.classList.remove('collapsed'); }
            var section = match.el.closest('.section');
            if (section) { section.classList.remove('collapsed'); }
            var collapsibleBody = match.el.closest('.collapsible-body');
            if (collapsibleBody) { collapsibleBody.style.display = 'block'; }
            match.el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            match.el.style.outline = '2px solid #c2583a';
            setTimeout(function () { match.el.style.outline = ''; }, 2000);
          }
        });
      });
    });
  }

  /* ── Back to Top ── */
  var backToTop = $('#back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Progress Bar ── */
  var progressBar = $('#progress-bar');
  if (progressBar) {
    window.addEventListener('scroll', function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var pct = h > 0 ? (window.scrollY / h) * 100 : 0;
      progressBar.style.width = pct + '%';
    });
  }

  /* ── Nav auto-hide on scroll ── */
  var nav = $('#top-nav');
  var lastScroll = 0;
  if (nav) {
    window.addEventListener('scroll', function () {
      var st = window.scrollY;
      if (st > 200 && st > lastScroll) {
        nav.classList.add('nav-hidden');
      } else {
        nav.classList.remove('nav-hidden');
      }
      lastScroll = st;
    });
  }

  /* ── Init: open first day card on load ── */
  var firstDay = $('#day1');
  if (firstDay) {
    firstDay.classList.remove('collapsed');
    var fh = firstDay.querySelector('.day-card-header');
    if (fh) fh.setAttribute('aria-expanded', 'true');
  }

})();
