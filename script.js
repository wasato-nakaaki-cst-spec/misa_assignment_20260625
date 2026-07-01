// グローバルスタイルの追加
const style = document.createElement('style');
style.textContent = `
    @keyframes button-pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }

    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }

    @keyframes float-up {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes letter-pop {
        0% {
            opacity: 0;
            transform: translateY(20px) scale(0.5);
        }
        100% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    .language-selector {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 2000;
        background: white;
        border-radius: 8px;
        padding: 5px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        gap: 5px;
    }

    .lang-btn {
        padding: 8px 12px;
        border: none;
        background: transparent;
        cursor: pointer;
        font-weight: 500;
        color: #666;
        border-radius: 5px;
        transition: all 0.3s ease;
    }

    .lang-btn:hover {
        background: #f0f0f0;
    }

    .lang-btn.active {
        background: var(--primary-color);
        color: white;
    }
`;
document.head.appendChild(style);

// 言語管理システム
let languageMetadata = {};
let languageData = {};
let currentLanguage = 'ja';

// 言語メタデータと言語データを読み込む
async function loadLanguages() {
    try {
        // 言語一覧を読み込む
        const metaResponse = await fetch('data/languages.json');
        languageMetadata = await metaResponse.json();
        console.log('言語メタデータ読み込み成功:', languageMetadata);

        // 初期言語（日本語）のデータを読み込む
        await loadLanguageData('ja');
        console.log('日本語データ読み込み成功');

        updatePageContent();
        initLanguageSelector();
        initNavLanguageSelector();
        initMobileLanguageSelector();
        console.log('言語セレクター初期化完了');

        await loadStoredLanguage();
    } catch (error) {
        console.error('言語ファイルの読み込みに失敗しました:', error);
    }
}

// 指定言語のデータを読み込む
async function loadLanguageData(lang) {
    try {
        const langInfo = languageMetadata[lang];
        if (!langInfo) {
            console.error(`言語 ${lang} が見つかりません`);
            return;
        }

        const filePath = `data/locales/${langInfo.file}`;
        const response = await fetch(filePath);
        languageData = await response.json();
    } catch (error) {
        console.error(`言語ファイル読み込みエラー (${lang}):`, error);
    }
}

// 言語セレクターを初期化
function initLanguageSelector() {
    const buttons = document.querySelectorAll('.lang-btn');
    if (!buttons.length) return;

    buttons.forEach(btn => {
        btn.addEventListener('click', async () => {
            const lang = btn.dataset.lang;
            await switchLanguage(lang);
        });
    });

    updateLanguageButtons();
}

// 言語を切り替え
async function switchLanguage(lang) {
    console.log('言語切り替え開始:', lang);
    currentLanguage = lang;
    localStorage.setItem('selectedLanguage', lang);
    await loadLanguageData(lang);
    console.log('言語データ読み込み完了:', lang);
    updatePageContent();
    updateLanguageButtons();
    updateNavLanguageLabel();
    updateMobileLanguageButtons();
    updateMobileLanguageLabel();
    closeNavLanguageMenu();
    console.log('言語切り替え完了:', lang);
}

// 言語ボタンの状態を更新
function updateLanguageButtons() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === currentLanguage);
    });
}

// メニューバーの言語セレクターを初期化
function initNavLanguageSelector() {
    const navLangBtn = document.getElementById('navLangBtn');
    const navLangMenu = document.getElementById('navLangMenu');
    const navLangOptions = document.querySelectorAll('.nav-lang-option');

    if (!navLangBtn || !navLangMenu || !navLangOptions.length) return;

    // ボタンクリックでメニュー開閉
    navLangBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navLangMenu.style.display = navLangMenu.style.display === 'none' ? 'flex' : 'none';
    });

    // メニューアイテムクリックで言語切り替え
    navLangOptions.forEach(option => {
        option.addEventListener('click', async () => {
            const lang = option.dataset.lang;
            await switchLanguage(lang);
        });
    });

    // ドキュメント外クリックでメニュー非表示
    document.addEventListener('click', () => {
        navLangMenu.style.display = 'none';
    });

    updateNavLanguageLabel();
}

