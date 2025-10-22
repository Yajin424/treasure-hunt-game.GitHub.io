<template>
  <div class="chamber-scene" @click="handleClick">
    <div class="scene-background" :style="{ backgroundImage: `url(${backgroundImage})` }"></div>
    <div class="scene-content">
      <h2>宝藏密室</h2>
      <p class="scene-description">你终于找到了传说中的宝藏密室！墙壁上镶嵌着宝石，中央有一个巨大的宝箱...</p>
      
      <!-- 墙壁上的宝石 -->
      <div class="wall-gems">
        <div v-for="gem in wallGems" :key="gem.id" class="wall-gem" 
             :style="{ left: gem.x + '%', top: gem.y + '%' }" 
             @click.stop="activateGem(gem)">
          {{ gem.icon }}
        </div>
      </div>
      
      <!-- 中央宝箱 -->
      <div class="main-treasure" @click.stop="openMainTreasure">
        <div class="treasure-box">
          {{ mainTreasureIcon }}
        </div>
        <div class="treasure-lock" v-if="!allGemsActivated">
          🔒
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChamberScene',
  data() {
    return {
      backgroundImage: '/images/scenes/宝藏密室.png',
      wallGems: [
        { id: 1, x: 20, y: 30, icon: '💎', activated: false },
        { id: 2, x: 80, y: 35, icon: '💎', activated: false },
        { id: 3, x: 25, y: 70, icon: '💎', activated: false },
        { id: 4, x: 75, y: 65, icon: '💎', activated: false }
      ],
      mainTreasureIcon: '📦',
      activatedGems: 0
    }
  },
  computed: {
    allGemsActivated() {
      return this.activatedGems === this.wallGems.length;
    }
  },
  methods: {
    handleClick(event) {
      // 基础点击交互
    },
    activateGem(gem) {
      if (!gem.activated) {
        gem.activated = true;
        this.activatedGems++;
        
        // 添加激活动画
        const gemEl = event.target;
        gemEl.style.animation = 'gemActivate 1s ease';
        setTimeout(() => {
          gemEl.style.animation = '';
        }, 1000);
      }
    },
    openMainTreasure() {
      if (this.allGemsActivated) {
        // 宝箱打开动画
        this.mainTreasureIcon = '💰';
        const treasureEl = this.$el.querySelector('.treasure-box');
        treasureEl.style.transform = 'scale(1.5) rotate(10deg)';
        
        setTimeout(() => {
          this.$emit('treasureFound', {
            score: 500,
            scene: 'chamber',
            timeBonus: 50,
            finalTreasure: true
          });
        }, 1500);
      } else {
        alert('宝箱被魔法锁住了！需要激活所有墙上的宝石才能打开。');
      }
    }
  }
}
</script>

<style scoped>
.chamber-scene {
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
  filter: brightness(0.5);
  transition: filter 0.3s ease;
}

.chamber-scene:hover .scene-background {
  filter: brightness(0.6);
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
  animation: titleGlow 2s infinite alternate;
}

.scene-description {
  font-size: 1.2rem;
  max-width: 600px;
  margin: 0 auto 30px;
  text-align: center;
  line-height: 1.6;
}

.wall-gems {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.wall-gem {
  position: absolute;
  transform: translate(-50%, -50%);
  font-size: 48px;
  cursor: pointer;
  animation: pulse 2s infinite alternate;
}

.wall-gem:hover {
  transform: translate(-50%, -50%) scale(1.3);
}

.main-treasure {
  position: absolute;
  bottom: 25%;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.treasure-box {
  font-size: 80px;
  animation: float 3s ease-in-out infinite;
}

.treasure-lock {
  position: absolute;
  top: -20px;
  right: -20px;
  font-size: 32px;
  animation: shake 1s infinite;
}

@keyframes titleGlow {
  from {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  }
  to {
    text-shadow: 0 0 20px rgba(255, 215, 0, 0.9);
  }
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    transform: translate(-50%, -50%) scale(1.2);
  }
}

@keyframes float {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-5px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(5px);
  }
}

@keyframes gemActivate {
  0% {
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.5);
    filter: brightness(1.5);
  }
  100% {
    transform: translate(-50%, -50%) scale(1.2);
  }
}
</style>