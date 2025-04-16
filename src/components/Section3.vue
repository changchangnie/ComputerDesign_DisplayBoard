<template>
  <div class="section3">
    <div class="section-container">
      <!-- 第一部分 -->
      <div class="section-part part1">
        <h2 class="part-title">研发-创新-产业-社会循环关系</h2>
        <div class="part-content">
          <div class="image-container">
            <img src="/images/part3/p1.png" alt="研发-创新-产业-社会循环关系" />
          </div>
          <div class="description-container">
            <p class="description-text">
              展示了研发投入、技术创新、产业升级与社会变革之间的基本循环关系，构成创新驱动发展的核心脉络层。
            </p>
          </div>
        </div>
        <div class="arrow">
          <div class="arrow-line"></div>
          <div class="arrow-head"></div>
        </div>
      </div>
      
      <!-- 第二部分 -->
      <div class="section-part part2">
        <h2 class="part-title">社会变革反作用于研发投入的变化</h2>
        <div class="part-content">
          <div class="image-container">
            <img src="/images/part3/p2.png" alt="社会变革反作用于研发投入的变化" />
          </div>
          <div class="description-container">
            <p class="description-text">
              分析变量随时间变化的动态关系建立的一类路径的动态关系图示例，展示了社会变革反作用于研发投入的动态关系。
            </p>
          </div>
        </div>
        <div class="arrow">
          <div class="arrow-line"></div>
          <div class="arrow-head"></div>
        </div>
      </div>
      
      <!-- 第三部分 -->
      <div class="section-part part3">
        <h2 class="part-title">变量定量关系网络</h2>
        <div class="part-content">
          <div class="image-container">
            <img src="/images/part3/p3.png" alt="变量定量关系网络" />
          </div>
          <div class="description-container">
            <p class="description-text">
              反向传播层的基本结构：社会变革反作用于研发投入，产业升级通过影响政策支持继而反作用于研发投入等多重回环关系。
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Section3'
}
</script>

<style scoped>
/* 添加全局字体导入 */
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600&family=Orbitron:wght@400;500;600&display=swap');

.section3 {
  width: 100%;
  height: 100%;
  padding: 20px;
  overflow-y: auto;
  background-color: rgba(10, 25, 50, 0.8);
  color: white;
}

.section-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.section-part {
  position: relative;
  width: 100%;
  padding: 20px;
  border-radius: 10px;
  background-color: rgba(15, 30, 60, 0.5);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(92, 187, 255, 0.3);
  backdrop-filter: blur(4px);
}

.part-title {
  text-align: center;
  margin-bottom: 15px;
  font-size: 30px;
  color: #7dd3fc;
  font-weight: 600;
  text-shadow: 0 0 10px rgba(92, 187, 255, 0.5);
  font-family: 'Rajdhani', 'Orbitron', sans-serif;
  letter-spacing: 1px;
}

.part-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: transparent;
  gap: 5px;
}

.image-container {
  flex: 0 0 60%;
  display: flex;
  justify-content: center;
}

.description-container {
  flex: 0 0 38%;
}

.description-text {
  color: #7dd3fc;
  font-size: 18px;
  line-height: 1.5;
  text-align: left;
  padding: 12px;
  border-left: 3px solid #5cbbff;
  background-color: rgba(15, 30, 60, 0.3);
  border-radius: 0 5px 5px 0;
  font-family: 'Rajdhani', 'Orbitron', sans-serif;
  letter-spacing: 0.5px;
  text-shadow: 0 0 8px rgba(92, 187, 255, 0.4);
}

.part-content img {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
  background: transparent;
  filter: drop-shadow(0 0 8px rgba(92, 187, 255, 0.3));
}

.arrow {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 30px;
  z-index: 10;
}

.arrow-line {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 20px;
  background-color: #5cbbff;
  box-shadow: 0 0 8px rgba(92, 187, 255, 0.5);
}

.arrow-head {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid #5cbbff;
  filter: drop-shadow(0 0 5px rgba(92, 187, 255, 0.5));
}

/* 增加逻辑关系的视觉效果 */
.part1 {
  border-left: 5px solid #5cbbff;
}

.part2 {
  border-left: 5px solid #61dafb;
}

.part3 {
  border-left: 5px solid #bb86fc;
}

/* 为第二张图片添加特殊样式 */
.part2 .image-container {
  flex: 0 0 50%;
}

.part2 .description-container {
  flex: 0 0 50%;
  margin-left: -20px;
}

.part2 .part-content {
  gap: 0;
}

.part2 .description-text {
  border-left-width: 2px;
  padding-left: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .part-content {
    flex-direction: column;
    gap: 5px;
  }
  
  .image-container, 
  .description-container,
  .part2 .image-container,
  .part2 .description-container {
    flex: 0 0 100%;
    width: 100%;
  }
  
  .description-text {
    font-size: 16px;
    border-left: none;
    border-top: 3px solid #5cbbff;
    border-radius: 0 0 5px 5px;
  }
  
  .section-part {
    padding: 15px;
  }
  
  .part-title {
    font-size: 24px;
    margin-bottom: 12px;
  }
}
</style> 