// メニューバーの言語ラベルを更新
function updateNavLanguageLabel() {
    const navLangLabel = document.getElementById('navLangLabel');
    if (navLangLabel && languageData && languageData.footer && languageData.footer.language) {
        navLangLabel.textContent = languageData.footer.language;
    }
}

// メニューバーの言語メニューを閉じる
function closeNavLanguageMenu() {
    const navLangMenu = document.getElementById('navLangMenu');
    if (navLangMenu) {
        navLangMenu.style.display = 'none';
    }
}

// モバイル用言語セレクターを初期化
function initMobileLanguageSelector() {
    const mobileLangBtn = document.getElementById('navMobileLangBtn');
    const languageModal = document.getElementById('languageModal');
    const modalCloseBtn = languageModal?.querySelector('.modal-close');
    const modalOptions = document.querySelectorAll('.language-modal-option');

    if (!mobileLangBtn || !languageModal || !modalOptions.length) return;

    // ボタンクリックでモーダルを開く
    mobileLangBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        languageModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // モーダルクローズボタン
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => {
            languageModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }

    // モーダル外クリックでクローズ
    languageModal.addEventListener('click', (e) => {
        if (e.target === languageModal) {
            languageModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // 言語オプションをクリック
    modalOptions.forEach(option => {
        option.addEventListener('click', async () => {
            const lang = option.dataset.lang;
            await switchLanguage(lang);
            languageModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    updateMobileLanguageButtons();
}

// モバイル用言語ボタンの状態を更新
function updateMobileLanguageButtons() {
    document.querySelectorAll('.nav-mobile-lang-option').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === currentLanguage);
    });
    // モーダル内の言語ボタンも更新
    document.querySelectorAll('.language-modal-option').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === currentLanguage);
    });
}

// モバイル用言語ラベルを更新
function updateMobileLanguageLabel() {
    const mobileLangLabel = document.getElementById('navMobileLangLabel');
    if (mobileLangLabel && languageData && languageData.footer && languageData.footer.language) {
        mobileLangLabel.textContent = languageData.footer.language;
    }
}

// 保存された言語を読み込む
async function loadStoredLanguage() {
    const stored = localStorage.getItem('selectedLanguage');
    if (stored && languageMetadata[stored]) {
        currentLanguage = stored;
        await loadLanguageData(stored);
        updatePageContent();
        updateLanguageButtons();
        updateNavLanguageLabel();
        updateMobileLanguageButtons();
        updateMobileLanguageLabel();
    }
}

// ページコンテンツを更新
function updatePageContent() {
    const t = languageData;
    if (!t) return;

    // 言語選択モーダルのタイトルを更新
    const languageModalTitle = document.getElementById('languageModalTitle');
    if (languageModalTitle && t.language && t.language.title) {
        languageModalTitle.textContent = t.language.title;
    }

    // ナビゲーション
    const logo = document.querySelector('a.logo');
    if (logo) logo.textContent = `🌸 ${t.nav.brand}`;
    updateNavLinks();

    // ヒーロー
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.innerHTML = '';
        const text = t.hero.title;
        [...text].forEach((char, index) => {
            const span = document.createElement('span');
            // スペースの場合は非改行スペースを使用
            span.textContent = char === ' ' ? ' ' : char;
            span.style.animation = `letter-pop 0.5s ease ${index * 50}ms both`;
            span.style.display = 'inline-block';
            heroTitle.appendChild(span);
        });
    }

    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) heroSubtitle.textContent = t.hero.subtitle;

    const heroDesc = document.querySelector('.hero-description');
    if (heroDesc) heroDesc.innerHTML = t.hero.description;

    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) ctaButton.textContent = t.hero.cta;

    // セクションタイトル
    document.querySelectorAll('.section-title').forEach((el, idx) => {
        if (idx === 0) el.textContent = t.spots.title;
        else if (idx === 1) el.textContent = t.gourmet.title;
        else if (idx === 2) el.textContent = t.seasons.title;
        else if (idx === 3) el.textContent = t.access.title;
    });

    // その他の要素を更新
    updateOverviewCards();
    updateStats();
    updateSpotCards();
    updateGourmetCards();
    updateSeasonCards();
    updateAccessCards();
    updateNewsletter();
    updateFooter();
    updateContactForm();
    updatePhotoCredits();
}

