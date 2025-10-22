<template>
  <div v-if="show" class="treasure-alert" @click="hide">
    <div class="alert-content">
      <div class="treasure-icon">💰</div>
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
      <div class="stats">
        <span>得分: +{{ score }}</span>
        <span>时间: -{{ timeBonus }}秒</span>
      </div>
      <button class="close-btn" @click.stop="hide">继续冒险</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TreasureAlert',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '发现宝藏！'
    },
    message: {
      type: String,
      default: '你找到了一个珍贵的宝藏！'
    },
    score: {
      type: Number,
      default: 100
    },
    timeBonus: {
      type: Number,
      default: 10
    }
  },
  methods: {
    hide() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.treasure-alert {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease;
}

.alert-content {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  color: #333;
  padding: 30px;
  border-radius: 15px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  animation: bounceIn 0.5s ease;
}

.treasure-icon {
  font-size: 64px;
  margin-bottom: 20px;
  animation: pulse 2s infinite;
}

h3 {
  font-size: 24px;
  margin-bottom: 10px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

p {
  font-size: 16px;
  margin-bottom: 20px;
}

.stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  font-weight: bold;
}

.close-btn {
  background: #333;
  color: #ffd700;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #555;
  transform: translateY(-2px);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes bounceIn {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>