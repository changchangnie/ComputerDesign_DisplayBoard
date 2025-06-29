<template>
  <div class="conclusion4">
    <div class="main-content">
      <!-- 左侧控制面板 -->
      <div class="control-panel">
        <!-- 模型控制区域 -->
        <div class="model-control">
          <h3 class="control-title">模型预测控制</h3>
          <div class="model-selector">
            <label class="radio-label">
              <input type="radio" value="lstm" v-model="activeModel" @change="handleModelChange" checked>
              <span class="radio-text">LSTM模型</span>
            </label>
            <label class="radio-label">
              <input type="radio" value="xgboost" v-model="activeModel" @change="handleModelChange">
              <span class="radio-text">XGBoost模型</span>
            </label>
            <label class="radio-label">
              <input type="radio" value="combined" v-model="activeModel" @change="handleModelChange">
              <span class="radio-text">组合模型</span>
            </label>
          </div>
          
          <!-- 组合模型权重调节 -->
          <div class="weight-control" v-if="activeModel === 'combined'">
            <div class="slider-container">
              <label class="slider-label">LSTM权重 (α)</label>
              <div class="slider-wrapper">
                <input 
                  type="range" 
                  class="slider" 
                  :min="0" 
                  :max="1" 
                  :step="0.1" 
                  v-model="lstmWeight"
                  @input="handleWeightChange"
                />
                <div class="slider-value">{{ lstmWeight }}</div>
              </div>
              <div class="weight-formula">
                组合预测 = {{ lstmWeight }} × LSTM + {{ (1 - lstmWeight).toFixed(1) }} × XGBoost<br>
                <small style="color: #94a3b8;">论文基准: 0.6 × 2251.2 + 0.4 × 1534.5 = 1964.5亿件</small>
              </div>
            </div>
          </div>
        </div>

        <!-- 技术创新输入控制区域 -->
        <div class="tech-input-control">
          <h3 class="control-title">技术创新参数</h3>
          <div class="slider-container">
            <label class="slider-label">技术市场成交额 (亿元)</label>
            <div class="slider-wrapper">
              <input 
                type="range" 
                class="slider" 
                :min="1000" 
                :max="5000" 
                :step="50" 
                v-model="currentParams.techMarket"
                @input="handleTechInputChange"
              />
              <div class="slider-value">{{ currentParams.techMarket }}</div>
            </div>
          </div>
          <div class="slider-container">
            <label class="slider-label">专利授权数 (件)</label>
            <div class="slider-wrapper">
              <input 
                type="range" 
                class="slider" 
                :min="10000" 
                :max="30000" 
                :step="500" 
                v-model="currentParams.patents"
                @input="handleTechInputChange"
              />
              <div class="slider-value">{{ currentParams.patents }}</div>
            </div>
          </div>
        </div>

        <!-- 情景模拟区域 -->
        <div class="scenario-control">
          <h3 class="control-title">情景模拟</h3>
          <div class="scenario-options">
            <label class="radio-label">
              <input type="radio" value="normal" v-model="scenarioType" @change="handleScenarioChange">
              <span class="radio-text">正常发展</span>
            </label>
            <label class="radio-label">
              <input type="radio" value="pandemic" v-model="scenarioType" @change="handleScenarioChange">
              <span class="radio-text">疫情加速 (+30%)</span>
            </label>
            <label class="radio-label">
              <input type="radio" value="policy" v-model="scenarioType" @change="handleScenarioChange">
              <span class="radio-text">政策刺激 (+20%)</span>
            </label>
          </div>
        </div>

        <!-- 预测结果显示 -->
        <div class="prediction-result">
          <h3 class="control-title">2025年预测结果</h3>
          <div class="result-item">
            <span class="result-label">当前模型预测:</span>
            <span class="result-value highlight">{{ currentPrediction.toFixed(1) }} 亿件</span>
          </div>
          <div class="result-item">
            <span class="result-label">模型准确度 (R²):</span>
            <span class="result-value">{{ modelAccuracy }}</span>
          </div>
          <div class="result-item">
            <span class="result-label">技术创新滞后:</span>
            <span class="result-value">2年 (r=0.91)</span>
          </div>
        </div>

        <!-- 模型性能指标 -->
        <div class="performance-metrics">
          <h3 class="control-title">模型性能</h3>
          <div class="metrics-grid">
            <div class="metric-item">
              <span class="metric-label">MAE</span>
              <span class="metric-value">{{ currentMetrics.mae }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">RMSE</span>
              <span class="metric-value">{{ currentMetrics.rmse }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">MAPE</span>
              <span class="metric-value">{{ currentMetrics.mape }}%</span>
            </div>
          </div>
        </div>

        <!-- 智能解读区域 -->
        <div class="insight-panel">
          <h3 class="control-title">智能解读</h3>
          <div class="insight-content">
            <p class="insight-text">{{ currentInsight }}</p>
          </div>
        </div>
      </div>

      <!-- 右侧图表区域 -->
      <div class="chart-area">
        <!-- 主要预测图表 -->
        <div class="chart-container main-chart">
          <h4 class="chart-title">技术创新与物流发展动态关系<br>(多模型预测对比)</h4>
          <div ref="mainChartRef" class="echarts-container"></div>
        </div>

        <!-- 模型分析图表 -->
        <div class="chart-container analysis-chart">
          <h4 class="chart-title">模型预测分析<br>(技术市场成交额 vs 物流业务量)</h4>
          <div ref="analysisChartRef" class="echarts-container"></div>
        </div>

        <div class="chart-description">
          <p>图表说明：基于LSTM和XGBoost模型的技术创新与物流发展动态关系分析。上图展示历史数据和多模型预测对比，当前设置下各模型的预测结果；下图展示技术市场成交额与物流业务量的关系，不同模型的预测趋势对比。模型性能：LSTM R²=0.962，XGBoost R²=0.981，组合模型R²=0.969。技术创新对物流发展具有显著的正向推动作用，存在约2年的滞后效应。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'Conclusion4',
  data() {
    return {
      // 模型控制参数
      activeModel: 'lstm',
      lstmWeight: 0.6,
      
      // 基础参数 (2023年基准)
      baseParams: {
        techMarket: 3800,    // 技术市场成交额(亿元)
        patents: 22100,      // 专利授权数(件)
        logistics: 412.4     // 快递业务量(亿件)
      },
      
      // 当前输入参数
      currentParams: {
        techMarket: 3800,    // 技术市场成交额(亿元)
        patents: 22100       // 专利授权数(件)
      },
      
      // 当前预测值
      currentPrediction: 412.4,
      
      // 模型系数
      modelCoefficients: {
        lstm: {
          techMarket: 0.25,    // 增大技术市场成交额系数
          patents: 0.018       // 增大专利授权数系数
        },
        xgboost: {
          techMarket: 0.18,    // 增大技术市场成交额系数  
          patents: 0.012       // 增大专利授权数系数
        }
      },
      
      // 情景模拟参数
      scenarioType: 'normal',
      
      // 图表实例
      mainChartInstance: null,
      analysisChartInstance: null,
      resizeHandler: null,
      
      // 情景乘数
      scenarioMultipliers: {
        normal: { tech: 1.0, logistics: 1.0 },
        pandemic: { tech: 1.3, logistics: 1.35 },  // 疫情加速数字化
        policy: { tech: 1.2, logistics: 1.25 }     // 政策刺激
      },
      
      // 历史数据（2005-2023）
      historicalData: [
        { year: 2005, techMarketValue: 180, patents: 2800, logistics: 12.5 },
        { year: 2006, techMarketValue: 210, patents: 3200, logistics: 15.8 },
        { year: 2007, techMarketValue: 245, patents: 3650, logistics: 19.6 },
        { year: 2008, techMarketValue: 285, patents: 4150, logistics: 24.2 },
        { year: 2009, techMarketValue: 320, patents: 4700, logistics: 29.8 },
        { year: 2010, techMarketValue: 420, patents: 5200, logistics: 36.7 },
        { year: 2011, techMarketValue: 520, patents: 6100, logistics: 45.2 },
        { year: 2012, techMarketValue: 640, patents: 7200, logistics: 55.8 },
        { year: 2013, techMarketValue: 780, patents: 8100, logistics: 68.5 },
        { year: 2014, techMarketValue: 890, patents: 8600, logistics: 78.9 },
        { year: 2015, techMarketValue: 980, patents: 8900, logistics: 89.2 },
        { year: 2016, techMarketValue: 1150, patents: 10200, logistics: 108.7 },
        { year: 2017, techMarketValue: 1380, patents: 11800, logistics: 132.4 },
        { year: 2018, techMarketValue: 1650, patents: 13500, logistics: 162.8 },
        { year: 2019, techMarketValue: 1920, patents: 15100, logistics: 198.5 },
        { year: 2020, techMarketValue: 2240, patents: 15600, logistics: 243.8 }, // 疫情影响
        { year: 2021, techMarketValue: 2890, patents: 17800, logistics: 312.4 },
        { year: 2022, techMarketValue: 3250, patents: 19800, logistics: 365.2 },
        { year: 2023, techMarketValue: 3800, patents: 22100, logistics: 412.4 }
      ],
      
      // 模型预测基准值 (2025年)
      modelPredictions: {
        lstm: 2251.22,      // LSTM预测值(亿件) - 论文精确数据
        xgboost: 1534.52,   // XGBoost预测值(亿件) - 论文精确数据
        combined: 1964.54   // 组合预测值(亿件) - 论文精确数据
      },
      
      // 模型性能指标 - 基于论文数据转换为亿件单位
      modelMetrics: {
        lstm: { mae: 74.16, rmse: 100.92, mape: 3.3, r2: 0.962 },      // 论文数据: MAE=741,557, RMSE=1,009,213
        xgboost: { mae: 24.17, rmse: 71.71, mape: 1.6, r2: 0.981 },    // 论文数据: MAE=241,713, RMSE=717,127
        combined: { mae: 54.17, rmse: 89.24, mape: 2.6, r2: 0.969 }    // 加权平均: 0.6×LSTM + 0.4×XGBoost
      },
      
      // 物流机制贡献数据
      mechanismContributions: {
        smartSorting: 0.35,      // 智能分拣贡献35%
        pathOptimization: 0.42,  // 路径优化贡献42%
        fullChainTracing: 0.23   // 全链追溯贡献23%
      }
    }
  },
  computed: {
    // 当前模型准确度
    modelAccuracy() {
      if (this.activeModel === 'combined') {
        return this.modelMetrics.combined.r2.toFixed(3)
      }
      return this.modelMetrics[this.activeModel].r2.toFixed(3)
    },
    
    // 当前模型性能指标
    currentMetrics() {
      if (this.activeModel === 'combined') {
        return this.modelMetrics.combined
      }
      return this.modelMetrics[this.activeModel]
    },
    
    // 智能解读
    currentInsight() {
      const modelName = this.activeModel === 'lstm' ? 'LSTM' : 
                       this.activeModel === 'xgboost' ? 'XGBoost' : '组合模型'
      const prediction = this.currentPrediction.toFixed(1)
      const accuracy = this.modelAccuracy
      const scenario = this.scenarioType === 'pandemic' ? '疫情加速' : 
                      this.scenarioType === 'policy' ? '政策刺激' : '正常发展'
      
      return `当前${modelName}在${scenario}情景下预测2025年物流业务量将达到${prediction}亿件，模型准确度为${accuracy}。技术创新通过智能分拣、路径优化、全链追溯等机制推动物流发展，存在约2年滞后效应。建议持续加大技术市场投入，优化专利布局，以实现物流业高质量发展。`
    }
  },
  mounted() {
    // 延迟初始化，确保组件完全加载
    setTimeout(() => {
      this.$nextTick(() => {
        // 初始化当前预测值
        this.updateCurrentPrediction()
        
        // 初始化图表
        this.initMainChart()
        this.initAnalysisChart()
      })
    }, 100)
    
    // 添加防抖的resize监听
    this.resizeHandler = this.debounce(() => {
      if (this.mainChartInstance && !this.mainChartInstance.isDisposed()) {
        this.mainChartInstance.resize()
      }
      if (this.analysisChartInstance && !this.analysisChartInstance.isDisposed()) {
        this.analysisChartInstance.resize()
      }
    }, 300)
    
    window.addEventListener('resize', this.resizeHandler)
  },
  beforeUnmount() {
    console.log('Conclusion4 beforeUnmount')
    
    // 移除resize监听器
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler)
    }
    
    // 销毁图表实例
    if (this.mainChartInstance) {
      this.mainChartInstance.dispose()
      this.mainChartInstance = null
    }
    if (this.analysisChartInstance) {
      this.analysisChartInstance.dispose()
      this.analysisChartInstance = null
    }
  },
  methods: {
    // 防抖函数
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
    
    // 事件处理方法
    handleModelChange() {
      // 清理图表实例以避免缓存问题
      if (this.mainChartInstance && !this.mainChartInstance.isDisposed()) {
        this.mainChartInstance.clear()
      }
      if (this.analysisChartInstance && !this.analysisChartInstance.isDisposed()) {
        this.analysisChartInstance.clear()
      }
      
      this.updateCurrentPrediction()
      this.updateMainChart()
      this.updateAnalysisChart()
    },
    
    handleWeightChange() {
      this.debounce(() => {
        this.updateCurrentPrediction()
        this.updateMainChart()
      }, 300)()
    },
    
    handleTechInputChange() {
      this.debounce(() => {
        this.updateCurrentPrediction()
        this.updateMainChart()
      }, 300)()
    },
    
    handleScenarioChange() {
      this.updateCurrentPrediction()
      this.updateMainChart()
      this.updateAnalysisChart()
    },
    
    // 主图表初始化
    initMainChart() {
      try {
        const chartContainer = this.$refs.mainChartRef
        if (!chartContainer) {
          console.warn('Main chart container not found')
          return
        }
        
        // 如果已存在实例，先彻底销毁
        if (this.mainChartInstance) {
          this.mainChartInstance.dispose()
          this.mainChartInstance = null
        }
        
        // 清空容器内容
        chartContainer.innerHTML = ''
        
        this.mainChartInstance = echarts.init(chartContainer)
        this.updateMainChart()
      } catch (error) {
        console.error('Error initializing main chart:', error)
      }
    },
    
    // 分析图表初始化
    initAnalysisChart() {
      try {
        const chartContainer = this.$refs.analysisChartRef
        if (!chartContainer) {
          console.warn('Analysis chart container not found')
          return
        }
        
        // 如果已存在实例，先彻底销毁
        if (this.analysisChartInstance) {
          this.analysisChartInstance.dispose()
          this.analysisChartInstance = null
        }
        
        // 清空容器内容
        chartContainer.innerHTML = ''
        
        this.analysisChartInstance = echarts.init(chartContainer)
        this.updateAnalysisChart()
      } catch (error) {
        console.error('Error initializing analysis chart:', error)
      }
    },
    
    // 更新主图表
    updateMainChart() {
      try {
        if (!this.mainChartInstance || this.mainChartInstance.isDisposed()) {
          console.warn('Main chart instance not available')
          return
        }
        
        const data = this.generateMainChartData()
        
        // 根据当前选择的模型动态配置图例和系列
        const baseLegendData = ['技术市场成交额', '专利授权数', '快递业务量']
        const predictionLegendData = []
        
        // 根据activeModel决定显示哪些预测线
        if (this.activeModel === 'lstm') {
          predictionLegendData.push('LSTM预测 (当前)')
        } else if (this.activeModel === 'xgboost') {
          predictionLegendData.push('XGBoost预测 (当前)')
        } else if (this.activeModel === 'combined') {
          predictionLegendData.push('LSTM预测', 'XGBoost预测', '组合预测 (当前)')
        }
        
        const legendData = [...baseLegendData, ...predictionLegendData]
        
        const option = {
          backgroundColor: 'transparent',
          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'cross' },
            backgroundColor: 'rgba(15, 30, 60, 0.9)',
            borderColor: '#5cbbff',
            textStyle: { color: '#ffffff' },
            formatter: (params) => {
              const dataIndex = params[0].dataIndex
              const year = data.years[dataIndex]
              let content = `<div style="padding: 8px;"><div style="color: #7dd3fc; font-weight: bold;">${year}年</div><div style="margin-top: 8px;">`
              
              params.forEach(param => {
                const color = param.color
                const name = param.seriesName
                const value = param.value
                
                if (name.includes('技术市场成交额')) {
                  content += `<div style="color: ${color};">${name}: ${value} 亿元</div>`
                } else if (name.includes('专利授权数')) {
                  content += `<div style="color: ${color};">${name}: ${value} 件</div>`
                } else if (value !== null) {
                  // 突出显示当前选中的模型
                  const isCurrentModel = name.includes('当前')
                  const fontWeight = isCurrentModel ? 'bold' : 'normal'
                  const displayValue = typeof value === 'number' ? value.toFixed(1) : value
                  content += `<div style="color: ${color}; font-weight: ${fontWeight};">${name}: ${displayValue} 亿件</div>`
                }
              })
              
              content += '</div></div>'
              return content
            }
          },
          legend: {
            data: legendData,
            top: '8%',
            textStyle: { color: '#7dd3fc' }
          },
          grid: {
            left: '8%',
            right: '8%',
            bottom: '15%',
            top: '25%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: data.years,
            axisLine: { lineStyle: { color: '#5cbbff' } },
            axisLabel: { color: '#7dd3fc' },
            splitLine: { lineStyle: { color: 'rgba(92, 187, 255, 0.1)' } }
          },
          yAxis: [
            {
              type: 'value',
              name: '技术指标',
              nameTextStyle: { color: '#7dd3fc' },
              axisLine: { lineStyle: { color: '#5cbbff' } },
              axisLabel: { color: '#7dd3fc' },
              splitLine: { lineStyle: { color: 'rgba(92, 187, 255, 0.1)' } },
              position: 'left'
            },
            {
              type: 'value',
              name: '物流业务量(亿件)',
              nameTextStyle: { color: '#10b981' },
              axisLine: { lineStyle: { color: '#10b981' } },
              axisLabel: { color: '#10b981' },
              splitLine: { show: false },
              position: 'right',
              max: 800
            }
          ],
          series: this.generateDynamicSeries(data)
        }
        
        this.mainChartInstance.setOption(option, true)
      } catch (error) {
        console.error('Error updating main chart:', error)
      }
    },
    
    // 生成动态系列配置
    generateDynamicSeries(data) {
      const baseSeries = [
        {
          name: '技术市场成交额',
          type: 'line',
          yAxisIndex: 0,
          data: data.techMarket,
          lineStyle: { color: '#3b82f6', width: 2 },
          itemStyle: { color: '#3b82f6' },
          symbol: 'circle',
          symbolSize: 4
        },
        {
          name: '专利授权数',
          type: 'line',
          yAxisIndex: 0,
          data: data.patents,
          lineStyle: { color: '#8b5cf6', width: 2 },
          itemStyle: { color: '#8b5cf6' },
          symbol: 'diamond',
          symbolSize: 4
        },
        {
          name: '快递业务量',
          type: 'line',
          yAxisIndex: 1,
          data: data.logistics,
          lineStyle: { color: '#10b981', width: 3 },
          itemStyle: { color: '#10b981' },
          areaStyle: { color: 'rgba(16, 185, 129, 0.1)' },
          symbol: 'circle',
          symbolSize: 6
        }
      ]
      
      // 根据activeModel添加相应的预测系列
      if (this.activeModel === 'lstm' && data.lstmPrediction) {
        baseSeries.push({
          name: 'LSTM预测 (当前)',
          type: 'line',
          yAxisIndex: 1,
          data: data.lstmPrediction,
          lineStyle: { color: '#f59e0b', width: 4, type: 'solid' },
          itemStyle: { color: '#f59e0b' },
          symbol: 'triangle',
          symbolSize: 10,
          emphasis: { 
            lineStyle: { width: 6 },
            itemStyle: { borderWidth: 4, shadowBlur: 10, shadowColor: '#f59e0b' }
          },
          markPoint: {
            data: [
              { 
                name: `LSTM预测: ${this.currentPrediction.toFixed(1)}亿件`,
                coord: [data.years.length - 1, this.currentPrediction],
                itemStyle: { color: '#f59e0b', borderColor: '#fff', borderWidth: 2 },
                label: { 
                  show: true, 
                  position: 'right',
                  color: '#f59e0b',
                  fontWeight: 'bold',
                  formatter: `${this.currentPrediction.toFixed(1)}亿件`
                }
              }
            ]
          }
        })
      } else if (this.activeModel === 'xgboost' && data.xgboostPrediction) {
        baseSeries.push({
          name: 'XGBoost预测 (当前)',
          type: 'line',
          yAxisIndex: 1,
          data: data.xgboostPrediction,
          lineStyle: { color: '#ef4444', width: 4, type: 'solid' },
          itemStyle: { color: '#ef4444' },
          symbol: 'rect',
          symbolSize: 10,
          emphasis: { 
            lineStyle: { width: 6 },
            itemStyle: { borderWidth: 4, shadowBlur: 10, shadowColor: '#ef4444' }
          },
          markPoint: {
            data: [
              { 
                name: `XGBoost预测: ${this.currentPrediction.toFixed(1)}亿件`,
                coord: [data.years.length - 1, this.currentPrediction],
                itemStyle: { color: '#ef4444', borderColor: '#fff', borderWidth: 2 },
                label: { 
                  show: true, 
                  position: 'right',
                  color: '#ef4444',
                  fontWeight: 'bold',
                  formatter: `${this.currentPrediction.toFixed(1)}亿件`
                }
              }
            ]
          }
        })
      } else if (this.activeModel === 'combined' && data.lstmPrediction && data.xgboostPrediction && data.combinedPrediction) {
        // 组合模型模式：显示所有预测线，但突出组合预测
        baseSeries.push(
          {
            name: 'LSTM预测',
            type: 'line',
            yAxisIndex: 1,
            data: data.lstmPrediction,
            lineStyle: { color: '#f59e0b', width: 2, type: 'dashed', opacity: 0.7 },
            itemStyle: { color: '#f59e0b' },
            symbol: 'triangle',
            symbolSize: 6
          },
          {
            name: 'XGBoost预测',
            type: 'line',
            yAxisIndex: 1,
            data: data.xgboostPrediction,
            lineStyle: { color: '#ef4444', width: 2, type: 'dashed', opacity: 0.7 },
            itemStyle: { color: '#ef4444' },
            symbol: 'rect',
            symbolSize: 6
          },
          {
            name: '组合预测 (当前)',
            type: 'line',
            yAxisIndex: 1,
            data: data.combinedPrediction,
            lineStyle: { color: '#06b6d4', width: 4, type: 'solid' },
            itemStyle: { color: '#06b6d4' },
            symbol: 'diamond',
            symbolSize: 10,
            emphasis: { 
              lineStyle: { width: 6 },
              itemStyle: { borderWidth: 4, shadowBlur: 10, shadowColor: '#06b6d4' }
            },
            markPoint: {
              data: [
                { 
                  name: `组合预测: ${this.currentPrediction.toFixed(1)}亿件`,
                  coord: [data.years.length - 1, this.currentPrediction],
                  itemStyle: { color: '#06b6d4', borderColor: '#fff', borderWidth: 2 },
                  label: { 
                    show: true, 
                    position: 'right',
                    color: '#06b6d4',
                    fontWeight: 'bold',
                    formatter: `${this.currentPrediction.toFixed(1)}亿件`
                  }
                }
              ]
            }
          }
        )
      }
      
      return baseSeries
    },
    
    // 生成主图表数据
    generateMainChartData() {
      const years = []
      const techMarket = []
      const patents = []
      const logistics = []
      
      // 历史数据
      this.historicalData.forEach(item => {
        years.push(item.year)
        techMarket.push(item.techMarketValue)
        patents.push(item.patents)
        logistics.push(item.logistics)
      })
      
      // 获取情景乘数
      const scenarioMultiplier = this.scenarioMultipliers[this.scenarioType]
      
      // 预测数据 (2024-2025) - 使用当前预测值
      years.push(2024, 2025)
      techMarket.push(null, null)
      patents.push(null, null)
      logistics.push(null, null)
      
      // 根据当前模型只返回对应的预测数据
      const result = {
        years,
        techMarket,
        patents,
        logistics
      }
      
      if (this.activeModel === 'lstm') {
        const lstmTechImpact = (this.currentParams.techMarket - this.baseParams.techMarket) * this.modelCoefficients.lstm.techMarket
        const lstmPatentImpact = (this.currentParams.patents - this.baseParams.patents) * this.modelCoefficients.lstm.patents
        const lstmPred = (this.baseParams.logistics + lstmTechImpact + lstmPatentImpact) * scenarioMultiplier.logistics
        
        const lstmPrediction = new Array(this.historicalData.length).fill(null)
        lstmPrediction.push(null, lstmPred)
        result.lstmPrediction = lstmPrediction
        
      } else if (this.activeModel === 'xgboost') {
        const xgboostTechImpact = (this.currentParams.techMarket - this.baseParams.techMarket) * this.modelCoefficients.xgboost.techMarket
        const xgboostPatentImpact = (this.currentParams.patents - this.baseParams.patents) * this.modelCoefficients.xgboost.patents
        const xgboostPred = (this.baseParams.logistics + xgboostTechImpact + xgboostPatentImpact) * scenarioMultiplier.logistics
        
        const xgboostPrediction = new Array(this.historicalData.length).fill(null)
        xgboostPrediction.push(null, xgboostPred)
        result.xgboostPrediction = xgboostPrediction
        
      } else if (this.activeModel === 'combined') {
        // 计算LSTM预测
        const lstmTechImpact = (this.currentParams.techMarket - this.baseParams.techMarket) * this.modelCoefficients.lstm.techMarket
        const lstmPatentImpact = (this.currentParams.patents - this.baseParams.patents) * this.modelCoefficients.lstm.patents
        const lstmPred = (this.baseParams.logistics + lstmTechImpact + lstmPatentImpact) * scenarioMultiplier.logistics
        
        // 计算XGBoost预测
        const xgboostTechImpact = (this.currentParams.techMarket - this.baseParams.techMarket) * this.modelCoefficients.xgboost.techMarket
        const xgboostPatentImpact = (this.currentParams.patents - this.baseParams.patents) * this.modelCoefficients.xgboost.patents
        const xgboostPred = (this.baseParams.logistics + xgboostTechImpact + xgboostPatentImpact) * scenarioMultiplier.logistics
        
        // 组合预测
        const combinedPred = lstmPred * parseFloat(this.lstmWeight) + xgboostPred * (1 - parseFloat(this.lstmWeight))
        
        const lstmPrediction = new Array(this.historicalData.length).fill(null)
        const xgboostPrediction = new Array(this.historicalData.length).fill(null)
        const combinedPrediction = new Array(this.historicalData.length).fill(null)
        
        lstmPrediction.push(null, lstmPred)
        xgboostPrediction.push(null, xgboostPred)
        combinedPrediction.push(null, combinedPred)
        
        result.lstmPrediction = lstmPrediction
        result.xgboostPrediction = xgboostPrediction
        result.combinedPrediction = combinedPrediction
      }
      
      return result
    },
    
    // 生成分析数据
    generateAnalysisData() {
      // 生成不同模型的散点数据
      const lstm = {
        scatterData: [],
        regressionLine: []
      }
      
      const xgboost = {
        scatterData: [],
        regressionLine: []
      }
      
      // 获取情景乘数
      const scenarioMultiplier = this.scenarioMultipliers[this.scenarioType]
      
      // 基于模型系数生成散点数据
      for (let techMarket = 1000; techMarket <= 5000; techMarket += 200) {
        // LSTM模型预测
        const lstmTechImpact = (techMarket - this.baseParams.techMarket) * this.modelCoefficients.lstm.techMarket
        const lstmPatentImpact = (this.currentParams.patents - this.baseParams.patents) * this.modelCoefficients.lstm.patents
        const lstmLogistics = (this.baseParams.logistics + lstmTechImpact + lstmPatentImpact) * scenarioMultiplier.logistics
        lstm.scatterData.push([techMarket, lstmLogistics])
        
        // XGBoost模型预测
        const xgboostTechImpact = (techMarket - this.baseParams.techMarket) * this.modelCoefficients.xgboost.techMarket
        const xgboostPatentImpact = (this.currentParams.patents - this.baseParams.patents) * this.modelCoefficients.xgboost.patents
        const xgboostLogistics = (this.baseParams.logistics + xgboostTechImpact + xgboostPatentImpact) * scenarioMultiplier.logistics
        xgboost.scatterData.push([techMarket, xgboostLogistics])
      }
      
      // 生成LSTM回归线
      const minX = 1000
      const maxX = 5000
      for (let x = minX; x <= maxX; x += (maxX - minX) / 20) {
        const lstmTechImpact = (x - this.baseParams.techMarket) * this.modelCoefficients.lstm.techMarket
        const lstmPatentImpact = (this.currentParams.patents - this.baseParams.patents) * this.modelCoefficients.lstm.patents
        const lstmY = (this.baseParams.logistics + lstmTechImpact + lstmPatentImpact) * scenarioMultiplier.logistics
        lstm.regressionLine.push([x, lstmY])
        
        // 生成XGBoost回归线
        const xgboostTechImpact = (x - this.baseParams.techMarket) * this.modelCoefficients.xgboost.techMarket
        const xgboostPatentImpact = (this.currentParams.patents - this.baseParams.patents) * this.modelCoefficients.xgboost.patents
        const xgboostY = (this.baseParams.logistics + xgboostTechImpact + xgboostPatentImpact) * scenarioMultiplier.logistics
        xgboost.regressionLine.push([x, xgboostY])
      }
      
      return { lstm, xgboost }
    },

    // 选择模型
    selectModel(model) {
      this.activeModel = model
      
      // 根据选择的模型更新当前预测值
      this.updateCurrentPrediction()
      
      // 立即更新图表显示
      this.updateMainChart()
      
      // 更新分析图表以反映当前选择的模型
      this.$nextTick(() => {
        this.updateAnalysisChart()
      })
    },
    
    // 更新当前预测值
    updateCurrentPrediction() {
      const baseLogistics = this.baseParams.logistics
      const techMarket = this.currentParams.techMarket
      const patents = this.currentParams.patents
      
      // 获取情景乘数
      const scenarioMultiplier = this.scenarioMultipliers[this.scenarioType]
      
      if (this.activeModel === 'lstm') {
        // LSTM模型计算
        const techImpact = (techMarket - this.baseParams.techMarket) * this.modelCoefficients.lstm.techMarket
        const patentImpact = (patents - this.baseParams.patents) * this.modelCoefficients.lstm.patents
        this.currentPrediction = (baseLogistics + techImpact + patentImpact) * scenarioMultiplier.logistics
      } else if (this.activeModel === 'xgboost') {
        // XGBoost模型计算
        const techImpact = (techMarket - this.baseParams.techMarket) * this.modelCoefficients.xgboost.techMarket
        const patentImpact = (patents - this.baseParams.patents) * this.modelCoefficients.xgboost.patents
        this.currentPrediction = (baseLogistics + techImpact + patentImpact) * scenarioMultiplier.logistics
      } else if (this.activeModel === 'combined') {
        // 组合模型计算（加权平均）
        const lstmTechImpact = (techMarket - this.baseParams.techMarket) * this.modelCoefficients.lstm.techMarket
        const lstmPatentImpact = (patents - this.baseParams.patents) * this.modelCoefficients.lstm.patents
        const lstmPrediction = baseLogistics + lstmTechImpact + lstmPatentImpact
        
        const xgboostTechImpact = (techMarket - this.baseParams.techMarket) * this.modelCoefficients.xgboost.techMarket
        const xgboostPatentImpact = (patents - this.baseParams.patents) * this.modelCoefficients.xgboost.patents
        const xgboostPrediction = baseLogistics + xgboostTechImpact + xgboostPatentImpact
        
        // 加权平均 (LSTM 60%, XGBoost 40%) 然后应用情景乘数
        this.currentPrediction = (lstmPrediction * parseFloat(this.lstmWeight) + xgboostPrediction * (1 - parseFloat(this.lstmWeight))) * scenarioMultiplier.logistics
      }
      
      // 确保预测值在合理范围内
      this.currentPrediction = Math.max(0, this.currentPrediction)
    },

    // 更新分析图表
    updateAnalysisChart() {
      try {
        if (!this.analysisChartInstance || this.analysisChartInstance.isDisposed()) {
          console.warn('Analysis chart instance not available')
          return
        }
        
        const data = this.generateAnalysisData()
        
        // 根据当前模型突出显示对应的散点
        const scatterSeries = []
        
        // 只在对应模式或组合模式下添加LSTM散点
        if (this.activeModel === 'lstm') {
          scatterSeries.push({
            name: 'LSTM模型 (当前)',
            type: 'scatter',
            data: data.lstm.scatterData,
            symbolSize: 10,
            itemStyle: { 
              color: '#f59e0b',
              opacity: 1
            },
            emphasis: { itemStyle: { borderWidth: 3, borderColor: '#fff' } }
          })
        } else if (this.activeModel === 'xgboost') {
          scatterSeries.push({
            name: 'XGBoost模型 (当前)',
            type: 'scatter',
            data: data.xgboost.scatterData,
            symbolSize: 10,
            itemStyle: { 
              color: '#ef4444',
              opacity: 1
            },
            emphasis: { itemStyle: { borderWidth: 3, borderColor: '#fff' } }
          })
        } else if (this.activeModel === 'combined') {
          // 组合模式显示所有模型
          scatterSeries.push(
            {
              name: 'LSTM模型',
              type: 'scatter',
              data: data.lstm.scatterData,
              symbolSize: 6,
              itemStyle: { 
                color: '#f59e0b',
                opacity: 0.7
              },
              emphasis: { itemStyle: { borderWidth: 3, borderColor: '#fff' } }
            },
            {
              name: 'XGBoost模型',
              type: 'scatter',
              data: data.xgboost.scatterData,
              symbolSize: 6,
              itemStyle: { 
                color: '#ef4444',
                opacity: 0.7
              },
              emphasis: { itemStyle: { borderWidth: 3, borderColor: '#fff' } }
            },
            {
              name: '组合预测 (当前)',
              type: 'scatter',
              data: [[this.currentParams.techMarket, this.currentPrediction]],
              symbolSize: 15,
              symbol: 'diamond',
              itemStyle: { 
                color: '#06b6d4',
                borderColor: '#fff',
                borderWidth: 3
              },
              emphasis: { itemStyle: { borderWidth: 5, shadowBlur: 10, shadowColor: '#06b6d4' } },
              markPoint: {
                data: [{
                  name: '组合预测点',
                  coord: [this.currentParams.techMarket, this.currentPrediction],
                  itemStyle: { color: '#06b6d4' },
                  label: { 
                    show: true,
                    formatter: '组合预测',
                    color: '#06b6d4',
                    fontWeight: 'bold'
                  }
                }]
              }
            }
          )
        }
        
        const option = {
          backgroundColor: 'transparent',
          tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(15, 30, 60, 0.9)',
            borderColor: '#5cbbff',
            textStyle: { color: '#ffffff' },
            formatter: (params) => {
              const [x, y] = params.value
              return `<div style="padding: 8px;">
                <div style="color: #7dd3fc; font-weight: bold;">${params.seriesName}</div>
                <div style="margin-top: 4px;">技术市场成交额: ${x} 亿元</div>
                <div>预测物流量: ${y.toFixed(1)} 亿件</div>
              </div>`
            }
          },
          legend: {
            data: scatterSeries.map(s => s.name),
            top: '5%',
            textStyle: { color: '#7dd3fc' }
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
            name: '技术市场成交额(亿元)',
            nameLocation: 'middle',
            nameGap: 30,
            nameTextStyle: { color: '#7dd3fc' },
            axisLine: { lineStyle: { color: '#5cbbff' } },
            axisLabel: { color: '#7dd3fc' },
            splitLine: { lineStyle: { color: 'rgba(92, 187, 255, 0.1)' } },
            min: 1000,
            max: 5000
          },
          yAxis: {
            type: 'value',
            name: '物流业务量(亿件)',
            nameLocation: 'middle',
            nameGap: 40,
            nameTextStyle: { color: '#7dd3fc' },
            axisLine: { lineStyle: { color: '#5cbbff' } },
            axisLabel: { color: '#7dd3fc' },
            splitLine: { lineStyle: { color: 'rgba(92, 187, 255, 0.1)' } },
            min: 300,
            max: 800
          },
          series: [
            ...scatterSeries,
            // 添加回归线（根据当前模型显示对应的回归线）
            {
              name: '回归趋势',
              type: 'line',
              data: this.activeModel === 'xgboost' ? data.xgboost.regressionLine : data.lstm.regressionLine,
              lineStyle: { color: '#7dd3fc', width: 2, type: 'dashed' },
              symbol: 'none',
              emphasis: { lineStyle: { width: 3 } }
            }
          ]
        }
        
        this.analysisChartInstance.setOption(option, true)
      } catch (error) {
        console.error('Error updating analysis chart:', error)
      }
    },
  },
  watch: {
    // 监听参数变化
    'currentParams.techMarket'() {
      this.updateCurrentPrediction()
      this.updateMainChart()
      this.updateAnalysisChart()
    },
    'currentParams.patents'() {
      this.updateCurrentPrediction()
      this.updateMainChart()
      this.updateAnalysisChart()
    },
    // 监听模型切换
    activeModel() {
      this.updateCurrentPrediction()
      this.updateMainChart()
      this.updateAnalysisChart()
    }
  }
}
</script>

