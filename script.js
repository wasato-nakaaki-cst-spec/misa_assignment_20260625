document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. スクロール連動アニメーション (画面外に出たらリセットされ、何度でも動く)
    // ==========================================================================
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px', // 画面の下から10%入ったところで発火
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 画面内に入ったらクラスを付与
                entry.target.classList.add('is-active');
            } else {
                // 画面外に出たらクラスを削除（これにより再度スクロールした時にアニメーションが再実行されます）
                entry.target.classList.remove('is-active');
            }
        });
    }, observerOptions);

    // アニメーションさせたい要素を取得
    const animateElements = document.querySelectorAll('.card:not(.transparent-card), .spot-item, .access-section');

    animateElements.forEach((el, index) => {
        el.classList.add('js-fade-up');
        
        // スポット一覧のカードには、上から順番に現れるようにディレイ（時間差）を設定
        if (el.classList.contains('spot-item')) {
            el.style.transitionDelay = `${index * 0.15}s`;
        }
        
        observer.observe(el);
    });

    // ==========================================================================
    // 2. ヘッダーのパララックス（視差効果）
    // ==========================================================================
    const headerBg = document.querySelector('.header-bg');
    const headerContent = document.querySelector('.header-content');
    
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                
                // ヘッダーが見えている範囲でのみ計算
                if (scrolled < window.innerHeight) {
                    // 背景画像をスクロール量に合わせて少し下にずらす（視差）
                    if (headerBg) {
                        headerBg.style.transform = `translateY(${scrolled * 0.4}px)`;
                    }
                    // 文字コンテンツは少し早く下げつつ、透明にしていく
                    if (headerContent) {
                        headerContent.style.transform = `translateY(${scrolled * 0.2}px)`;
                        headerContent.style.opacity = `${1 - (scrolled * 0.003)}`;
                    }
                }
                ticking = false;
            });
            ticking = true;
        }
    });
});