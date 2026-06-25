document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. スクロール連動アニメーション (多彩な動きに対応)
    // ==========================================================================
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -15% 0px', // 画面の下から15%入ったところで発火
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-active');
            } else {
                // スクロール外に出たらクラスを外し、再度動くようにする
                entry.target.classList.remove('is-active');
            }
        });
    }, observerOptions);

    // 今回追加した全てのアニメーションクラスを取得
    const animateElements = document.querySelectorAll('.js-fade-up, .js-slide-left, .js-slide-right, .js-zoom-in');

    animateElements.forEach((el, index) => {
        // ギャラリー画像など、横並びの要素が順番に出るようにディレイ（時間差）を設定
        if (el.classList.contains('js-zoom-in') || el.classList.contains('spot-item')) {
            // 要素のインデックス番号を利用して、少しずつ遅らせる
            const delay = (index % 6) * 0.1;
            el.style.transitionDelay = `${delay}s`;
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
                    // 背景画像をスクロール量に合わせて少し下にずらす
                    if (headerBg) {
                        // ケン・バーンズ効果（CSS）と競合しないよう、親要素や配置で工夫していますが
                        // ここでは背景のY軸のみスクロールで操作します
                        headerBg.style.transform = `translateY(${scrolled * 0.4}px) scale(1.1)`; 
                    }
                    // 文字コンテンツは少し早く下げつつ、透明にしていく
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
