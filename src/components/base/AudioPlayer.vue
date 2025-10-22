<template>
  <audio ref="audioPlayer" :src="audioSrc" loop :volume="volume" @ended="onEnded"></audio>
  <div v-if="showControls" class="audio-controls">
    <button @click="togglePlayPause" class="control-btn">
      {{ isPlaying ? '⏸️' : '▶️' }}
    </button>
    <input 
      type="range" 
      min="0" 
      max="1" 
      step="0.05" 
      :value="volume" 
      @input="changeVolume" 
      class="volume-slider"
    >
  </div>
</template>

<script>
export default {
  name: 'AudioPlayer',
  props: {
    audioSrc: {
      type: String,
      required: true
    },
    autoPlay: {
      type: Boolean,
      default: false
    },
    volume: {
      type: Number,
      default: 0.5,
      validator: (value) => value >= 0 && value <= 1
    },
    showControls: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isPlaying: false
    }
  },
  mounted() {
    if (this.autoPlay) {
      this.play()
    }
  },
  methods: {
    play() {
      this.$refs.audioPlayer.play().then(() => {
        this.isPlaying = true
      }).catch(err => {
        console.error('音频播放失败:', err)
      })
    },
    pause() {
      this.$refs.audioPlayer.pause()
      this.isPlaying = false
    },
    togglePlayPause() {
      if (this.isPlaying) {
        this.pause()
      } else {
        this.play()
      }
    },
    changeVolume(event) {
      this.$emit('volumeChange', parseFloat(event.target.value))
    },
    onEnded() {
      this.isPlaying = false
      this.$emit('ended')
    },
    stop() {
      this.pause()
      this.$refs.audioPlayer.currentTime = 0
    }
  },
  watch: {
    audioSrc(newSrc) {
      if (newSrc) {
        this.stop()
        if (this.autoPlay) {
          // 给DOM一点时间更新src
          setTimeout(() => {
            this.play()
          }, 100)
        }
      }
    }
  }
}
</script>

<style scoped>
.audio-controls {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  padding: 10px 20px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 1000;
}

.control-btn {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 5px;
}

.volume-slider {
  width: 100px;
  height: 6px;
  border-radius: 3px;
  background: #555;
  outline: none;
  -webkit-appearance: none;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #4CAF50;
  cursor: pointer;
}
</style>