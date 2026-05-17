// 数据管理模块 - 用于管理员后台编辑网站内容

// 默认成员数据
const defaultMembers = [
  {
    id: 'zhangtaohong',
    name: '张桃红',
    title: '教授',
    role: '实验室负责人',
    avatar: 'pictures/成员0.png',
    tags: ['具身智能', '机器人导航', '智能感知'],
    bio: '实验室创始人与学术带头人，专注于具身智能、机器人导航与环境感知领域的前沿研究',
    order: 1
  },
  {
    id: 'xingbowen',
    name: '邢博文',
    title: '副教授',
    role: '学术顾问',
    avatar: 'pictures/成员5.png',
    tags: ['大语言模型', '自然语言处理'],
    bio: '长期从事人工智能和自然语言处理的前沿研究，专注于基于大语言模型的异构语言信息处理及其在垂直领域的应用',
    order: 1.5
  },
  {
    id: 'yuchunlin',
    name: '俞纯林',
    title: '博士',
    role: 'SLAM算法研究',
    avatar: 'pictures/成员1.png',
    tags: ['SLAM算法', '视觉导航', '路径规划'],
    bio: '专注于SLAM算法研究与视觉导航系统开发，在多传感器融合定位方面有深入研究',
    order: 2
  },
  {
    id: 'wanghaoyu',
    name: '王浩宇',
    title: '博士',
    role: '深度学习研究',
    avatar: 'pictures/成员2.png',
    tags: ['深度学习', '环境感知', '智能避障'],
    bio: '研究方向为深度学习与环境感知，致力于提升机器人在复杂环境下的智能避障能力',
    order: 3
  },
  {
    id: 'libotao',
    name: '李博涛',
    title: '硕士研究生',
    role: '机器学习研究',
    avatar: 'pictures/成员3.png',
    tags: ['机器学习', '数据分析'],
    bio: '机器学习与数据分析方向研究者，专注于智能算法在机器人系统中的应用',
    order: 4
  },
  {
    id: 'xiachenglong',
    name: '夏成龙',
    title: '硕士研究生',
    role: '嵌入式开发',
    avatar: 'pictures/成员4.png',
    tags: ['嵌入式系统', '硬件开发'],
    bio: '嵌入式系统与硬件集成方向研究者，专注于机器人底层控制与硬件开发',
    order: 5
  },
  {
    id: 'xulonglong',
    name: '许龙龙',
    title: '硕士研究生',
    role: '图像处理',
    avatar: 'pictures/成员7.png',
    tags: ['图像处理', '粗糙度检测'],
    bio: '图像处理与特征提取方向研究者，专注于工业视觉检测',
    order: 8
  },
  {
    id: 'zhuzhuangzhuang',
    name: '朱状状',
    title: '硕士研究生',
    role: '系统测试',
    avatar: 'pictures/成员8.png',
    tags: ['云平台', '数据管理'],
    bio: '系统测试与质量保障方向研究者，专注于机器人系统可靠性',
    order: 9
  },
  {
    id: 'ganyutong',
    name: '甘语桐',
    title: '硕士研究生',
    role: '前端开发',
    avatar: 'pictures/成员9.png',
    tags: ['前端开发', 'UI/UX设计'],
    bio: 'Web开发与人机交互界面设计方向研究者',
    order: 10
  }
];

// 默认产品数据
const defaultProducts = [
  {
    id: 'wheelchair',
    name: '智能导航轮椅',
    icon: '🦽',
    shortDesc: '辅助出行 · 情感陪伴',
    description: '集成多传感器融合、大模型语音交互、情感陪伴等功能的智能轮椅系统',
    features: ['室外导航', '室内避障', '语音交互', '情感陪伴', '坡道辅助'],
    status: 'available',
    link: 'product_chair.html',
    order: 1
  },
  {
    id: 'cargo-cart',
    name: '智能运货小车',
    icon: '🚚',
    shortDesc: '高效物流 · 智能配送',
    description: '该产品正在开发中，敬请期待！智能运货小车即将上线，为您提供高效的物流解决方案。',
    features: ['自动导航', '货物识别', '路径优化'],
    status: 'developing',
    link: '#',
    order: 2
  },
  {
    id: 'food-cart',
    name: '智能餐车',
    icon: '🍽️',
    shortDesc: '智能送餐 · 卫生高效',
    description: '该产品正在开发中，敬请期待！智能餐车即将上线，为您提供智能化的餐饮配送服务。',
    features: ['自动送餐', '保温控制', '消毒功能'],
    status: 'developing',
    link: '#',
    order: 3
  }
];

// 数据管理类
class DataManager {
  constructor() {
    this.init();
  }

