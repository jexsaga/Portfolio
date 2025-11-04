<template>
  <div class="left-text">
    <p>
    OpenGL project enabling interactive manipulation of a 2D model around its centroid.
    </p>
    <p>
    Implemented: scaling along intrinsic axes using arrow keys, rotation via mouse drag, and translation using mouse with control key.
    </p>
    <p>
    Added safeguards to prevent failure states, and included reset ('r') and quit ('q') functionality.
    </p>
    <p>
    Focus: mastering transformation matrices, user input handling, and robust interactive design.
    </p>
  </div>
  <div ref="videoContainer" class="right-image">
    <video
      ref="video"
      src="../assets/TriangleTriangles.mp4"
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
