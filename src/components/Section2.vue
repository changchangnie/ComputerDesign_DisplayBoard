<template>
  <section class="content-section">
    <h2 class="section-title">科技创新全球格局</h2>
    
    <div class="two-column-layout">
      <!-- 左侧栏 -->
      <div class="left-column">
        <!-- 1.2 国家聚类分布表 -->
        <div class="panel panel-1-2">
          <h4 class="chart-title">国家聚类分布表</h4>
          <div class="cluster-table-container" v-if="imagesLoaded">
            <table class="cluster-table">
              <thead>
                <tr>
                  <th class="cluster-id">聚类编号</th>
                  <th class="cluster-countries">包含国家</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in clusterData" :key="index">
                  <td class="cluster-id">{{ item.id }}</td>
                  <td class="cluster-countries">{{ item.countries }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="hexagon-loader" v-else>
            <div class="hexagon-inner"></div>
          </div>
        </div>
        
        <!-- 1.3 聚类结果分析 -->
        <div class="panel panel-1-3">
          <h4 class="chart-title">聚类结果分析</h4>
          <div class="chart-image adaptive-border" @click="toggleImage('analysis')">
            <img :src="getImageSrc('analysis')" alt="聚类结果分析" v-if="imagesLoaded">
            <div class="hexagon-loader" v-else>
              <div class="hexagon-inner"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 右侧栏 -->
      <div class="right-column">
        <div class="panel panel-2">
          <h4 class="chart-title">各国经济行为与科创特征</h4>
          <div class="chart-image adaptive-border" @click="toggleImage('capitalTech')">
            <img :src="getImageSrc('capitalTech')" alt="各国经济行为与科创特征" v-if="imagesLoaded">
            <div class="hexagon-loader" v-else>
              <div class="hexagon-inner"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 放大后的悬浮图片容器 -->
      <div class="zoom-container" :class="{ active: isZoomed }" @click="hideImage">
        <div class="zoom-backdrop"></div>
        <div class="zoom-content">
          <div class="zoom-image-wrapper">
            <img :src="zoomedImageSrc" :alt="zoomedImageAlt" class="zoom-image" v-if="zoomedImageSrc">
          </div>
          <div class="zoom-title">{{ zoomedImageTitle }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
// 引入ECharts库，稍后可以用于实现可视化
import * as echarts from 'echarts'

export default {
  name: 'Section2',
  data() {
    return {
      imagesLoaded: false,
      isZoomed: false,
      zoomedImageSrc: '',
      zoomedImageAlt: '',
      zoomedImageTitle: '',
      clusterData: [
        {
          id: '0',
          countries: 'Australia, Brazil, Canada, Germany, Hong Kong, Israel, Singapore (HQ Region), Sweden, Switzerland'
        },
        {
          id: '1',
          countries: 'United States'
        },
        {
          id: '2',
          countries: 'China'
        },
        {
          id: '3',
          countries: 'Argentina, Austria, Belgium, Bulgaria, Czechia, Denmark, Egypt, Estonia, Finland, Greece, Iceland, Indonesia, Ireland, Italy, Kenya, Latvia, Lithuania, Malaysia, Mexico, Netherlands, New Zealand, Nigeria, Norway, Poland, Portugal, Russia, South Africa, Spain, Taiwan, Ukraine, Vietnam'
        },
        {
          id: '4',
          countries: 'India, South Korea'
        },
        {
          id: '5',
          countries: 'United Kingdom'
        },
        {
          id: '6',
          countries: 'France, Japan, Luxembourg, Saudi Arabia'
        }
      ],
      basePaths: {
        // 存储不同环境下的基础路径
        local: '/',
        production: './'
      },
      imageInfo: {
        analysis: {
          path: 'images/part2/analysis.png',
          alt: '聚类结果分析',
          title: '聚类结果分析'
        },
        capitalTech: {
          path: 'images/part2/capitalTech.png',
          alt: '各国经济行为与科创特征',
          title: '各国经济行为与科创特征'
        }
      }
    }
  },
  computed: {
    // 根据环境确定基础路径
    basePath() {
      // 检查当前URL是否包含GitHub Pages域名
      if (window.location.href.includes('github.io')) {
        return this.basePaths.production;
      }
      return this.basePaths.local;
    },
    // 为每个图片生成完整路径
    imageSrcs() {
      const srcs = {};
      for (const key in this.imageInfo) {
        srcs[key] = this.basePath + this.imageInfo[key].path;
      }
      return srcs;
    }
  },
  mounted() {
    console.log('Section 2 mounted')
    // 渐进式加载图片
    setTimeout(() => {
      this.imagesLoaded = true
    }, 600)
  },
  methods: {
    toggleImage(imageKey) {
      if (this.isZoomed && this.zoomedImageSrc === this.getImageSrc(imageKey)) {
        this.hideImage();
      } else {
        this.showImage(imageKey);
      }
    },
    
    // 获取图片完整路径的方法
    getImageSrc(imageKey) {
      return this.imageSrcs[imageKey];
    },
    
    showImage(imageKey) {
      if (!this.imageInfo[imageKey]) return;
      
      this.zoomedImageSrc = this.getImageSrc(imageKey);
      this.zoomedImageAlt = this.imageInfo[imageKey].alt;
      this.zoomedImageTitle = this.imageInfo[imageKey].title;
      
      this.isZoomed = true;
    },
    
    hideImage() {
      this.isZoomed = false;
      
      // 清空图片源，但要延迟执行以保持退出动画
      setTimeout(() => {
        if (!this.isZoomed) {
          this.zoomedImageSrc = '';
          this.zoomedImageAlt = '';
          this.zoomedImageTitle = '';
        }
      }, 300);
    }
  }
}
</script>

<style scoped>
.two-column-layout {
  display: flex;
  width: 100%;
  height: calc(100% - 40px);
  gap: 15px;
  padding: 10px;
  overflow: hidden;
  position: relative;
}

.left-column {
  flex: 0.85; /* 减少左栏的宽度 */
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  height: 100%;
}

.right-column {
  flex: 1.15; /* 增加右栏的宽度 */
  width: 100%;
  height: 100%;
}

.panel {
  position: relative;
  background-color: rgba(10, 25, 50, 0.7);
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  overflow: hidden;
}

.panel:hover {
  box-shadow: 0 0 25px rgba(64, 156, 255, 0.3);
  transform: scale(1.01);
  z-index: 5;
}

.panel-1-3 {
  flex: 1.2; /* 增加聚类结果分析面板的比例 */
}

.panel-1-2 {
  flex: 1; /* 减少表格部分的比例 */
}

.panel-2 {
  height: 100%;
}

.chart-title {
  font-size: 14px;
  color: #5cbbff;
  margin-bottom: 10px;
  text-align: center;
  font-weight: 500;
  text-shadow: 0 0 10px rgba(92, 187, 255, 0.5);
  letter-spacing: 1px;
}

.chart-image {
  flex: 1;
  border-radius: 8px;
  overflow: hidden;
  background-color: rgba(15, 30, 60, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 0;
  cursor: pointer;
}

.chart-image::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, transparent 80%, rgba(15, 30, 60, 0.5) 100%);
  pointer-events: none;
  z-index: 3;
}

.chart-image img {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  display: block;
  transition: all 0.5s ease;
  opacity: 0;
  transform: scale(0.95);
  animation: fadeIn 0.8s ease forwards;
}

/* 聚类表样式 */
.cluster-table-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto;
  padding: 5px;
  animation: fadeIn 0.8s ease forwards;
}

