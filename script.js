let currentCategory = '文学';
let currentContentType = '视频';
let categoryList = [];
let contentTypeList = [];
let isLoggedIn = false;
let accessToken = null;
let contentCount = {};
let articles = JSON.parse(localStorage.getItem('articles')) || [];

// 从 JSON 文件加载配置
async function loadConfig() {
  try {
    const response = await fetch('config.json');
    const config = await response.json();
    categoryList = config.categories;
    contentTypeList = config.contentTypes;
    renderNavAndSidebar();
    navigateToCategory(categoryList[0], document.querySelector('nav ul li'));
  } catch (error) {
    console.error('加载配置文件时出错:', error);
  }
}

// 渲染分类导航和侧边栏
function renderNavAndSidebar() {
  renderCategoryNav();
  renderContentTypeNav();
}

function renderCategoryNav() {
  const categoryNav = document.getElementById('category-nav');
  categoryNav.innerHTML = '';
  categoryList.forEach((category, index) => {
    const li = createNavItem(category, () => navigateToCategory(category, li));
    if (index === 0) {
      li.classList.add('active');
    }
    categoryNav.appendChild(li);
  });
}

function renderContentTypeNav() {
  const contentTypeNav = document.getElementById('content-type-list');
  contentTypeNav.innerHTML = '';
  contentTypeList.forEach((contentType, index) => {
    const li = createNavItem(contentType, () => navigateToContent(contentType, li));
    if (index === 0) {
      li.classList.add('active');
    }
    contentTypeNav.appendChild(li);
  });
}

function createNavItem(text, onClick) {
  const li = document.createElement('li');
  li.textContent = text;
  li.onclick = onClick;
  return li;
}

function navigateToCategory(category, element) {
  currentCategory = category;
  updateActiveNavItems('nav ul li', element);
  const sidebarItems = document.querySelectorAll('aside ul li');
  updateActiveNavItems('aside ul li', sidebarItems[0]);
  navigateToContent('视频', sidebarItems[0]);
  updateLocationDisplay();
}

function navigateToContent(contentType, element) {
  currentContentType = contentType;
  const contentSection = document.getElementById('content');
  contentSection.innerHTML = '';
  for (let i = 0; i < 8; i++) {
    const item = createContentItem(`${currentCategory} - ${contentType} 推荐 ${i + 1}`);
    contentSection.appendChild(item);
  }
  const key = `${currentCategory}-${currentContentType}`;
  if (!contentCount[key]) {
    contentCount[key] = 8;
  }
  updateActiveNavItems('aside ul li', element);
  updateLocationDisplay();
}

function createContentItem(text) {
  const item = document.createElement('div');
  item.classList.add('item');
  item.textContent = text;
  return item;
}

function updateActiveNavItems(selector, activeElement) {
  const items = document.querySelectorAll(selector);
  items.forEach(item => {
    item.classList.remove('active');
  });
  activeElement.classList.add('active');
}

function updateLocationDisplay() {
  const locationElement = document.getElementById('current-location');
  locationElement.textContent = `当前位置：${currentCategory} - ${currentContentType}`;
}

// 处理 GitHub 回调
function handleGitHubCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  if (code) {
    exchangeToken(code)
    .then(data => {
        accessToken = data.access_token;
        isLoggedIn = true;
        updateLoginStatus();
      })
    .catch(error => {
        alert('获取访问令牌失败：' + error.message);
      });
  }
}

async function exchangeToken(code) {
  const response = await fetch('/exchange-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ code })
  });
  return response.json();
}

function updateLoginStatus() {
  document.getElementById('github-login-btn').style.display = 'none';
  document.getElementById('modify-entry-btn').disabled = false;
  document.getElementById('modify-entry-btn').classList.remove('disabled-btn');
  document.getElementById('submit-btn').disabled = false;
  document.getElementById('submit-btn').classList.remove('disabled-btn');
}

