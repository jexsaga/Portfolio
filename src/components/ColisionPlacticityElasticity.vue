<template>
  
  <div class="left-text">
    <p>
    Another OpenGL project to explore collision detection and response, plasticity, and elasticity in 3D models.
    </p>
    <p>
    Given: starter code for rendering the model and opening a responsive window.
    </p>
    <p>
    Implemented: rigid transformations for 3D models, collision detection between complex shapes, and response behaviors including plastic deformation and elastic restitution.
    </p>
    <p>
    Focus: understanding collision detection algorithms, physical response modeling, and enhancing realism in interactive graphics.
    </p>
  </div>
  <div ref="videoContainer" class="right-image" style="display: flex; flex-direction: column ;gap: 10px; justify-content: center;">
    <video
    ref="video1"
    src="../assets/BunnyPlasticity.mp4"
    width="100%"
    muted
    loop
    ></video>
    <video
    ref="video2"
    src="../assets/CowCubeColisionElasticity.mp4"
    width="100%"
    muted
    loop
    ></video>
  </div>
</template>

<script>
export default {
  mounted() {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const video1 = this.$refs.video1
        const video2 = this.$refs.video2
        if (entry.isIntersecting) {
            video1.play()
            video2.play()
        } else {
            video1.pause()
            video2.pause()
        }
      },
      {
        threshold: 0.5
      }
    )

    observer.observe(this.$refs.videoContainer)
  }
}
</script>