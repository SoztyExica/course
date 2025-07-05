// 搜索功能
window.addEventListener('DOMContentLoaded', function() {
  // 定义所有帖子的数据
  const allPosts = [
    {
      id: 1,
      title: '图片分享帖',
      author: '用户A',
      link: 'post_detail_1.html',
      image: 'img/8.png',
      date: '2025-07-03'
    },
    {
      id: 2,
      title: '图片分享帖',
      author: '用户B',
      link: 'post_detail_2.html',
      image: 'img/9.png',
      date: '2025-07-03'
    },
    {
      id: 3,
      title: '图片分享帖',
      author: '用户C',
      link: 'post_detail_3.html',
      image: 'img/10.png',
      date: '2025-07-03'
    },
    {
      id: 4,
      title: '图片分享帖',
      author: '用户D',
      link: 'post_detail_4.html',
      image: 'img/11.png',
      date: '2025-07-03'
    }
  ];

  // 搜索函数
  function searchPosts(query) {
    if (!query || query.trim() === '') {
      return [];
    }

    const searchTerm = query.toLowerCase().trim();
    return allPosts.filter(post => {
      // 搜索标题
      const titleMatch = post.title.toLowerCase().includes(searchTerm);
      // 搜索作者
      const authorMatch = post.author.toLowerCase().includes(searchTerm);
      
      return titleMatch || authorMatch;
    });
  }

  // 显示搜索结果
  function displaySearchResults(results, query) {
    const resultsContainer = document.getElementById('searchResults');
    const searchTitle = document.getElementById('searchTitle');
    
    if (!resultsContainer) return;

    // 清空现有结果
    resultsContainer.innerHTML = '';

    if (results.length === 0) {
      // 没有搜索结果
      resultsContainer.innerHTML = `
        <div class="no-results">
          <p>没有找到与"${query}"相关的帖子</p>
          <p>请尝试其他关键词</p>
        </div>
      `;
      if (searchTitle) {
        searchTitle.textContent = `搜索"${query}" - 无结果`;
      }
      return;
    }

    // 显示搜索结果
    results.forEach(post => {
      const li = document.createElement('li');
      li.innerHTML = `
        <a href="${post.link}">
          <img src="${post.image}" alt="帖子缩略图">
          <h3>${post.title}</h3>
          <p>由 <a href="profile.html">${post.author}</a> 发布</p>
          <p class="post-date">${post.date}</p>
        </a>
      `;
      resultsContainer.appendChild(li);
    });

    if (searchTitle) {
      searchTitle.textContent = `搜索"${query}" - 找到 ${results.length} 个结果`;
    }
  }

  // 处理搜索表单提交
  const searchForm = document.getElementById('searchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const searchInput = document.getElementById('searchInput');
      const query = searchInput.value.trim();
      
      if (query === '') {
        alert('请输入搜索内容');
        return;
      }

      // 执行搜索
      const results = searchPosts(query);
      displaySearchResults(results, query);
    });
  }

  // 处理URL参数（从其他页面跳转过来时）
  const urlParams = new URLSearchParams(window.location.search);
  const queryParam = urlParams.get('q');
  
  if (queryParam) {
    // 设置搜索框的值
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.value = queryParam;
    }
    
    // 执行搜索
    const results = searchPosts(queryParam);
    displaySearchResults(results, queryParam);
  }

  // 实时搜索功能（可选）
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      const query = this.value.trim();
      
      if (query.length >= 2) { // 至少2个字符才开始搜索
        searchTimeout = setTimeout(() => {
          const results = searchPosts(query);
          displaySearchResults(results, query);
        }, 300); // 300ms延迟，避免频繁搜索
      } else if (query.length === 0) {
        // 清空搜索框时清空结果
        const resultsContainer = document.getElementById('searchResults');
        if (resultsContainer) {
          resultsContainer.innerHTML = '';
        }
        const searchTitle = document.getElementById('searchTitle');
        if (searchTitle) {
          searchTitle.textContent = '搜索结果';
        }
      }
    });
  }
}); 