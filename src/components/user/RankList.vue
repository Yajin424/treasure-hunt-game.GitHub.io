<template>
  <div class="rank-container">
    <div class="rank-header">
      <h2>🏆 寻宝排行榜</h2>
      <button @click="backToGame" class="back-btn">返回游戏</button>
    </div>
    
    <div class="rank-list">
      <!-- 第一名 -->
      <div class="rank-item top-rank first-place">
        <div class="rank-number">🥇</div>
        <div class="rank-info">
          <div class="username">{{ topPlayers.first?.username || '-' }}</div>
          <div class="score-info">
            <span class="score">{{ topPlayers.first?.score || 0 }}</span>
            <span class="time">{{ formatTime(topPlayers.first?.time || 0) }}</span>
          </div>
        </div>
      </div>
      
      <!-- 第二名 -->
      <div class="rank-item top-rank second-place">
        <div class="rank-number">🥈</div>
        <div class="rank-info">
          <div class="username">{{ topPlayers.second?.username || '-' }}</div>
          <div class="score-info">
            <span class="score">{{ topPlayers.second?.score || 0 }}</span>
            <span class="time">{{ formatTime(topPlayers.second?.time || 0) }}</span>
          </div>
        </div>
      </div>
      
      <!-- 第三名 -->
      <div class="rank-item top-rank third-place">
        <div class="rank-number">🥉</div>
        <div class="rank-info">
          <div class="username">{{ topPlayers.third?.username || '-' }}</div>
          <div class="score-info">
            <span class="score">{{ topPlayers.third?.score || 0 }}</span>
            <span class="time">{{ formatTime(topPlayers.third?.time || 0) }}</span>
          </div>
        </div>
      </div>
      
      <!-- 分隔线 -->
      <div class="rank-separator">其他玩家</div>
      
      <!-- 其他排名 -->
      <div 
        v-for="(player, index) in otherPlayers" 
        :key="index" 
        class="rank-item"
      >
        <div class="rank-number">{{ index + 4 }}</div>
        <div class="rank-info">
          <div class="username">{{ player.username }}</div>
          <div class="score-info">
            <span class="score">{{ player.score }}</span>
            <span class="time">{{ formatTime(player.time) }}</span>
          </div>
        </div>
      </div>
      
      <!-- 无记录提示 -->
      <div v-if="otherPlayers.length === 0" class="no-records">
        暂无其他记录
      </div>
    </div>
    
    <!-- 当前用户排名信息 -->
    <div v-if="currentUserRank" class="current-user-rank">
      <p>您的排名: #{{ currentUserRank.rank }}</p>
      <p>得分: {{ currentUserRank.score }}</p>
      <p>用时: {{ formatTime(currentUserRank.time) }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RankList',
  props: {
    currentUser: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      rankData: []
    };
  },
  computed: {
    // 排序玩家列表（按得分降序，同分按时间升序）
    sortedPlayers() {
      return [...this.rankData].sort((a, b) => {
        if (a.score !== b.score) {
          return b.score - a.score;
        }
        return a.time - b.time;
      });
    },
    // 前三名玩家数据
    topPlayers() {
      return {
        first: this.sortedPlayers[0] || null,
        second: this.sortedPlayers[1] || null,
        third: this.sortedPlayers[2] || null
      };
    },
    // 第四名及以后的玩家数据
    otherPlayers() {
      return this.sortedPlayers.slice(3);
    },
    // 当前用户排名信息
    currentUserRank() {
      if (!this.currentUser) return null;
      
      const rankIndex = this.sortedPlayers.findIndex(
        player => player.username === this.currentUser.username 
                && player.timestamp === this.currentUser.timestamp
      );
      
      if (rankIndex > -1) {
        const userData = this.sortedPlayers[rankIndex];
        return {
          rank: rankIndex + 1,
          score: userData.score,
          time: userData.time
        };
      }
      return null;
    }
  },
  mounted() {
    this.loadRankData();
  },
  methods: {
    // 加载排名数据
    loadRankData() {
      const savedData = localStorage.getItem('treasureHuntRanks');
      if (savedData) {
        this.rankData = JSON.parse(savedData);
      } else {
        // 模拟初始数据
        this.rankData = [
          { 
            username: '寻宝大师', 
            score: 1500, 
            time: 300, 
            timestamp: Date.now() - 86400000 
          },
          { 
            username: '冒险家小明', 
            score: 1200, 
            time: 350, 
            timestamp: Date.now() - 432000 
          }
        ];
      }
    },
    // 格式化时间（补充原代码缺失的方法）
    formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },
    // 返回游戏（补充原代码缺失的方法）
    backToGame() {
      this.$router.push('/game'); // 假设游戏主页面路由为/game
    }
  }
};
</script>