function updateNavLinks() {
    const t = languageData;
    const navLinks = document.querySelectorAll('.nav-link');
    const linkMap = {
        '#home': t.nav.home,
        '#spots': t.nav.spots,
        '#gourmet': t.nav.gourmet,
        '#seasons': t.nav.seasons,
        '#access': t.nav.access
    };

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (linkMap[href]) link.textContent = linkMap[href];
    });
}

function updateOverviewCards() {
    const t = languageData;
    const cards = document.querySelectorAll('.overview-card');
    const data = [
        { title: t.overview.title1, desc: t.overview.desc1 },
        { title: t.overview.title2, desc: t.overview.desc2 },
        { title: t.overview.title3, desc: t.overview.desc3 }
    ];

    cards.forEach((card, idx) => {
        if (data[idx]) {
            const h3 = card.querySelector('h3');
            const p = card.querySelector('p');
            if (h3) h3.textContent = data[idx].title;
            if (p) p.textContent = data[idx].desc;
        }
    });
}

function updateStats() {
    const t = languageData;
    const statLabels = document.querySelectorAll('.stat-label');
    statLabels.forEach((label, idx) => {
        if (idx === 0) label.textContent = t.stats.visitors;
        else if (idx === 1) label.textContent = t.stats.history;
        else if (idx === 2) label.textContent = t.stats.hotsprings;
    });
}

function updateSpotCards() {
    const t = languageData;
    const spotCards = document.querySelectorAll('.spot-card');
    const spotsArray = ['matsushima', 'sendai', 'shiogama', 'naruko', 'kesennuma', 'zao'];

    spotCards.forEach((card, idx) => {
        const spotKey = spotsArray[idx];
        if (t.spots[spotKey]) {
            const h3 = card.querySelector('h3');
            const p = card.querySelector('p');
            const link = card.querySelector('.spot-link');
            if (h3) h3.textContent = t.spots[spotKey].name;
            if (p) p.textContent = t.spots[spotKey].desc;
            if (link) link.textContent = t.common.details;
        }
    });
}

function updateGourmetCards() {
    const t = languageData;
    const gourmetCards = document.querySelectorAll('.gourmet-card');
    const gourmetArray = ['gyutan', 'zunda', 'kaki', 'sasakama', 'fukahire', 'harako'];

    gourmetCards.forEach((card, idx) => {
        const gourmetKey = gourmetArray[idx];
        if (t.gourmet[gourmetKey]) {
            const h3 = card.querySelector('h3');
            const p = card.querySelector('p');
            if (h3) h3.textContent = t.gourmet[gourmetKey].name;
            if (p) p.textContent = t.gourmet[gourmetKey].desc;
        }
    });
}

function updateSeasonCards() {
    const t = languageData;
    const seasonTabs = document.querySelectorAll('.season-tab');
    seasonTabs.forEach((tab, idx) => {
        const seasonKey = tab.dataset.season;
        const seasonText = t.seasons[seasonKey];
        if (seasonText) {
            const icon = tab.textContent.split(' ')[0];
            tab.textContent = `${icon} ${seasonText}`;
        }
    });

    const seasonCards = document.querySelectorAll('.season-card');
    seasonCards.forEach(card => {
        const seasonKey = card.dataset.season;
        const seasonData = t.seasons[seasonKey + 'Period'];
        const seasonItems = t.seasons[seasonKey + 'Items'];

        if (seasonData) {
            const pTag = card.querySelector('p');
            if (pTag) pTag.innerHTML = `<strong>${seasonData}</strong>`;
        }

        if (seasonItems) {
            const ul = card.querySelector('ul');
            if (ul) {
                ul.innerHTML = seasonItems.map((item, idx) => {
                    const icon = ul.children[idx]?.getAttribute('data-icon') || '🌸';
                    return `<li data-icon="${icon}">${item}</li>`;
                }).join('');
            }
        }
    });
}

