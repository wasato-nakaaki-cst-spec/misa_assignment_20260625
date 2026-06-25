// モダンなスクロールアニメーション
document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for lazy animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // reveal アニメーションの要素を監視
    const revealElements = document.querySelectorAll('.reveal, .reveal-left');
    revealElements.forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });

    // スムーススクロール機能
    setupSmoothScroll();

    // カウントアップアニメーション
    setupCounterAnimation();

    // ナビゲーションスムーズスクロール
    setupNavigation();

    // モーダル機能
    setupModal();

    // ニュースレターフォーム
    setupNewsletterForm();

    // コンタクトフォーム
    setupContactForm();

    // パラレックス効果
    setupParallax();

    // ナビゲーションのスティッキー効果
    setupStickyNav();

    // スクロール時のホバーエフェクト
    setupScrollEffects();
});

// スムーススクロール
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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

// カウントアップアニメーション
function setupCounterAnimation() {
    const counters = document.querySelectorAll('.counter');
    let animated = false;

    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const startTime = Date.now();
        const startValue = 0;

        const updateCounter = () => {
            const currentTime = Date.now();
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // イージング関数
            const easeOutQuad = 1 - Math.pow(1 - progress, 2);
            const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuad);

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
                counters.forEach(counter => animateCounter(counter));
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
            navLinks.forEach(l => l.style.color = 'inherit');
            this.style.color = 'var(--primary-color)';
        });
    });

    // スクロール時のアクティブナビゲーション更新
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
            navLinks.forEach(link => link.style.color = 'inherit');
            
            const activeLink = document.querySelector(`.nav-link[href="#${section.id}"]`);
            if (activeLink) {
                activeLink.style.color = 'var(--primary-color)';
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
        const email = form.querySelector('input[type="email"]').value;
        
        // シミュレーション
        showNotification('ありがとうございます！メールを送信しました。', 'success');
        form.reset();
    });
}

// コンタクトフォーム
function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };

        // シミュレーション
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
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
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
    });
}

// スティッキーナビゲーション
function setupStickyNav() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;

        if (scrollTop > 100) {
            if (scrollTop > lastScrollTop) {
                // 下へスクロール
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // 上へスクロール
                navbar.style.transform = 'translateY(0)';
            }
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    navbar.style.transition = 'transform 0.3s ease';
}

// スクロールエフェクト
function setupScrollEffects() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const floatingElements = document.querySelectorAll('.floating-element');

        floatingElements.forEach((el, index) => {
            const speed = 0.5 + index * 0.1;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// リップルエフェクト（ボタンクリック時）
document.addEventListener('click', (e) => {
    const target = e.target;
    
    if (target.classList.contains('cta-button') || 
        target.classList.contains('submit-btn') ||
        target.classList.contains('subscribe-btn')) {
        createRipple(e, target);
    }
});

function createRipple(e, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        left: ${x}px;
        top: ${y}px;
        animation: rippleAnimation 0.6s ease-out;
        pointer-events: none;
    `;

    // スタイルシートに追加
    if (!document.getElementById('ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = `
            @keyframes rippleAnimation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            button, a {
                position: relative;
                overflow: hidden;
            }
        `;
        document.head.appendChild(style);
    }

    element.style.position = 'relative';
    element.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
}

// スクロール時のカード効果
document.addEventListener('scroll', () => {
    const cards = document.querySelectorAll('.spot-card, .gourmet-card, .access-card');
    
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
            const scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
            card.style.opacity = Math.min(scrollPercent + 0.3, 1);
        }
    });
});

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

// ページロード時のアニメーション
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    
    // ヒーロー要素にフェードインエフェクト
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateX(0)';
    }
});

// リサイズ時のレスポンシブ調整
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    
    if (width <= 768) {
        document.querySelector('.nav-links').style.fontSize = '0.9rem';
    } else {
        document.querySelector('.nav-links').style.fontSize = '1rem';
    }
});

// パフォーマンス最適化: Passive Event Listener
window.addEventListener('scroll', () => {
    // スクロール処理
}, { passive: true });

// ホイールスクロールの遅延ローディング用
document.addEventListener('wheel', () => {
    // 画像のLazy loading などここで処理可能
}, { passive: true });

// 追加: カスタムカーソル効果（オプション）
document.addEventListener('mousemove', (e) => {
    const buttons = document.querySelectorAll('.cta-button, .submit-btn, .subscribe-btn');
    
    buttons.forEach(btn => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const isNear = x > -50 && x < rect.width + 50 && y > -50 && y < rect.height + 50;
        
        if (isNear) {
            btn.style.cursor = 'pointer';
        }
    });
});

// スクロール位置の記憶と復元
window.addEventListener('beforeunload', () => {
    sessionStorage.setItem('scrollPosition', window.scrollY);
});

window.addEventListener('load', () => {
    const scrollPosition = sessionStorage.getItem('scrollPosition');
    if (scrollPosition) {
        window.scrollTo(0, parseInt(scrollPosition));
    }
});

// パフォーマンス監視（開発用）
if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        const perfTiming = window.performance.timing;
        const pageLoadTime = perfTiming.loadEventEnd - perfTiming.navigationStart;
        console.log('Page Load Time: ' + pageLoadTime + 'ms');
    });
}

// ナビゲーションリンクのアクティブ状態管理
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function() {
        document.querySelectorAll('.nav-link').forEach(l => {
            l.style.color = 'var(--text-dark)';
        });
        this.style.color = 'var(--primary-color)';
    });
});

// グローバルエラーハンドリング
window.addEventListener('error', (event) => {
    console.error('Error:', event.error);
});

// 最後に: ページ初期化完了フラグ
window.pageReady = true;
console.log('🎉 宮城県観光PRサイトが読み込まれました！');
