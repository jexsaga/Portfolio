<template>
    <div class="left-text">
        <p>
            Research project. 
        </p>
        <p>
            Guided by Professor Kiwon Um. I will be doing a research project in the area of character animation. 
            I will do my own implementation of the paper "Generating Upper-Body Motion for Real-Time Characters Making their Way through Dynamic Environments" by Eduardo Alvarado, Damien Rohmer, Marie-Paule Cani. 
            Then, I will take it further by adding my own imporovements.
        </p>
        <p>
            Implemented: So far, I have created 3D models using blender and imported them into Unity. Character and animations are from Mixamo.
        </p>
        <p>
            Focus: Computer animation, character movement, research and implementation.
        </p>
    </div>
    <div ref="videoContainer" class="right-image--comingsoon" style="width: 250%;">
        <p> IN PROGRESS </p>
        <video
        ref="video"
        src="../assets/research_proj_vid.mp4"
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