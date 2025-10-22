<template>
  <div class="rank-view">
    <RankList :players="players" :currentUsername="currentUsername" @back="goToGame" />
  </div>
</template>

<script>
import RankList from '../components/user/RankList.vue'

export default {
  name: 'RankView',
  components: {
    RankList
  },
  data() {
    return {
      players: [],
      currentUsername: ''
    }
  },
  mounted() {
    this.loadRankData();
  },
  methods: {
    loadRankData() {
      // 从localStorage加载排行榜数据
      const savedData = localStorage.getItem('treasureHuntData');
      if (savedData) {
        const data = JSON.parse(savedData);
        this.players = data.players || [];
        
        // 确保数据按得分排序
        this.players.sort((a, b) => b.score - a.score);
      }
    },
    goToGame() {
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
.rank-view {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>