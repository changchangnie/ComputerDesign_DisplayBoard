<template>
  <div class="conclusion3">
    <div class="main-content">
      <!-- 左侧控制面板 -->
      <div class="control-panel">
        <!-- 时间控制区域 -->
        <div class="time-control">
          <h3 class="control-title">时间控制</h3>
          <div class="slider-container">
            <label class="slider-label">起始观察年份</label>
            <div class="slider-wrapper">
              <input 
                type="range" 
                class="slider" 
                :min="2020" 
                :max="2025" 
                :step="1" 
                v-model="startYear"
                @input="handleTimeChange"
              />
              <div class="slider-value">{{ startYear }}</div>
            </div>
          </div>
          <div class="select-container">
            <label class="select-label">预测期长度:</label>
            <select class="select-input" v-model="predictionYears" @change="handleTimeChange">
              <option value="5">5年</option>
              <option value="10">10年</option>
            </select>
          </div>
        </div>

        <!-- 情景模拟区域 -->
        <div class="scenario-control">
          <h3 class="control-title">情景模拟</h3>
          <div class="scenario-options">
            <label class="radio-label">
              <input type="radio" value="baseline" v-model="scenarioType" @change="handleScenarioChange">
              <span class="radio-text">基准预测</span>
            </label>
            <label class="radio-label">
              <input type="radio" value="stimulus" v-model="scenarioType" @change="handleScenarioChange">
              <span class="radio-text">政策刺激 (+20%)</span>
            </label>
            <label class="radio-label">
              <input type="radio" value="adjustment" v-model="scenarioType" @change="handleScenarioChange">
              <span class="radio-text">市场调整 (-15%)</span>
            </label>
          </div>
        </div>

        <!-- 敏感性分析区域 -->
        <div class="sensitivity-control">
          <h3 class="control-title">敏感性分析</h3>
          <div class="coefficient-sliders">
            <div class="slider-container">
              <label class="slider-label">基金→VC影响系数</label>
              <div class="slider-wrapper">
                <input 
                  type="range" 
                  class="slider" 
                  :min="0.5" 
                  :max="1.5" 
                  :step="0.1" 
                  v-model="varCoefficients.fundToVC"
                  @input="handleCoefficientChange"
                />
                <div class="slider-value">{{ varCoefficients.fundToVC }}</div>
              </div>
            </div>
            <div class="slider-container">
              <label class="slider-label">VC→独角兽影响系数</label>
              <div class="slider-wrapper">
                <input 
                  type="range" 
                  class="slider" 
                  :min="0.3" 
                  :max="1.2" 
                  :step="0.1" 
                  v-model="varCoefficients.vcToUnicorn"
                  @input="handleCoefficientChange"
                />
                <div class="slider-value">{{ varCoefficients.vcToUnicorn }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 显示选项区域 -->
        <div class="display-options">
          <h3 class="control-title">显示选项</h3>
          <div class="checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="showConfidenceInterval" @change="updateCharts">
              <span class="checkbox-text">显示置信区间</span>
            </label>
            <label class="checkbox-label">
              <input type="checkbox" v-model="showKeyPoints" @change="updateCharts">
              <span class="checkbox-text">标注关键拐点</span>
            </label>
            <label class="checkbox-label">
              <input type="checkbox" v-model="showCausalArrows" @change="updateNetworkChart">
              <span class="checkbox-text">显示因果箭头</span>
            </label>
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
        <!-- 主要时间序列图表 -->
        <div class="chart-container main-chart">
          <h4 class="chart-title">独角兽企业与风险投资动态趋势<br>(VAR模型预测)</h4>
          <div ref="mainChartRef" class="echarts-container"></div>
        </div>

        <!-- VAR因果关系网络图 -->
        <div class="chart-container network-chart">
          <h4 class="chart-title">VAR模型因果关系网络</h4>
          <div ref="networkChartRef" class="echarts-container"></div>
        </div>

        <div class="chart-description">
          <p>图表说明：基于VAR(3)模型的独角兽企业与风险投资动态关系分析。上图展示三变量时间序列趋势，2025年风险投资达峰后回落；下图展示变量间因果传导机制，箭头粗细表示影响强度。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'Conclusion3',
  data() {
    return {
      // 时间控制参数
      startYear: 2020,
      predictionYears: 10,
      
      // 情景模拟参数
      scenarioType: 'baseline',
      
      // VAR模型系数
      varCoefficients: {
        fundToVC: 0.78,       // 基金规模→VC金额影响系数
        vcToUnicorn: 0.65,    // VC金额→独角兽数量影响系数
        unicornToFund: 0.42   // 独角兽数量→基金规模反馈系数
      },
      
      // 显示选项
      showConfidenceInterval: true,
      showKeyPoints: true,
      showCausalArrows: true,
      
      // 图表实例
      mainChartInstance: null,
      networkChartInstance: null,
      resizeHandler: null,
      
      // 情景乘数
      scenarioMultipliers: {
        baseline: { fund: 1.0, vc: 1.0, unicorn: 1.0 },
        stimulus: { fund: 1.2, vc: 1.15, unicorn: 1.08 },
        adjustment: { fund: 0.85, vc: 0.9, unicorn: 0.95 }
      },
      
      // 基础历史数据（2020-2024）
      historicalData: [
        { year: 2020, unicorns: 586, vcAmount: 2890, fundScale: 4200 },
        { year: 2021, unicorns: 959, vcAmount: 4520, fundScale: 6800 },
        { year: 2022, unicorns: 1205, vcAmount: 3980, fundScale: 5900 },
        { year: 2023, unicorns: 1361, vcAmount: 3420, fundScale: 5200 },
        { year: 2024, unicorns: 1456, vcAmount: 3650, fundScale: 5600 }
      ],
      
      // VAR模型基准预测数据
      basePredictedData: [
        { year: 2025, unicorns: 1580, vcAmount: 4100, fundScale: 6200 }, // VC峰值年
        { year: 2026, unicorns: 1720, vcAmount: 3950, fundScale: 6500 },
        { year: 2027, unicorns: 1840, vcAmount: 3800, fundScale: 6300 },
        { year: 2028, unicorns: 1950, vcAmount: 3700, fundScale: 6100 },
        { year: 2029, unicorns: 2040, vcAmount: 3650, fundScale: 6000 },
        { year: 2030, unicorns: 2120, vcAmount: 3600, fundScale: 5950 }
      ]
    }
  },
  computed: {
    // 当前预测数据
    currentPredictedData() {
      return this.calculateVARPrediction()
    },
    
    // 组合数据（历史+预测）
    combinedData() {
      const startIndex = this.startYear - 2020
      const historical = this.historicalData.slice(startIndex)
      return [...historical, ...this.currentPredictedData]
    },
    
    // 智能解读文本
    currentInsight() {
      const scenario = this.scenarioType
      const vcPeak = this.currentPredictedData.find(d => d.year === 2025)
      
      if (scenario === 'stimulus') {
        return `政策刺激情景下，基金规模增加20%将推动风险投资在2025年达到${Math.round(vcPeak?.vcAmount || 4100)}亿美元，独角兽企业数量预计增长8%，体现了基金→VC→独角兽的传导机制。`
      } else if (scenario === 'adjustment') {
        return `市场调整情景下，基金规模收缩15%将导致风险投资回落至${Math.round(vcPeak?.vcAmount || 4100)}亿美元，独角兽增速放缓至5%，反映了市场周期性调整的影响。`
      } else {
        return `基准情景下，风险投资将在2025年达到峰值4100亿美元后回落，独角兽企业数量持续增长但增速趋缓，符合VAR模型预测的动态平衡趋势。`
      }
    }
  },
  mounted() {
    console.log('Conclusion3 mounted')
    this.$nextTick(() => {
      setTimeout(() => {
        this.initCharts()
      }, 100)
    })
    
    // 添加防抖的resize监听
    this.resizeHandler = this.debounce(() => {
      if (this.mainChartInstance && !this.mainChartInstance.isDisposed()) {
        this.mainChartInstance.resize()
      }
      if (this.networkChartInstance && !this.networkChartInstance.isDisposed()) {
        this.networkChartInstance.resize()
      }
    }, 300)
    
    window.addEventListener('resize', this.resizeHandler)
  },
  beforeUnmount() {
    console.log('Conclusion3 beforeUnmount')
    
    // 移除resize监听器
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler)
    }
    
    // 销毁图表实例
    if (this.mainChartInstance) {
      this.mainChartInstance.dispose()
      this.mainChartInstance = null
    }
    if (this.networkChartInstance) {
      this.networkChartInstance.dispose()
      this.networkChartInstance = null
    }
  },
  methods: {
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
    
    // VAR模型预测计算
    calculateVARPrediction() {
      const predictions = []
      const multipliers = this.scenarioMultipliers[this.scenarioType]
      
      for (let i = 0; i < this.predictionYears; i++) {
        const baseData = this.basePredictedData[i]
        if (!baseData) continue
        
        // 应用情景乘数和系数调整
        const adjustedData = {
          year: baseData.year,
          unicorns: Math.round(baseData.unicorns * multipliers.unicorn * (this.varCoefficients.vcToUnicorn / 0.65)),
          vcAmount: Math.round(baseData.vcAmount * multipliers.vc * (this.varCoefficients.fundToVC / 0.78)),
          fundScale: Math.round(baseData.fundScale * multipliers.fund),
          confidenceInterval: this.calculateConfidenceInterval(baseData.year)
        }
        
        predictions.push(adjustedData)
      }
      
      return predictions
    },
    
    // 计算置信区间
    calculateConfidenceInterval(year) {
      const yearsFromNow = year - 2024
      const baseWidth = 0.1 + yearsFromNow * 0.05 // 越远置信区间越宽
      return {
        upper: 1 + baseWidth,
        lower: 1 - baseWidth
      }
    },
    
    // 事件处理方法
    handleTimeChange() {
      this.updateCharts()
    },
    
    handleScenarioChange() {
      this.updateCharts()
    },
    
    handleCoefficientChange() {
      this.debounce(() => {
        this.updateCharts()
      }, 300)()
    },
    
    // 图表初始化
    initCharts() {
      this.initMainChart()
      this.initNetworkChart()
    },
    
    // 主图表初始化
    initMainChart() {
      const chartContainer = this.$refs.mainChartRef
      if (!chartContainer) return
      
      this.mainChartInstance = echarts.init(chartContainer)
      this.updateMainChart()
    },
    
    // 网络图初始化
    initNetworkChart() {
      const chartContainer = this.$refs.networkChartRef
      if (!chartContainer) return
      
      this.networkChartInstance = echarts.init(chartContainer)
      this.updateNetworkChart()
    },
    
    // 更新所有图表
    updateCharts() {
      this.updateMainChart()
      this.updateNetworkChart()
    },
    
    // 更新主图表
    updateMainChart() {
      if (!this.mainChartInstance) return
      
      const data = this.combinedData
      const historicalEndIndex = this.historicalData.length - (2020 - this.startYear)
      
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
            const item = data[dataIndex]
            const isHistorical = dataIndex < historicalEndIndex
            const status = isHistorical ? '历史数据' : '预测数据'
            
            return `
              <div style="padding: 8px;">
                <div style="color: #7dd3fc; font-weight: bold;">${item.year}年 (${status})</div>
                <div style="margin-top: 8px;">
                  <div style="color: #3b82f6;">独角兽企业: ${item.unicorns} 家</div>
                  <div style="color: #10b981;">风险投资: ${item.vcAmount} 亿美元</div>
                  <div style="color: #8b5cf6;">基金规模: ${item.fundScale} 亿美元</div>
                </div>
              </div>
            `
          }
        },
        legend: {
          data: ['独角兽企业数量', '风险投资金额', '基金规模'],
          top: '8%',
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
          type: 'category',
          data: data.map(d => d.year),
          axisLine: { lineStyle: { color: '#5cbbff' } },
          axisLabel: { color: '#7dd3fc' },
          splitLine: { lineStyle: { color: 'rgba(92, 187, 255, 0.1)' } }
        },
        yAxis: {
          type: 'value',
          name: '数量/金额',
          nameTextStyle: { color: '#7dd3fc' },
          axisLine: { lineStyle: { color: '#5cbbff' } },
          axisLabel: { color: '#7dd3fc' },
          splitLine: { lineStyle: { color: 'rgba(92, 187, 255, 0.1)' } }
        },
        series: [
          {
            name: '独角兽企业数量',
            type: 'line',
            data: data.map(d => d.unicorns),
            lineStyle: { color: '#3b82f6', width: 3 },
            areaStyle: { color: 'rgba(59, 130, 246, 0.1)' },
            symbol: 'circle',
            symbolSize: 6,
            markPoint: this.showKeyPoints ? {
              data: [
                { name: '独角兽增速放缓', xAxis: data.findIndex(d => d.year === 2026), yAxis: data.find(d => d.year === 2026)?.unicorns }
              ],
              itemStyle: { color: '#f59e0b' }
            } : undefined
          },
          {
            name: '风险投资金额',
            type: 'line',
            data: data.map(d => d.vcAmount),
            lineStyle: { color: '#10b981', width: 3 },
            symbol: 'diamond',
            symbolSize: 6,
            markPoint: this.showKeyPoints ? {
              data: [
                { name: '2025年VC峰值', xAxis: data.findIndex(d => d.year === 2025), yAxis: data.find(d => d.year === 2025)?.vcAmount }
              ],
              itemStyle: { color: '#f59e0b' }
            } : undefined
          },
          {
            name: '基金规模',
            type: 'line',
            data: data.map(d => d.fundScale),
            lineStyle: { color: '#8b5cf6', width: 3 },
            symbol: 'triangle',
            symbolSize: 6
          }
        ]
      }
      
      // 添加历史/预测分界线
      if (historicalEndIndex > 0 && historicalEndIndex < data.length) {
        option.series.push({
          name: '预测分界线',
          type: 'line',
          data: Array(data.length).fill(null).map((_, i) => i === historicalEndIndex - 1 ? [data[i].year, 0] : null),
          lineStyle: { color: '#f59e0b', type: 'dashed', width: 2 },
          symbol: 'none',
          markLine: {
            data: [{ xAxis: data[historicalEndIndex - 1]?.year }],
            lineStyle: { color: '#f59e0b', type: 'dashed', width: 2 },
            label: { formatter: '预测起点', color: '#f59e0b' }
          }
        })
      }
      
      this.mainChartInstance.setOption(option, false)
    },
    
    // 更新网络图
    updateNetworkChart() {
      if (!this.networkChartInstance) return
      
      const nodes = [
        {
          id: 'fund',
          name: `基金规模\n(Ft)\n系数: ${this.varCoefficients.unicornToFund}`,
          x: 150,
          y: 80,
          symbolSize: 60,
          itemStyle: { color: '#8b5cf6' }
        },
        {
          id: 'vc',
          name: `风险投资\n(VCt)\n系数: ${this.varCoefficients.fundToVC}`,
          x: 350,
          y: 80,
          symbolSize: 60,
          itemStyle: { color: '#10b981' }
        },
        {
          id: 'unicorn',
          name: `独角兽企业\n(Ut)\n系数: ${this.varCoefficients.vcToUnicorn}`,
          x: 250,
          y: 200,
          symbolSize: 60,
          itemStyle: { color: '#3b82f6' }
        }
      ]
      
      const links = this.showCausalArrows ? [
        {
          source: 'fund',
          target: 'vc',
          value: this.varCoefficients.fundToVC,
          lineStyle: {
            width: Math.max(2, this.varCoefficients.fundToVC * 4),
            color: '#10b981',
            curveness: 0.1
          },
          label: {
            show: true,
            formatter: `${this.varCoefficients.fundToVC}`,
            color: '#10b981'
          }
        },
        {
          source: 'vc',
          target: 'unicorn',
          value: this.varCoefficients.vcToUnicorn,
          lineStyle: {
            width: Math.max(2, this.varCoefficients.vcToUnicorn * 4),
            color: '#3b82f6',
            curveness: 0.1
          },
          label: {
            show: true,
            formatter: `${this.varCoefficients.vcToUnicorn}`,
            color: '#3b82f6'
          }
        },
        {
          source: 'unicorn',
          target: 'fund',
          value: this.varCoefficients.unicornToFund,
          lineStyle: {
            width: Math.max(2, this.varCoefficients.unicornToFund * 4),
            color: '#8b5cf6',
            curveness: 0.2
          },
          label: {
            show: true,
            formatter: `${this.varCoefficients.unicornToFund}`,
            color: '#8b5cf6'
          }
        }
      ] : []
      
      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(15, 30, 60, 0.9)',
          borderColor: '#5cbbff',
          textStyle: { color: '#ffffff' },
          formatter: (params) => {
            if (params.dataType === 'node') {
              const names = {
                fund: '基金规模 (Ft)',
                vc: '风险投资 (VCt)',
                unicorn: '独角兽企业 (Ut)'
              }
              return `<div style="padding: 8px;"><div style="color: #7dd3fc; font-weight: bold;">${names[params.data.id]}</div></div>`
            } else if (params.dataType === 'edge') {
              return `<div style="padding: 8px;"><div style="color: #7dd3fc;">影响系数: ${params.data.value}</div></div>`
            }
          }
        },
        series: [{
          type: 'graph',
          layout: 'none',
          data: nodes,
          links: links,
          roam: false,
          label: {
            show: true,
            position: 'inside',
            color: '#ffffff',
            fontSize: 12,
            fontWeight: 'bold'
          },
          emphasis: {
            focus: 'adjacency',
            itemStyle: { borderWidth: 3, borderColor: '#f59e0b' }
          },
          edgeSymbol: ['none', 'arrow'],
          edgeSymbolSize: [0, 10]
        }]
      }
      
      this.networkChartInstance.setOption(option, false)
    }
  }
}
</script>

