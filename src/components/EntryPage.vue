<template>
    <!-- <div v-if="isMobile || isProllyMobile" style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; padding: 0 20px;">
        <h2 style="text-align: center;">Oops! It looks like you're on a mobile device.</h2>
        <p style="text-align: center;">This portfolio is best experienced on a laptop or computer due to its interactive and visual nature. If possible, try revisiting on a larger screen to get the full experience. Thank you for stopping by!</p>
        
        <p style="text-align: center;">- Jess</p>
    </div> -->
    <!--  v-if="!isMobile && !isProllyMobile" -->
    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <div class="entry-top">
            <h1>Welcome to Jessica Robbins' Portfolio</h1>
            <div style="padding: 0 10px;">
                <h3>Who am I?</h3>
                <p>
                My name is Jessica Robbins. I recently graduated from the University of Minnesota with a <strong>Bachelor's in Computer Science and a Minor in French</strong>. Now, I am starting my <strong>Master's in Computer Graphics at Institut Polytechnique de Paris</strong>.
                I am intrigued by all things computer graphics, especially <strong>VFX, animation, and video game development</strong>. 
                I challenge myself to make my projects personal, beautiful, and effective. 
                While I enjoy the arts—such as music, poetry, pastels, digital illustration, and other expressive media—I balance that with my intellectual side, which loves problem-solving and efficiency. 
                This portfolio showcases the work I have done that reflects both my technical skills and creative passions. 
                I hope you enjoy!
                </p>
            </div>
        </div>
        <div>
            <!-- <h4 style="margin: 5px">Please pick which you would like to see.</h4> -->
            <div class="entry-tab-container">
                <!-- <router-link to="/fun">
                <div class="entry-tab entry-tab--fun">
                    <h3 class="entry-tab__content" style="color: var(--light-white)">Interactive Portfolio</h3>
                    <p class="entry-tab__content" style="color: var(--light-white)">This version is more playful and experimental, showcasing my projects in a more creative and fun way. Give it a try!</p>
                </div>
                </router-link> -->
                <router-link to="/Portfolio">
                    <div class="entry-tab entry-tab--professional">
                        <h3 class="entry-tab__content" style="color: var(--light-white)">See Portfolio</h3>
                    </div>
                </router-link>
                
                <router-link to="/Resume">
                    <div class="entry-tab entry-tab--professional">
                        <h3 class="entry-tab__content" style="color: var(--light-white)">See Resume</h3>
                    </div>
                </router-link>
            </div>
        </div>
        <div class="credits">
            <p>Coding Image by <a href="https://wallpapers.com/wallpapers/cool-code-aesthetic-cqzxsy3jp8y5w6xx.html" style="color: #456664; text-decoration: underline;">Wallpapers.com</a></p>
        </div>
    </div>
    
</template>

<script>
export default {
    data() {
        return {
            isMobile: true,
            isProllyMobile: true,
        }
    },
    mounted() {
        this.isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        this.isProllyMobile = window.innerWidth <= 768;
    }
}
</script>