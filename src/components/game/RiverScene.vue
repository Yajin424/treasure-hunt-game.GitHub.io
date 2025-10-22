<template>
  <div class="river-scene" @click="handleClick">
    <div class="scene-background" :style="{ backgroundImage: `url(${backgroundImage})` }"></div>
    <div class="scene-content">
      <h2>神秘河流</h2>
      <p class="scene-description">一条宽阔的河流横亘在你面前，河水波光粼粼。对岸似乎有什么秘密在等待着你...</p>
      <div class="items">
        <div v-for="item in items" :key="item.id" class="item" 
             :style="{ left: item.x + '%', top: item.y + '%' }" 
             @click.stop="examineItem(item)">
          {{ item.icon }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RiverScene',
  data() {
    return {
      backgroundImage: '/images/scenes/river/river.png',
      items: [
        { id: 1, x: 30, y: 50, icon: '⛵', type: 'boat', discovered: false },
        { id: 2, x: 70, y: 60, icon: '🔑', type: 'key', discovered: false },
        { id: 3, x: 45, y: 30, icon: '🗺️', type: 'map', discovered: false }
      ],
      collectedItems: []
    }
  },
  methods: {
    handleClick(event) {
      // 这里可以添加一些随机事件
    },
    examineItem(item) {
      if (!item.discovered) {
        item.discovered = true;
        this.collectedItems.push(item.type);
        this.checkWinCondition();
      }
    },
    checkWinCondition() {
      // 检查是否收集了所有必要物品
      const requiredItems = ['boat', 'key'];
      const hasAllItems = requiredItems.every(item => 
        this.collectedItems.includes(item)
      );
      
      if (hasAllItems) {
        setTimeout(() => {
          this.$emit('treasureFound', {
            score: 180,
            scene: 'river',
            timeBonus: 20
          });
        }, 1000);
      }
    }
  }
}
</script>

<style scoped>
.river-scene {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.scene-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  filter: brightness(0.7);
  transition: filter 0.3s ease;
}

.river-scene:hover .scene-background {
  filter: brightness(0.8);
}

.scene-content {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 40px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

.scene-content h2 {
  font-size: 3rem;
  margin-bottom: 20px;
  color: #4169e1;
  text-align: center;
}

.scene-description {
  font-size: 1.2rem;
  max-width: 600px;
  margin: 0 auto 30px;
  text-align: center;
  line-height: 1.6;
}

.items {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.item {
  position: absolute;
  transform: translate(-50%, -50%);
  font-size: 48px;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: float 3s ease-in-out infinite;
}

.item:hover {
  transform: translate(-50%, -50%) scale(1.3);
}

@keyframes float {
  0% {
    transform: translate(-50%, -50%) translateY(0px);
  }
  50% {
    transform: translate(-50%, -50%) translateY(-15px);
  }
  100% {
    transform: translate(-50%, -50%) translateY(0px);
  }
}
</style>