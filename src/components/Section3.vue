<template>
  <section class="content-section">
    <h2 class="section-title">基于核心脉络与动态因素的回环分析</h2>
    
    <div class="tech-dashboard">
      <!-- 未来可以添加实际图表和内容 -->
      <div class="cyber-grid">
        <div class="grid-overlay"></div>
        <div class="cyber-circle"></div>
        <div class="center-node">
          <div class="pulse-ring"></div>
          <div class="pulse-core"></div>
        </div>
        <div class="center-text">
          <p class="placeholder-text">基于核心脉络与动态因素的回环分析<br>图片将在稍后添加</p>
        </div>
        <div class="cyber-line line1"></div>
        <div class="cyber-line line2"></div>
        <div class="cyber-line line3"></div>
        <div class="cyber-line line4"></div>
      </div>
    </div>
  </section>
</template>

<script>
// 引入ECharts库，稍后可以用于实现可视化
import * as echarts from 'echarts'

export default {
  name: 'Section3',
  data() {
    return {
      chartInitialized: false,
      imagesLoaded: false
    }
  },
  mounted() {
    console.log('Section 3 mounted')
    // 模拟图片加载过程
    setTimeout(() => {
      this.imagesLoaded = true
    }, 800)
  },
  methods: {
    initChart() {
      // 初始化图表的代码将放在这里
      // 例如：
      // const chartDom = this.$refs.chartContainer
      // const myChart = echarts.init(chartDom)
      // const option = { ... }
      // myChart.setOption(option)
      // this.chartInitialized = true
    }
  }
}
</script>

<style scoped>
.tech-dashboard {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  padding: 10px;
}

.cyber-grid {
  width: 90%;
  height: 90%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1000px;
}

.grid-overlay {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background-image: 
    linear-gradient(rgba(61, 193, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(61, 193, 255, 0.1) 1px, transparent 1px);
  background-size: 40px 40px;
  transform: rotateX(60deg);
  animation: grid-move 20s linear infinite;
}

.cyber-circle {
  position: absolute;
  width: 70%;
  height: 70%;
  border-radius: 50%;
  border: 2px solid rgba(61, 193, 255, 0.2);
  box-shadow: 0 0 50px rgba(61, 193, 255, 0.2), inset 0 0 30px rgba(61, 193, 255, 0.1);
}

.center-node {
  position: relative;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pulse-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid rgba(61, 193, 255, 0.5);
  animation: pulse-out 2s ease-out infinite;
}

.pulse-core {
  width: 20px;
  height: 20px;
  background-color: rgba(61, 193, 255, 0.8);
  border-radius: 50%;
  box-shadow: 0 0 15px rgba(61, 193, 255, 0.8);
  animation: pulse-core 2s ease-out infinite alternate;
}

.center-text {
  position: absolute;
  top: 55%;
  text-align: center;
  width: 100%;
  padding: 0 40px;
}

.cyber-line {
  position: absolute;
  background: linear-gradient(90deg, rgba(61, 193, 255, 0), rgba(61, 193, 255, 0.6), rgba(61, 193, 255, 0));
  height: 1px;
  width: 40%;
  top: 50%;
  animation: line-pulse 3s infinite alternate;
}

.line1 {
  transform: rotate(0deg);
  animation-delay: 0s;
  left: 55%;
}

.line2 {
  transform: rotate(90deg);
  animation-delay: 0.5s;
  top: 30%;
  left: 50%;
}

.line3 {
  transform: rotate(180deg);
  animation-delay: 1s;
  left: 5%;
}

.line4 {
  transform: rotate(-90deg);
  animation-delay: 1.5s;
  top: 70%;
  left: 50%;
}

.placeholder-text {
  color: #7dd3fc;
  font-size: 20px;
  text-align: center;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 500;
  line-height: 1.8;
  letter-spacing: 1px;
  text-shadow: 0 0 10px rgba(125, 211, 252, 0.5);
  position: relative;
  z-index: 2;
}

@keyframes grid-move {
  from {
    transform: rotateX(60deg) translateY(0);
  }
  to {
    transform: rotateX(60deg) translateY(40px);
  }
}

@keyframes pulse-out {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(3);
    opacity: 0;
  }
}

@keyframes pulse-core {
  0% {
    transform: scale(0.8);
    opacity: 0.6;
  }
  100% {
    transform: scale(1.2);
    opacity: 1;
  }
}

@keyframes line-pulse {
  0% {
    opacity: 0.3;
    width: 30%;
  }
  100% {
    opacity: 1;
    width: 45%;
  }
}

@media (max-width: 768px) {
  .cyber-grid {
    width: 95%;
    height: 70%;
  }
  
  .placeholder-text {
    font-size: 18px;
  }
  
  .cyber-line {
    width: 35%;
  }
}

/* 对于图片的样式 */
.chart-image {
  width: 100%;
  height: calc(100% - 30px);
  border-radius: 8px;
  overflow: hidden;
  background-color: rgba(15, 30, 60, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid rgba(92, 187, 255, 0.3);
  padding: 0;
}

.chart-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  display: block;
  width: auto;
  height: auto;
}

.chart-title {
  font-size: 16px;
  color: #5cbbff;
  margin-bottom: 10px;
  text-align: center;
  font-weight: 500;
  text-shadow: 0 0 10px rgba(92, 187, 255, 0.5);
  letter-spacing: 1px;
}
</style> 