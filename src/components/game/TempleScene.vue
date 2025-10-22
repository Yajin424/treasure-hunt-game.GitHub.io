<template>
  <div class="temple-scene" @click="handleClick">
    <div class="scene-background" :style="{ backgroundImage: `url(${backgroundImage})` }"></div>
    <div class="scene-content">
      <h2>太阳神殿</h2>
      <p class="scene-description">古老的太阳神殿在阳光下闪耀着金色的光芒。传说这里藏着失落的宝藏，但机关重重...</p>
      
      <!-- 神殿大门 -->
      <div class="temple-gate" @click.stop="interactWithGate">
        <div class="gate-symbol">{{ gateSymbol }}</div>
        <div class="gate-locks">
          <div v-for="(lock, index) in locks" :key="index" class="lock" :class="{ 'unlocked': lock.unlocked }">
            <span class="lock-icon">{{ lock.icon }}</span>
          </div>
        </div>
      </div>
      
      <!-- 散落的宝石 -->
      <div class="gems">
        <div v-for="gem in gems" :key="gem.id" class="gem" 
             :style="{ left: gem.x + '%', top: gem.y + '%' }" 
             @click.stop="collectGem(gem)">
          {{ gem.icon }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TempleScene',
  data() {
    return {
      backgroundImage: '/images/scenes/太阳神殿.png',
      gateSymbol: '☀️',
      locks: [
        { icon: '🔒', unlocked: false },
        { icon: '🔒', unlocked: false },
        { icon: '🔒', unlocked: false }
      ],
      gems: [
        { id: 1, x: 25, y: 60, icon: '💎', collected: false },
        { id: 2, x: 75, y: 55, icon: '💎', collected: false },
        { id: 3, x: 50, y: 30, icon: '💎', collected: false }
      ],
      collectedGems: 0
    }
  },
  methods: {
    handleClick(event) {
      // 基础点击交互
    },
    collectGem(gem) {
      if (!gem.collected) {
        gem.collected = true;
        this.collectedGems++;
        this.updateLocks();
      }
    },
    updateLocks() {
      // 根据收集的宝石数量解锁门锁
      for (let i = 0; i < this.collectedGems && i < this.locks.length; i++) {
        this.locks[i].unlocked = true;
        this.locks[i].icon = '🔓';
      }
    },
    interactWithGate() {
      // 检查是否所有锁都已打开
      const allUnlocked = this.locks.every(lock => lock.unlocked);
      
      if (allUnlocked) {
        this.$emit('treasureFound', {
          score: 200,
          scene: 'temple',
          timeBonus: 25
        });
      } else {
        // 可以添加提示信息
        alert('大门仍然锁着，需要找到更多的宝石！');
      }
    }
  }
}
</script>

<style scoped>
.temple-scene {
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

.temple-scene:hover .scene-background {
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
  color: #ffcc00;
  text-align: center;
}

.scene-description {
  font-size: 1.2rem;
  max-width: 600px;
  margin: 0 auto 30px;
  text-align: center;
  line-height: 1.6;
}

.temple-gate {
  position: absolute;
  bottom: 20%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  animation: glow 3s ease-in-out infinite alternate;
}

.gate-symbol {
  font-size: 64px;
  margin-bottom: 20px;
}

.gate-locks {
  display: flex;
  gap: 30px;
}

.lock {
  font-size: 48px;
  transition: transform 0.3s ease;
}

.lock:hover {
  transform: scale(1.2);
}

.gems {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.gem {
  position: absolute;
  transform: translate(-50%, -50%);
  font-size: 48px;
  cursor: pointer;
  animation: rotate 4s linear infinite;
}

.gem:hover {
  transform: translate(-50%, -50%) scale(1.4);
}

@keyframes glow {
  from {
    box-shadow: 0 0 10px rgba(255, 204, 0, 0.3);
  }
  to {
    box-shadow: 0 0 30px rgba(255, 204, 0, 0.8);
  }
}

@keyframes rotate {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
</style>