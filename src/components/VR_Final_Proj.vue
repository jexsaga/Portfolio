<template>
  <div class="left-text">
    <p>
    VR project to develop a locomation technique for a race track.
    </p>
    <p>
    Given: Basic tutorials to follow and game layout.
    </p>
    <p>
    Implemented: Created locomation idea and implemented it using Unity and C++.
    </p>
    <p>
    Focus: Unity development and VR.
    </p>
  </div>
  <div ref="videoContainer" class="right-image">
    <video
      ref="video"
      src="../assets/VR_turn_sprint.mp4"
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
