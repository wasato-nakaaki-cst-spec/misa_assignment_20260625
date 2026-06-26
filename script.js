// グローバルスタイルの追加
const style = document.createElement('style');
style.textContent = `
    @keyframes particle-float {
        0% { 
            opacity: 1; 
            transform: translate(0, 0) scale(1);
        }
        100% { 
            opacity: 0; 
            transform: translate(${Math.random() * 100 - 50}px, -100px) scale(0);
        }
    }
    
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
`;
document.head.appendChild(style);

// モダンなスクロールアニメーション
document.addEventListener('DOMContentLoaded', () => {
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
    setupTextAnimation();
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
                createClickAnimation(e);
            }
        });
    });
}

// クリック時のパーティクル効果
function createClickAnimation(e) {
    const x = e.clientX;
    const y = e.clientY;
    const particles = ['✨', '🌸', '💫', '⭐', '✨'];

    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        const randomX = (Math.random() - 0.5) * 200;
        const randomY = (Math.random() - 0.5) * 200 - 100;
        
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            font-size: 1.5rem;
            opacity: 1;
            z-index: 9999;
            animation: particle-float 1s ease-out forwards;
            transform: translate(${randomX}px, ${randomY}px);
        `;
        particle.textContent = particles[i];
        document.body.appendChild(particle);

        setTimeout(() => particle.remove(), 1000);
    }
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
    const closeBtn = document.querySelector('.modal-close');
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
    const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

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

    // ブレークポイントをまたいだ時に状態をリセット
    window.addEventListener('resize', () => {
        navbar.classList.remove('nav-open', 'hidden');
        document.body.classList.remove('nav-closed');
        syncIcon();
    });
}

// スクロールエフェクト
function setupScrollEffects() {
    window.addEventListener('scroll', () => {
        // スマホではアイコンを本文下に通常配置するため視差は無効
        if (window.matchMedia('(max-width: 768px)').matches) return;

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