<style scoped>
.conclusion4 {
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
  flex: 0 0 320px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: sticky;
  top: 0;
  max-height: 100vh;
  overflow-y: auto;
}

.model-control,
.tech-input-control,
.scenario-control,
.prediction-result,
.performance-metrics,
.insight-panel {
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

/* 模型选择器样式 */
.model-selector {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.radio-label:hover {
  background-color: rgba(92, 187, 255, 0.1);
}

.radio-label input[type="radio"] {
  accent-color: #5cbbff;
}

.radio-text {
  color: #94a3b8;
  font-size: 14px;
}

.radio-label input[type="radio"]:checked + .radio-text {
  color: #7dd3fc;
  font-weight: 600;
}

/* 权重控制样式 */
.weight-control {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid rgba(92, 187, 255, 0.2);
}

.weight-formula {
  margin-top: 8px;
  font-size: 12px;
  color: #94a3b8;
  text-align: center;
  font-style: italic;
}

/* 滑动条样式 */
.slider-container {
  margin-bottom: 15px;
}

.slider-label {
  display: block;
  color: #94a3b8;
  margin-bottom: 8px;
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
  min-width: 60px;
  text-align: center;
}

/* 情景选项样式 */
.scenario-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 结果显示样式 */
.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 8px;
  background-color: rgba(92, 187, 255, 0.05);
  border-radius: 6px;
}

.result-label {
  color: #94a3b8;
  font-size: 13px;
}

.result-value {
  color: #7dd3fc;
  font-weight: 600;
  font-size: 14px;
}

.result-value.highlight {
  color: #10b981;
  font-size: 16px;
  font-weight: 700;
}

/* 性能指标网格 */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.metric-item {
  text-align: center;
  padding: 8px;
  background-color: rgba(92, 187, 255, 0.05);
  border-radius: 6px;
}

.metric-label {
  display: block;
  color: #94a3b8;
  font-size: 12px;
  margin-bottom: 4px;
}

.metric-value {
  color: #7dd3fc;
  font-weight: 600;
  font-size: 14px;
}

/* 智能解读面板 */
.insight-content {
  background-color: rgba(92, 187, 255, 0.1);
  border-radius: 8px;
  padding: 12px;
  border: 1px solid rgba(92, 187, 255, 0.2);
}

.insight-text {
  color: #94a3b8;
  font-size: 13px;
  line-height: 1.5;
  margin: 0;
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
  background-color: rgba(15, 30, 60, 0.7);
  border-radius: 12px;
  padding: 15px;
  border: 1px solid rgba(92, 187, 255, 0.3);
  backdrop-filter: blur(4px);
}

.main-chart {
  flex: 2;
  min-height: 500px;
}

.analysis-chart {
  flex: 1;
  min-height: 280px;
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
  
  .model-control,
  .tech-input-control,
  .scenario-control,
  .prediction-result,
  .performance-metrics,
  .insight-panel {
    flex: 1;
    min-width: 280px;
  }
  
  .chart-area {
    min-height: 500px;
    position: static;
    max-height: none;
    overflow-y: visible;
  }
}

@media (max-width: 768px) {
  .conclusion4 {
    padding: 15px;
  }
  
  .control-panel {
    flex-direction: column;
  }
  
  .model-control,
  .tech-input-control,
  .scenario-control,
  .prediction-result,
  .performance-metrics,
  .insight-panel {
    min-width: auto;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
}
</style> 