<template>
    <div v-if="isMobile || isProllyMobile">
        <p>This is best viewed full screen on laptop or computer.</p>
    </div>
    <div v-if="!isMobile && !isProllyMobile" style="height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <div class="entry-top">
            <h1>Welcome to Jessica Robbins' Portfolio</h1>
            <div style="padding: 0 10px;">
                <h3>Who am I?</h3>
                <p>
                My name is Jessica Robbins. I recently graduated from the University of Minnesota with a <strong>Bachelor's in Computer Science and a Minor in French</strong>. Now, I am starting my <strong>Master's in Computer Graphics at Institut Polytechnique de Paris</strong>.
                I am intrigued by all things computer graphics, especially <strong>VFX, animation, and video game development</strong>. 
                I challenge myself to make my projects personal, beautiful, and effective. 
                While I enjoy the arts—such as music, poetry, pastels, digital illustration, and other expressive media—I balance that with my intellectual side, which loves problem-solving and efficiency. 
                This portfolio showcases both sides by offering two versions: an Interactive Portfolio and a Professional Portfolio. 
                I hope you enjoy!
                </p>
            </div>
        </div>
        <div class="entry-bottom">
            <h4 style="margin: 5px">Please pick which you would like to see.</h4>
            <div class="entry-tab-container">
                <router-link to="/fun">
                <div class="entry-tab entry-tab--fun">
                    <h3 class="entry-tab__content" style="color: var(--light-white)">Interactive Portfolio</h3>
                    <p class="entry-tab__content" style="color: var(--light-white)">This version is more playful and experimental, showcasing my projects in a more creative and fun way. Give it a try!</p>
                </div>
                </router-link>
                <router-link to="/professional">
                    <div class="entry-tab entry-tab--professional">
                        <h3 class="entry-tab__content" style="color: var(--light-white)">Professional Portfolio</h3>
                        <p class="entry-tab__content" style="color: var(--light-white)">This version is more formal and polished, highlighting technical skills and completed projects in a straightforward manner.</p>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isMobile: false,
            isProllyMobile: false,
        }
    },
    mounted() {
        this.isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        this.isProllyMobile = window.innerWidth <= 768;
    }
}
</script>