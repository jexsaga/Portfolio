<script setup>
import MainPage from './MainPage.vue'
import RobotProject from './RobotProject.vue'
import DonutProject from './DonutProject.vue'
import BouncingBallGame from './BouncingBallGame.vue'
import EarthQuakeMap from './EarthQuakeMap.vue'
import MichelinMan from './MichelinMan.vue'
import LightingAndShading from './LightingAndShading.vue'
import CurrentProjects from './CurrentProjects.vue'
import Cathedral from './Cathedral.vue'
import TriangleTriangles from './TriangleTriangles.vue'
import ClothAnimation from './ClothAnimation.vue'
import ColisionPlacticityElasticity from './ColisionPlacticityElasticity.vue'
import CompletedProjects from './CompletedProjects.vue'



const curProjectComponents = [
  RobotProject,
  DonutProject,
]

const doneProjectComponents = [
  ClothAnimation,
  ColisionPlacticityElasticity,
  Cathedral,
  TriangleTriangles,
  MichelinMan,
  EarthQuakeMap,
  BouncingBallGame,
  LightingAndShading,
]


function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
</script>

<template>
  <button @click="$router.push('/')" class="back-button">
      <img src="../assets/BackButton.svg" alt="Back Button" class="back-icon" width="20px" height="20px" color="#ebeff1"/>
  </button>
  <div style="margin: 0 10%">
    <MainPage />
    <CurrentProjects />
    <div v-for="(Component, index) in curProjectComponents" :key="index" class="project-tab">
      <component :is="Component" />
    </div>
    <CompletedProjects />
    <div v-for="(Component, index) in doneProjectComponents" :key="index" class="project-tab">
      <component :is="Component" />
    </div>
  </div>
  <!-- back to top -->
  <div class="back-to-top"  @click="scrollToTop">
      <a style="color: var(--light-white);">Back to Top</a>
  </div>

</template>