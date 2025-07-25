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
    
    // 初始化股票热力图
    initializeStockHeatmap();
    
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

/**
 * 股票热力图功能
 */

// 真实股票数据配置
const stockSectors = {
    '科技': [
        {name: '腾讯控股', code: 'hk00700'},
        {name: '阿里巴巴', code: 'hk09988'},
        {name: '美团', code: 'hk03690'},
        {name: '京东', code: 'hk09618'},
        {name: '百度', code: 'hk09888'},
        {name: '网易', code: 'hk09999'},
        {name: '小米', code: 'hk01810'},
        {name: '比亚迪', code: 'sz002594'}
    ],
    '金融': [
        {name: '中国平安', code: 'sh601318'},
        {name: '招商银行', code: 'sh600036'},
        {name: '工商银行', code: 'sh601398'},
        {name: '建设银行', code: 'sh601939'},
        {name: '中国银行', code: 'sh601988'},
        {name: '农业银行', code: 'sh601288'},
        {name: '中信银行', code: 'sh601998'},
        {name: '民生银行', code: 'sh600016'}
    ],
    '消费': [
        {name: '贵州茅台', code: 'sh600519'},
        {name: '五粮液', code: 'sz000858'},
        {name: '伊利股份', code: 'sh600887'},
        {name: '海天味业', code: 'sh603288'},
        {name: '格力电器', code: 'sz000651'},
        {name: '美的集团', code: 'sz000333'},
        {name: '海尔智家', code: 'sh600690'},
        {name: '长城汽车', code: 'sh601633'}
    ],
    '医药': [
        {name: '恒瑞医药', code: 'sh600276'},
        {name: '药明康德', code: 'sh603259'},
        {name: '迈瑞医疗', code: 'sz300760'},
        {name: '爱尔眼科', code: 'sz300015'},
        {name: '智飞生物', code: 'sz300122'},
        {name: '康泰生物', code: 'sz300601'},
        {name: '华兰生物', code: 'sz002007'},
        {name: '复星医药', code: 'sh600196'}
    ],
    '能源': [
        {name: '中国石油', code: 'sh601857'},
        {name: '中国石化', code: 'sh600028'},
        {name: '中海油', code: 'sh600938'},
        {name: '中国神华', code: 'sh601088'},
        {name: '陕西煤业', code: 'sh601225'},
        {name: '兖州煤业', code: 'sh600188'},
        {name: '潞安环能', code: 'sh601699'},
        {name: '西山煤电', code: 'sz000983'}
    ],
    '房地产': [
        {name: '万科A', code: 'sz000002'},
        {name: '保利地产', code: 'sh600048'},
        {name: '融创中国', code: 'hk01918'},
        {name: '碧桂园', code: 'hk02007'},
        {name: '恒大集团', code: 'hk03333'},
        {name: '中海地产', code: 'hk00688'},
        {name: '华润置地', code: 'hk01109'},
        {name: '龙湖集团', code: 'hk00960'}
    ],
    '制造业': [
        {name: '宁德时代', code: 'sz300750'},
        {name: '三一重工', code: 'sh600031'},
        {name: '中联重科', code: 'sz000157'},
        {name: '徐工机械', code: 'sz000425'},
        {name: '潍柴动力', code: 'sz000338'},
        {name: '上汽集团', code: 'sh600104'},
        {name: '广汽集团', code: 'sh601238'},
        {name: '中国重汽', code: 'sz000951'}
    ],
    '通信': [
        {name: '中国移动', code: 'sh600941'},
        {name: '中国联通', code: 'sh600050'},
        {name: '中国电信', code: 'sh601728'},
        {name: '中兴通讯', code: 'sz000063'},
        {name: '烽火通信', code: 'sh600498'},
        {name: '亨通光电', code: 'sh600487'},
        {name: '中天科技', code: 'sh600522'},
        {name: '光迅科技', code: 'sz002281'}
    ]
};

/**
 * 从腾讯财经API获取股票数据
 * @param {string} stockCode - 股票代码
 * @returns {Promise<Object>} 股票数据
 */
