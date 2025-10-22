<template>
  <div class="user-view">
    <div class="user-info">
      <h2>👤 个人信息</h2>
      <div v-if="currentUser" class="user-details">
        <p>用户名: {{ currentUser.username }}</p>
        <p>总分: {{ currentUser.score }}</p>
        <p>找到的宝藏: {{ currentUser.treasures }}</p>
        <p>收集的线索: {{ collectedClues.length }}</p>
      </div>
      <div v-else>
        <p>请先登录游戏</p>
      </div>
      <button class="back-button" @click="goToGame">返回游戏</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserView',
  data() {
    return {
      currentUser: null,
      collectedClues: []
    }
  },
  mounted() {
    this.loadUserData();
  },
  methods: {
    loadUserData() {
      // 从localStorage加载用户数据
      const savedData = localStorage.getItem('treasureHuntData');
      if (savedData) {
        const data = JSON.parse(savedData);
        
        // 假设我们存储了当前登录的用户名
        const currentUsername = localStorage.getItem('currentUsername');
        if (currentUsername && data.players) {
          const user = data.players.find(p => p.username === currentUsername);
          if (user) {
            this.currentUser = user;
          }
        }
        
        this.collectedClues = data.collectedClues || [];
      }
    },
    goToGame() {
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
.user-view {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.user-info {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 40px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  text-align: center;
}

.user-info h2 {
  font-size: 32px;
  margin-bottom: 30px;
  color: #ffd700;
}

.user-details {
  margin-bottom: 30px;
}

.user-details p {
  font-size: 18px;
  margin-bottom: 15px;
  color: #ffffff;
}

.back-button {
  padding: 12px 24px;
  font-size: 16px;
  border: none;
  border-radius: 25px;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}
</style>