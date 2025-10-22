<template>
  <div class="game-view">
    <div v-if="!isLoggedIn" class="login-container">
      <!-- 使用完整的UserLogin组件 -->
      <UserLogin @login="handleLogin" />
    </div>
    <div v-else-if="showPanorama" class="game-container">
      <!-- 全景图导航界面 -->
      <div class="panorama-wrapper">
        <div class="panorama-header">
          <div class="player-info">
            <h3>{{ currentUser.username }}</h3>
            <p>得分: {{ currentUser.score }} | 宝藏: {{ currentUser.treasures }}</p>
          </div>
          <div class="panorama-controls">
            <button @click="toggleAudio">
              {{ isAudioPlaying ? '🔊 静音' : '🔈 开启音效' }}
            </button>
            <button @click="showRankList">🏆 排行榜</button>
          </div>
        </div>
        <Panorama 
          :panoramaImage="'/images/panorama/panorama.png'"
          :hotspots="availableHotspots"
          @hotspotClick="handleHotspotClick"
        />
      </div>
    </div>
    <div v-else class="game-container">
      <div class="game-header">
        <div class="player-info">
          <h3>{{ currentUser.username }}</h3>
          <p>得分: {{ currentUser.score }} | 宝藏: {{ currentUser.treasures }}</p>
        </div>
        <div class="game-controls">
          <button @click="toggleAudio">
            {{ isAudioPlaying ? '🔊 静音' : '🔈 开启音效' }}
          </button>
          <button @click="showRankList">🏆 排行榜</button>
          <button @click="backToPanorama">🗺️ 全景地图</button>
          <div class="scene-navigation">
            <button v-for="scene in availableScenes" :key="scene"
                    :class="{ active: currentScene === scene, locked: !isSceneUnlocked(scene) }"
                    @click="changeScene(scene)">
              {{ getSceneName(scene) }}
              <span v-if="!isSceneUnlocked(scene)" class="lock-icon">🔒</span>
              <span v-else-if="isSceneCompleted(scene)" class="completed-icon">🏆</span>
            </button>
          </div>
        </div>
      </div>
      <div class="game-scene">
        <LibraryScene v-if="currentScene === 'library'" 
                      @treasureFound="handleTreasureFound" 
                      @clueFound="handleFoundClue"/>
        <ForestScene v-if="currentScene === 'forest'" @treasureFound="handleTreasureFound"/>
        <RiverScene v-if="currentScene === 'river'" @treasureFound="handleTreasureFound"/>
        <TempleScene v-if="currentScene === 'temple'" @treasureFound="handleTreasureFound"/>
        <ChamberScene v-if="currentScene === 'chamber'" @treasureFound="handleTreasureFound"/>
      </div>
      <!-- 简化版排行榜 -->
      <div v-if="showRank" class="simple-rank">
        <div class="rank-header">
          <h2>排行榜</h2>
          <button @click="showRank = false">关闭</button>
        </div>
        <div class="rank-list">
          <div v-for="(player, index) in rankedPlayers" :key="index" class="rank-item">
            <span class="rank-number">{{ index + 1 }}</span>
            <span class="rank-name">{{ player.username }}</span>
            <span class="rank-score">{{ player.score }}分</span>
          </div>
        </div>
      </div>
      <div class="clues-collection">
        <h4>收集的线索</h4>
        <div class="clues-list">
          <div v-for="(clue, index) in collectedClues" :key="index" class="clue-item">
            {{ getSceneName(clue.scene) }}:{{ clue.clue }}
          </div>
        </div>
      </div>
      <audio ref="audioPlayer" loop>
        <source src="/audio/game-background.mp3" type="audio/mpeg">
      </audio>
    </div>
  </div>
</template>

<script>
// 导入所有场景组件
import LibraryScene from '../components/game/LibraryScene.vue'
import ForestScene from '../components/game/ForestScene.vue'
import RiverScene from '../components/game/RiverScene.vue'
import ChamberScene from '../components/game/ChamberScene.vue'
import TempleScene from '../components/game/TempleScene.vue'
import Panorama from '../components/game/Panorama.vue'
import UserLogin from '../components/user/UserLogin.vue'

