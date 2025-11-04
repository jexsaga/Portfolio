<template>
    <div class="left-text">
        <p>
        Real-time lighting project using GLSL shaders to explore both photorealistic and stylized rendering techniques.
        </p>
        <p>
        Given: support code for loading 3D models, rotating them with the mouse, and switching between built-in shader modes.
        </p>
        <p>
        Implemented: custom Gouraud and Phong shaders for vertex and pixel lighting, cartoon shading with silhouette outlines, and normal mapping for detailed surface textures.
        </p>
        <p>
        Focus: mastering shader programming, per-pixel lighting, geometry manipulation, and artistic rendering effects in real-time graphics.
        </p>
    </div>
    <div class="right-image">
        <img src="../assets/LightingAndShading.png" alt="lightingandshading" width="100%" @click="openLink" class="clickable-image"/>
    </div>
</template>


<script>
export default {
  methods: {
    openLink() {
      window.open('https://csci-4611-fall-2024.github.io/assignment-5-JessRobb/', '_blank');
    }
  }
}
</script>
