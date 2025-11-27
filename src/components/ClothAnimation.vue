<template>
  <div ref="videoContainer" class="left-image">
    <video
      ref="video"
      src="../assets/ClothProject.mp4"
      width="100%"
      muted
      loop
    ></video>
  </div>
  <div class="right-text">
    <p>
    OpenGL project simulating cloth animation using mass-spring systems .
    </p>
    <p>
    Given: starter code for rendering the model and opening a responsive window.
    </p>
    <p>
    Implemented: The network of springs able to model the behavior of a cloth. Collision detection and response with respect to the ground and the sphere. Action of the wind or wind force.
    </p>
    <p>
    Focus: understanding physical simulation of cloth, numerical integration, and collision handling techniques. 
    </p>
  </div>
</template>

<script>
export default {
  mounted() {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = this.$refs.video
        if (entry.isIntersecting) {
          video.play()
        } else {
          video.pause()
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