function updateAccessCards() {
    const t = languageData;

    // アクセスセクションのリード文を更新
    const accessLead = document.querySelector('.access-lead');
    if (accessLead) {
        accessLead.textContent = t.access.lead;
    }

    const accessCards = document.querySelectorAll('.access-card');
    const accessData = [t.access.airplane, t.access.shinkansen, t.access.car];

    accessCards.forEach((card, idx) => {
        if (accessData[idx]) {
            const h3 = card.querySelector('h3');
            const desc = card.querySelector(':scope > p');
            const ul = card.querySelector('ul');

            if (h3) h3.textContent = accessData[idx].title;
            if (desc) desc.textContent = accessData[idx].desc;
            if (ul && accessData[idx].items) {
                ul.innerHTML = accessData[idx].items.map(item => `<li>${item}</li>`).join('');
            }
        }
    });
}

function updateNewsletter() {
    const t = languageData;
    const newsletter = document.querySelector('.newsletter');
    if (newsletter) {
        const h2 = newsletter.querySelector('h2');
        const p = newsletter.querySelector('.newsletter-content p');
        const input = newsletter.querySelector('input');
        const button = newsletter.querySelector('.subscribe-btn');

        if (h2) h2.textContent = t.newsletter.title;
        if (p) p.textContent = t.newsletter.desc;
        if (input) input.placeholder = t.newsletter.placeholder;
        if (button) button.textContent = t.newsletter.button;
    }
}

function updateFooter() {
    const t = languageData;
    const footerSections = document.querySelectorAll('.footer-section');

    footerSections.forEach((section, idx) => {
        const h4 = section.querySelector('h4');
        const links = section.querySelectorAll('a');

        if (idx === 0) {
            if (h4) h4.textContent = t.footer.tourism;
            links[0].textContent = t.footer.official;
            links[1].textContent = t.footer.events;
        } else if (idx === 1) {
            if (h4) h4.textContent = t.footer.support;
            links[0].textContent = t.footer.contact;
            links[1].textContent = t.footer.faq;
            links[2].textContent = t.footer.privacy;
        } else if (idx === 2) {
            if (h4) h4.textContent = t.footer.follow;
            links[0].textContent = t.footer.facebook;
            links[1].textContent = t.footer.instagram;
            links[2].textContent = t.footer.x;
        } else if (idx === 3) {
            if (h4) h4.textContent = t.footer.language;
        }
    });
}

function updatePhotoCredits() {
    const t = languageData;
    const photoCredits = document.querySelector('.photo-credits');
    if (!photoCredits || !t.photoCredits) {
        console.log('photoCredits update skipped:', {photoCredits: !!photoCredits, t_photoCredits: !!t.photoCredits});
        return;
    }

    // 見出しを更新（リンク部分はそのまま）
    const heading = photoCredits.querySelector('p');
    if (heading) {
        heading.innerHTML = t.photoCredits.title;
    }

    // リスト項目を更新
    const items = photoCredits.querySelectorAll('li');
    const itemKeys = ['heroBackground', 'matsushima', 'naruko', 'kesennuma', 'zao', 'zunda', 'sasakama', 'fukahire', 'harako', 'springCherry', 'summerTanabata', 'autumnNaruko', 'winterZao'];

    items.forEach((item, idx) => {
        const key = itemKeys[idx];
        const translation = t.photoCredits.items[key];

        if (key && translation) {
            // li タグの内容を保持しながら、最初のテキストノードを置き換え
            const originalHTML = item.innerHTML;
            // EM ダッシュ「—」（U+2014）を検索（&mdash; ではなく実際の文字）
            const dashIndex = originalHTML.indexOf('—');
            if (dashIndex !== -1) {
                const rest = originalHTML.substring(dashIndex);
                item.innerHTML = `${translation} ${rest}`;
            }
        }
    });
}

