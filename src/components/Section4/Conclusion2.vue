<template>
  <div class="conclusion2">
    <div class="main-content">
      <!-- 左侧控制面板 -->
      <div class="control-panel">
        <div class="parameter-control">
          <h3 class="control-title">参数调节</h3>
          
          <!-- 技术创新指数滑动条 -->
          <div class="slider-container">
            <label class="slider-label">技术创新指数 (0-100)</label>
            <div class="slider-wrapper">
              <input 
                type="range" 
                class="slider" 
                :min="0" 
                :max="100" 
                :step="1" 
                v-model="techInnovationIndex"
                @input="handleSliderChange"
              />
              <div class="slider-value">{{ techInnovationIndex }}</div>
            </div>
          </div>
          
          <!-- 数值输入框 -->
          <div class="input-container">
            <label class="input-label">精确输入:</label>
            <input 
              type="number" 
              class="number-input"
              :min="0"
              :max="100"
              :step="1"
              v-model="techInnovationIndex"
              @input="handleInputChange"
            />
            <span class="input-unit">分</span>
          </div>
        </div>
        
        <!-- 计算结果显示 -->
        <div class="result-panel">
          <h3 class="control-title">计算结果</h3>
          <div class="result-item">
            <span class="result-label">技术创新指数:</span>
            <span class="result-value">{{ techInnovationIndex }}</span>
          </div>
          <div class="result-item">
            <span class="result-label">高科技出口占比:</span>
            <span class="result-value highlight">{{ currentHighTechExport.toFixed(1) }}%</span>
          </div>
          <div class="result-item total">
            <span class="result-label">数字化指数:</span>
            <span class="result-value total-value">{{ currentDigitalizationIndex.toFixed(1) }}</span>
          </div>
        </div>
        
        <!-- 国家对比数据 -->
        <div class="country-comparison">
          <h3 class="control-title">国家对比</h3>
          <div class="country-list">
            <div 
              v-for="country in countryExamples" 
              :key="country.name"
              class="country-item"
              @click="setCountryParams(country)"
            >
              <div class="country-name">{{ country.name }}</div>
              <div class="country-data">
                <span>创新: {{ country.tech }}</span>
                <span>出口: {{ country.highTech }}%</span>
                <span>数字: {{ country.digital }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 相关性说明 -->
        <div class="correlation-info">
          <h3 class="control-title">相关性分析</h3>
          <div class="correlation-item">
            <span class="correlation-label">高科技出口相关性:</span>
            <span class="correlation-value">r = 0.89</span>
          </div>
          <div class="correlation-item">
            <span class="correlation-label">数字化指数相关性:</span>
            <span class="correlation-value strong">r = 0.97</span>
          </div>
        </div>
      </div>
      
      <!-- 右侧图表区域 -->
      <div class="chart-area">
        <!-- 上方图表：技术创新→高科技出口 -->
        <div class="chart-container">
          <h4 class="chart-title">技术创新 → 高科技出口关系 (r=0.89)</h4>
          <div ref="chartHighTechRef" class="echarts-container"></div>
        </div>
        
        <!-- 下方图表：技术创新→数字化指数 -->
        <div class="chart-container">
          <h4 class="chart-title">技术创新 → 数字化指数关系 (r=0.97)</h4>
          <div ref="chartDigitalRef" class="echarts-container"></div>
        </div>
        
        <div class="chart-description">
          <p>图表说明：展示技术创新指数与高科技出口占比(r=0.89)和数字化指数(r=0.97)的相关关系。数字化指数相关性更强，表明技术创新对数字化转型的推动作用更为显著。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'Conclusion2',
  data() {
    return {
      // 可调节参数
      techInnovationIndex: 58,           // 技术创新指数 (0-100)，调整为更接近实际数据的中位数
      
      // 基础参数和系数
      baseHighTechExport: 18,            // 高科技出口基础值 (%)，基于实际数据调整
      baseDigitalizationIndex: 78,       // 数字化基础指数，基于实际数据调整
      correlationHighTech: 0.89,         // 高科技出口相关性系数
      correlationDigital: 0.97,          // 数字化相关性系数
      scalingFactorHighTech: 0.8,        // 高科技出口缩放因子，调整以适应真实数据范围
      scalingFactorDigital: 0.4,         // 数字化缩放因子，调整以适应真实数据范围
      
      // 计算结果
      currentHighTechExport: 0,          // 当前高科技出口占比
      currentDigitalizationIndex: 0,     // 当前数字化指数
      
      // 图表实例
      chartInstanceHighTech: null,
      chartInstanceDigital: null,
      resizeHandler: null,
      
      // 国家示例数据
      // 数据来源：GII 2024 (技术创新指数) + 各国官方数字化指数 + WTO/OECD高科技出口数据
      countryExamples: [
        { name: '中国 🇨🇳', tech: 56.3, highTech: 30.8, digital: 73.1 },
        { name: '美国 🇺🇸', tech: 62.4, highTech: 19.5, digital: 85.6 },
        { name: '德国 🇩🇪', tech: 58.1, highTech: 17.2, digital: 81.3 },
        { name: '日本 🇯🇵', tech: 54.1, highTech: 19.1, digital: 78.4 },
        { name: '韩国 🇰🇷', tech: 60.9, highTech: 26.4, digital: 84.5 }
      ]
    }
  },
  mounted() {
    console.log('Conclusion2 mounted')
    this.calculateValues()
    this.$nextTick(() => {
      setTimeout(() => {
        this.initCharts()
      }, 100)
    })
    
    // 添加防抖的resize监听
    this.resizeHandler = this.debounce(() => {
      if (this.chartInstanceHighTech && !this.chartInstanceHighTech.isDisposed()) {
        this.chartInstanceHighTech.resize()
      }
      if (this.chartInstanceDigital && !this.chartInstanceDigital.isDisposed()) {
        this.chartInstanceDigital.resize()
      }
    }, 300)
    
    window.addEventListener('resize', this.resizeHandler)
  },
  beforeUnmount() {
    console.log('Conclusion2 beforeUnmount')
    
    // 移除resize监听器
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler)
    }
    
    // 销毁图表实例
    if (this.chartInstanceHighTech) {
      this.chartInstanceHighTech.dispose()
      this.chartInstanceHighTech = null
    }
    if (this.chartInstanceDigital) {
      this.chartInstanceDigital.dispose()
      this.chartInstanceDigital = null
    }
  },
  methods: {
    calculateValues() {
      // 线性回归计算
      this.currentHighTechExport = this.baseHighTechExport + (this.techInnovationIndex - 50) * this.correlationHighTech * this.scalingFactorHighTech
      this.currentDigitalizationIndex = this.baseDigitalizationIndex + (this.techInnovationIndex - 50) * this.correlationDigital * this.scalingFactorDigital
      
      // 确保值在合理范围内
      this.currentHighTechExport = Math.max(15, Math.min(35, this.currentHighTechExport))
      this.currentDigitalizationIndex = Math.max(70, Math.min(90, this.currentDigitalizationIndex))
    },
    
    handleSliderChange() {
      this.calculateValues()
      this.updateCharts()
    },
    
    handleInputChange() {
      // 验证输入范围
      if (this.techInnovationIndex < 0) this.techInnovationIndex = 0
      if (this.techInnovationIndex > 100) this.techInnovationIndex = 100
      this.calculateValues()
      this.updateCharts()
    },
    
    setCountryParams(country) {
      this.techInnovationIndex = country.tech
      this.calculateValues()
      this.updateCharts()
    },
    
    debounce(func, wait) {
      let timeout
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout)
          func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
      }
    },
    
    initCharts() {
      this.initHighTechChart()
      this.initDigitalChart()
    },
    
    initHighTechChart() {
      const chartContainer = this.$refs.chartHighTechRef
      if (!chartContainer) return
      
      this.chartInstanceHighTech = echarts.init(chartContainer)
      this.updateHighTechChart()
    },
    
    initDigitalChart() {
      const chartContainer = this.$refs.chartDigitalRef
      if (!chartContainer) return
      
      this.chartInstanceDigital = echarts.init(chartContainer)
      this.updateDigitalChart()
    },
    
    updateCharts() {
      this.updateHighTechChart()
      this.updateDigitalChart()
    },
    
    updateHighTechChart() {
      if (!this.chartInstanceHighTech) return
      
      const { regressionData, countryData, currentPoint } = this.generateHighTechData()
      
      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(15, 30, 60, 0.9)',
          borderColor: '#22c55e',
          textStyle: { color: '#ffffff' },
          formatter: function(params) {
            const [x, y] = params.data
            if (params.seriesName === '理论回归线') {
              return `技术创新: ${x}<br/>高科技出口: ${y.toFixed(1)}%`
            } else if (params.seriesName === '当前设置') {
              return `当前设置<br/>技术创新: ${x}<br/>高科技出口: ${y.toFixed(1)}%`
            } else {
              const countryName = this.countryExamples[params.dataIndex]?.name || '未知'
              return `${countryName}<br/>技术创新: ${x}<br/>高科技出口: ${y}%`
            }
          }.bind(this)
        },
        legend: {
          data: ['实际国家数据', '当前设置'],
          top: '5%',
          textStyle: { color: '#22c55e' }
        },
        grid: {
          left: '10%',
          right: '10%',
          bottom: '15%',
          top: '20%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          name: '技术创新指数',
          nameTextStyle: { color: '#22c55e' },
          axisLabel: { color: '#22c55e' },
          axisLine: { lineStyle: { color: '#22c55e' } },
          splitLine: { lineStyle: { color: 'rgba(34, 197, 94, 0.2)' } },
          min: 0,
          max: 100
        },
        yAxis: {
          type: 'value',
          name: '高科技出口占比 (%)',
          nameTextStyle: { color: '#22c55e' },
          axisLabel: { color: '#22c55e' },
          axisLine: { lineStyle: { color: '#22c55e' } },
          splitLine: { lineStyle: { color: 'rgba(34, 197, 94, 0.2)' } },
          min: 15,
          max: 35
        },
        series: [
          {
            name: '理论回归线',
            type: 'line',
            data: regressionData,
            lineStyle: { color: '#22c55e', width: 3 },
            symbol: 'none',
            smooth: true
          },
          {
            name: '实际国家数据',
            type: 'scatter',
            data: countryData,
            symbolSize: 12,
            itemStyle: {
              color: 'rgba(34, 197, 94, 0.8)',
              borderColor: '#22c55e',
              borderWidth: 2
            }
          },
          {
            name: '当前设置',
            type: 'scatter',
            data: [currentPoint],
            symbolSize: 16,
            itemStyle: {
              color: '#ff6b35',
              borderColor: '#ff8c42',
              borderWidth: 3
            }
          }
        ]
      }
      
      this.chartInstanceHighTech.setOption(option, false)
    },
    
    updateDigitalChart() {
      if (!this.chartInstanceDigital) return
      
      const { regressionData, countryData, currentPoint } = this.generateDigitalData()
      
      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(15, 30, 60, 0.9)',
          borderColor: '#a855f7',
          textStyle: { color: '#ffffff' },
          formatter: function(params) {
            const [x, y] = params.data
            if (params.seriesName === '理论回归线') {
              return `技术创新: ${x}<br/>数字化指数: ${y.toFixed(1)}`
            } else if (params.seriesName === '当前设置') {
              return `当前设置<br/>技术创新: ${x}<br/>数字化指数: ${y.toFixed(1)}`
            } else {
              const countryName = this.countryExamples[params.dataIndex]?.name || '未知'
              return `${countryName}<br/>技术创新: ${x}<br/>数字化指数: ${y}`
            }
          }.bind(this)
        },
        legend: {
          data: ['实际国家数据', '当前设置'],
          top: '5%',
          textStyle: { color: '#a855f7' }
        },
        grid: {
          left: '10%',
          right: '10%',
          bottom: '15%',
          top: '20%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          name: '技术创新指数',
          nameTextStyle: { color: '#a855f7' },
          axisLabel: { color: '#a855f7' },
          axisLine: { lineStyle: { color: '#a855f7' } },
          splitLine: { lineStyle: { color: 'rgba(168, 85, 247, 0.2)' } },
          min: 0,
          max: 100
        },
        yAxis: {
          type: 'value',
          name: '数字化指数',
          nameTextStyle: { color: '#a855f7' },
          axisLabel: { color: '#a855f7' },
          axisLine: { lineStyle: { color: '#a855f7' } },
          splitLine: { lineStyle: { color: 'rgba(168, 85, 247, 0.2)' } },
          min: 70,
          max: 90
        },
        series: [
          {
            name: '理论回归线',
            type: 'line',
            data: regressionData,
            lineStyle: { color: '#a855f7', width: 3 },
            symbol: 'none',
            smooth: true
          },
          {
            name: '实际国家数据',
            type: 'scatter',
            data: countryData,
            symbolSize: 12,
            itemStyle: {
              color: 'rgba(168, 85, 247, 0.8)',
              borderColor: '#a855f7',
              borderWidth: 2
            }
          },
          {
            name: '当前设置',
            type: 'scatter',
            data: [currentPoint],
            symbolSize: 16,
            itemStyle: {
              color: '#ff6b35',
              borderColor: '#ff8c42',
              borderWidth: 3
            }
          }
        ]
      }
      
      this.chartInstanceDigital.setOption(option, false)
    },
    
    generateHighTechData() {
      // 回归线数据
      const regressionData = []
      for (let x = 0; x <= 100; x += 5) {
        const y = this.baseHighTechExport + (x - 50) * this.correlationHighTech * this.scalingFactorHighTech
        regressionData.push([x, Math.max(15, Math.min(35, y))])
      }
      
      // 国家数据
      const countryData = this.countryExamples.map(country => [
        country.tech,
        country.highTech
      ])
      
      // 当前设置点
      const currentPoint = [
        this.techInnovationIndex,
        this.currentHighTechExport
      ]
      
      return { regressionData, countryData, currentPoint }
    },
    
    generateDigitalData() {
      // 回归线数据
      const regressionData = []
      for (let x = 0; x <= 100; x += 5) {
        const y = this.baseDigitalizationIndex + (x - 50) * this.correlationDigital * this.scalingFactorDigital
        regressionData.push([x, Math.max(70, Math.min(90, y))])
      }
      
      // 国家数据
      const countryData = this.countryExamples.map(country => [
        country.tech,
        country.digital
      ])
      
      // 当前设置点
      const currentPoint = [
        this.techInnovationIndex,
        this.currentDigitalizationIndex
      ]
      
      return { regressionData, countryData, currentPoint }
    }
  }
}
</script>

