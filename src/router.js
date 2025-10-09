import EntryPage from './components/EntryPage.vue'
import ProfessionalPortfolio from './components/ProfessionalPortfolio.vue'
import FunPortfolio from './components/FunPortfolio.vue'
import { createRouter, createWebHistory } from 'vue-router'


const routes = [
  { path: '/', component: EntryPage },
  { path: '/professional', component: ProfessionalPortfolio },
  { path: '/fun', component: FunPortfolio },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router