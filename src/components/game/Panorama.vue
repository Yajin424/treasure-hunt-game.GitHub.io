<template>
  <div class="panorama-container" ref="panoramaContainer" @mousedown="startDrag" @mouseup="endDrag" @mousemove="onDrag" @mouseleave="endDrag">
    <div class="panorama" :style="{ transform: `translateX(${position.x}px)` }">
      <img 
        :src="panoramaImage" 
        alt="全景图" 
        class="panorama-img" 
        @click="onPanoramaClick" 
        @mousedown.stop="startDrag"
      >
      <!-- 渲染热点 -->
      <div 
        v-for="hotspot in hotspots" 
        :key="hotspot.id" 
        class="hotspot" 
        :class="{ 'unlocked': hotspot.unlocked || hotspot.target === 'library', 'locked': !(hotspot.unlocked || hotspot.target === 'library') }"
        :style="{ left: `${hotspot.position}px` }"
        @click.stop="handleHotspotClick(hotspot)"
      >
        <div class="hotspot-icon">{{ hotspot.unlocked || hotspot.target === 'library' ? '📍' : '🔒' }}</div>
        <div class="hotspot-label">{{ hotspot.label }}</div>
      </div>
    </div>
    <!-- 拖动提示 -->
    <div v-if="showDragHint" class="drag-hint">
      <p>按住鼠标拖动查看全景</p>
      <p>点击📍图标进入场景</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Panorama',
  props: {
    panoramaImage: {
      type: String,
      required: true
    },
    hotspots: {
      type: Array,
      default: () => []
    },
    hotspotClickRadius: {
      type: Number,
      default: 100
    }
  },
  data() {
    return {
      position: { x: 0 },
      isDragging: false,
      startX: 0,
      startPosition: { x: 0 },
      maxWidth: 0,
      showDragHint: true
    }
  },
  mounted() {
    // 确保计算最大宽度时图片已加载
    const img = this.$refs.panoramaContainer?.querySelector('.panorama-img');
    if (img) {
      if (img.complete) {
        this.calculateMaxWidth();
      } else {
        img.onload = () => {
          this.calculateMaxWidth();
        };
      }
    }
    
    window.addEventListener('resize', this.calculateMaxWidth);
    
    // 5秒后隐藏拖动提示
    setTimeout(() => {
      this.showDragHint = false;
    }, 5000);
    
    // 初始化时自动滚动到图书馆位置
    setTimeout(() => {
      const libraryHotspot = this.hotspots.find(h => h.target === 'library');
      if (libraryHotspot) {
        this.scrollToHotspot(libraryHotspot.id);
      }
    }, 500);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.calculateMaxWidth);
  },
  methods: {
    calculateMaxWidth() {
      const containerWidth = this.$refs.panoramaContainer?.clientWidth || 0;
      const img = this.$refs.panoramaContainer?.querySelector('.panorama-img');
      const imageWidth = img ? img.naturalWidth : 0;
      this.maxWidth = Math.max(0, imageWidth - containerWidth);
    },
    startDrag(event) {
      this.isDragging = true;
      this.startX = event.clientX;
      this.startPosition.x = this.position.x;
      // 确保设置了正确的鼠标样式
      document.body.style.cursor = 'grabbing';
      if (this.$refs.panoramaContainer) {
        this.$refs.panoramaContainer.style.cursor = 'grabbing';
      }
    },
    endDrag() {
      this.isDragging = false;
      document.body.style.cursor = 'default';
      if (this.$refs.panoramaContainer) {
        this.$refs.panoramaContainer.style.cursor = 'grab';
      }
    },
    onDrag(event) {
      if (!this.isDragging) return;
      
      const deltaX = event.clientX - this.startX;
      let newX = this.startPosition.x + deltaX;
      
      // 限制拖动范围
      newX = Math.max(-this.maxWidth, Math.min(0, newX));
      
      this.position.x = newX;
    },
    handleHotspotClick(hotspot) {
      // 通知父组件热点被点击
      this.$emit('hotspotClick', hotspot);
    },
    scrollToHotspot(hotspotId) {
      const hotspot = this.hotspots.find(h => h.id === hotspotId);
      if (!hotspot || !this.$refs.panoramaContainer) return;
      
      const containerWidth = this.$refs.panoramaContainer.clientWidth;
      const img = this.$refs.panoramaContainer.querySelector('.panorama-img');
      const imageWidth = img ? img.naturalWidth : 0;
      
      // 计算热点中心位置相对于容器的偏移
      let targetPosition = -hotspot.position + (containerWidth / 2);
      // 限制在有效范围内
      targetPosition = Math.max(-this.maxWidth, Math.min(0, targetPosition));
      
      // 平滑滚动动画
      this.smoothScrollTo(targetPosition);
    },
    smoothScrollTo(targetX) {
      const duration = 500; // 动画持续时间
      const startX = this.position.x;
      const distance = targetX - startX;
      const startTime = performance.now();
      
      const animateScroll = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // 使用缓动函数使动画更自然
        const easeOutQuad = progress * (2 - progress);
        
        this.position.x = startX + distance * easeOutQuad;
        
        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };
      
      requestAnimationFrame(animateScroll);
    },
    onPanoramaClick(event) {
      // 只有在非拖动状态下才响应点击
      if (this.isDragging) return;
      
      // 获取点击位置相对于图片的水平坐标
      const img = this.$refs.panoramaContainer?.querySelector('.panorama-img');
      if (!img) return;
      
      // 计算点击位置在图片上的实际坐标（考虑当前的平移位置）
      const rect = img.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const actualX = clickX - this.position.x;
      
      // 查找点击位置附近的热点
      const clickedHotspot = this.hotspots.find(hotspot => {
        // 检查热点是否在点击范围内
        const distance = Math.abs(actualX - hotspot.position);
        return distance <= this.hotspotClickRadius && 
               (hotspot.unlocked || hotspot.target === 'library');
      });
      
      if (clickedHotspot) {
        this.handleHotspotClick(clickedHotspot);
      }
    }
  }
}
</script>

<style scoped>
.panorama-container {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  cursor: grab;
  user-select: none; /* 防止拖动时选中文字 */
}

.panorama {
  position: relative;
  height: 100%;
  transition: transform 0s; /* 拖动时无过渡动画 */
}

.panorama-img {
  height: 100%;
  display: block;
  cursor: grab;
  user-select: none; /* 防止拖动时选中图片 */
  pointer-events: auto; /* 确保图片可以接收事件 */
}

.hotspot {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.hotspot.unlocked:hover {
  transform: translateY(-50%) scale(1.1);
}

.hotspot-icon {
  font-size: 32px;
  margin-bottom: 5px;
  transition: transform 0.3s ease;
}

.hotspot:hover .hotspot-icon {
  transform: scale(1.2);
}

.hotspot-label {
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 14px;
  white-space: nowrap;
}

.hotspot.locked {
  opacity: 0.5;
  cursor: not-allowed;
}

.drag-hint {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 15px 25px;
  border-radius: 25px;
  text-align: center;
  backdrop-filter: blur(5px);
  animation: fadeInOut 5s ease-in-out;
}

.drag-hint p {
  margin: 5px 0;
  font-size: 14px;
}

@keyframes fadeInOut {
  0% { opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { opacity: 0; }
}
</style>