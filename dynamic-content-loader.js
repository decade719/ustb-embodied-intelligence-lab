// 动态内容加载器 - 从localStorage加载管理员更新的内容
// 与新版"深空玻璃"设计系统保持一致：全部输出基于 class 的卡片（.m-card），
// 不再使用内联粉彩样式；容器选择器保持兼容（.members-scroll / #doctoral-team-grid /
// #master-team-grid / [data-anchor="professor"] / .has-sub .sub）。

// 角色判定工具
function isLeader(m) {
  const title = (m && m.title) ? m.title : '';
  const role = (m && m.role) ? m.role : '';
  return role.includes('负责人') || title.includes('教授');
}
function isDoctoral(m) {
  const title = (m && m.title) ? m.title : '';
  return title.includes('博士') || title.includes('Ph.D') || title.includes('PhD');
}
function isMaster(m) {
  const title = (m && m.title) ? m.title : '';
  return title.includes('硕士') || (title.includes('研究生') && !title.includes('博士'));
}
function isClickable(id) {
  return id === 'zhangtaohong' || id === 'xingbowen';
}

// 统一的成员卡片（class 驱动，样式全部来自 styles.css）
function renderMemberCard(member, variant, badgeText, roleText, delay) {
  const clickable = isClickable(member.id);
  const clickableAttr = clickable
    ? ` onclick="window.location.href='member-profile.html?id=${member.id}'"`
    : '';
  const delayStyle = delay ? ` style="--d:${delay}s"` : '';
  return `
    <article class="m-card ${variant}${clickable ? ' clickable' : ''} reveal reveal-show"${clickableAttr}${delayStyle}>
      <span class="m-badge">${badgeText}</span>
      <div class="m-photo"><img src="${member.avatar}" alt="${member.name}" loading="lazy"></div>
      <h3>${member.name}</h3>
      <p class="m-role">${roleText}</p>
    </article>
  `;
}

// 成员页面动态加载（members.html）
function loadDynamicMembers() {
  try {
    // 先确保 dataManager 已初始化
    if (!window.dataManager) {
      console.log('数据管理器未初始化，保留静态内容');
      return;
    }

    // 获取成员数据
    const members = window.dataManager.getMembers();

    // 如果数据为空或太少，不覆盖静态内容
    if (!Array.isArray(members) || members.length < 3) {
      console.log('成员数据不足或格式异常，保留静态内容');
      return;
    }

    // 过滤掉"洪英"（如果存在）
    const filteredMembers = members.filter(m => m && m.name !== '洪英' && m.id !== 'hongying');

    if (filteredMembers.length < 3) {
      console.log('过滤后成员数据不足，保留静态内容');
      return;
    }

    // 按照order排序（容错）
    filteredMembers.sort((a, b) => ((a && a.order) || 0) - ((b && b.order) || 0));

    // 分组（容错）
    const leaders = filteredMembers.filter(isLeader);
    const doctorals = filteredMembers.filter(m => isDoctoral(m) && !isLeader(m));
    const masters = filteredMembers.filter(m => isMaster(m) && !isLeader(m));

    // 更新教授/负责人部分（支持多位导师）
    const professorCard = document.querySelector('[data-anchor="professor"] .container .reveal');
    if (professorCard && leaders.length > 0) {
      const grid = professorCard.closest('.m-grid') || professorCard.parentElement;
      if (grid.classList && grid.classList.contains('m-grid')) grid.className = 'm-grid cols-2';
      grid.innerHTML = leaders
        .map((m, i) => renderMemberCard(m, 'gold', m.title || '教授', m.role || '实验室负责人', i * 0.06))
        .join('');
    }

    // 获取容器
    const doctoralGrid = document.getElementById('doctoral-team-grid');
    const masterGrid = document.getElementById('master-team-grid');

    // 仅当有数据时才覆盖静态内容，避免出现空白
    if (doctoralGrid && doctorals.length > 0) {
      doctoralGrid.innerHTML = doctorals
        .map((m, i) => renderMemberCard(m, 'blue', '博士', m.title || 'Ph.D. Candidate', i * 0.05))
        .join('');
    }

    if (masterGrid && masters.length > 0) {
      masterGrid.innerHTML = masters
        .map((m, i) => renderMemberCard(m, 'green', '硕士', m.title || 'M.S. Candidate', i * 0.05))
        .join('');
    }

    // 仅当静态内容本身为空且无数据时才隐藏
    const doctoralSection = document.getElementById('doctoral-team-section');
    const masterSection = document.getElementById('master-team-section');

    if (doctoralSection && doctorals.length === 0) {
      const hasStaticDoctoral = (document.querySelector('#doctoral-team-grid')?.children?.length || 0) > 0;
      if (!hasStaticDoctoral) doctoralSection.style.display = 'none';
    }
    if (masterSection && masters.length === 0) {
      const hasStaticMaster = document.querySelector('#master-team-grid')?.children?.length > 0;
      if (!hasStaticMaster) masterSection.style.display = 'none';
    }
  } catch (err) {
    console.warn('成员动态加载失败，将保留静态内容', err);
  }
}