function updateContactForm() {
    const t = languageData;
    const modal = document.getElementById('contactModal');
    if (modal) {
        const title = modal.querySelector('h2');
        const labels = modal.querySelectorAll('label');
        const button = modal.querySelector('.submit-btn');

        if (title) title.textContent = t.contact.title;
        if (labels[0]) labels[0].textContent = t.contact.name;
        if (labels[1]) labels[1].textContent = t.contact.email;
        if (labels[2]) labels[2].textContent = t.contact.message;
        if (button) button.textContent = t.contact.submit;
    }
}

// モダンなスクロールアニメーション
document.addEventListener('DOMContentLoaded', async () => {
    // 言語機能の初期化
    await loadLanguages();

    // Intersection Observer for lazy animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px 80px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // 要素が見える時にクラス追加（アニメーション発動）
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, index * 80);
                // 一度発動したら監視を解除（点滅防止・1回のみ）
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // reveal アニメーションの要素を監視
    const revealElements = document.querySelectorAll('.reveal, .reveal-left');
    revealElements.forEach(el => {
        observer.observe(el);
    });

    setupSmoothScroll();
    setupCounterAnimation();
    setupNavigation();
    setupModal();
    setupNewsletterForm();
    setupContactForm();
    setupParallax();
    setupStickyNav();
    setupScrollEffects();
    setupScrollProgress();
    setupSeasonTabs();
});

// 季節タブ切り替え
function setupSeasonTabs() {
    const tabs = document.querySelectorAll('.season-tab');
    const cards = document.querySelectorAll('.season-card');

    if (!tabs.length || !cards.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const season = tab.getAttribute('data-season');

            // タブのアクティブ状態を切り替え
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // カードの表示を切り替え
            cards.forEach(card => {
                if (card.getAttribute('data-season') === season) {
                    card.classList.add('active');
                } else {
                    card.classList.remove('active');
                }
            });
        });
    });
}

// スムーススクロール
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // お問い合わせモーダルのトリガーはスクロール対象外（モーダル側で処理）
            if (this.getAttribute('href') === '#contact') return;
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// カウントアップアニメーション（1回のみ）
function setupCounterAnimation() {
    const counters = document.querySelectorAll('.counter');
    let animated = false;

    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2500;
        const startTime = Date.now();

        const updateCounter = () => {
            const currentTime = Date.now();
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // イージング関数
            const easeOutQuint = 1 - Math.pow(1 - progress, 5);
            const currentValue = Math.floor(target * easeOutQuint);

            element.textContent = currentValue.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        };

        updateCounter();
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                counters.forEach((counter, index) => {
                    setTimeout(() => animateCounter(counter), index * 150);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
}

// ナビゲーション機能
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => {
                l.style.color = 'inherit';
                l.style.textDecoration = 'none';
            });
            this.style.color = 'var(--primary-color)';
            this.style.textDecoration = 'underline wavy var(--primary-color)';
        });
    });

    window.addEventListener('scroll', () => {
        updateActiveNavLink();
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 150;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.style.color = 'inherit';
                link.style.textDecoration = 'none';
            });
            
            const activeLink = document.querySelector(`.nav-link[href="#${section.id}"]`);
            if (activeLink) {
                activeLink.style.color = 'var(--primary-color)';
                activeLink.style.textDecoration = 'underline wavy var(--primary-color)';
            }
        }
    });
}

// モーダル機能
function setupModal() {
    const modal = document.getElementById('contactModal');
    const closeBtn = modal?.querySelector('.modal-close');
    const contactLink = document.querySelector('a[href="#contact"]');

    if (contactLink) {
        contactLink.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    function openModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.animation = 'slideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// ニュースレターフォーム
function setupNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('ありがとうございます！メールを送信しました。', 'success');
        form.reset();
        
        const btn = form.querySelector('.subscribe-btn');
        btn.style.animation = 'button-pulse 0.6s ease';
    });
}

// コンタクトフォーム
function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('お問い合わせをありがとうございました！', 'success');
        form.reset();
        
        setTimeout(() => {
            document.getElementById('contactModal').classList.remove('active');
            document.body.style.overflow = 'auto';
        }, 1500);
    });
}

