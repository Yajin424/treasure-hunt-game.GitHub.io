<template>
  <div class="login-container">
    <div class="login-form">
      <h2>寻宝游戏</h2>
      <p class="login-subtitle">请输入您的名字开始冒险</p>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <input 
            type="text" 
            v-model="username" 
            placeholder="请输入您的名字" 
            class="form-input"
            required
            minlength="2"
          >
        </div>
        
        <button type="submit" class="login-btn" :disabled="!username.trim()">
          开始冒险
        </button>
      </form>
      
      <div class="guest-option">
        <button @click="loginAsGuest" class="guest-btn">
          以游客身份开始
        </button>
      </div>
      
      <div class="game-info">
        <p>🏆 寻找隐藏的宝藏</p>
        <p>🗺️ 探索神秘场景</p>
        <p>⏱️ 挑战最快速度</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserLogin',
  data() {
    return {
      username: ''
    }
  },
  methods: {
    handleLogin() {
      if (this.username.trim()) {
        this.$emit('login', {
          username: this.username.trim(),
          isGuest: false,
          timestamp: new Date().getTime()
        });
      }
    },
    loginAsGuest() {
      const guestName = '游客' + Math.floor(Math.random() * 10000);
      this.$emit('login', {
        username: guestName,
        isGuest: true,
        timestamp: new Date().getTime()
      });
    }
  }
}
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
}

.login-form {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  text-align: center;
  max-width: 400px;
  width: 90%;
  animation: fadeInUp 0.6s ease;
}

.login-form h2 {
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.login-subtitle {
  color: #7f8c8d;
  margin-bottom: 30px;
  font-size: 1.1rem;
}

.form-group {
  margin-bottom: 25px;
}

.form-input {
  width: 100%;
  padding: 12px 20px;
  border: 2px solid #bdc3c7;
  border-radius: 30px;
  font-size: 16px;
  transition: all 0.3s ease;
  outline: none;
}

.form-input:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.login-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
}

.login-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.guest-option {
  margin: 20px 0;
}

.guest-btn {
  background: none;
  border: 2px solid #95a5a6;
  color: #7f8c8d;
  padding: 8px 20px;
  border-radius: 30px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.guest-btn:hover {
  background: #95a5a6;
  color: white;
}

.game-info {
  margin-top: 30px;
  display: flex;
  justify-content: space-around;
}

.game-info p {
  color: #7f8c8d;
  font-size: 14px;
  text-align: center;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>