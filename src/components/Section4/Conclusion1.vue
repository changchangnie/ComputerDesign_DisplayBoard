<template>
  <div class="conclusion1">
    <div class="main-content">
      <!-- 左侧控制面板 -->
      <div class="control-panel">
        <div class="parameter-control">
          <h3 class="control-title">参数调节</h3>
          
          <!-- 研发投入比重滑动条 -->
          <div class="slider-container">
            <label class="slider-label">研发投入占GDP比重 (%)</label>
            <div class="slider-wrapper">
              <input 
                type="range" 
                class="slider" 
                :min="0.1" 
                :max="5.0" 
                :step="0.1" 
                v-model="rdGdpRatio"
                @input="handleSliderChange"
              />
              <div class="slider-value">{{ rdGdpRatio }}%</div>
            </div>
          </div>
          
          <!-- 数值输入框 -->
          <div class="input-container">
            <label class="input-label">精确输入:</label>
            <input 
              type="number" 
              class="number-input"
              :min="0.1"
              :max="5.0"
              :step="0.1"
              v-model="rdGdpRatio"
              @input="handleInputChange"
            />
            <span class="input-unit">%</span>
          </div>
        </div>
        
        <!-- 计算结果显示 -->
        <div class="result-panel">
          <h3 class="control-title">计算结果</h3>
          <div class="result-item">
            <span class="result-label">基础GII得分:</span>
            <span class="result-value">{{ baseGiiScore }}</span>
          </div>
          <div class="result-item">
            <span class="result-label">GII增加值:</span>
            <span class="result-value highlight">+{{ giiIncrease.toFixed(2) }}</span>
          </div>
          <div class="result-item total">
            <span class="result-label">当前GII得分:</span>
            <span class="result-value total-value">{{ currentGiiScore.toFixed(2) }}</span>
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
                <span>R&D: {{ country.rdRatio }}%</span>
                <span>GII: {{ country.giiScore }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 右侧图表区域 -->
      <div class="chart-area">
        <div class="chart-container">
          <div ref="chartRef" class="echarts-container"></div>
        </div>
        <div class="chart-description">
          <p>图表说明：X轴为研发投入占GDP比重(%)，Y轴为全球创新指数(GII Score)。蓝色线为理论回归线，橙色点为当前设置值，蓝色点为实际国家数据。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'Conclusion1',
  data() {
    return {
      // 可调节参数
      rdGdpRatio: 2.5, // 研发投入占GDP比重，默认2.5%
      baseGiiScore: 53.5, // 基础GII得分
      coefficient: 0.78, // 研究结论中的系数
      
      // 计算结果
      currentGiiScore: 0, // 当前GII得分
      giiIncrease: 0, // GII增加值
      
      // 图表实例
      chartInstance: null,
      resizeHandler: null,
      
      // 示例国家数据（用于对比展示）
      // 数据来源：NSF & OECD (R&D投入率，2021年) + Global Innovation Index 2024 (GII得分)
      countryExamples: [
        { name: '中国', rdRatio: 2.43, giiScore: 56.3 },
        { name: '美国', rdRatio: 3.46, giiScore: 62.4 },
        { name: '德国', rdRatio: 3.13, giiScore: 58.1 },
        { name: '日本', rdRatio: 3.30, giiScore: 54.1 },
        { name: '韩国', rdRatio: 4.93, giiScore: 60.9 }
      ]
    }
  },
  mounted() {
    console.log('Section4 mounted')
    this.calculateGiiScore()
    this.$nextTick(() => {
      setTimeout(() => {
        this.initChart()
      }, 100)
    })
    
    // 添加防抖的resize监听
    this.resizeHandler = this.debounce(() => {
      if (this.chartInstance && !this.chartInstance.isDisposed()) {
        try {
          this.chartInstance.resize()
        } catch (error) {
          console.error('Chart resize failed:', error)
          this.reinitChart()
        }
      }
    }, 300)
    
    window.addEventListener('resize', this.resizeHandler)
  },
  beforeUnmount() {
    console.log('Section4 beforeUnmount')
    
    // 移除resize监听器
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler)
    }
    
    // 销毁图表实例
    if (this.chartInstance) {
      try {
        this.chartInstance.dispose()
      } catch (error) {
        console.error('Chart dispose failed:', error)
      }
      this.chartInstance = null
    }
  },
  methods: {
    calculateGiiScore() {
      // 根据研究结论：研发投入占GDP比重每提升1%，GII Score平均增加0.78分
      this.giiIncrease = this.rdGdpRatio * this.coefficient
      this.currentGiiScore = this.baseGiiScore + this.giiIncrease
    },
    
    handleSliderChange() {
      this.calculateGiiScore()
      this.updateChart()
    },
    
    handleInputChange() {
      // 验证输入范围
      if (this.rdGdpRatio < 0.1) this.rdGdpRatio = 0.1
      if (this.rdGdpRatio > 5.0) this.rdGdpRatio = 5.0
      this.calculateGiiScore()
      this.updateChart()
    },
    
    setCountryParams(country) {
      this.rdGdpRatio = country.rdRatio
      this.calculateGiiScore()
      this.updateChart()
    },
    
    initChart() {
      console.log('Initializing chart...')
      const chartContainer = this.$refs.chartRef
      
      if (!chartContainer) {
        console.error('Chart container not found')
        return
      }
      
      // 检查容器尺寸
      const containerWidth = chartContainer.offsetWidth
      const containerHeight = chartContainer.offsetHeight
      
      if (containerWidth === 0 || containerHeight === 0) {
        console.warn('Container has zero dimensions, retrying...', {
          width: containerWidth,
          height: containerHeight
        })
        setTimeout(() => {
          this.initChart()
        }, 200)
        return
      }
      
      try {
        // 销毁现有实例
        if (this.chartInstance) {
          this.chartInstance.dispose()
          this.chartInstance = null
        }
        
        // 创建新实例
        this.chartInstance = echarts.init(chartContainer)
        
        // 验证实例创建成功
        if (!this.chartInstance) {
          throw new Error('Failed to create chart instance')
        }
        
        console.log('Chart instance created successfully')
        
        // 更新图表
        this.updateChart()
        
      } catch (error) {
        console.error('Chart initialization failed:', error)
        this.chartInstance = null
        
        // 延迟重试
        setTimeout(() => {
          console.log('Retrying chart initialization...')
          this.initChart()
        }, 1000)
      }
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
    
    updateChart() {
      if (!this.chartInstance) {
        console.log('Chart instance not initialized')
        return
      }
      
      // 检查图表是否已被销毁
      if (this.chartInstance.isDisposed()) {
        console.log('Chart instance is disposed')
        return
      }
      
      console.log('Updating chart, container size:', this.$refs.chartRef?.offsetWidth, this.$refs.chartRef?.offsetHeight)
      
      try {
        const { regressionData, countryData, currentPoint } = this.generateChartData()
        
        console.log('Chart data:', { regressionData: regressionData.length, currentPoint, countryData: countryData.length })

        const option = {
          backgroundColor: 'transparent',
          title: {
            text: '研发投入与全球创新指数关系图',
            left: 'center',
            textStyle: {
              color: '#7dd3fc',
              fontSize: 18,
              fontWeight: 'bold'
            }
          },
          tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(15, 30, 60, 0.9)',
            borderColor: '#5cbbff',
            textStyle: {
              color: '#ffffff'
            },
            formatter: function(params) {
              try {
                const [x, y] = params.data
                const seriesName = params.seriesName
                
                if (seriesName === '理论回归线') {
                  return `研发投入: ${x.toFixed(2)}%<br/>GII得分: ${y.toFixed(2)}`
                } else if (seriesName === '当前设置') {
                  return `当前设置<br/>研发投入: ${x.toFixed(2)}%<br/>GII得分: ${y.toFixed(2)}`
                } else {
                  // 通过dataIndex获取国家名称
                  const countryName = this.countryExamples[params.dataIndex]?.name || '未知'
                  return `${countryName}<br/>研发投入: ${x}%<br/>GII得分: ${y}`
                }
              } catch (error) {
                console.error('Tooltip formatter error:', error)
                return '数据加载中...'
              }
            }.bind(this)
          },
          legend: {
            data: ['实际国家数据', '当前设置'],
            top: '8%',
            textStyle: {
              color: '#7dd3fc'
            }
          },
          grid: {
            left: '10%',
            right: '10%',
            bottom: '15%',
            top: '20%',
            containLabel: true
          },
          xAxis: {
            id: 'xAxis0',
            type: 'value',
            name: '研发投入占GDP比重 (%)',
            nameLocation: 'middle',
            nameGap: 30,
            nameTextStyle: {
              color: '#7dd3fc'
            },
            axisLabel: {
              color: '#7dd3fc'
            },
            axisLine: {
              lineStyle: {
                color: '#5cbbff'
              }
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(92, 187, 255, 0.2)'
              }
            },
            min: 0,
            max: 5.5,
            interval: 1
          },
          yAxis: {
            id: 'yAxis0',
            type: 'value',
            name: '全球创新指数 (GII Score)',
            nameLocation: 'middle',
            nameGap: 50,
            nameTextStyle: {
              color: '#7dd3fc'
            },
            axisLabel: {
              color: '#7dd3fc'
            },
            axisLine: {
              lineStyle: {
                color: '#5cbbff'
              }
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(92, 187, 255, 0.2)'
              }
            },
            min: 45,
            max: 70
          },
          series: [
            {
              name: '理论回归线',
              type: 'line',
              coordinateSystem: 'cartesian2d',
              xAxisIndex: 0,
              yAxisIndex: 0,
              data: regressionData,
              lineStyle: {
                color: '#5cbbff',
                width: 3
              },
              symbol: 'none',
              smooth: true,
              silent: false
            },
            {
              name: '实际国家数据',
              type: 'scatter',
              coordinateSystem: 'cartesian2d',
              xAxisIndex: 0,
              yAxisIndex: 0,
              data: countryData,
              symbolSize: 12,
              itemStyle: {
                color: 'rgba(92, 187, 255, 0.8)',
                borderColor: '#5cbbff',
                borderWidth: 2
              }
            },
            {
              name: '当前设置',
              type: 'scatter',
              coordinateSystem: 'cartesian2d',
              xAxisIndex: 0,
              yAxisIndex: 0,
              data: [currentPoint],
              symbolSize: 16,
              itemStyle: {
                color: '#ff6b35',
                borderColor: '#ff8c42',
                borderWidth: 3
              },
              emphasis: {
                itemStyle: {
                  color: '#ff8c42',
                  borderColor: '#ffab42',
                  borderWidth: 4
                }
              }
            }
          ]
        }
        
        this.chartInstance.setOption(option, false)
        console.log('Chart updated successfully')
      } catch (error) {
        console.error('Chart update failed:', error)
        // 尝试重新初始化
        this.reinitChart()
      }
    },
    
    generateChartData() {
      // 回归线数据 - 确保数据格式统一
      const regressionData = []
      for (let x = 0.1; x <= 5.0; x += 0.1) {
        const y = this.baseGiiScore + x * this.coefficient
        // 确保数值精度和格式一致
        regressionData.push([
          Math.round(x * 10) / 10,  // 保留1位小数
          Math.round(y * 100) / 100  // 保留2位小数
        ])
      }
      
      // 国家数据 - 确保数据格式统一
      const countryData = this.countryExamples.map(country => [
        Number(country.rdRatio),   // 确保是数字类型
        Number(country.giiScore)   // 确保是数字类型
      ])
      
      // 当前设置点 - 确保数据格式统一
      const currentPoint = [
        Math.round(this.rdGdpRatio * 100) / 100,      // 保留2位小数
        Math.round(this.currentGiiScore * 100) / 100  // 保留2位小数
      ]
      
      // 验证数据完整性
      const isValidData = (data) => {
        return Array.isArray(data) && 
               data.length === 2 && 
               typeof data[0] === 'number' && 
               typeof data[1] === 'number' &&
               !isNaN(data[0]) && 
               !isNaN(data[1])
      }
      
      // 过滤无效数据
      const validRegressionData = regressionData.filter(isValidData)
      const validCountryData = countryData.filter(isValidData)
      const validCurrentPoint = isValidData(currentPoint) ? currentPoint : [2.5, 51.95]
      
      console.log('Generated chart data:', {
        regression: validRegressionData.length,
        country: validCountryData.length,
        current: validCurrentPoint
      })
      
      return {
        regressionData: validRegressionData,
        countryData: validCountryData, 
        currentPoint: validCurrentPoint
      }
    },
    
    reinitChart() {
      if (this.chartInstance) {
        this.chartInstance.dispose()
        this.chartInstance = null
      }
      
      setTimeout(() => {
        this.initChart()
      }, 100)
    }
  }
}
</script>