<style scoped>
.conclusion3 {
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
  flex: 0 0 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: sticky;
  top: 0;
  max-height: 100vh;
  overflow-y: auto;
}

.time-control,
.scenario-control,
.sensitivity-control,
.display-options,
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
  min-width: 50px;
  text-align: center;
}

/* 选择框样式 */
.select-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.select-label {
  color: #94a3b8;
  font-size: 14px;
  min-width: 80px;
}

.select-input {
  flex: 1;
  padding: 8px 12px;
  background-color: rgba(92, 187, 255, 0.1);
  border: 1px solid rgba(92, 187, 255, 0.3);
  border-radius: 6px;
  color: #7dd3fc;
  font-size: 14px;
}

/* 单选按钮样式 */
.scenario-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
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

/* 复选框样式 */
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.checkbox-label:hover {
  background-color: rgba(92, 187, 255, 0.1);
}

.checkbox-label input[type="checkbox"] {
  accent-color: #5cbbff;
}

.checkbox-text {
  color: #94a3b8;
  font-size: 14px;
}

.checkbox-label input[type="checkbox"]:checked + .checkbox-text {
  color: #7dd3fc;
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
  min-height: 350px;
}

.network-chart {
  flex: 1.5;
  min-height: 320px;
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
  
  .time-control,
  .scenario-control,
  .sensitivity-control,
  .display-options,
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
  .conclusion3 {
    padding: 15px;
  }
  
  .control-panel {
    flex-direction: column;
  }
  
  .time-control,
  .scenario-control,
  .sensitivity-control,
  .display-options,
  .insight-panel {
    min-width: auto;
  }
}
</style> 