// 通知表示
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? 'linear-gradient(135deg, #FF6B9D 0%, #FFB6D9 100%)' : '#ff6b6b'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        animation: slideInRight 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// パラレックス効果
function setupParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const elements = document.querySelectorAll('.hero');
        
        elements.forEach(el => {
            el.style.backgroundPosition = `center ${scrolled * 0.5}px`;
        });
    }, { passive: true });
}

// メニューバーの開閉トグル
function setupStickyNav() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');

    if (!navbar || !navToggle) return;

    const icon = navToggle.querySelector('.nav-toggle-icon');
    const isMobile = () => window.matchMedia('(max-width: 960px)').matches;

    // アイコンを現在の状態に合わせて更新
    const syncIcon = () => {
        if (isMobile()) {
            // スマホ：メニュー（リンク）が開いていれば×、閉じていれば☰
            icon.textContent = navbar.classList.contains('nav-open') ? '✕' : '☰';
        } else {
            // PC：バーが表示中なら×、非表示なら☰
            icon.textContent = navbar.classList.contains('hidden') ? '☰' : '✕';
        }
    };

    syncIcon();

    // ボタンクリック：スマホはリンク開閉、PCはバー表示/非表示
    navToggle.addEventListener('click', () => {
        if (isMobile()) {
            navbar.classList.toggle('nav-open');
        } else {
            navbar.classList.toggle('hidden');
            document.body.classList.toggle('nav-closed');
        }
        syncIcon();
    });

    // スマホ：リンクをタップしたらメニューを閉じる
    navbar.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (isMobile()) {
                navbar.classList.remove('nav-open');
                syncIcon();
            }
        });
    });

    // スマホ：メニュー外をタップしたらメニューを閉じる
    const languageModal = document.getElementById('languageModal');
    document.addEventListener('click', (e) => {
        if (!isMobile()) return;
        if (!navbar.classList.contains('nav-open')) return;
        // ナビバー内・トグルボタンのクリックは除外
        if (navbar.contains(e.target) || navToggle.contains(e.target)) return;
        // 言語選択モーダル内のクリックは除外（メニューを開いたままにする）
        if (languageModal && languageModal.contains(e.target)) return;
        navbar.classList.remove('nav-open');
        syncIcon();
    });

    // ブレークポイントをまたいだ時に状態をリセット
    window.addEventListener('resize', () => {
        navbar.classList.remove('nav-open', 'hidden');
        document.body.classList.remove('nav-closed');
        syncIcon();
    });
}

// スクロール進捗バー
function setupScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;

    const updateProgress = () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
        bar.style.width = progress + '%';
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();
}

// スクロールエフェクト
function setupScrollEffects() {
    window.addEventListener('scroll', () => {
        // スマホではアイコンを本文下に通常配置するため視差は無効
        if (window.matchMedia('(max-width: 960px)').matches) return;

        const scrolled = window.pageYOffset;

        // 浮遊要素
        const floatingElements = document.querySelectorAll('.floating-element');
        floatingElements.forEach((el, index) => {
            const speed = 0.5 + index * 0.1;
            el.style.transform = `translateY(${scrolled * speed}px) rotateZ(${scrolled * 0.1}deg)`;
        });

    }, { passive: true });
}

// テキストアニメーション
function setupTextAnimation() {
    const titleElements = document.querySelectorAll('.hero-title');

    titleElements.forEach(el => {
        const text = el.textContent;
        el.innerHTML = '';

        [...text].forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.animation = `letter-pop 0.5s ease ${index * 50}ms both`;
            span.style.display = 'inline-block';
            el.appendChild(span);
        });
    });
}

// キーボードナビゲーション
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('contactModal');
        if (modal && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
});

// ページロード
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateX(0)';
    }
});

// 最後に: ページ初期化完了
window.pageReady = true;
console.log('🎉 宮城県観光PRサイトが読み込まれました！');
console.log('✨ ポップでキュートな動きをお楽しみください！');