<style scoped>
.conclusion2 {
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: rgba(10, 25, 50, 0.9);
  color: white;
  overflow: visible;
}

.main-content {
  display: flex;
  gap: 30px;
  min-height: 100vh;
  align-items: flex-start;
}

/* 左侧控制面板 */
.control-panel {
  flex: 0 0 280px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: sticky;
  top: 0;
  max-height: 100vh;
  overflow-y: auto;
}

.parameter-control,
.result-panel,
.country-comparison,
.correlation-info {
  background-color: rgba(15, 30, 60, 0.7);
  border-radius: 12px;
  padding: 15px;
  border: 1px solid rgba(92, 187, 255, 0.3);
  backdrop-filter: blur(4px);
}

.control-title {
  font-size: 18px;
  color: #7dd3fc;
  margin-bottom: 15px;
  font-weight: 500;
  text-shadow: 0 0 8px rgba(125, 211, 252, 0.4);
}

/* 滑动条样式 */
.slider-container {
  margin-bottom: 20px;
}

.slider-label {
  display: block;
  color: #94a3b8;
  margin-bottom: 10px;
  font-size: 14px;
}

.slider-wrapper {
  display: flex;
  align-items: center;
  gap: 15px;
}

.slider {
  flex: 1;
  height: 6px;
  background: rgba(92, 187, 255, 0.2);
  border-radius: 3px;
  outline: none;
  -webkit-appearance: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  background: #5cbbff;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(92, 187, 255, 0.5);
}

