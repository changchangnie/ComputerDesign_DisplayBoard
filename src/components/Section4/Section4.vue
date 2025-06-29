<template>
  <div class="section4-container">
    <div class="section-header">
      <h2 class="section-title">研究结论交互分析</h2>
      <p class="section-subtitle">基于多项研究结论的可视化交互展示</p>
      
      <div class="conclusion-nav">
        <button 
          v-for="conclusion in conclusions" 
          :key="conclusion.id"
          :class="['nav-btn', { active: activeConclusion === conclusion.id }]"
          @click="switchConclusion(conclusion.id)"
        >
          {{ conclusion.title }}
        </button>
      </div>
    </div>
    
    <div class="conclusion-content">
      <component :is="currentComponent" :key="activeConclusion" />
    </div>
  </div>
</template>

<script>
import Conclusion1 from './Conclusion1.vue'
import Conclusion2 from './Conclusion2.vue'
import Conclusion3 from './Conclusion3.vue'
import Conclusion4 from './Conclusion4.vue'

export default {
  name: 'Section4',
  components: {
    Conclusion1,
    Conclusion2,
    Conclusion3,
    Conclusion4
  },
  data() {
    return {
      activeConclusion: 1,
      conclusions: [
        { 
          id: 1, 
          title: 'R&D投入与创新关系', 
          component: 'Conclusion1',
          description: '研发投入占GDP比重每提升1%，全球创新指数平均增加0.78分'
        },
        { 
          id: 2, 
          title: '技术创新与产业升级', 
          component: 'Conclusion2',
          description: '技术创新与高科技出口(r=0.89)和数字化指数(r=0.97)的相关性分析'
        },
        { 
          id: 3, 
          title: '独角兽企业与风险投资', 
          component: 'Conclusion3',
          description: 'VAR模型分析独角兽企业与风险投资的动态关系，2025年VC达峰后回落'
        },
        { 
          id: 4, 
          title: '技术创新与物流发展', 
          component: 'Conclusion4',
          description: 'LSTM模型预测技术创新对物流发展的2年滞后效应，2025年快递业务量达2251亿件'
        }
      ]
    }
  },
  computed: {
    currentComponent() {
      const conclusion = this.conclusions.find(c => c.id === this.activeConclusion)
      return conclusion ? conclusion.component : 'Conclusion1'
    }
  },
  methods: {
    switchConclusion(id) {
      if (this.conclusions.find(c => c.id === id)) {
        this.activeConclusion = id
      } else {
        console.warn(`Invalid conclusion id: ${id}`)
      }
    }
  }
}
</script>

<style scoped>
.section4-container {
  width: 100%;
  height: 100%;
  background-color: rgba(10, 25, 50, 0.9);
  color: white;
  overflow-y: auto;
}

.section-header {
  text-align: center;
  padding: 20px;
  border-bottom: 1px solid rgba(92, 187, 255, 0.2);
}

.section-title {
  font-size: 28px;
  color: #7dd3fc;
  margin-bottom: 10px;
  font-weight: 600;
  text-shadow: 0 0 10px rgba(125, 211, 252, 0.5);
}

.section-subtitle {
  font-size: 16px;
  color: #94a3b8;
  line-height: 1.5;
  max-width: 800px;
  margin: 0 auto 30px auto;
}

.conclusion-nav {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.nav-btn {
  padding: 12px 24px;
  background: rgba(15, 30, 60, 0.7);
  border: 1px solid rgba(92, 187, 255, 0.3);
  color: #7dd3fc;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
  backdrop-filter: blur(4px);
}

.nav-btn:hover {
  background: rgba(92, 187, 255, 0.2);
  border-color: #5cbbff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(92, 187, 255, 0.3);
}

.nav-btn.active {
  background: rgba(92, 187, 255, 0.4);
  border-color: #5cbbff;
  color: #ffffff;
  box-shadow: 0 0 15px rgba(92, 187, 255, 0.5);
}

.conclusion-content {
  height: calc(100% - 160px);
  overflow: hidden;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .conclusion-nav {
    flex-direction: column;
    align-items: center;
  }
  
  .nav-btn {
    width: 100%;
    max-width: 300px;
  }
  
  .section-title {
    font-size: 24px;
  }
  
  .section-subtitle {
    font-size: 14px;
  }
}
</style> 