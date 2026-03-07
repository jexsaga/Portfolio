<template>
    <div ref="videoContainer" class="left-image">
        <video
        ref="video"
        src="../assets/Robo_premier_animation_wave.mp4"
        width="100%"
        muted
        loop
        class="scroll-video"
        ></video>
    </div>
    <div class="right-text">
        <p>
            Personal Blender project. 
        </p>
        <p>
            This is the first robot model for a 3D game I am making in Unity in partnership with a fellow student at IP - Paris.
            It includes a basic rig for animation and is designed to be simple as per our game aesthetic.
        </p>
        <p>
            Focus: Making something fun and personal while getting to know the tools of Blender and Unity.
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