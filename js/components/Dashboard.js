import Section1 from './Section1.js'
import Section2 from './Section2.js'
import Section3 from './Section3.js'

export default {
    components: {
        Section1,
        Section2,
        Section3
    },
    data() {
        return {
            activeSection: 1
        }
    },
    methods: {
        changeSection(sectionNumber) {
            this.activeSection = sectionNumber
        }
    },
    template: `
    <div class="dashboard">
      <header class="dashboard-header">
        <h1 class="dashboard-title">科技创新数据可视化平台</h1>
        <div class="nav-buttons">
          <button 
            class="nav-button" 
            :class="{ active: activeSection === 1 }" 
            @click="changeSection(1)">
            研发投入-技术创新-产业升级-社会变革图谱
          </button>
          <button 
            class="nav-button" 
            :class="{ active: activeSection === 2 }" 
            @click="changeSection(2)">
            科技创新和资本市场的相互影响和预测
          </button>
          <button 
            class="nav-button" 
            :class="{ active: activeSection === 3 }" 
            @click="changeSection(3)">
            基于核心脉络与动态因素的回环分析
          </button>
        </div>
      </header>
      
      <div class="dashboard-content">
        <Section1 :class="{ active: activeSection === 1 }" />
        <Section2 :class="{ active: activeSection === 2 }" />
        <Section3 :class="{ active: activeSection === 3 }" />
      </div>
    </div>
  `
} 