export default {
  name: 'GameView',
  components: {
    LibraryScene,
    ForestScene,
    RiverScene,
    ChamberScene,
    TempleScene,
    Panorama,
    UserLogin
  },
  data() {
    return {
      isLoggedIn: false,
      username: '',
      currentUser: {
        username: '',
        score: 0,
        treasures: 0,
        completedScenes: []
      },
      currentScene: 'library',
      showPanorama: true, // 登录后默认显示全景图
      collectedClues: [],
      showTreasureAlert: false,
      treasureAlertMessage: '',
      showRank: false,
      isAudioPlaying: false,
      players: [] // 存储所有玩家数据
    };
  },
  computed: {
    rankedPlayers() {
      // 确保当前用户在排行榜中
      const allPlayers = [...this.players];
      const currentUserIndex = allPlayers.findIndex(p => p.username === this.currentUser.username);
      
      if (currentUserIndex === -1) {
        allPlayers.push({...this.currentUser});
      } else {
        allPlayers[currentUserIndex] = {...this.currentUser};
      }
      
      // 按得分排序
      return allPlayers.sort((a, b) => b.score - a.score);
    },
    // 根据分数返回可用的场景
    availableScenes() {
      return ['library', 'forest', 'river', 'temple', 'chamber'];
    },
    // 根据用户分数和已完成场景生成可用的热点
    availableHotspots() {
      return [
        { id: 1, position: 350, label: '神秘森林', target: 'forest', unlocked: this.isSceneUnlocked('forest') },
        { id: 2, position: 750, label: '河流探险', target: 'river', unlocked: this.isSceneUnlocked('river') },
        { id: 3, position: 1200, label: '太阳神殿', target: 'temple', unlocked: this.isSceneUnlocked('temple') },
        { id: 4, position: 1700, label: '古老的图书馆', target: 'library', unlocked: true },
        { id: 5, position: 2100, label: '宝藏密室', target: 'chamber', unlocked: this.isSceneUnlocked('chamber') }
      ].filter(hotspot => hotspot.unlocked || hotspot.target === 'library');
    }
  },
  methods: {
    handleLogin(loginData) {
      this.isLoggedIn = true;
      this.currentUser.username = loginData.username;
      this.currentUser.isGuest = loginData.isGuest;
      // 初始化用户数据
      this.loadUserData();
      // 登录后直接进入全景图界面
      this.showPanorama = true;
    },
    
    loadUserData() {
      // 从localStorage加载用户数据
      const savedData = localStorage.getItem('treasureHuntData');
      if (savedData) {
        const data = JSON.parse(savedData);
        this.players = data.players || [];
        
        // 检查当前用户是否有保存的数据
        const savedUser = this.players.find(p => p.username === this.currentUser.username);
        if (savedUser) {
          this.currentUser = {...savedUser};
        } else {
          // 确保completedScenes存在
          this.currentUser.completedScenes = [];
        }
        
        // 加载其他数据
        this.collectedClues = data.collectedClues || [];
      } else {
        // 确保新用户有completedScenes属性
        this.currentUser.completedScenes = [];
      }
    },
    
    saveUserData() {
      // 保存数据到localStorage
      const data = {
        currentScene: this.currentScene,
        collectedClues: this.collectedClues,
        players: this.rankedPlayers
      };
      localStorage.setItem('treasureHuntData', JSON.stringify(data));
    },
    
    // 根据分数检查场景是否解锁
    isSceneUnlocked(scene) {
      // 临时测试模式：设置为true可以解锁所有场景
      const testMode = false;
      if (testMode) return true;
      
      const scoreRequirements = {
        library: 0,
        forest: 100,
        river: 300,
        temple: 500,
        chamber: 800
      };
      
      return this.currentUser.score >= scoreRequirements[scene];
    },
    
    // 检查场景是否已完成（找到宝藏）
    isSceneCompleted(scene) {
      return this.currentUser.completedScenes.includes(scene);
    },
    
    changeScene(sceneName) {
      // 检查用户是否可以切换到该场景
      if (this.isSceneUnlocked(sceneName)) {
        this.currentScene = sceneName;
        this.showPanorama = false;
        this.saveUserData();
      } else {
        const scoreRequirements = {
          library: 0,
          forest: 100,
          river: 300,
          temple: 500,
          chamber: 800
        };
        alert(`需要达到${scoreRequirements[sceneName]}分才能解锁${this.getSceneName(sceneName)}！`);
      }
    },
    
    handleFoundClue(clue) {
      // 检查是否已经收集了这个线索
      const isAlreadyCollected = this.collectedClues.some(c => 
        c.scene === clue.scene && c.clue === clue.clue
      );
      
      if (!isAlreadyCollected) {
        this.collectedClues.push(clue);
        this.currentUser.score += 50; // 每个线索50分
        this.saveUserData();
        
        // 显示线索发现提示
        const TreasureAlert = this.$options.components.TreasureAlert;
        if (TreasureAlert) {
          this.$alert(`获得线索: ${this.getSceneName(clue.scene)}: ${clue.clue}`, '发现线索', {
            confirmButtonText: '确定'
          });
        } else {
          alert(`获得线索: ${this.getSceneName(clue.scene)}: ${clue.clue}`);
        }
      }
    },
    
    toggleAudio() {
      if (this.isAudioPlaying) {
        if (this.$refs.audioPlayer) {
          this.$refs.audioPlayer.pause();
        }
      } else {
        if (this.$refs.audioPlayer) {
          this.$refs.audioPlayer.play();
        }
      }
      this.isAudioPlaying = !this.isAudioPlaying;
    },
    
    showRankList() {
      this.showRank = true;
    },
    
    handleTreasureFound(treasureData) {
      // 更新用户分数和宝藏数量
      this.currentUser.score += treasureData.score;
      this.currentUser.treasures += 1;
      
      // 标记场景为已完成
      if (!this.currentUser.completedScenes.includes(treasureData.scene)) {
        this.currentUser.completedScenes.push(treasureData.scene);
      }
      
      // 显示提示信息
      this.treasureAlertMessage = `恭喜你在${this.getSceneName(treasureData.scene)}找到宝藏，获得${treasureData.score}分！`;
      
      // 保存数据
      this.saveUserData();
      
      // 检查是否解锁了新场景
      const newlyUnlocked = this.checkForNewUnlockedScenes();
      if (newlyUnlocked.length > 0) {
        const unlockedNames = newlyUnlocked.map(scene => this.getSceneName(scene)).join('、');
        alert(`${this.treasureAlertMessage}\n🎉 恭喜解锁新场景: ${unlockedNames}`);
      } else {
        alert(this.treasureAlertMessage);
      }
    },
    
    // 检查是否有新解锁的场景
    checkForNewUnlockedScenes() {
      const newlyUnlocked = [];
      const allScenes = ['library', 'forest', 'river', 'temple', 'chamber'];
      
      // 遍历所有场景，找到刚解锁的场景
      for (const scene of allScenes) {
        if (scene !== 'library' && this.isSceneUnlocked(scene)) {
          // 检查该场景是否是在这次宝藏发现后才解锁的
          // 通过检查该场景是否在已完成场景中，或者用户分数是否刚刚达到要求
          const wasJustUnlocked = !this.currentUser.completedScenes.includes(scene);
          if (wasJustUnlocked) {
            newlyUnlocked.push(scene);
          }
        }
      }
      
      return newlyUnlocked;
    },
    
    getSceneName(scene) {
      const sceneNames = {
        library: '古老的图书馆',
        forest: '神秘森林',
        river: '河流探险',
        temple: '太阳神殿',
        chamber: '宝藏密室'
      };
      return sceneNames[scene || this.currentScene] || (scene || this.currentScene);
    },
    
    // 全景图热点点击处理
    handleHotspotClick(hotspot) {
      if (hotspot.unlocked || hotspot.target === 'library') {
        this.changeScene(hotspot.target);
      } else {
        const scoreRequirements = {
          library: 0,
          forest: 100,
          river: 300,
          temple: 500,
          chamber: 800
        };
        alert(`需要达到${scoreRequirements[hotspot.target]}分才能解锁${hotspot.label}！`);
      }
    },
    
    // 返回全景图界面
    backToPanorama() {
      this.showPanorama = true;
    },
    
    switchToNextScene() {
      const scenes = ['library', 'forest', 'river', 'temple', 'chamber'];
      const currentIndex = scenes.indexOf(this.currentScene);
      
      // 查找下一个已解锁的场景
      for (let i = 1; i < scenes.length; i++) {
        const nextIndex = (currentIndex + i) % scenes.length;
        if (this.isSceneUnlocked(scenes[nextIndex])) {
          this.changeScene(scenes[nextIndex]);
          return;
        }
      }
      
      // 如果没有找到下一个已解锁的场景，保持当前场景
    }
  },
  beforeUnmount() {
    // 组件卸载前保存数据
    this.saveUserData();
  }
}
</script>

<style scoped>
.game-view {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.panorama-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.panorama-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  z-index: 100;
}

.panorama-controls {
  display: flex;
  gap: 10px;
}

.panorama-controls button {
  padding: 8px 16px;
  font-size: 14px;
  border: none;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.panorama-controls button:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.lock-icon {
  margin-left: 5px;
  opacity: 0.5;
}

.completed-icon {
  margin-left: 5px;
  color: #ffd700;
}

/* 其他样式保持不变 */
</style>