// 产品菜单动态加载（导航栏，兼容旧结构；新版导航无该结构时自动跳过）
function loadDynamicProducts() {
  try {
    const productsData = localStorage.getItem('siteProducts');
    if (!productsData) return;

    const products = JSON.parse(productsData);
    const productMenus = document.querySelectorAll('.has-sub .sub');
    if (!productMenus.length) return;

    productMenus.forEach(menu => {
      // 检查是否是产品菜单（包含智能导航轮椅等）
      const menuText = menu.innerHTML;
      if (!menuText.includes('智能导航轮椅') && !menuText.includes('智能运货小车') && !menuText.includes('🦽')) {
        return;
      }

      menu.innerHTML = '';
      products.sort((a, b) => (a.order || 0) - (b.order || 0));

      products.forEach(product => {
        const link = document.createElement('a');
        link.href = product.link;
        link.textContent = `${product.icon} ${product.name}`;

        if (product.status !== 'available') {
          link.onclick = function(e) {
            e.preventDefault();
            if (typeof showModal === 'function') {
              showModal(product.name, product.description);
            } else {
              alert(product.description);
            }
            return false;
          };
        }

        menu.appendChild(link);
      });
    });
  } catch (err) {
    console.warn('产品菜单动态加载失败', err);
  }
}

// 首页成员列表动态加载（index.html）
function loadHomeMembers() {
  if (!window.dataManager) {
    return;
  }

  const members = window.dataManager.getMembers();
  if (!members || members.length < 3) {
    return;
  }

  // 过滤掉"洪英"（如果存在）和张桃红（张桃红使用静态卡片展示）
  const filteredMembers = members.filter(m =>
    m && m.name !== '洪英' && m.id !== 'hongying' && m.id !== 'zhangtaohong'
  );

  if (filteredMembers.length < 2) {
    return;
  }

  const membersScroll = document.querySelector('.members-scroll');
  if (!membersScroll) return;

  // 保留张桃红的静态卡片（选择器兼容：带 onclick 的 article）
  const zhangCard = membersScroll.querySelector('article[onclick*="zhangtaohong"]');
  const zhangCardHTML = zhangCard ? zhangCard.outerHTML : '';

  // 按照order排序
  filteredMembers.sort((a, b) => (a.order || 0) - (b.order || 0));

  // 清空并重新渲染（保留张桃红的静态卡片）
  membersScroll.innerHTML = zhangCardHTML;

  filteredMembers.forEach((member, index) => {
    // 判断身份：教授/负责人 → gold，博士 → blue，硕士 → green
    let variant = 'green';
    let badgeText = '硕士';
    let roleText = member.title || 'M.S. Candidate';

    if (isLeader(member)) {
      variant = 'gold';
      badgeText = member.title.includes('副教授') ? '副教授' : '教授';
      roleText = member.role || '实验室负责人';
    } else if (isDoctoral(member)) {
      variant = 'blue';
      badgeText = '博士';
      roleText = member.title || 'Ph.D. Candidate';
    }

    membersScroll.insertAdjacentHTML(
      'beforeend',
      renderMemberCard(member, variant, badgeText, roleText, (index + 1) * 0.06)
    );
  });
}

function initDynamicContent() {
  // 检查当前页面
  const path = window.location.pathname;

  if (path.includes('members.html')) {
    // 延迟一下，确保原始DOM已渲染
    setTimeout(loadDynamicMembers, 100);
  }

  if (path.includes('index.html') || path.endsWith('/') || path === '') {
    // 首页加载成员 - 延迟加载确保DOM已就绪
    setTimeout(loadHomeMembers, 200);
  }

  // 所有页面都尝试加载动态产品菜单
  setTimeout(loadDynamicProducts, 50);
}

// 在DOM加载完成后执行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDynamicContent);
} else {
  initDynamicContent();
}

// 导出给需要的页面使用
window.loadDynamicMembers = loadDynamicMembers;
window.loadDynamicProducts = loadDynamicProducts;
window.loadHomeMembers = loadHomeMembers;
