/**
 * 个人网站主要JavaScript文件
 * 实现导航、页面切换、动画效果等功能
 */

// 全局变量
let currentSection = 'home';
let isAnimating = false;

/**
 * 页面加载完成后初始化
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeAnimations();
    initializeTypewriter();
    initializeMobileMenu();
    initializeScrollEffects();
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
    
    // 显示首页
    showSection('home');
});

/**
 * 初始化导航功能
 */
function initializeNavigation() {
    // 绑定导航链接事件
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (isAnimating) return;
            
            const targetSection = this.getAttribute('data-section');
            
            // 特殊处理游戏链接
            if (targetSection === 'games-page') {
                window.location.href = 'games.html';
                return;
            }
            
            if (targetSection && targetSection !== currentSection) {
                showSection(targetSection);
                updateActiveNavLink(this);
            }
        });
    });
    
    // 绑定所有带有data-section属性的按钮事件
    const sectionButtons = document.querySelectorAll('[data-section]');
    
    sectionButtons.forEach(button => {
        // 避免重复绑定导航链接
        if (!button.classList.contains('nav-link')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                if (isAnimating) return;
                
                const targetSection = this.getAttribute('data-section');
                
                if (targetSection && targetSection !== currentSection) {
                    showSection(targetSection);
                    // 更新对应的导航链接状态
                    const correspondingNavLink = document.querySelector(`.nav-link[data-section="${targetSection}"]`);
                    if (correspondingNavLink) {
                        updateActiveNavLink(correspondingNavLink);
                    }
                }
            });
        }
    });
}

/**
 * 显示指定部分
 * @param {string} sectionId - 要显示的部分ID
 */
function showSection(sectionId) {
    if (isAnimating) return;
    
    isAnimating = true;
    const currentSectionElement = document.getElementById(currentSection);
    const targetSectionElement = document.getElementById(sectionId);
    
    if (!targetSectionElement) {
        isAnimating = false;
        return;
    }
    
    // 隐藏当前部分
    if (currentSectionElement && currentSectionElement !== targetSectionElement) {
        currentSectionElement.style.opacity = '0';
        currentSectionElement.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            currentSectionElement.classList.remove('active');
            currentSectionElement.style.display = 'none';
        }, 300);
    }
    
    // 显示目标部分
    setTimeout(() => {
        targetSectionElement.style.display = 'block';
        targetSectionElement.classList.add('active');
        
        // 触发重排
        targetSectionElement.offsetHeight;
        
        targetSectionElement.style.opacity = '1';
        targetSectionElement.style.transform = 'translateY(0)';
        
        currentSection = sectionId;
        
        // 触发进入动画
        triggerSectionAnimations(sectionId);
        
        setTimeout(() => {
            isAnimating = false;
        }, 500);
    }, currentSectionElement && currentSectionElement !== targetSectionElement ? 300 : 0);
}

/**
 * 更新活跃导航链接
 * @param {Element} activeLink - 当前活跃的链接元素
 */
function updateActiveNavLink(activeLink) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

/**
 * 初始化动画效果
 */
function initializeAnimations() {
    // 为所有卡片添加悬停效果
    const cards = document.querySelectorAll('.project-card, .skill-category, .game-preview-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // 按钮点击效果
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

/**
 * 初始化打字机效果
 */
function initializeTypewriter() {
    const codeLines = document.querySelectorAll('.code-line');
    
    // 重置动画
    codeLines.forEach(line => {
        line.style.opacity = '0';
        line.style.animation = 'none';
    });
    
    // 延迟启动动画
    setTimeout(() => {
        codeLines.forEach((line, index) => {
            setTimeout(() => {
                line.style.animation = 'typewriter 0.5s ease forwards';
            }, index * 500);
        });
    }, 1000);
}

/**
 * 初始化移动端菜单
 */
function initializeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // 点击导航链接时关闭菜单
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

/**
 * 初始化滚动效果
 */
function initializeScrollEffects() {
    // 导航栏滚动效果
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
    
    // 滚动指示器点击事件
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            showSection('about');
            updateActiveNavLink(document.querySelector('[data-section="about"]'));
        });
    }
}

/**
 * 触发部分进入动画
 * @param {string} sectionId - 部分ID
 */
function triggerSectionAnimations(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    const animatedElements = section.querySelectorAll('.fade-in');
    
    animatedElements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('visible');
        }, index * 100);
    });
    
    // 特殊动画处理
    switch (sectionId) {
        case 'home':
            initializeTypewriter();
            break;
        case 'skills':
            animateSkillBars();
            break;
        case 'projects':
            animateProjectCards();
            break;
    }
}

/**
 * 动画技能条
 */
function animateSkillBars() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.transform = 'scale(1.1)';
            setTimeout(() => {
                item.style.transform = 'scale(1)';
            }, 200);
        }, index * 100);
    });
}

/**
 * 动画项目卡片
 */
function animateProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

/**
 * 更新当前时间显示
 */
function updateCurrentTime() {
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        const now = new Date();
        const timeString = now.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        timeElement.textContent = timeString;
    }
}

/**
 * 处理联系表单提交
 * @param {Event} event - 表单提交事件
 */
function handleContactForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    
    // 禁用提交按钮
    submitButton.disabled = true;
    submitButton.textContent = '发送中...';
    
    // 模拟表单提交
    setTimeout(() => {
        alert('感谢您的留言！我会尽快回复您。');
        form.reset();
        submitButton.disabled = false;
        submitButton.textContent = '发送消息';
    }, 2000);
}

/**
 * 平滑滚动到指定元素
 * @param {string} elementId - 目标元素ID
 */
function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

/**
 * 工具函数：防抖
 * @param {Function} func - 要防抖的函数
 * @param {number} wait - 等待时间
 * @returns {Function} 防抖后的函数
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 工具函数：节流
 * @param {Function} func - 要节流的函数
 * @param {number} limit - 限制时间
 * @returns {Function} 节流后的函数
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * 添加CSS动画关键帧
 */
function addAnimationKeyframes() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes slideInUp {
            from {
                transform: translateY(100%);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        @keyframes slideInDown {
            from {
                transform: translateY(-100%);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        @keyframes fadeInScale {
            from {
                transform: scale(0.8);
                opacity: 0;
            }
            to {
                transform: scale(1);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}

// 页面加载时添加动画关键帧
addAnimationKeyframes();

/**
 * 打开指定游戏
 * @param {string} gameName - 游戏名称
 */
function openGame(gameName) {
    const gameUrls = {
        'snake': 'snake.html',
        'tetris': 'tetris.html',
        '2048': '2048.html',
        'memory': 'memory.html'
    };
    
    if (gameUrls[gameName]) {
        window.open(gameUrls[gameName], '_blank');
    } else {
        console.error('未找到游戏:', gameName);
    }
}

// 导出函数供全局使用
window.PersonalSite = {
    showSection,
    updateCurrentTime,
    handleContactForm,
    smoothScrollTo
};

// 将openGame函数添加到全局作用域
window.openGame = openGame;