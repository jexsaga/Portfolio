<template>
  <button @click="$router.push('/')" class="back-button">
      <img src="../assets/BackButton.svg" alt="Back Button" class="back-icon" width="20px" height="20px" color="#ebeff1"/>
  </button>
  <div class="resume-container">
    <h1 style="margin-top: 40px;">Jessica Robbins' Resume</h1>
    <iframe
      :src="resumePdf"
      class="resume-frame"
    ></iframe>
  </div>
</template>

<script>
import resumePdf from '../assets/JessicaRobbins_Resume.pdf'

export default {
  name: 'ResumeScreen',
  data() {
    return { resumePdf }
  }
}
</script>

<style scoped>
.resume-container {
  width: 100vw;
  padding: 0 30px;
  box-sizing: border-box;
}

.resume-frame {
  width: 100%;
  height: 100vh;
  border: none;
}
</style>