// 打开修改模态框
function openModifyModal() {
  if (!isLoggedIn) {
    alert('请先登录 GitHub 再进行修改操作。');
    return;
  }
  renderModifyModal();
  document.getElementById('modify-modal').style.display = 'block';
}

// 关闭修改模态框
function closeModifyModal() {
  document.getElementById('modify-modal').style.display = 'none';
}

function renderModifyModal() {
  renderCategoryListInModal();
  renderContentTypeListInModal();
}

function renderCategoryListInModal() {
  const categoryListDiv = document.getElementById('category-list');
  categoryListDiv.innerHTML = '';
  categoryList.forEach((category, index) => {
    const itemDiv = createListItem(category, () => deleteCategoryInModal(index));
    categoryListDiv.appendChild(itemDiv);
  });
}

function renderContentTypeListInModal() {
  const contentTypeListDiv = document.getElementById('content-type-modal-list');
  contentTypeListDiv.innerHTML = '';
  contentTypeList.forEach((contentType, index) => {
    const itemDiv = createListItem(contentType, () => deleteContentTypeInModal(index));
    contentTypeListDiv.appendChild(itemDiv);
  });
}

function createListItem(value, onDelete) {
  const itemDiv = document.createElement('div');
  itemDiv.classList.add('list-item');
  const input = document.createElement('input');
  input.value = value;
  itemDiv.appendChild(input);
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '删除';
  const hasContent = checkContentExists(value, contentTypeList, contentCount);
  if (hasContent) {
    deleteBtn.disabled = true;
    deleteBtn.classList.add('disabled-btn');
  }
  deleteBtn.onclick = onDelete;
  itemDiv.appendChild(deleteBtn);
  return itemDiv;
}

function checkContentExists(item, relatedList, countObj) {
  let hasContent = false;
  relatedList.forEach(relatedItem => {
    const key = `${item}-${relatedItem}`;
    if (countObj[key] && countObj[key] > 0) {
      hasContent = true;
    }
  });
  return hasContent;
}

// 添加分类（模态框内）
function addCategoryInModal() {
  if (!isLoggedIn) {
    alert('请先登录 GitHub 再进行修改操作。');
    return;
  }
  const newCategory = prompt('请输入新的分类名称');
  if (newCategory) {
    categoryList.push(newCategory);
    const categoryListDiv = document.getElementById('category-list');
    const itemDiv = createListItem(newCategory, () => deleteCategoryInModal(categoryList.length - 1));
    categoryListDiv.appendChild(itemDiv);
  }
}

// 删除分类（模态框内）
function deleteCategoryInModal(index) {
  if (!isLoggedIn) {
    alert('请先登录 GitHub 再进行修改操作。');
    return;
  }
  const categoryToDelete = categoryList[index];
  if (checkContentExists(categoryToDelete, contentTypeList, contentCount)) {
    alert('该分类下有内容，禁止删除。');
    return;
  }
  categoryList.splice(index, 1);
  renderCategoryListInModal();
}

// 添加内容类型（模态框内）
function addContentTypeInModal() {
  if (!isLoggedIn) {
    alert('请先登录 GitHub 再进行修改操作。');
    return;
  }
  const newContentType = prompt('请输入新的内容类型名称');
  if (newContentType) {
    contentTypeList.push(newContentType);
    const contentTypeListDiv = document.getElementById('content-type-modal-list');
    const itemDiv = createListItem(newContentType, () => deleteContentTypeInModal(contentTypeList.length - 1));
    contentTypeListDiv.appendChild(itemDiv);
  }
}

// 删除内容类型（模态框内）
function deleteContentTypeInModal(index) {
  if (!isLoggedIn) {
    alert('请先登录 GitHub 再进行修改操作。');
    return;
  }
  const contentTypeToDelete = contentTypeList[index];
  if (checkContentExists(contentTypeToDelete, categoryList, contentCount)) {
    alert('该内容类型下有内容，禁止删除。');
    return;
  }
  contentTypeList.splice(index, 1);
  renderContentTypeListInModal();
}