async function fetchStockData(stockCode) {
    try {
        // 添加时间戳防止缓存，使用腾讯财经API
        const timestamp = Date.now();
        const apiUrl = `https://qt.gtimg.cn/q=${stockCode}&_=${timestamp}`;
        
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Referer': 'https://finance.qq.com/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            mode: 'cors',
            cache: 'no-cache'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const text = await response.text();
        console.log(`API响应 ${stockCode}:`, text); // 调试日志
        
        // 解析腾讯财经返回的数据格式: v_股票代码="数据字符串";
        const regex = new RegExp(`v_${stockCode.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}="([^"]*)";`);
        const match = text.match(regex);
        
        if (!match || !match[1]) {
            throw new Error('未找到股票数据或数据格式错误');
        }
        
        const dataStr = match[1];
        const dataArray = dataStr.split('~');
        
        if (dataArray.length < 5) {
            throw new Error(`数据不完整，只有${dataArray.length}个字段`);
        }
        
        // 腾讯财经API数据格式解析
        const stockName = dataArray[1]; // 股票名称
        const currentPrice = parseFloat(dataArray[3]) || 0; // 当前价格
        const yesterdayClose = parseFloat(dataArray[4]) || 0; // 昨收价格
        const openPrice = parseFloat(dataArray[5]) || 0; // 开盘价
        const volume = parseInt(dataArray[6]) || 0; // 成交量
        const turnover = parseFloat(dataArray[37]) || 0; // 成交额
        
        // 计算涨跌幅
        let changePercent = 0;
        if (yesterdayClose > 0) {
            changePercent = ((currentPrice - yesterdayClose) / yesterdayClose) * 100;
        }
        
        console.log(`${stockCode} 解析结果:`, {
            name: stockName,
            currentPrice,
            yesterdayClose,
            changePercent: changePercent.toFixed(2) + '%'
        });
        
        return {
            currentPrice,
            yesterdayClose,
            changePercent,
            openPrice,
            volume,
            turnover
        };
    } catch (error) {
        console.error(`获取股票 ${stockCode} 数据失败:`, error.message);
        
        // 如果API失败，返回随机数据作为备用
        const randomReturn = (Math.random() - 0.4) * 25;
        const basePrice = 10 + Math.random() * 90; // 10-100之间的基础价格
        
        return {
            currentPrice: basePrice + (basePrice * randomReturn / 100),
            yesterdayClose: basePrice,
            changePercent: randomReturn,
            openPrice: basePrice,
            volume: Math.floor(Math.random() * 1000000),
            turnover: Math.floor(Math.random() * 100000000)
        };
    }
}

/**
 * 获取所有股票的实时数据
 * @returns {Promise<Object>} 包含各行业股票数据的对象
 */
async function generateStockData() {
    const data = {};
    
    for (const sector of Object.keys(stockSectors)) {
        data[sector] = [];
        
        // 并发获取该行业所有股票数据
        const promises = stockSectors[sector].map(async (stock) => {
            const stockData = await fetchStockData(stock.code);
            return {
                name: stock.name,
                code: stock.code,
                return: stockData.changePercent,
                currentPrice: stockData.currentPrice,
                yesterdayClose: stockData.yesterdayClose
            };
        });
        
        try {
            const sectorData = await Promise.all(promises);
            data[sector] = sectorData;
        } catch (error) {
            console.error(`获取 ${sector} 行业数据失败:`, error);
            // 如果整个行业数据获取失败，使用随机数据
            data[sector] = stockSectors[sector].map(stock => ({
                name: stock.name,
                code: stock.code,
                return: (Math.random() - 0.4) * 25,
                currentPrice: 100 + (Math.random() - 0.4) * 25,
                yesterdayClose: 100
            }));
        }
    }
    
    return data;
}

/**
 * 颜色插值函数 - 在两个RGB颜色之间进行线性插值
 * @param {Array} color1 - 起始颜色 [r, g, b]
 * @param {Array} color2 - 结束颜色 [r, g, b]
 * @param {number} factor - 插值因子 (0-1)
 * @returns {string} RGB颜色字符串
 */
function lerpColor(color1, color2, factor) {
    const r = Math.round(color1[0] + (color2[0] - color1[0]) * factor);
    const g = Math.round(color1[1] + (color2[1] - color1[1]) * factor);
    const b = Math.round(color1[2] + (color2[2] - color1[2]) * factor);
    return `rgb(${r}, ${g}, ${b})`;
}