.cluster-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  color: #e4e6eb;
  font-size: 12px;
  background-color: rgba(15, 30, 60, 0.3);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
}

.cluster-table th {
  padding: 12px 8px;
  background-color: rgba(9, 25, 62, 0.8); /* 修复了这里的typo */
  text-align: left;
  font-weight: 500;
  color: #7dd3fc;
  border-bottom: 1px solid rgba(64, 156, 255, 0.3);
  text-shadow: 0 0 8px rgba(92, 187, 255, 0.4);
  position: sticky;
  top: 0;
  z-index: 2;
}

.cluster-table td {
  padding: 10px 8px;
  border-bottom: 1px solid rgba(64, 156, 255, 0.1);
  vertical-align: top;
  line-height: 1.4;
}

.cluster-table tr:last-child td {
  border-bottom: none;
}

.cluster-id {
  width: 80px;
  text-align: center;
  font-weight: 500;
  color: #a5c9fd;
  background-color: rgba(9, 25, 62, 0.6);
}

.cluster-countries {
  padding-left: 12px;
  text-align: left;
}

/* 放大效果容器样式 */
.zoom-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  pointer-events: none;
}

.zoom-container.active {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.zoom-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(5, 15, 35, 0.85);
  backdrop-filter: blur(5px);
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.zoom-container.active .zoom-backdrop {
  opacity: 1;
}

.zoom-content {
  position: relative;
  max-width: 100%;
  max-height: 85%;
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0;
  transform: scale(0.95);
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.zoom-container.active .zoom-content {
  opacity: 1;
  transform: scale(1);
}

.zoom-image-wrapper {
  background-color: rgba(10, 25, 50, 0.7);
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 0 40px rgba(64, 156, 255, 0.4);
  border: 2px solid rgba(97, 218, 251, 0.5);
  overflow: hidden;
  position: relative;
  max-height: calc(90vh - 80px);
  display: flex;
  justify-content: center;
  align-items: center;
}

.zoom-image-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, rgba(97, 218, 251, 0.1), transparent 60%);
  pointer-events: none;
}