// 保存修改
async function saveChanges() {
  if (!isLoggedIn) {
    alert('请先登录 GitHub 再进行修改操作。');
    return;
  }
  const config = {
    categories: categoryList,
    contentTypes: contentTypeList
  };
  try {
    const response = await fetch('/save-config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(config)
    });
    if (response.ok) {
      renderNavAndSidebar();
      closeModifyModal();
    } else {
      alert('保存配置文件时出错');
    }
  } catch (error) {
    alert('保存配置文件时出错:', error);
  }
}

// 打开投稿模态框
function openSubmitModal() {
  if (!isLoggedIn) {
    alert('请先登录 GitHub 再进行投稿操作。');
    return;
  }
  renderSubmitModal();
  document.getElementById('submit-modal').style.display = 'block';
}

// 关闭投稿模态框
function closeSubmitModal() {
  document.getElementById('submit-modal').style.display = 'none';
}

function renderSubmitModal() {
  const categorySelect = document.getElementById('category');
  const contentTypeSelect = document.getElementById('content-type');
  categorySelect.innerHTML = '';
  contentTypeSelect.innerHTML = '';
  categoryList.forEach(category => {
    const option = createOption(category);
    categorySelect.appendChild(option);
  });
  contentTypeList.forEach(contentType => {
    const option = createOption(contentType);
    contentTypeSelect.appendChild(option);
  });
}

function createOption(value) {
  const option = document.createElement('option');
  option.value = value;
  option.textContent = value;
  return option;
}

// 提交文章
async function submitArticle() {
  if (!isLoggedIn) {
    alert('请先登录 GitHub 再进行投稿操作。');
    return;
  }
  const submitButton = document.getElementById('submit-btn');
  submitButton.disabled = true;
  submitButton.textContent = '正在提交...';

  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;
  const category = document.getElementById('category').value;
  const contentType = document.getElementById('content-type').value;

  if (!title || !content || !category || !contentType) {
    alert('请填写完整的标题、内容、分类和内容类型。');
    submitButton.disabled = false;
    submitButton.textContent = '提交';
    return;
  }

  const article = {
    title,
    content,
    category,
    contentType
  };

  const htmlContent = generateArticleHTML(article);
  const fileName = `${title.replace(' ', '_')}.html`;
  const filePath = `${category}/${contentType}/${fileName}`;

  const githubUsername = 'Wang-ABG';
  const repoName = 'AUITestAgent';
  const apiUrl = `https://api.github.com/repos/${githubUsername}/${repoName}/contents/${filePath}`;
  const base64Content = btoa(unescape(encodeURIComponent(htmlContent)));

  try {
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `Add article: ${title}`,
        content: base64Content
      })
    });
    const data = await response.json();
    if (data.content) {
      const key = `${category}-${contentType}`;
      if (!contentCount[key]) {
        contentCount[key] = 0;
      }
      contentCount[key]++;
      alert('投稿成功！');
      closeSubmitModal();
    } else {
      alert('投稿失败：' + data.message);
    }
  } catch (error) {
    alert('投稿失败：' + error.message);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = '提交';
  }
}

function generateArticleHTML(article) {
  return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>${article.title}</title>
</head>
<body>
    <h1>${article.title}</h1>
    <p>${article.content}</p>
</body>
</html>
  `;
}

// 增加搜索功能
const searchInput = document.querySelector('input[type="text"]');
searchInput.addEventListener('input', function () {
  const searchTerm = this.value.toLowerCase();
  const items = document.querySelectorAll('.item');
  items.forEach(item => {
    const text = item.textContent.toLowerCase();
    if (text.includes(searchTerm)) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
});

// 页面加载完成后加载配置
window.addEventListener('load', () => {
  loadConfig();
  handleGitHubCallback();
});    