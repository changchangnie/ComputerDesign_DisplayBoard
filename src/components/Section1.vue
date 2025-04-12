<template>
  <section class="content-section">
    <h2 class="section-title">研发投入-技术创新-产业升级-社会变革图谱</h2>
    
    <div class="grid-dashboard">
      <!-- 位置1: 左上角 -->
      <div class="grid-item grid-item-1">
        <h4 class="chart-title">研发投入与科技创新的回归关系</h4>
        <div class="chart-image adaptive-border" @click="toggleImage('linearRegression')">
          <img src="/images/part1/linearRegression.png" alt="研发投入与科技创新的回归关系" v-if="imagesLoaded">
          <div class="hexagon-loader" v-else>
            <div class="hexagon-inner"></div>
          </div>
        </div>
      </div>
      
      <!-- 位置2: 中部 - 主要图表（扩大1.5倍） -->
      <div class="grid-item grid-item-2">
        <h4 class="chart-title">各省投入强度</h4>
        <div class="chart-image main-image adaptive-border" @click="toggleImage('provincesInput')">
          <img src="/images/part1/provincesInput.png" alt="各省投入强度" v-if="imagesLoaded">
          <div class="hexagon-loader" v-else>
            <div class="hexagon-inner"></div>
          </div>
        </div>
      </div>
      
      <!-- 位置3: 右上角 -->
      <div class="grid-item grid-item-3">
        <h4 class="chart-title">各国创新情况二维分布</h4>
        <div class="chart-image adaptive-border" @click="toggleImage('2d')">
          <img src="/images/part1/2d.png" alt="各国创新情况二维分布" v-if="imagesLoaded">
          <div class="hexagon-loader" v-else>
            <div class="hexagon-inner"></div>
          </div>
        </div>
      </div>
      
      <!-- 位置4: 左下角 -->
      <div class="grid-item grid-item-4">
        <h4 class="chart-title">产业升级聚类特征图</h4>
        <div class="chart-image adaptive-border" @click="toggleImage('radarMap')">
          <img src="/images/part1/radarMap.png" alt="产业升级聚类特征图" v-if="imagesLoaded">
          <div class="hexagon-loader" v-else>
            <div class="hexagon-inner"></div>
          </div>
        </div>
      </div>
      
      <!-- 位置5: 中下 - 中美研发对比表格 -->
      <div class="grid-item grid-item-5">
        <h4 class="chart-title">中美研发投入对比(2022)</h4>
        <div class="research-comparison-table">
          <div class="table-container" v-if="imagesLoaded">
            <table class="data-table">
              <thead>
                <tr>
                  <th>指标</th>
                  <th>
                    <div class="country-header">
                      <span class="country-icon china"></span>
                      中国
                    </div>
                  </th>
                  <th>
                    <div class="country-header">
                      <span class="country-icon usa"></span>
                      美国
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in researchData" :key="index">
                  <td class="indicator">{{ item.indicator }}</td>
                  <td class="value china">
                    <div class="bar-container">
                      <div class="bar china-bar" :style="{ width: item.chinaPercentage + '%' }"></div>
                      <span class="value-text">{{ item.china }}</span>
                    </div>
                  </td>
                  <td class="value usa">
                    <div class="bar-container">
                      <div class="bar usa-bar" :style="{ width: item.usaPercentage + '%' }"></div>
                      <span class="value-text">{{ item.usa }}</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="hexagon-loader" v-else>
            <div class="hexagon-inner"></div>
          </div>
        </div>
      </div>
      
      <!-- 位置6: 右下角 -->
      <div class="grid-item grid-item-6">
        <h4 class="chart-title">社会变革指标趋势</h4>
        <div class="chart-image adaptive-border" @click="toggleImage('socialReform')">
          <img src="/images/part1/socialReform.png" alt="社会变革指标趋势" v-if="imagesLoaded">
          <div class="hexagon-loader" v-else>
            <div class="hexagon-inner"></div>
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
export default {
  name: 'Section1',
  data() {
    return {
      imagesLoaded: false,
      isZoomed: false,
      zoomedImageSrc: '',
      zoomedImageAlt: '',
      zoomedImageTitle: '',
      researchData: [
        {
          indicator: '年度 R&D 经费(亿美元)',
          china: '4,500',
          usa: '7,132',
          chinaPercentage: 63,  // 相对于最大值的百分比
          usaPercentage: 100
        },
        {
          indicator: 'R&D/GDP 占比(%)',
          china: '2.55',
          usa: '3.45',
          chinaPercentage: 74,
          usaPercentage: 100
        },
        {
          indicator: '企业研发占比(%)',
          china: '77',
          usa: '73',
          chinaPercentage: 100,
          usaPercentage: 95
        },
        {
          indicator: 'AI论文全球占比(%)',
          china: '29',
          usa: '19',
          chinaPercentage: 100,
          usaPercentage: 66
        },
        {
          indicator: '风险投资规模(亿美元)',
          china: '1,000',
          usa: '2,400',
          chinaPercentage: 42,
          usaPercentage: 100
        }
      ],
      imageInfo: {
        provincesInput: {
          src: '/images/part1/provincesInput.png',
          alt: '各省投入强度',
          title: '各省投入强度'
        },
        linearRegression: {
          src: '/images/part1/linearRegression.png',
          alt: '研发投入与科技创新的回归关系',
          title: '研发投入与科技创新的回归关系'
        },
        '2d': {
          src: '/images/part1/2d.png',
          alt: '各国创新情况二维分布',
          title: '各国创新情况二维分布'
        },
        radarMap: {
          src: '/images/part1/radarMap.png',
          alt: '产业升级聚类特征图',
          title: '产业升级聚类特征图'
        },
        socialReform: {
          src: '/images/part1/socialReform.png',
          alt: '社会变革指标趋势',
          title: '社会变革指标趋势'
        }
      }
    }
  },
  mounted() {
    console.log('Section 1 mounted')
    // 渐进式加载图片
    setTimeout(() => {
      this.imagesLoaded = true
    }, 600)
  },
  methods: {
    toggleImage(imageKey) {
      if (this.isZoomed && this.zoomedImageSrc === this.imageInfo[imageKey].src) {
        this.hideImage();
      } else {
        this.showImage(imageKey);
      }
    },
    
    showImage(imageKey) {
      if (!this.imageInfo[imageKey]) return;
      
      this.zoomedImageSrc = this.imageInfo[imageKey].src;
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
.grid-dashboard {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 15px;
  width: 100%;
  height: calc(100% - 40px);
  padding: 10px;
  overflow: hidden;
  position: relative;
}

.grid-item {
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

.grid-item:hover {
  box-shadow: 0 0 25px rgba(64, 156, 255, 0.3);
  transform: scale(1.01);
  z-index: 5;
}

.grid-item-2 {
  background-color: rgba(10, 25, 50, 0.8);
  padding: 20px;
  border: 2px solid rgba(64, 156, 255, 0.6);
  box-shadow: 0 0 30px rgba(64, 156, 255, 0.2), inset 0 0 20px rgba(64, 156, 255, 0.1);
  height: 130%; /* 增加高度至原来的1.5倍 */
  z-index: 4; /* 确保在其他元素上方 */
}

.grid-item-2:hover {
  box-shadow: 0 0 35px rgba(64, 156, 255, 0.4), inset 0 0 25px rgba(64, 156, 255, 0.2);
  transform: scale(1.05); /* 保持原来的位置，只放大不移动 */
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

.grid-item-2 .chart-title {
  font-size: 16px;
  margin-bottom: 15px;
  color: #7dd3fc;
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
  max-height: 100%; /* 增加最大高度占比 */
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
  max-height: calc(90vh - 80px); /* 增加最大高度，减去标题和内边距的空间 */
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
  max-height: 80vh; /* 增加图片最大高度 */
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

.grid-item-5 {
  position: relative;
  z-index: 3;
  padding-top: 20px;
  height: 70%; /* 设置高度为70% */
  align-self: flex-end; /* 确保从顶部开始对齐 */
}

@media (max-width: 992px) {
  .grid-dashboard {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto auto;
  }
  
  .grid-item-2 {
    grid-column: span 2;
    height: auto;
    transform: none;
  }
  
  .grid-item-2:hover {
    transform: scale(1.02);
  }
  
  .grid-item-5 {
    display: none;
    padding-top: 15px;
  }
  
  .zoom-image {
    max-height: 70vh; /* 中等屏幕也增加高度 */
  }
}

@media (max-width: 576px) {
  .grid-dashboard {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto auto;
    gap: 10px;
  }
  
  .grid-item {
    padding: 10px;
    height: 250px;
  }
  
  .grid-item-2 {
    grid-column: 1;
    grid-row: 1;
    height: 350px;
  }
  
  .chart-title {
    font-size: 12px;
    margin-bottom: 8px;
  }
  
  .grid-item-2 .chart-title {
    font-size: 14px;
  }
  
  .zoom-content {
    max-width: 95%;
  }
  
  .zoom-title {
    font-size: 14px;
    margin-top: 10px;
  }
  
  .zoom-image {
    max-height: 60vh; /* 小屏幕稍微调整一下高度 */
  }
}

.research-comparison-table {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* 修改为从顶部开始对齐 */
  align-items: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding-bottom: 10px; /* 底部添加一些间距 */
}

.table-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.8s ease forwards;
}

.data-table {
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

.data-table th {
  padding: 12px 8px;
  background-color: rgba(9, 25, 62, 0.8);
  text-align: left;
  font-weight: 500;
  color: #7dd3fc;
  border-bottom: 1px solid rgba(64, 156, 255, 0.3);
  text-shadow: 0 0 8px rgba(92, 187, 255, 0.4);
}

.data-table td {
  padding: 10px 8px;
  border-bottom: 1px solid rgba(64, 156, 255, 0.1);
  position: relative;
}

.data-table tr:last-child td {
  border-bottom: none;
}

.country-header {
  display: flex;
  align-items: center;
  justify-content: center;
}

.country-icon {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  margin-right: 6px;
}

.country-icon.china {
  background: linear-gradient(135deg, #ff4d4d, #b30000);
  box-shadow: 0 0 8px rgba(255, 77, 77, 0.5);
}

.country-icon.usa {
  background: linear-gradient(135deg, #4d79ff, #0044cc);
  box-shadow: 0 0 8px rgba(77, 121, 255, 0.5);
}

.indicator {
  font-weight: 500;
  color: #a5c9fd;
}

.bar-container {
  position: relative;
  height: 24px;
  width: 100%;
  background-color: rgba(10, 25, 50, 0.4);
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.bar {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  border-radius: 4px;
  transition: width 1s ease;
}

.bar.china-bar {
  background: linear-gradient(90deg, rgba(255, 77, 77, 0.2), rgba(255, 77, 77, 0.6));
  box-shadow: 0 0 10px rgba(255, 77, 77, 0.3);
}

.bar.usa-bar {
  background: linear-gradient(90deg, rgba(77, 121, 255, 0.2), rgba(77, 121, 255, 0.6));
  box-shadow: 0 0 10px rgba(77, 121, 255, 0.3);
}

.value-text {
  position: relative;
  z-index: 2;
  padding: 0 8px;
  font-weight: 500;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);
}

.grid-item-5 {
  position: relative;
  z-index: 3;
  padding-top: 20px;
}

@media (max-width: 992px) {
  .research-comparison-table {
    font-size: 11px;
  }
}
</style> 