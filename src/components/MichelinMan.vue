<template>
  <div ref="videoContainer" class="left-image">
    <video
      ref="video"
      src="../assets/MichelinManVideo.mp4"
      width="100%"
      muted
      loop
      class="scroll-video"
      @click="openLink"
    ></video>
  </div>
  <div class="right-text">
    <p>
    Animated character project using motion capture data from the Carnegie Mellon mocap database.
    </p>
    <p>
    Given: support code for reading and playing back mocap data formatted as text files.
    </p>
    <p>
    Implemented: hierarchical scene graph for character animation, transformation of primitive shapes into articulated figures, looping and overlaying motion clips, and runtime animation control.
    </p>
    <p>
    Focus: understanding skeletal animation, transformation hierarchies, and integrating mocap data into interactive graphics.
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
  },
  methods: {
    openLink() {
      window.open('https://csci-4611-fall-2024.github.io/assignment-4-JessRobb/', '_blank')
    }
  }
}
</script>

<style scoped>
.scroll-video {
  cursor: pointer;
  transition: opacity 0.3s ease;
}
</style>