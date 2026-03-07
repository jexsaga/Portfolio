<template>
    <div ref="videoContainer" class="left-image--comingsoon">
        <p> COMING SOON </p>
    </div>
    <div class="right-text">
        <p>
            WebGPU project. 
        </p>
        <p>
            I am currently working on a project to implement subsurface scattering using WebGPU. I am following the paper "Screen-Space Perceptual Rendering of Human Skin" by Jorge Jimenez, Veronica Sundstedt and Diego Guitierrez.
        </p>
        <p>
            Focus: Rendering real looking skin in WebGPU.
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