  // 初始化数据
  init() {
    // 过滤函数：移除陈震和临
    const filterMembers = (members) => {
      return members.filter(m => m && 
        m.name !== '陈震' && m.id !== 'chenzhen' &&
        m.name !== '临' && m.id !== 'lin' &&
        m.name !== '洪英' && m.id !== 'hongying'
      );
    };

    // 头像映射：将在线头像替换为本地头像
    const avatarMap = {
      'xingbowen': 'pictures/成员5.png',
      'yuchunlin': 'pictures/成员1.png',
      'wanghaoyu': 'pictures/成员2.png',
      'libotao': 'pictures/成员3.png',
      'xiachenglong': 'pictures/成员4.png',
      'xulonglong': 'pictures/成员7.png',
      'zhuzhuangzhuang': 'pictures/成员8.png',
      'ganyutong': 'pictures/成员9.png'
    };

    // 更新成员头像的函数（强制更新）
    const updateMemberAvatar = (member) => {
      if (member && member.id && avatarMap[member.id]) {
        const oldAvatar = member.avatar;
        member.avatar = avatarMap[member.id];
        return oldAvatar !== member.avatar; // 返回是否发生了变化
      }
      return false;
    };

    if (!localStorage.getItem('siteMembers')) {
      localStorage.setItem('siteMembers', JSON.stringify(defaultMembers));
    } else {
      // 合并缺失的默认成员（不覆盖已有数据），确保原始页面不空
      try {
        const current = JSON.parse(localStorage.getItem('siteMembers')) || [];
        // 删除"洪英"、"陈震"、"临"（如果存在）
        let filtered = filterMembers(current);
        let changed = filtered.length !== current.length;
        
        // 更新所有成员的头像
        filtered.forEach(member => {
          if (updateMemberAvatar(member)) {
            changed = true;
          }
        });
        
        defaultMembers.forEach(dm => {
          const existing = filtered.find(m => m && m.id === dm.id);
          if (!existing) {
            filtered.push(dm);
            changed = true;
          } else {
            // 如果已存在，也更新头像
            if (updateMemberAvatar(existing)) {
              changed = true;
            }
          }
        });
        // 再次过滤确保没有陈震和临
        filtered = filterMembers(filtered);
        if (changed || filtered.length !== current.length) {
          localStorage.setItem('siteMembers', JSON.stringify(filtered));
        }
      } catch (e) {
        console.warn('成员数据合并失败，使用默认成员');
        localStorage.setItem('siteMembers', JSON.stringify(defaultMembers));
      }
    }
    if (!localStorage.getItem('siteProducts')) {
      localStorage.setItem('siteProducts', JSON.stringify(defaultProducts));
    }
  }

  // 获取成员列表
  getMembers() {
    const data = localStorage.getItem('siteMembers');
    const members = data ? JSON.parse(data) : defaultMembers;
    
    // 头像映射
    const avatarMap = {
      'xingbowen': 'pictures/成员5.png',
      'yuchunlin': 'pictures/成员1.png',
      'wanghaoyu': 'pictures/成员2.png',
      'libotao': 'pictures/成员3.png',
      'xiachenglong': 'pictures/成员4.png',
      'xulonglong': 'pictures/成员7.png',
      'zhuzhuangzhuang': 'pictures/成员8.png',
      'ganyutong': 'pictures/成员9.png'
    };
    
    // 更新头像并过滤
    return members
      .filter(m => m && 
        m.name !== '陈震' && m.id !== 'chenzhen' &&
        m.name !== '临' && m.id !== 'lin'
      )
      .map(m => {
        // 强制更新为本地头像（如果该成员在映射表中）
        if (m.id && avatarMap[m.id]) {
          m.avatar = avatarMap[m.id];
        }
        return m;
      });
  }

  // 保存成员列表
  saveMembers(members) {
    // 保存时也过滤掉陈震和临
    const filtered = members.filter(m => m && 
      m.name !== '陈震' && m.id !== 'chenzhen' &&
      m.name !== '临' && m.id !== 'lin'
    );
    localStorage.setItem('siteMembers', JSON.stringify(filtered));
  }

  // 添加成员
  addMember(member) {
    const members = this.getMembers();
    member.id = member.id || 'member_' + Date.now();
    member.order = members.length + 1;
    members.push(member);
    this.saveMembers(members);
    return member;
  }

  // 更新成员
  updateMember(id, updates) {
    const members = this.getMembers();
    const index = members.findIndex(m => m.id === id);
    if (index !== -1) {
      members[index] = { ...members[index], ...updates };
      this.saveMembers(members);
      return members[index];
    }
    return null;
  }

  // 删除成员
  deleteMember(id) {
    let members = this.getMembers();
    members = members.filter(m => m.id !== id);
    this.saveMembers(members);
    return true;
  }

  // 获取产品列表
  getProducts() {
    const data = localStorage.getItem('siteProducts');
    return data ? JSON.parse(data) : defaultProducts;
  }

  // 保存产品列表
  saveProducts(products) {
    localStorage.setItem('siteProducts', JSON.stringify(products));
  }

  // 添加产品
  addProduct(product) {
    const products = this.getProducts();
    product.id = product.id || 'product_' + Date.now();
    product.order = products.length + 1;
    products.push(product);
    this.saveProducts(products);
    return product;
  }

  // 更新产品
  updateProduct(id, updates) {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updates };
      this.saveProducts(products);
      return products[index];
    }
    return null;
  }

  // 删除产品
  deleteProduct(id) {
    let products = this.getProducts();
    products = products.filter(p => p.id !== id);
    this.saveProducts(products);
    return true;
  }

  // 重置为默认数据
  resetToDefault() {
    localStorage.setItem('siteMembers', JSON.stringify(defaultMembers));
    localStorage.setItem('siteProducts', JSON.stringify(defaultProducts));
  }

  // 导出数据
  exportData() {
    return {
      members: this.getMembers(),
      products: this.getProducts(),
      exportDate: new Date().toISOString()
    };
  }

  // 导入数据
  importData(data) {
    if (data.members) {
      this.saveMembers(data.members);
    }
    if (data.products) {
      this.saveProducts(data.products);
    }
  }
}

// 创建全局实例
window.dataManager = new DataManager();

