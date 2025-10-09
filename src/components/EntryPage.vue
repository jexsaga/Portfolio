<template>
    <div>
        <div style="height: 50%;">        
            <h1>Welcome to Jessica Robbins' Portfolio</h1>
            <div>
                <h3>Who am I?</h3>
                <p>
                My name is Jessica Robbins, and I am a Master's student at Institut Polytechnique de Paris with a passion for creating engaging and meaningful projects. 
                I am intrigued by all things computer graphics, especially VFX, animation, and video game development. 
                I challenge myself to make my projects personal, beautiful, and effective. 
                While I enjoy the arts—such as music, poetry, pastels, digital illustration, and other expressive media—I balance that with my intellectual side, which loves problem-solving and efficiency. 
                This portfolio showcases both sides by offering two versions: a Fun Portfolio and a Professional Portfolio. 
                I hope you enjoy!
                </p>
            </div>
            <h4>Please pick which version you would like to see.</h4>
        </div>
        <div class="entry-tab-container">
            <router-link to="/fun">
            <div class="entry-tab entry-tab--fun">
                <h3 class="entry-tab__content">Fun Portfolio</h3>
                <p class="entry-tab__content">This version is more playful and experimental, showcasing creative coding projects and interactive experiences.</p>
            </div>
            </router-link>
            <router-link to="/professional">
                <div class="entry-tab entry-tab--professional">
                    <h3 class="entry-tab__content">Professional Portfolio</h3>
                    <p class="entry-tab__content">This version is more formal and polished, highlighting technical skills, completed projects, and professional achievements.</p>
                </div>
            </router-link>
        </div>
    </div>
</template>