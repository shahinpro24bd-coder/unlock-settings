(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();

    /* Mobile nav toggle fallback: if the Bootstrap bundle failed to load
       (or loads late), still open/close the menu manually — with a smooth
       height animation like Bootstrap's own collapse. */
    document.addEventListener('click', function (e) {
        var btn = e.target.closest ? e.target.closest('.navbar-toggler') : null;
        if (!btn) return;
        if (window.bootstrap && window.bootstrap.Collapse) return; // Bootstrap handles it
        var targetSel = btn.getAttribute('data-bs-target') || btn.getAttribute('data-target');
        var target = targetSel && document.querySelector(targetSel);
        if (!target || target.dataset.navAnimating) return;

        target.style.transition = 'height 0.35s ease';
        target.style.overflow = 'hidden';

        if (target.classList.contains('show')) {
            target.dataset.navAnimating = '1';
            target.style.height = target.scrollHeight + 'px';
            requestAnimationFrame(function () {
                requestAnimationFrame(function () { target.style.height = '0px'; });
            });
            target.addEventListener('transitionend', function h() {
                target.removeEventListener('transitionend', h);
                target.classList.remove('show');
                target.style.cssText = '';
                delete target.dataset.navAnimating;
            });
        } else {
            target.dataset.navAnimating = '1';
            target.classList.add('show');
            target.style.height = '0px';
            var full = target.scrollHeight + 'px';
            requestAnimationFrame(function () {
                requestAnimationFrame(function () { target.style.height = full; });
            });
            target.addEventListener('transitionend', function h() {
                target.removeEventListener('transitionend', h);
                target.style.cssText = '';
                delete target.dataset.navAnimating;
            });
        }
    });


    /* Sticky navbar + back-to-top: one passive, rAF-throttled scroll handler.
       State is only written when it actually changes, so scrolling never
       queues repeated jQuery animations (the old code did that on every
       single scroll event and made the page feel stuck). */
    var $sticky = $('.sticky-top');
    var $toTop = $('.back-to-top');
    var stickyOn = null;
    var topOn = null;
    var scrollTicking = false;

    function onScrollFrame() {
        scrollTicking = false;
        var y = window.pageYOffset || document.documentElement.scrollTop || 0;

        var wantSticky = y > 300;
        if (wantSticky !== stickyOn) {
            stickyOn = wantSticky;
            $sticky.toggleClass('shadow-sm', wantSticky).css('top', wantSticky ? '0px' : '-150px');
        }

        var wantTop = y > 100;
        if (wantTop !== topOn) {
            topOn = wantTop;
            $toTop.stop(true, true)[wantTop ? 'fadeIn' : 'fadeOut'](300);
        }
    }

    window.addEventListener('scroll', function () {
        if (scrollTicking) return;
        scrollTicking = true;
        requestAnimationFrame(onScrollFrame);
    }, { passive: true });
    onScrollFrame();

    /* smooth in-page anchor scrolling (CSS scroll-behavior is off for perf) */
    document.addEventListener('click', function (e) {
        var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
        if (!a) return;
        var href = a.getAttribute('href');
        if (!href || href === '#' || a.classList.contains('back-to-top')) return;
        var target = document.getElementById(href.slice(1));
        if (!target) return;
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: top, behavior: 'smooth' });
    });

    $toTop.click(function () {
        $('html, body').stop(true).animate({ scrollTop: 0 }, 700, 'easeInOutExpo');
        return false;
    });



    // Header carousel
    $(".header-carousel").owlCarousel({
        items: 1,
        autoplay: true,
        smartSpeed: 1000,
        loop: true,
        dots: false,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ]
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: false,
        smartSpeed: 1000,
        margin: 25,
        loop: true,
        center: true,
        dots: false,
        nav: true,
        navText : [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });







































        (function() {
        // premium toast notification
        function heroToast(msg, icon = '✨') {
            let toast = document.createElement('div');
            toast.innerHTML = `<span style="margin-right: 12px; font-size: 18px;">${icon}</span>${msg}`;
            toast.style.position = 'fixed';
            toast.style.bottom = '30px';
            toast.style.left = '50%';
            toast.style.transform = 'translateX(-50%) translateY(20px)';
            toast.style.backgroundColor = '#1e1c19';
            toast.style.color = '#fff3e6';
            toast.style.padding = '14px 28px';
            toast.style.borderRadius = '60px';
            toast.style.fontSize = '14px';
            toast.style.fontWeight = '500';
            toast.style.fontFamily = "'Inter', system-ui, sans-serif";
            toast.style.boxShadow = '0 20px 35px -8px rgba(0,0,0,0.25), 0 0 0 1px rgba(184,134,11,0.3)';
            toast.style.zIndex = '9999';
            toast.style.backdropFilter = 'blur(12px)';
            toast.style.background = 'rgba(0,0,0,0.85)';
            toast.style.border = '1px solid rgba(184,134,11,0.5)';
            toast.style.maxWidth = '85%';
            toast.style.textAlign = 'center';
            toast.style.letterSpacing = '0.3px';
            toast.style.transition = 'all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.2)';
            toast.style.opacity = '0';
            document.body.appendChild(toast);
            setTimeout(() => {
                toast.style.opacity = '1';
                toast.style.transform = 'translateX(-50%) translateY(0)';
            }, 20);
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(-50%) translateY(20px)';
                setTimeout(() => { if(toast.remove) toast.remove(); }, 400);
            }, 2700);
        }

        // Buttons events
