// 注册表单验证
document.addEventListener('DOMContentLoaded', function() {
  const registerForm = document.getElementById('registerForm');
  const usernameInput = document.getElementById('regUsername');
  const emailInput = document.getElementById('regEmail');
  const phoneInput = document.getElementById('regPhone');
  const passwordInput = document.getElementById('regPassword');
  const confirmPasswordInput = document.getElementById('regConfirmPassword');
  const regionSelect = document.getElementById('region');
  const registerError = document.getElementById('registerError');
  
  // 清除错误信息
  function clearError() {
    registerError.innerText = '';
    registerError.style.display = 'none';
  }
  
  // 显示错误信息
  function showError(message) {
    registerError.innerText = message;
    registerError.style.display = 'block';
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
  
  // 邮箱验证
  function validateEmail(email) {
    if (!email) {
      return '邮箱不能为空';
    }
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailReg.test(email)) {
      return '请输入有效的邮箱地址';
    }
    return '';
  }
  
  // 手机号验证
  function validatePhone(phone) {
    if (!phone) {
      return '手机号不能为空';
    }
    if (!/^\d{11}$/.test(phone)) {
      return '手机号必须是11位数字';
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
  
  // 确认密码验证
  function validateConfirmPassword(password, confirmPassword) {
    if (!confirmPassword) {
      return '请确认密码';
    }
    if (password !== confirmPassword) {
      return '两次输入的密码不一致';
    }
    return '';
  }
  
  // 性别验证
  function validateGender() {
    const gender = document.querySelector('input[name="gender"]:checked');
    if (!gender) {
      return '请选择性别';
    }
    return '';
  }
  
  // 地区验证
  function validateRegion(region) {
    if (!region) {
      return '请选择所属地区';
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
  
  // 实时验证邮箱
  emailInput.addEventListener('blur', function() {
    const error = validateEmail(this.value.trim());
    if (error) {
      showError(error);
    } else {
      clearError();
    }
  });
  
  // 实时验证手机号
  phoneInput.addEventListener('blur', function() {
    const error = validatePhone(this.value.trim());
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
  
  // 实时验证确认密码
  confirmPasswordInput.addEventListener('blur', function() {
    const error = validateConfirmPassword(passwordInput.value, this.value);
    if (error) {
      showError(error);
    } else {
      clearError();
    }
  });
  
  // 输入时清除错误
  usernameInput.addEventListener('input', clearError);
  emailInput.addEventListener('input', clearError);
  phoneInput.addEventListener('input', clearError);
  passwordInput.addEventListener('input', clearError);
  confirmPasswordInput.addEventListener('input', clearError);
  
  // 表单提交验证
  registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const gender = document.querySelector('input[name="gender"]:checked');
    const region = regionSelect.value;
    const hobbies = Array.from(document.querySelectorAll('input[name="hobby"]:checked')).map(cb => cb.value);
    const intro = document.getElementById('intro').value.trim();
    
    // 验证所有字段
    const usernameError = validateUsername(username);
    if (usernameError) {
      showError(usernameError);
      usernameInput.focus();
      return false;
    }
    
    const emailError = validateEmail(email);
    if (emailError) {
      showError(emailError);
      emailInput.focus();
      return false;
    }
    
    const phoneError = validatePhone(phone);
    if (phoneError) {
      showError(phoneError);
      phoneInput.focus();
      return false;
    }
    
    const passwordError = validatePassword(password);
    if (passwordError) {
      showError(passwordError);
      passwordInput.focus();
      return false;
    }
    
    const confirmPasswordError = validateConfirmPassword(password, confirmPassword);
    if (confirmPasswordError) {
      showError(confirmPasswordError);
      confirmPasswordInput.focus();
      return false;
    }
    
    const genderError = validateGender();
    if (genderError) {
      showError(genderError);
      return false;
    }
    
    const regionError = validateRegion(region);
    if (regionError) {
      showError(regionError);
      regionSelect.focus();
      return false;
    }
    
    // 检查用户名是否已存在
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const existingUser = users.find(u => u.username === username);
      
      if (existingUser) {
        showError('用户名已存在，请选择其他用户名');
        usernameInput.focus();
        return false;
      }
      
      // 创建新用户
      const newUser = {
        username: username,
        email: email,
        phone: phone,
        password: password,
        gender: gender.value,
        region: region,
        hobbies: hobbies,
        intro: intro,
        avatar: 'img/7.png',
        registerTime: new Date().toISOString()
      };
      
      // 保存用户信息
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // 显示成功消息
      showError('注册成功！正在跳转到登录页面...');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1500);
      
    } catch (error) {
      showError('注册过程中出现错误，请重试');
      console.error('Register error:', error);
    }
  });
});