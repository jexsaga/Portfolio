<template>
  <button @click="$router.push('/')" class="back-button">
      <img src="../assets/BackButton.svg" alt="Back Button" class="back-icon" width="20px" height="20px" color="#ebeff1"/>
  </button>
  <div class="resume-container">
    <h1 style="margin-top: 40px;">Jessica Robbins' Resume</h1>
    <div style="display: flex; justify-content: center; margin-bottom: 10px;">
      <button @click="pickedResume = resumePdfEN" :class="{ active: pickedResume === resumePdfEN }" class="language-button">EN</button>
      <button @click="pickedResume = resumePdfFR" :class="{ active: pickedResume === resumePdfFR }" class="language-button">FR</button>
    </div>
    <iframe
      :src="pickedResume + '#toolbar=0&navpanes=0&scrollbar=0'"
      class="resume-frame"
    ></iframe>
  </div>
</template>

<script>
import resumePdfEN from '../assets/JessicaRobbins_Resume_EN.pdf'
import resumePdfFR from '../assets/JessicaRobbins_Resume_FR.pdf'

export default {
  name: 'ResumeScreen',
  data() {
    return { resumePdfEN, resumePdfFR, pickedResume: resumePdfEN}
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
