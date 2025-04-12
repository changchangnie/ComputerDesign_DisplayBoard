# 科技创新数据可视化平台

这是一个基于Vue.js和Vite的数据可视化大屏项目，用于展示科技创新相关的数据分析。

## 项目结构

```
├── public/                    # 静态资源文件夹
│   └── images/                # 图片资源
│       └── part1/             # 第一部分图片
│           ├── provincesInput.png    # 各省投入强度
│           ├── linearRegression.png  # 研发投入与科技创新的回归关系
│           ├── 2d.png                # 各国创新情况二维分布
│           ├── radarMap.png          # 产业升级聚类特征图
│           └── socialReform.png      # 社会变革指标趋势
├── src/                       # 源代码
│   ├── assets/                # 资源文件
│   │   └── css/               # CSS样式
│   │       └── style.css      # 全局样式
│   ├── components/            # Vue组件
│   │   ├── Dashboard.vue      # 主面板组件
│   │   ├── Section1.vue       # 研发投入-技术创新-产业升级-社会变革图谱
│   │   ├── Section2.vue       # 科技创新和资本市场的相互影响和预测
│   │   └── Section3.vue       # 基于核心脉络与动态因素的回环分析
│   ├── App.vue                # 根组件
│   └── main.js                # 入口文件
├── index.html                 # HTML入口
├── vite.config.js             # Vite配置文件
├── package.json               # 包管理文件
└── README.md                  # 项目说明
```

## 功能特点

- 三部分数据可视化内容，通过按钮可互相切换
- 响应式设计，适配不同屏幕尺寸
- 暗色主题设计，更适合数据可视化展示
- 使用图表和图片展示数据分析结果

## 图片放置说明

项目使用了多个数据可视化图片，按以下方式放置：

1. **第一部分：研发投入-技术创新-产业升级-社会变革图谱**
   - 将图片文件放在 `public/images/part1/` 目录下：
     - `provincesInput.png` - 各省投入强度
     - `linearRegression.png` - 研发投入与科技创新的回归关系
     - `2d.png` - 各国创新情况二维分布
     - `radarMap.png` - 产业升级聚类特征图
     - `socialReform.png` - 社会变革指标趋势

2. **其他部分的图片**
   - 可以按照类似的结构放置在相应的目录中
   - 确保路径与组件中引用的路径一致

## 使用说明

### 环境要求
- Node.js 16+
- npm 或 yarn

### 安装依赖
```bash
npm install
# 或
yarn
```

### 开发模式
```bash
npm run dev
# 或
yarn dev
```

### 构建项目
```bash
npm run build
# 或
yarn build
```

### 预览构建结果
```bash
npm run preview
# 或
yarn preview
```

## 后续开发

- 添加各部分的实际图表和数据
- 集成数据API，实现实时数据更新
- 优化动画效果和交互体验
- 添加更多的图表类型和数据分析功能 