<template>
  <div class="library-scene" @click="handleClick">
    <div class="scene-background" :style="{ backgroundImage: `url(${backgroundImage})` }"></div>
    <div class="scene-content">
      <h2>古老的图书馆</h2>
      <p class="scene-description">满是灰尘的书架上摆满了古老的书籍。空气中弥漫着纸张和墨水的味道。一本书似乎在微微发光...</p>
      
      <!-- 书架 -->
      <div class="bookshelves">
        <div v-for="shelf in bookshelves" :key="shelf.id" class="bookshelf" 
             :style="{ left: shelf.x + '%', top: shelf.y + '%', height: shelf.height + 'px' }">
          <div v-for="book in shelf.books" :key="book.id" class="book" 
               :class="{ 'highlighted': book.highlighted, 'discovered': book.discovered }" 
               @click.stop="examineBook(book, shelf, $event)">
            <span class="book-spine"></span>
          </div>
        </div>
      </div>
      
      <!-- 发光的神秘书籍 -->
      <div v-if="showMysteryBook" class="mystery-book" @click.stop="openMysteryBook">
        <div class="book-icon">📜</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LibraryScene',
  data() {
    return {
      backgroundImage: '/images/scenes/古老的图书馆.png',
      bookshelves: [
        {
          id: 1,
          x: 15,
          y: 30,
          height: 400,
          books: Array.from({ length: 12 }, (_, i) => ({
            id: `1-${i}`,
            highlighted: i === 5, // 随机选择一本作为线索
            discovered: false
          }))
        },
        {
          id: 2,
          x: 40,
          y: 40,
          height: 300,
          books: Array.from({ length: 8 }, (_, i) => ({
            id: `2-${i}`,
            highlighted: i === 2,
            discovered: false
          }))
        },
        {
          id: 3,
          x: 70,
          y: 35,
          height: 350,
          books: Array.from({ length: 10 }, (_, i) => ({
            id: `3-${i}`,
            highlighted: i === 7,
            discovered: false
          }))
        }
      ],
      showMysteryBook: false,
      discoveredClues: 0
    }
  },
  methods: {
    handleClick(event) {
      // 基础点击交互
    },
    
    examineBook(book, shelf, event) {
      if (book.highlighted && !book.discovered) {
        book.discovered = true;
        this.discoveredClues++;
        this.checkForMysteryBook();
        
        // 添加线索到父组件
        this.$emit('clueFound', {
          scene: 'library',
          clue: `从书架${shelf.id}找到的古老笔记`
        });
        
        // 添加一些视觉反馈
        const bookEl = event.currentTarget;
        bookEl.style.transform = 'scale(1.1) rotate(5deg)';
        setTimeout(() => {
          bookEl.style.transform = '';
        }, 500);
      }
    },
    
    checkForMysteryBook() {
      // 统计所有已发现的线索
      const totalClues = this.bookshelves.reduce((sum, shelf) => {
        return sum + shelf.books.filter(book => book.highlighted).length;
      }, 0);
      
      // 如果所有线索都已发现，显示神秘书籍
      if (this.discoveredClues === totalClues) {
        setTimeout(() => {
          this.showMysteryBook = true;
        }, 1000);
      }
    },
    
    openMysteryBook() {
      this.$emit('treasureFound', {
        score: 220,
        scene: 'library',
        timeBonus: 30
      });
    }
  }
}
</script>

<style scoped>
.library-scene {
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
  filter: brightness(0.6);
  transition: filter 0.3s ease;
}

.library-scene:hover .scene-background {
  filter: brightness(0.7);
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
  color: #d4af37;
  text-align: center;
  animation: fadeIn 1s ease-in-out;
}

.scene-description {
  font-size: 1.2rem;
  max-width: 600px;
  margin: 0 auto 30px;
  text-align: center;
  line-height: 1.6;
  animation: fadeIn 1.5s ease-in-out;
}

.bookshelves {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.bookshelf {
  position: absolute;
  width: 60px;
  background: rgba(139, 69, 19, 0.8);
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 10px 5px;
  pointer-events: auto;
}

.book {
  width: 100%;
  height: 15px;
  cursor: pointer;
  transition: transform 0.3s ease;
  position: relative;
}

.book-spine {
  display: block;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #6b4226, #8b5a2b);
  border-radius: 2px;
  transition: all 0.3s ease;
}

.book.highlighted .book-spine {
  background: linear-gradient(90deg, #ffd700, #ffed4e);
  animation: glow 2s infinite alternate;
}

.book.discovered .book-spine {
  background: linear-gradient(90deg, #7cfc00, #98fb98);
  animation: none;
}

.mystery-book {
  position: absolute;
  bottom: 30%;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
  animation: float 3s ease-in-out infinite, glow 2s infinite alternate;
}

.book-icon {
  font-size: 64px;
}

/* 动画定义 */
@keyframes glow {
  from {
    box-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
  }
  to {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.9);
  }
}

@keyframes float {
  0%, 20%, 50%, 80%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  40% {
    transform: translateX(-50%) translateY(-20px);
  }
  60% {
    transform: translateX(-50%) translateY(-10px);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>