.slider-value {
  color: #7dd3fc;
  font-weight: 600;
  font-size: 16px;
  min-width: 50px;
  text-align: center;
}

/* 数值输入框 */
.input-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.input-label {
  color: #94a3b8;
  font-size: 14px;
}

.number-input {
  flex: 1;
  padding: 8px 12px;
  background-color: rgba(92, 187, 255, 0.1);
  border: 1px solid rgba(92, 187, 255, 0.3);
  border-radius: 6px;
  color: #7dd3fc;
  font-size: 14px;
}

.input-unit {
  color: #94a3b8;
  font-size: 14px;
}

/* 结果面板 */
.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(92, 187, 255, 0.1);
}

.result-item.total {
  border-bottom: none;
  margin-top: 10px;
  padding-top: 15px;
  border-top: 2px solid rgba(92, 187, 255, 0.3);
}

.result-label {
  color: #94a3b8;
  font-size: 14px;
}

.result-value {
  color: #7dd3fc;
  font-weight: 600;
  font-size: 16px;
}

.result-value.highlight {
  color: #22c55e;
}

.result-value.total-value {
  color: #a855f7;
  font-size: 18px;
}

/* 国家对比 */
.country-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.country-item {
  padding: 10px;
  background-color: rgba(92, 187, 255, 0.1);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.country-item:hover {
  background-color: rgba(92, 187, 255, 0.2);
  border-color: rgba(92, 187, 255, 0.5);
  transform: translateY(-2px);
}

.country-name {
  color: #7dd3fc;
  font-weight: 600;
  margin-bottom: 5px;
  font-size: 14px;
}

.country-data {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #94a3b8;
}

/* 相关性说明 */
.correlation-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.correlation-label {
  color: #94a3b8;
  font-size: 13px;
}

.correlation-value {
  color: #22c55e;
  font-weight: 600;
  font-size: 14px;
}

.correlation-value.strong {
  color: #a855f7;
}

/* 右侧图表区域 */
.chart-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 600px;
  position: sticky;
  top: 0;
  max-height: 100vh;
  overflow-y: auto;
}