const btnConsult = document.getElementById('heroBtn1');
const btnLibrary = document.getElementById('heroBtn2');

if (btnConsult) {
    btnConsult.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '#';
    });
}

if (btnLibrary) {
    btnLibrary.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '#';
    });
}

        // scroll reveal observer
        const revealEls = document.querySelectorAll('.hero35');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('hero36');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: "0px 0px -20px 0px" });
        revealEls.forEach(el => observer.observe(el));
        
        window.addEventListener('load', () => {
            revealEls.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight - 100) {
                    el.classList.add('hero36');
                    observer.unobserve(el);
                }
            });
        });

        /* 3D tilt on desktop — rAF throttled, geometry cached, and skipped
           while the hero is off screen so it costs nothing during scroll. */
        const imgWrap = document.getElementById('heroImgWrap');
        if (imgWrap && window.matchMedia('(min-width: 881px) and (hover: hover)').matches) {
            let rect = null;
            let pending = null;
            let ticking = false;
            let visible = true;

            const measure = () => { rect = imgWrap.getBoundingClientRect(); };
            measure();
            window.addEventListener('resize', measure, { passive: true });
            window.addEventListener('scroll', () => { rect = null; }, { passive: true });

            if ('IntersectionObserver' in window) {
                new IntersectionObserver((entries) => {
                    visible = entries[0].isIntersecting;
                    if (!visible) imgWrap.style.transform = '';
                }, { rootMargin: '100px' }).observe(imgWrap);
            }

            const render = () => {
                ticking = false;
                if (!pending || !visible) return;
                if (!rect) measure();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const maxRotate = 8;
                const rotX = Math.min(maxRotate, Math.max(-maxRotate, (pending.y - centerY) / 25));
                const rotY = Math.min(maxRotate, Math.max(-maxRotate, -(pending.x - centerX) / 25));
                imgWrap.style.transform =
                    `perspective(1000px) rotateX(${rotX * 0.6}deg) rotateY(${rotY * 0.6}deg) translateY(-4px)`;
            };

            imgWrap.style.transition = 'transform 0.2s ease-out';
            imgWrap.style.willChange = 'transform';

            document.addEventListener('mousemove', (e) => {
                if (!visible) return;
                pending = { x: e.clientX, y: e.clientY };
                if (ticking) return;
                ticking = true;
                requestAnimationFrame(render);
            }, { passive: true });

            document.addEventListener('mouseleave', () => {
                pending = null;
                imgWrap.style.transform = '';
            });
        }

        
        // subtle particle effect on image click
        const imgInner = document.querySelector('.hero32');
        if (imgInner) {
            imgInner.addEventListener('click', () => {
                const ripple = document.createElement('div');
                ripple.style.position = 'absolute';
                ripple.style.width = '40px';
                ripple.style.height = '40px';
                ripple.style.borderRadius = '50%';
                ripple.style.background = 'rgba(184,134,11,0.4)';
                ripple.style.top = '50%';
                ripple.style.left = '50%';
                ripple.style.transform = 'translate(-50%, -50%) scale(0)';
                ripple.style.pointerEvents = 'none';
                ripple.style.animation = 'heroRipple 0.6s ease-out forwards';
                imgInner.style.position = 'relative';
                imgInner.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
            });
        }
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `@keyframes heroRipple {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 0.7; }
            100% { transform: translate(-50%, -50%) scale(6); opacity: 0; }
        }`;
        document.head.appendChild(styleSheet);
    })();
    
})(jQuery);

