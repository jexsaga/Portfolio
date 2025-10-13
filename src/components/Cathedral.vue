<template>
  <div ref="videoContainer">
    <video
      ref="video"
      src="../assets/Cathedral.mp4"
      width="100%"
      muted
      loop
    ></video>
  </div>
  <div class="right-text">
    <p>
    OpenGL project showcasing interactive first-person navigation within a 3D building model.
    </p>
    <p>
    Given: starter code for rendering the model and opening a responsive window.
    </p>
    <p>
    Implemented: initial viewing matrix setup, keyboard-controlled camera movement and rotation, perspective projection, dynamic window resizing, and quit functionality via 'r' and 'q' keys.
    </p>
    <p>
    Focus: mastering OpenGL rendering, camera control, and user interaction techniques.
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