<style scoped>
.conclusion1 {
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
.country-comparison {
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

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: #5cbbff;
  border-radius: 50%;
  cursor: pointer;
  border: none;
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

.number-input:focus {
  outline: none;
  border-color: #5cbbff;
  box-shadow: 0 0 8px rgba(92, 187, 255, 0.3);
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
  color: #ff6b35;
}

.result-value.total-value {
  color: #7dd3fc;
  font-size: 20px;
  text-shadow: 0 0 8px rgba(125, 211, 252, 0.5);
}

/* 国家对比 */
.country-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.country-item {
  padding: 12px;
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
}

.country-data {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #94a3b8;
}

/* 右侧图表区域 */
.chart-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 600px;
  min-width: 600px;
  position: sticky;
  top: 0;
  max-height: 100vh;
  overflow-y: auto;
}

.chart-container {
  flex: 1;
  background-color: rgba(15, 30, 60, 0.7);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(92, 187, 255, 0.3);
  backdrop-filter: blur(4px);
  height: 100%;
  min-height: 500px;
}

.echarts-container {
  width: 100%;
  height: 100%;
  min-height: 500px;
}

.chart-description {
  margin-top: 15px;
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
@media (min-width: 1600px) {
  .control-panel {
    flex: 0 0 320px;
  }
}

@media (min-width: 1200px) and (max-width: 1599px) {
  .control-panel {
    flex: 0 0 280px;
  }
}

@media (max-width: 1199px) {
  .control-panel {
    flex: 0 0 260px;
  }
}

@media (max-width: 1024px) {
  .main-content {
    flex-direction: column;
    align-items: stretch;
  }
  
  .control-panel {
    flex: none;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 20px;
    position: static;
    max-height: none;
    overflow-y: visible;
  }
  
  .parameter-control,
  .result-panel,
  .country-comparison {
    flex: 1;
    min-width: 300px;
  }
  
  .chart-area {
    min-height: 600px;
    min-width: auto;
    position: static;
    max-height: none;
    overflow-y: visible;
  }
}

@media (max-width: 768px) {
  .conclusion1 {
    padding: 15px;
  }
  
  .control-panel {
    flex-direction: column;
  }
  
  .parameter-control,
  .result-panel,
  .country-comparison {
    min-width: auto;
  }
}
</style> 