<template>
  <div class="forest-scene" @click="handleClick">
    <div class="scene-background" :style="{ backgroundImage: `url(${backgroundImage})` }"></div>
    <div class="scene-content">
      <h2>神秘森林</h2>
      <p class="scene-description">你在一片古老的森林中，树木高耸入云。阳光透过树叶洒下斑驳的光影。远处似乎有什么东西在闪闪发光...</p>
      <div class="clues">
        <div v-for="clue in clues" :key="clue.id" class="clue" :style="{ left: clue.x + '%', top: clue.y + '%' }"></div>
      </div>
      <div class="treasure" v-if="showTreasure" :style="{ left: treasurePosition.x + '%', top: treasurePosition.y + '%' }" @click.stop="discoverTreasure">
        <div class="treasure-chest">💎</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ForestScene',
  data() {
    return {
      backgroundImage: '/images/scenes/forest/forest.png',
      clues: [
        { id: 1, x: 20, y: 40 },
        { id: 2, x: 60, y: 30 },
        { id: 3, x: 75, y: 65 }
      ],
      showTreasure: false,
      treasurePosition: { x: 50, y: 50 },
      discoveredClues: 0
    }
  },
  methods: {
    handleClick(event) {
      // 计算点击位置相对于场景的百分比
      const rect = event.currentTarget.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      
      // 检查是否点击了线索
      this.clues.forEach(clue => {
        // 简单的碰撞检测 - 10x10像素的区域
        if (Math.abs(x - clue.x) < 5 && Math.abs(y - clue.y) < 5 && !clue.discovered) {
          clue.discovered = true;
          this.discoveredClues++;
          this.checkTreasureVisibility();
        }
      });
    },
    checkTreasureVisibility() {
      // 如果发现了所有线索，显示宝藏
      if (this.discoveredClues === this.clues.length) {
        setTimeout(() => {
          this.showTreasure = true;
        }, 1000);
      }
    },
    discoverTreasure() {
      this.$emit('treasureFound', {
        score: 150,
        scene: 'forest',
        timeBonus: 15
      });
    }
  }
}
</script>

<style scoped>
.forest-scene {
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

.forest-scene:hover .scene-background {
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
  color: #ffd700;
  text-align: center;
}

.scene-description {
  font-size: 1.2rem;
  max-width: 600px;
  margin: 0 auto 30px;
  text-align: center;
  line-height: 1.6;
}

.clues {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.clue {
  position: absolute;
  width: 20px;
  height: 20px;
  background: rgba(255, 215, 0, 0.7);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  animation: glow 2s infinite alternate;
}

.clue:hover {
  transform: translate(-50%, -50%) scale(1.5);
  background: rgba(255, 215, 0, 1);
}

.treasure {
  position: absolute;
  transform: translate(-50%, -50%);
  animation: bounce 2s infinite;
}

.treasure-chest {
  font-size: 60px;
}

@keyframes glow {
  from {
    box-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
  }
  to {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.9);
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translate(-50%, -50%) translateY(0);
  }
  40% {
    transform: translate(-50%, -50%) translateY(-20px);
  }
  60% {
    transform: translate(-50%, -50%) translateY(-10px);
  }
}
</style>