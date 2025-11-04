<template>
    <div class="left-image">
        <img src="../assets/BouncingBallGame.png" alt="bouncingballgame" width="100%" @click="openLink" class="clickable-image"/>
    </div>
    <div class="right-text">
        <p>
        3D physics-based game inspired by Donut County, built using TypeScript and GopherGfx.
        </p>
        <p>
        Given: Project setup with a 3D scene, camera, and rendering loop.
        </p>
        <p>
        Implemented: interactive gameplay where the player controls a growing hole that swallows objects, simplified physics simulation using spheres, and movement via keyboard.
        </p>
        <p>
        Focus: building an engaging, interactive 3D game while mastering core computer graphics techniques.
        </p>
    </div>
</template>


<script>
export default {
  methods: {
    openLink() {
      window.open('https://csci-4611-fall-2024.github.io/assignment-2-JessRobb/', '_blank');
    }
  }
}
</script>
