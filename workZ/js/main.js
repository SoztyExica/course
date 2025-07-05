// 动态切换页面背景
function setPageBg(type) {
  let bg = '';
  switch(type) {
    case 'index': bg = ''; break; // 首页背景
    case 'login': case 'register': bg = ''; break; // 登录/注册
    case 'zone': bg = ''; break; // 版区
    case 'post': bg = ''; break; // 帖子
    case 'profile': bg = ''; break; // 个人主页
    case 'search': bg = ''; break; // 搜索
    default: bg = '';
  }
  document.body.style.backgroundImage = bg ? `url('${bg}')` : '';
}
window.setPageBg = setPageBg;

// 用户状态管理
class UserManager {
  constructor() {
    this.currentUser = null;
    // 延迟初始化，确保DOM已加载
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }

  // 初始化
  init() {
    this.loadCurrentUser();
    this.updateUI();
    this.setupEventListeners();
  }

  // 加载当前用户
  loadCurrentUser() {
    try {
      const userData = localStorage.getItem('currentUser');
      this.currentUser = userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('加载用户数据失败:', error);
      this.currentUser = null;
    }
  }

  // 更新用户界面
  updateUI() {
    this.updateAvatar();
    this.updateDropdownMenu();
  }

  // 更新头像
  updateAvatar() {
    const avatar = document.getElementById('userAvatar');
    if (avatar) {
      if (this.currentUser && this.currentUser.avatar) {
        avatar.src = this.currentUser.avatar;
      } else {
        avatar.src = 'img/7.png'; // 默认头像
      }
    }
  }

  // 更新下拉菜单
  updateDropdownMenu() {
    const dropdownBox = document.querySelector('.dropdown-box');
    if (!dropdownBox) return;

    if (this.currentUser) {
      // 已登录状态
      dropdownBox.innerHTML = `
        <a href="#" id="logoutBtn">登出</a>
      `;
    } else {
      // 未登录状态
      dropdownBox.innerHTML = `
        <a href="login.html">登录</a>
        <a href="register.html">注册</a>
      `;
    }
  }

  // 设置事件监听器
  setupEventListeners() {
    // 下拉菜单显示/隐藏
    const profileDropdown = document.querySelector('.user-profile-dropdown');
    if (profileDropdown) {
      let hideTimeout;
      
      profileDropdown.addEventListener('mouseenter', () => {
        // 清除之前的隐藏定时器
        if (hideTimeout) {
          clearTimeout(hideTimeout);
          hideTimeout = null;
        }
        
        const dropdownBox = profileDropdown.querySelector('.dropdown-box');
        dropdownBox.style.display = 'block';
        // 强制重绘后设置透明度
        setTimeout(() => {
          dropdownBox.style.opacity = '1';
          dropdownBox.style.visibility = 'visible';
        }, 10);
      });
      
      profileDropdown.addEventListener('mouseleave', () => {
        const dropdownBox = profileDropdown.querySelector('.dropdown-box');
        
        // 设置0.5秒延迟隐藏
        hideTimeout = setTimeout(() => {
          dropdownBox.style.opacity = '0';
          dropdownBox.style.visibility = 'hidden';
          // 延迟设置display为none，确保过渡动画完成
          setTimeout(() => {
            dropdownBox.style.display = 'none';
          }, 300);
        }, 500);
      });
    }

    // 登出按钮事件
    document.addEventListener('click', (e) => {
      if (e.target.id === 'logoutBtn') {
        e.preventDefault();
        this.showLogoutConfirm();
      }
    });
  }

  // 显示登出确认对话框
  showLogoutConfirm() {
    const confirmed = confirm('确定要登出吗？\n\n选择"确定"将退出登录\n选择"取消"则继续登录状态');
    
    if (confirmed) {
      this.logout();
    }
  }

  // 登出
  logout() {
    // 清除当前用户信息
    localStorage.removeItem('currentUser');
    this.currentUser = null;
    
    // 更新界面
    this.updateUI();
    
    // 显示登出成功消息
    alert('已成功登出！');
    
    // 如果当前在需要登录的页面，跳转到首页
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === 'profile.html') {
      window.location.href = 'index.html';
    }
  }

  // 登录
  login(userData) {
    this.currentUser = userData;
    localStorage.setItem('currentUser', JSON.stringify(userData));
    this.updateUI();
  }

  // 检查是否已登录
  isLoggedIn() {
    return this.currentUser !== null;
  }

  // 获取当前用户
  getCurrentUser() {
    return this.currentUser;
  }
}

// 创建全局用户管理器实例
window.userManager = new UserManager();