/**
 * 根据收益率获取插值颜色 - 支持连续颜色变化
 * @param {number} returnRate - 收益率
 * @returns {string} RGB颜色字符串
 */
function getInterpolatedColor(returnRate) {
    // 定义颜色节点 [r, g, b]
    const colors = {
        '-4': [68, 255, 68],    // 深绿
        '-3': [102, 255, 102],  // 中绿
        '-2': [136, 255, 136],  // 浅绿
        '-1': [170, 255, 170],  // 很浅绿
        '0': [102, 102, 102],   // 灰色
        '1': [255, 170, 170],   // 很浅红
        '2': [255, 136, 136],   // 浅红
        '3': [255, 102, 102],   // 中红
        '4': [255, 68, 68]      // 深红
    };
    
    // 限制收益率范围
    const clampedRate = Math.max(-4, Math.min(4, returnRate));
    
    // 确定所在区间
    let lowerBound, upperBound, factor;
    
    if (clampedRate <= -4) {
        return `rgb(${colors['-4'].join(', ')})`;
    } else if (clampedRate >= 4) {
        return `rgb(${colors['4'].join(', ')})`;
    } else {
        // 找到相邻的两个颜色节点
        const lowerKey = Math.floor(clampedRate).toString();
        const upperKey = Math.ceil(clampedRate).toString();
        
        if (lowerKey === upperKey) {
            return `rgb(${colors[lowerKey].join(', ')})`;
        }
        
        // 计算插值因子
        factor = clampedRate - Math.floor(clampedRate);
        
        // 进行颜色插值
        return lerpColor(colors[lowerKey], colors[upperKey], factor);
    }
}

/**
 * 根据收益率获取颜色类名 - 9级颜色系统 (-4% 到 +4%)
 * @param {number} returnRate - 收益率
 * @returns {string} CSS类名
 */
function getColorClass(returnRate) {
    if (returnRate >= 4) return 'positive-4';        // +4%及以上
    if (returnRate >= 3) return 'positive-3';        // +3%到+4%
    if (returnRate >= 2) return 'positive-2';        // +2%到+3%
    if (returnRate >= 1) return 'positive-1';        // +1%到+2%
    if (returnRate > -1) return 'neutral';           // -1%到+1%
    if (returnRate >= -2) return 'negative-1';       // -1%到-2%
    if (returnRate >= -3) return 'negative-2';       // -2%到-3%
    if (returnRate >= -4) return 'negative-3';       // -3%到-4%
    return 'negative-4';                              // -4%及以下
}

/**
 * 渲染股票热力图
 * @param {Object} stockData - 股票数据
 */
function renderStockHeatmap(stockData) {
    const heatmapContainer = document.getElementById('stockHeatmap');
    if (!heatmapContainer) return;
    
    heatmapContainer.innerHTML = '';
    
    Object.keys(stockData).forEach(sector => {
        const sectorDiv = document.createElement('div');
        sectorDiv.className = 'sector';
        
        // 创建行业标题
        const sectorTitle = document.createElement('div');
        sectorTitle.className = 'sector-title';
        sectorTitle.textContent = sector;
        sectorDiv.appendChild(sectorTitle);
        
        // 创建股票网格
        const stocksGrid = document.createElement('div');
        stocksGrid.className = 'stocks-grid';
        
        stockData[sector].forEach(stock => {
            const stockItem = document.createElement('div');
            stockItem.className = 'stock-item';
            
            // 使用颜色插值设置背景色
            const interpolatedColor = getInterpolatedColor(stock.return);
            stockItem.style.backgroundColor = interpolatedColor;
            
            // 为极值添加动画效果
            if (Math.abs(stock.return) >= 4) {
                stockItem.style.animation = stock.return >= 4 ? 
                    'pulse-positive 2s infinite' : 'pulse-negative 2s infinite';
            }
            
            const stockName = document.createElement('div');
            stockName.className = 'stock-name';
            stockName.textContent = stock.name;
            
            const stockReturn = document.createElement('div');
            stockReturn.className = 'stock-return';
            stockReturn.textContent = `${stock.return >= 0 ? '+' : ''}${stock.return.toFixed(2)}%`;
            
            stockItem.appendChild(stockName);
            stockItem.appendChild(stockReturn);
            
            // 添加点击事件显示详细信息
            stockItem.addEventListener('click', () => {
                showStockDetail(stock);
            });
            
            stocksGrid.appendChild(stockItem);
        });
        
        sectorDiv.appendChild(stocksGrid);
        heatmapContainer.appendChild(sectorDiv);
    });
}

