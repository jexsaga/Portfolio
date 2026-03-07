<template>
  <div class="left-text">
    <p>
    OpenGL project simulating the rotation of the earth around the sun and the moon around the earth.
    </p>
    <p>
    Given: Starter code for opening a responsive window.
    </p>
    <p>
    Implemented: Created sphere meshes, added textures and the transformations to create the orbits. 
    </p>
    <p>
    Focus: Obtain a basic understanding of graphics concepts and learn OpenGL.
    </p>
  </div>
  <div ref="videoContainer" class="right-image" style="width: 95%;">
    <video
      ref="video"
      src="../assets/Earth_Moon_Orbit.mp4"
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
