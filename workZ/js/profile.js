// 个人主页功能
window.addEventListener('DOMContentLoaded', function() {
  // 检查登录状态
  if (!window.userManager || !window.userManager.isLoggedIn()) {
    alert('请先登录！');
    window.location.href = 'login.html';
    return;
  }

  const currentUser = window.userManager.getCurrentUser();
  
  // 显示用户信息
  document.getElementById('profileUsername').textContent = currentUser.username || '未知用户';
  document.getElementById('profileGender').textContent = '性别：' + (currentUser.gender === 'male' ? '男' : (currentUser.gender === 'female' ? '女' : '未知'));
  document.getElementById('profileIntro').textContent = '个人简介：' + (currentUser.intro || '暂无');
  
  // 显示头像
  const avatar = document.getElementById('profileAvatar');
  if (currentUser.avatar) {
    avatar.src = currentUser.avatar;
  } else {
    avatar.src = 'img/7.png'; // 默认头像
  }

  // 头像上传功能
  document.getElementById('avatarForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const fileInput = document.getElementById('avatarInput');
    const file = fileInput.files[0];
    
    if (!file) {
      alert('请选择图片文件');
      return;
    }
    
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件');
      return;
    }
    
    // 检查文件大小（限制为2MB）
    if (file.size > 2 * 1024 * 1024) {
      alert('图片文件大小不能超过2MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = function(evt) {
      const imageData = evt.target.result;
      
      // 更新头像显示
      avatar.src = imageData;
      
      // 更新当前用户信息
      currentUser.avatar = imageData;
      
      // 保存到localStorage
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      
      // 更新用户列表中的头像
      try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.username === currentUser.username);
        if (userIndex !== -1) {
          users[userIndex].avatar = imageData;
          localStorage.setItem('users', JSON.stringify(users));
        }
      } catch (error) {
        console.error('更新用户列表失败:', error);
      }
      
      // 更新右上角头像
      const topAvatar = document.getElementById('userAvatar');
      if (topAvatar) {
        topAvatar.src = imageData;
      }
      
      // 更新用户管理器
      if (window.userManager) {
        window.userManager.updateUI();
      }
      
      alert('头像上传成功！');
      
      // 清空文件输入
      fileInput.value = '';
    };
    
    reader.onerror = function() {
      alert('读取文件失败，请重试');
    };
    
    reader.readAsDataURL(file);
  });
  
  // 添加文件选择时的预览
  document.getElementById('avatarInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = function(evt) {
        // 可以在这里添加预览功能
        console.log('选择了图片文件:', file.name);
      };
      reader.readAsDataURL(file);
    }
  });
});