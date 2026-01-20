import EntryPage from './components/EntryPage.vue'
import ProfessionalPortfolio from './components/ProfessionalPortfolio.vue'
import FunPortfolio from './components/FunPortfolio.vue'
import ResumeScreen from './components/ResumeScreen.vue'
import { createRouter, createWebHistory } from 'vue-router'


const routes = [
  { path: '/', component: EntryPage },
  { path: '/Portfolio', component: ProfessionalPortfolio },
  { path: '/fun', component: FunPortfolio },
  { path: '/Resume', component: ResumeScreen },
]

// Use Vite's BASE_URL so the router works when the app is served from a subpath
// (e.g. GitHub Pages at https://<user>.github.io/Portfolio/)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router