/**
 * 主页面JavaScript文件
 * 处理游戏导航和基础功能
 */

// 游戏配置
const games = {
    snake: {
        title: '贪吃蛇',
        file: 'snake.html'
    },
    tetris: {
        title: '俄罗斯方块',
        file: 'tetris.html'
    },
    '2048': {
        title: '2048',
        file: '2048.html'
    },
    memory: {
        title: '记忆翻牌',
        file: 'memory.html'
    }
};

/**
 * 打开指定的游戏
 * @param {string} gameId - 游戏ID
 */
function openGame(gameId) {
    if (games[gameId]) {
        // 添加点击动画效果
        const gameCard = event.currentTarget;
        gameCard.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            window.location.href = games[gameId].file;
        }, 150);
    } else {
        console.error('游戏不存在:', gameId);
    }
}

/**
 * 页面加载完成后的初始化
 */
document.addEventListener('DOMContentLoaded', function() {
    // 添加页面加载动画
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // 添加键盘导航支持
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && document.activeElement.classList.contains('game-card')) {
            document.activeElement.click();
        }
    });
    
    // 显示当前时间
    updateTime();
    setInterval(updateTime, 1000);
});

/**
 * 更新页面显示的当前时间
 */
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    // 如果页面有时间显示元素，更新它
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
}

/**
 * 通用工具函数
 */
const Utils = {
    /**
     * 生成随机数
     * @param {number} min - 最小值
     * @param {number} max - 最大值
     * @returns {number} 随机数
     */
    random: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    /**
     * 本地存储操作
     */
    storage: {
        set: function(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
                console.error('存储失败:', e);
            }
        },
        
        get: function(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                console.error('读取存储失败:', e);
                return defaultValue;
            }
        },
        
        remove: function(key) {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                console.error('删除存储失败:', e);
            }
        }
    }
};

// 全局暴露工具函数
window.Utils = Utils;