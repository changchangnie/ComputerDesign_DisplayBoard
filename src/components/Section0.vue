<template>
  <div class="section0">
    <div class="fullscreen-image">
      <img src="/images/opening/startImage.png" alt="科技创新关系图谱" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Section0'
}
</script>

<style scoped>
.section0 {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(10, 25, 50, 0.9);
  overflow: hidden;
}

.fullscreen-image {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.fullscreen-image img {
  max-width: 95%;
  max-height: 95%;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 0 30px rgba(92, 187, 255, 0.4);
}
</style> 