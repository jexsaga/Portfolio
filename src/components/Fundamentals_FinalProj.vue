<template>
  <div class="left-text">
    <p>
    Commulative project of all OpenGL labs throughout the course including rendering, geometry and simulation.
    </p>
    <p>
    Given: starter code for rendering the model and opening a responsive window.
    </p>
    <p>
    Implemented: Rendering pipeline with vertex and graphics shaders, subdivision on mesh models and collision simulation in real time.
    </p>
    <p>
    Focus: Building strong understanding of the fundamentals of computer graphics and implementing them into one big project.
    </p>
  </div>
  <div ref="videoContainer" class="right-image">
    <video
      ref="video"
      src="../assets/Fundamentals_FinalProj.mp4"
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