.chart-container {
  flex: 1;
  background-color: rgba(15, 30, 60, 0.7);
  border-radius: 12px;
  padding: 15px;
  border: 1px solid rgba(92, 187, 255, 0.3);
  backdrop-filter: blur(4px);
  min-height: 250px;
}

.chart-title {
  color: #7dd3fc;
  font-size: 16px;
  margin-bottom: 10px;
  text-align: center;
  font-weight: 500;
}

.echarts-container {
  width: 100%;
  height: calc(100% - 40px);
  min-height: 200px;
}

.chart-description {
  padding: 15px;
  background-color: rgba(15, 30, 60, 0.5);
  border-radius: 8px;
  border: 1px solid rgba(92, 187, 255, 0.2);
}

.chart-description p {
  color: #94a3b8;
  font-size: 13px;
  line-height: 1.5;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .main-content {
    flex-direction: column;
    align-items: stretch;
  }
  
  .control-panel {
    flex: none;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 15px;
    position: static;
    max-height: none;
    overflow-y: visible;
  }
  
  .parameter-control,
  .result-panel,
  .country-comparison,
  .correlation-info {
    flex: 1;
    min-width: 250px;
  }
  
  .chart-area {
    min-height: 500px;
    position: static;
    max-height: none;
    overflow-y: visible;
  }
}

@media (max-width: 768px) {
  .conclusion2 {
    padding: 15px;
  }
  
  .control-panel {
    flex-direction: column;
  }
  
  .parameter-control,
  .result-panel,
  .country-comparison,
  .correlation-info {
    min-width: auto;
  }
}
</style> 