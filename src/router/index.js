import { createRouter, createWebHistory } from 'vue-router'
import GameView from '../views/GameView.vue'
import RankView from '../views/RankView.vue'
import UserView from '../views/UserView.vue'

const routes = [
  {
    path: '/',
    name: 'Game',
    component: GameView
  },
  {
    path: '/rank',
    name: 'Rank',
    component: RankView
  },
  {
    path: '/user',
    name: 'User',
    component: UserView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router