.zoom-image {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  display: block;
  border-radius: 4px;
}

.zoom-title {
  margin-top: 15px;
  color: #7dd3fc;
  font-size: 18px;
  font-weight: 500;
  text-align: center;
  text-shadow: 0 0 15px rgba(125, 211, 252, 0.7);
  background-color: rgba(10, 25, 50, 0.7);
  padding: 8px 20px;
  border-radius: 30px;
  letter-spacing: 1px;
  white-space: nowrap;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.3s ease 0.2s, transform 0.3s ease 0.2s;
}

.zoom-container.active .zoom-title {
  opacity: 1;
  transform: translateY(0);
}

.empty-placeholder {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(15, 30, 60, 0.3);
  border-radius: 8px;
  border: 1px dashed rgba(64, 156, 255, 0.3);
  position: relative;
  overflow: hidden;
}

.empty-placeholder::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background-image: 
    linear-gradient(rgba(61, 193, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(61, 193, 255, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
  transform: rotateX(60deg);
  animation: grid-move 15s linear infinite;
  pointer-events: none;
}

.tech-graphic {
  position: relative;
  width: 100px;
  height: 100px;
  margin-bottom: 15px;
}

.tech-line {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(97, 218, 251, 0.8), transparent);
  animation: pulse 2s ease-in-out infinite alternate;
}

.tech-line:nth-child(1) {
  transform: translate(-50%, -50%) rotate(0deg);
  animation-delay: 0s;
}

.tech-line:nth-child(2) {
  transform: translate(-50%, -50%) rotate(60deg);
  animation-delay: 0.5s;
}

.tech-line:nth-child(3) {
  transform: translate(-50%, -50%) rotate(120deg);
  animation-delay: 1s;
}

.placeholder-text {
  color: #5cbbff;
  font-size: 15px;
  text-align: center;
  opacity: 0.7;
  letter-spacing: 1px;
  text-shadow: 0 0 8px rgba(92, 187, 255, 0.5);
}

.hexagon-loader {
  position: relative;
  width: 50px;
  height: 50px;
  animation: rotate 2s linear infinite;
}

.hexagon-inner {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background: linear-gradient(45deg, transparent 40%, rgba(92, 187, 255, 0.8) 45%, rgba(92, 187, 255, 0.8) 55%, transparent 60%);
  animation: pulse-loader 1.5s ease-in-out infinite alternate;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse-loader {
  from {
    opacity: 0.3;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1.2);
  }
}

@keyframes grid-move {
  from {
    transform: rotateX(60deg) translateY(0);
  }
  to {
    transform: rotateX(60deg) translateY(20px);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes pulse {
  from {
    opacity: 0.3;
    width: 40%;
  }
  to {
    opacity: 1;
    width: 80%;
  }
}

/* 响应式布局 */
@media (max-width: 992px) {
  .two-column-layout {
    flex-direction: column;
  }
  
  .left-column, .right-column {
    width: 100%;
  }
  
  .panel-1-2 {
    flex: 1.5;
  }
  
  .zoom-image {
    max-height: 70vh;
  }
}

@media (max-width: 576px) {
  .left-column {
    gap: 10px;
  }
  
  .panel {
    padding: 10px;
  }
  
  .chart-title {
    font-size: 12px;
    margin-bottom: 8px;
  }
  
  .cluster-table {
    font-size: 10px;
  }
  
  .zoom-content {
    max-width: 95%;
  }
  
  .zoom-title {
    font-size: 14px;
    margin-top: 10px;
  }
  
  .zoom-image {
    max-height: 60vh;
  }
}
</style> 