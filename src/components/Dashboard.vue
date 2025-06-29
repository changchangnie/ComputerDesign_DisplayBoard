<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1 class="dashboard-title">科技创新数据可视化平台</h1>
      <div class="nav-buttons">
        <button 
          class="nav-button" 
          :class="{ active: activeSection === 0 }" 
          @click="changeSection(0)">
          关系图谱
        </button>
        <button 
          class="nav-button" 
          :class="{ active: activeSection === 1 }" 
          @click="changeSection(1)">
          核心脉络层
        </button>
        <button 
          class="nav-button" 
          :class="{ active: activeSection === 2 }" 
          @click="changeSection(2)">
          动态影响层
        </button>
        <button
          class="nav-button" 
          :class="{ active: activeSection === 3 }" 
          @click="changeSection(3)">
          反馈传播层
        </button>
        <button
          class="nav-button" 
          :class="{ active: activeSection === 4 }" 
          @click="changeSection(4)">
          交互结论
        </button>
      </div>
    </header>
    
    <div class="dashboard-content">
      <Section0 :class="{ active: activeSection === 0 }" />
      <Section1 :class="{ active: activeSection === 1 }" />
      <Section2 :class="{ active: activeSection === 2 }" />
      <Section3 :class="{ active: activeSection === 3 }" />
      <Section4 :class="{ active: activeSection === 4 }" />
    </div>
  </div>
  <div/>
</template>

<script>
import Section0 from './Section0.vue'
import Section1 from './Section1.vue'
import Section2 from './Section2.vue'
import Section3 from './Section3.vue'
import Section4 from './Section4.vue'

export default {
  name: 'Dashboard',
  components: {
    Section0,
    Section1,
    Section2,
    Section3,
    Section4
  },
  data() {
    return {
      activeSection: 0
    }
  },
  methods: {
    changeSection(sectionNumber) {
      this.activeSection = sectionNumber
    }
  }
}
</script>

<style scoped>
.dashboard {
  width: 100%;
  height: 100vh;
  position: relative;
}

.dashboard-header {
  padding: 10px 20px;
  text-align: center;
}

.dashboard-title {
  margin-bottom: 10px;
  font-size: 24px;
  color: #333;
}

.nav-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.nav-button {
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  background-color: #f0f0f0;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 14px;
}

.nav-button.active {
  background-color: #2196F3;
  color: white;
}

.dashboard-content {
  position: relative;
  height: calc(100vh - 100px);
  overflow: hidden;
}

/* 重要：处理组件显示/隐藏 */
.dashboard-content > * {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  visibility: hidden;
  z-index: 0;
  display: none;
}

.dashboard-content > *.active {
  opacity: 1;
  visibility: visible;
  z-index: 1;
  display: block;
}
</style> 