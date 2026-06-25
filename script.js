document.addEventListener('DOMContentLoaded', () => {
    // 1. スクロール連動アニメーション
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -15% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-active');
            } else {
                entry.target.classList.remove('is-active');
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.js-fade-up, .js-slide-left, .js-slide-right, .js-zoom-in');

    animateElements.forEach((el, index) => {
        if (el.classList.contains('js-zoom-in') || el.classList.contains('spot-item')) {
            const delay = (index % 6) * 0.1;
            el.style.transitionDelay = `${delay}s`;
        }
        observer.observe(el);
    });

    // 2. ヘッダーのパララックス
    const headerBg = document.querySelector('.header-bg');
    const headerContent = document.querySelector('.header-content');
    
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                if (scrolled < window.innerHeight) {
                    if (headerBg) {
                        headerBg.style.transform = `translateY(${scrolled * 0.4}px) scale(1.1)`; 
                    }
                    if (headerContent) {
                        headerContent.style.transform = `translateY(${scrolled * 0.25}px)`;
                        headerContent.style.opacity = `${1 - (scrolled * 0.0025)}`;
                    }
                }
                ticking = false;
            });
            ticking = true;
        }
    });
});