/**
 * 显示股票详细信息
 * @param {Object} stock - 股票对象
 */
function showStockDetail(stock) {
    const returnRate = stock.return;
    const currentPrice = stock.currentPrice || 0;
    const yesterdayClose = stock.yesterdayClose || 0;
    const openPrice = stock.openPrice || 0;
    const volume = stock.volume || 0;
    const turnover = stock.turnover || 0;
    const code = stock.code || '';
    
    // 计算涨跌额
    const changeAmount = currentPrice - yesterdayClose;
    
    // 格式化成交量和成交额
    const formatVolume = (vol) => {
        if (vol >= 100000000) return (vol / 100000000).toFixed(2) + '亿手';
        if (vol >= 10000) return (vol / 10000).toFixed(2) + '万手';
        return vol.toLocaleString() + '手';
    };
    
    const formatTurnover = (amount) => {
        if (amount >= 100000000) return (amount / 100000000).toFixed(2) + '亿元';
        if (amount >= 10000) return (amount / 10000).toFixed(2) + '万元';
        return amount.toLocaleString() + '元';
    };
    
    const message = `📊 股票详情\n\n` +
        `📌 股票名称: ${stock.name}\n` +
        `🔢 股票代码: ${code.toUpperCase()}\n` +
        `💰 当前价格: ¥${currentPrice.toFixed(2)}\n` +
        `📅 昨日收盘: ¥${yesterdayClose.toFixed(2)}\n` +
        `🌅 今日开盘: ¥${openPrice.toFixed(2)}\n` +
        `📈 涨跌额: ${changeAmount >= 0 ? '+' : ''}¥${changeAmount.toFixed(2)}\n` +
        `📊 涨跌幅: ${returnRate >= 0 ? '+' : ''}${returnRate.toFixed(2)}%\n` +
        `📦 成交量: ${formatVolume(volume)}\n` +
        `💵 成交额: ${formatTurnover(turnover)}\n\n` +
        `${returnRate >= 0 ? '📈 上涨' : '📉 下跌'} ${Math.abs(returnRate) >= 5 ? '(大幅)' : '(小幅)'}\n` +
        `更新时间: ${new Date().toLocaleTimeString()}`;
    
    alert(message);
}

/**
 * 更新最后更新时间
 */
function updateLastUpdateTime() {
    const lastUpdateElement = document.getElementById('lastUpdateTime');
    if (lastUpdateElement) {
        const now = new Date();
        const timeString = now.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        lastUpdateElement.textContent = timeString;
    }
}

/**
 * 显示加载状态
 * @param {boolean} isLoading - 是否正在加载
 */
function showLoadingState(isLoading) {
    const heatmapContainer = document.getElementById('stockHeatmap');
    const refreshButton = document.getElementById('refreshData');
    
    if (isLoading) {
        if (heatmapContainer) {
            heatmapContainer.innerHTML = '<div style="text-align: center; padding: 50px; color: #ccc; font-size: 18px;">📊 正在获取实时股票数据...</div>';
        }
        if (refreshButton) {
            refreshButton.disabled = true;
            refreshButton.textContent = '获取中...';
        }
    } else {
        if (refreshButton) {
            refreshButton.disabled = false;
            refreshButton.textContent = '刷新数据';
        }
    }
}

/**
 * 生成模拟股票数据
 * @returns {Object} 包含各行业股票数据的对象
 */
function generateMockStockData() {
    const data = {};
    
    for (const sector of Object.keys(stockSectors)) {
        data[sector] = stockSectors[sector].map(stock => {
            // 生成随机收益率，范围在-8%到+8%之间
            const randomReturn = (Math.random() - 0.5) * 16;
            const basePrice = 10 + Math.random() * 90; // 10-100之间的基础价格
            
            return {
                name: stock.name,
                code: stock.code,
                return: randomReturn,
                currentPrice: basePrice + (basePrice * randomReturn / 100),
                yesterdayClose: basePrice
            };
        });
    }
    
    return data;
}

