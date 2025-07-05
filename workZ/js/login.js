// 登录表单验证
document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const loginError = document.getElementById('loginError');
  
  // 清除错误信息
  function clearError() {
    loginError.innerText = '';
    loginError.style.display = 'none';
  }
  
  // 显示错误信息
  function showError(message) {
    loginError.innerText = message;
    loginError.style.display = 'block';
  }
  
  // 用户名验证
  function validateUsername(username) {
    if (!username) {
      return '用户名不能为空';
    }
    if (username.length < 3) {
      return '用户名至少需要3个字符';
    }
    if (username.length > 10) {
      return '用户名不能超过10个字符';
    }
    if (!/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/.test(username)) {
      return '用户名只能包含中文、英文、数字和下划线';
    }
    return '';
  }
  
  // 密码验证
  function validatePassword(password) {
    if (!password) {
      return '密码不能为空';
    }
    if (password.length < 8) {
      return '密码至少需要8个字符';
    }
    if (password.length > 20) {
      return '密码不能超过20个字符';
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
      return '密码必须包含字母和数字';
    }
    return '';
  }
  
  // 实时验证用户名
  usernameInput.addEventListener('blur', function() {
    const error = validateUsername(this.value.trim());
    if (error) {
      showError(error);
    } else {
      clearError();
    }
  });
  
  // 实时验证密码
  passwordInput.addEventListener('blur', function() {
    const error = validatePassword(this.value);
    if (error) {
      showError(error);
    } else {
      clearError();
    }
  });
  
  // 输入时清除错误
  usernameInput.addEventListener('input', clearError);
  passwordInput.addEventListener('input', clearError);
  
  // 表单提交验证
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    const remember = document.querySelector('input[name="remember"]').checked;
    
    // 验证用户名
    const usernameError = validateUsername(username);
    if (usernameError) {
      showError(usernameError);
      usernameInput.focus();
      return false;
    }
    
    // 验证密码
    const passwordError = validatePassword(password);
    if (passwordError) {
      showError(passwordError);
      passwordInput.focus();
      return false;
    }
    
    // 模拟登录验证
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.username === username && u.password === password);
      
      if (user) {
        // 登录成功
        const currentUser = {
          username: user.username,
          email: user.email,
          avatar: user.avatar || 'img/7.png'
        };
        
        // 保存登录状态
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // 调用用户管理器登录方法
        if (window.userManager) {
          window.userManager.login(currentUser);
        }
        
        // 如果选择记住密码，保存到本地
        if (remember) {
          localStorage.setItem('rememberedUser', JSON.stringify({
            username: username,
            password: password
          }));
        } else {
          localStorage.removeItem('rememberedUser');
        }
        
        // 显示成功消息
        showError('登录成功，正在跳转...');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1000);
        
      } else {
        // 登录失败
        showError('用户名或密码错误，请检查后重试');
        passwordInput.focus();
      }
      
    } catch (error) {
      showError('登录过程中出现错误，请重试');
      console.error('Login error:', error);
    }
  });
  
  // 页面加载时检查是否有记住的用户信息
  window.addEventListener('load', function() {
    const rememberedUser = JSON.parse(localStorage.getItem('rememberedUser') || '{}');
    if (rememberedUser.username && rememberedUser.password) {
      usernameInput.value = rememberedUser.username;
      passwordInput.value = rememberedUser.password;
      document.querySelector('input[name="remember"]').checked = true;
    }
  });
});