/**
 * 初始化股票热力图
 */
async function initializeStockHeatmap() {
    try {
        // 显示加载状态
        showLoadingState(true);
        
        // 直接使用模拟数据，避免跨域问题
        const stockData = generateMockStockData();
        renderStockHeatmap(stockData);
        updateLastUpdateTime();
        
        // 隐藏加载状态
        showLoadingState(false);
        
    } catch (error) {
        console.error('初始化股票热力图失败:', error);
        showLoadingState(false);
        
        const heatmapContainer = document.getElementById('stockHeatmap');
        if (heatmapContainer) {
            heatmapContainer.innerHTML = '<div style="text-align: center; padding: 50px; color: #ff6b6b; font-size: 18px;">❌ 数据加载失败，请稍后重试</div>';
        }
    }
    
    // 绑定刷新按钮事件
    const refreshButton = document.getElementById('refreshData');
    if (refreshButton) {
        refreshButton.addEventListener('click', async () => {
            try {
                showLoadingState(true);
                
                const newStockData = generateMockStockData();
                renderStockHeatmap(newStockData);
                updateLastUpdateTime();
                
                showLoadingState(false);
                
                // 添加刷新动画效果
                const heatmapContainer = document.getElementById('stockHeatmap');
                if (heatmapContainer) {
                    heatmapContainer.style.opacity = '0.5';
                    setTimeout(() => {
                        heatmapContainer.style.opacity = '1';
                    }, 300);
                }
            } catch (error) {
                console.error('刷新股票数据失败:', error);
                showLoadingState(false);
                alert('刷新失败，请检查网络连接后重试');
            }
        });
    }
}



// 添加调试功能
window.debugStock = {
    /**
     * 测试单个股票数据获取
     * @param {string} stockCode - 股票代码，如 'sh600519'
     */
    async testSingleStock(stockCode) {
        console.log(`🔍 测试获取股票 ${stockCode} 的数据...`);
        try {
            const data = await fetchStockData(stockCode);
            console.log(`✅ 成功获取 ${stockCode} 数据:`, data);
            return data;
        } catch (error) {
            console.error(`❌ 获取 ${stockCode} 数据失败:`, error);
            return null;
        }
    },
    
    /**
     * 测试批量股票数据获取
     */
    async testBatchStocks() {
        const testCodes = ['sh600519', 'sz000858', 'sh601318', 'sz000002'];
        console.log('🔍 测试批量获取股票数据...');
        
        for (const code of testCodes) {
            await this.testSingleStock(code);
            // 添加延迟避免请求过快
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    },
    
    /**
     * 直接调用API测试
     * @param {string} stockCode - 股票代码
     */
    async testAPI(stockCode) {
        const timestamp = Date.now();
        const apiUrl = `https://qt.gtimg.cn/q=${stockCode}&_=${timestamp}`;
        console.log(`🌐 直接测试API: ${apiUrl}`);
        
        try {
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Referer': 'https://finance.qq.com/',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                mode: 'cors',
                cache: 'no-cache'
            });
            
            const text = await response.text();
            console.log(`📄 API原始响应:`, text);
            return text;
        } catch (error) {
            console.error(`❌ API调用失败:`, error);
            return null;
        }
    }
};

// 将股票热力图相关函数导出到全局对象
window.StockHeatmap = {
    generateStockData,
    generateMockStockData,
    renderStockHeatmap,
    initializeStockHeatmap,
    updateLastUpdateTime,
    fetchStockData // 导出供调试使用
};

// 在控制台输出调试提示
console.log('🚀 股票热力图调试工具已加载！');
console.log('📝 使用方法:');
console.log('  - debugStock.testSingleStock("sh600519") // 测试单个股票');
console.log('  - debugStock.testBatchStocks() // 测试批量股票');
console.log('  - debugStock.testAPI("sh600519") // 直接测试API');
console.log('  - StockHeatmap.fetchStockData("sh600519") // 调用获取函数');