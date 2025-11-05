<script setup>
    import robotImg from '../assets/RobotDraft.png';
    import bouncingBallImg from '../assets/BouncingBallGame.png';
    import michelinImg from '../assets/MichelinManVideo.mp4';
    import earthQuakeImg from '../assets/EarthQuakeMap.png';
    import lightingImage from '../assets/LightingAndShading.png';
    import donutImg from '../assets/DonutDraft.png';
    import cathedralVid from '../assets/Cathedral.mp4';
    import triangleVid from '../assets/TriangleTriangles.mp4';
    import EarthQuakeMap from './EarthQuakeMap.vue';
</script>

<template>
    <div>
        <button @click="$router.push('/')" class="back-button">
            <img src="../assets/BackButton.svg" alt="Back Button" class="back-icon" width="20px" height="20px" />
        </button>
        <div class = "background">
            <div class="background-fun-section">
                <div class = "fun-columns fun-columns--sides">
                    <div style="display: flex; flex-direction: row; justify-content: space-evenly; width: 50%">
                        <div class = "project-tag project-tag--nine">
                            <img src="../assets/icons8-retro-robot-50.png"class="project-icon" width="40px" height="40px"/>
                        </div>
                        <div class = "project-tag project-tag--nine">
                            <img src="../assets/icons8-beach-ball-100.png"class="project-icon" width="40px" height="40px"/>
                        </div>
                    </div>
                    <div style="display: flex; flex-direction: row; justify-content: space-evenly; width: 50%">
                        <div class = "project-tag project-tag--nine">
                            <img src="../assets/icons8-teapot-100.png"class="project-icon" width="40px" height="40px"/>
                        </div>
                        <div class = "project-tag project-tag--nine">
                            <img src="../assets/icons8-dance-100.png"class="project-icon" width="40px" height="40px"/>
                        </div>
                    </div>
                    <!-- <div style="display: flex; flex-direction: row; justify-content: space-evenly; width: 50%">
                        <div class = "project-tag project-tag--nine">
                        </div>
                    </div> -->
                </div>
                
                <div class = "fun-columns fun-columns--middle">
                    <div class = "project-tag project-tag--middle">
                        <div v-if="pushedButtons.length > 0" style="display: flex; flex-direction: column; justify-content: space-evenly; height: 100%;">
                            <div style="height: 70%;">
                                <img v-if="(imgMap[pushedButtons[pushedButtons.length - 1]]?.src[(imgMap[pushedButtons[pushedButtons.length - 1]]?.src).length -1] !== '4')"
                                :src="imgMap[pushedButtons[pushedButtons.length - 1]]?.src"
                                style="width: 100%; height: 100%; object-fit: contain;"
                                />
                                <video v-else
                                :src="imgMap[pushedButtons[pushedButtons.length - 1]]?.src"
                                style="width: 100%; height: 100%; object-fit: contain;"
                                muted
                                loop
                                autoplay
                                ></video>
                            </div>
                            <div style="height: 30%; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 10px;">
                                <p>{{ imgMap[pushedButtons[pushedButtons.length - 1]]?.description }}</p>
                                <p>Tools: {{ imgMap[pushedButtons[pushedButtons.length - 1]]?.tools }}</p>
                                <p>{{ imgMap[pushedButtons[pushedButtons.length - 1]]?.dates }}</p>
                            </div>
                        </div>
                        <!-- <div v-if="pushedButtons.length >= 8"  style="display: flex; flex-direction: column; justify-content: space-evenly; height: 100%;">
                            <p>You have jumped on them all congrats</p>
                        </div> -->
                        <div v-else>
                            <h1>Welcome to My Portfolio</h1>
                            <p>The Interactive Version</p>
                            <h2>Try using the arrow keys to move and space to jump on the buttons !</h2>
                        </div>
                    </div>
                    
                    <div v-if="pushedJumpable.length == 1 && imgMap[pushedButtons[pushedButtons.length - 1]]?.site != null"  style="display: flex; flex-direction: row; position: absolute; top: 5%; left: 50%;">
                        <img src="../assets/up-arrow.png" alt="up arrow" width="50px" height="50px" style="transform: rotate(-90deg) scaleX(-1);"/>    
                        <p>Try jumping here!</p>
                    </div>
                    <div v-if="pushedJumpable.length == 3 && imgMap[pushedButtons[pushedButtons.length - 1]]?.site != null"  style="display: flex; flex-direction: row; position: absolute; top: 5%; left: 35%;">
                        <p>Jump! Jump! Jump!</p>
                        <img src="../assets/up-arrow.png" alt="up arrow" width="50px" height="50px" style="transform: rotate(90deg)"/>
                    </div>
                    <div v-if="wrongButtonsPushed"  style="display: flex; flex-direction: row; position: absolute; top: 5%; left: 25%;">
                        <p>...arrow keys... please!</p>
                    </div>
                    <div v-if="pushedJumpable.length > 0 && imgMap[pushedButtons[pushedButtons.length - 1]]?.site == null"  style="display: flex; flex-direction: row; position: absolute; top: 10%; left: 45%;">
                        <p style="font-size: small;">This one is just an image there is nothing to expand. Try another!</p>
                    </div>
                </div>
                
                <div class = "fun-columns fun-columns--sides">
                    <div style="display: flex; flex-direction: row; justify-content: space-evenly; width: 50%">
                        <div class = "project-tag project-tag--nine">
                            <img src="../assets/icons8-map-100.png"class="project-icon" width="40px" height="40px"/>
                        </div>
                        <div class = "project-tag project-tag--nine">
                            <img src="../assets/icons8-donut-100.png"class="project-icon" width="40px" height="40px"/>
                        </div>
                    </div>
                    <div style="display: flex; flex-direction: row; justify-content: space-evenly; width: 50%">
                        <div class = "project-tag project-tag--nine">
                            <img src="../assets/icons8-cathedral-100.png"class="project-icon" width="40px" height="40px"/>
                        </div>
                        <div class = "project-tag project-tag--nine">
                            <img src="../assets/icons8-three-triangles-100.png"class="project-icon" width="40px" height="40px"/>
                        </div>
                    </div>
                    <!-- <div style="display: flex; flex-direction: row; justify-content: space-evenly; width: 50%">
                        <div class = "project-tag project-tag--nine">
                        </div>
                    </div> -->
                </div>
            </div>
        </div>

        <div class="game-overlay">
            <canvas id="gameCanvas"></canvas>
        </div>
    </div>
    
  <div class="credits">
      <p>Icons by <a href="https://icons8.com/icons" style="color: #456664; text-decoration: underline;">Icons8</a></p>
      <p>Arrow icons created by <a href="https://www.flaticon.com/free-icons/arrow" title="arrow icons" style="color: #456664; text-decoration: underline;"> rang - Flaticon</a></p>
  </div>
</template>

<script>
export default {  
    data() {
        return {
            pushedButtons: [],
            pushedJumpable: [],
            imgMap: {
                0: { src: robotImg, description: "This is the first robot model for an upcoming 3D Unity game. This model includes a basic rig for animation and is designed to be simple as per our game aesthetic.",  tools: "Blender", dates: "Current", site: null },
                1: { src: bouncingBallImg, description: "3D physics-based game inspired by Donut County, built using TypeScript and GopherGfx.",  tools: "TypeScript, GopherGfx", dates: "Fall 2024", site: "https://csci-4611-fall-2024.github.io/assignment-2-JessRobb/" },
                2: { src: lightingImage, description: "Real-time lighting project using GLSL shaders to explore both photorealistic and stylized rendering techniques.",  tools: "TypeScript, GopherGfx", dates: "Fall 2024", site: "https://csci-4611-fall-2024.github.io/assignment-5-JessRobb/" },
                3: { src: michelinImg, description: "Animated character project using motion capture data from the Carnegie Mellon mocap database.",  tools: "TypeScript, GopherGfx", dates: "Fall 2024", site: "https://csci-4611-fall-2024.github.io/assignment-4-JessRobb/" },
                // 4: { src: robotImg, description: "Raytracer Tools: cpp", dates: "Spring 2025" },
                5: { src: earthQuakeImg, description: "Interactive visualization of earthquake data from NASA and USGS, spanning 1905-2007.",  tools: "TypeScript, GopherGfx", dates: "Fall 2024", site: "https://csci-4611-fall-2024.github.io/assignment-3-JessRobb/" },
                6: { src: donutImg, description: "Simple donut model made while following a Blender tutorial by Blender Guru on YouTube.",  tools: "Blender", dates: "Current", site: null },
                7: { src: cathedralVid, description: "OpenGL project showcasing interactive first-person navigation within a 3D building model.",  tools: "OpenGL, C++", dates: "Spring 2025", site: null },
                8: { src: triangleVid, description: "OpenGL project enabling interactive manipulation of a 2D model around its centroid.",  tools: "OpenGL, C++", dates: "Spring 2025", site: null },
                // 9: { src: robotImg, description: "Idk what project this is yet" },
                middleDivNum: 4
            },
            hasJumpedInMiddle: true,
            wrongButtonsPushed: false,
        };
    },
    mounted() {
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');


        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        let ball = {
            x: window.innerWidth/2,
            y: window.innerHeight/4,
            radius: 10,
            vx: 0,
            vy: 0,
            rotation: 0,
            ogy: 0,
            isJumping: false,
        };

        const speed = 5;
        const yspeed = 5;
        
        const tagElements = Array.from(document.querySelectorAll('.project-tag'));
        const keysPressed = new Set();

        const vm = this;

        let hitTags = [];
        let unhitTags = [];

        let lastJumpTime = 0;

        document.addEventListener('keydown', (e) => {
            keysPressed.add(e.key);
        });

        document.addEventListener('keyup', (e) => {
            keysPressed.delete(e.key);
        });

        document.addEventListener('keyup', () => {
            ball.vx = 0;
            ball.vy = 0;
        });

        function drawBall() {
            ctx.save();
            ctx.translate(ball.x, ball.y);
            ctx.rotate(ball.rotation);
            ctx.beginPath();
            ctx.arc(0, 0, ball.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#ebeff1';
            ctx.fill();
            ctx.restore();
        }

        function drawBallShadow() {
            ctx.save();
            if (ball.isJumping) {
                ctx.globalAlpha = 0.5;
                ctx.translate((ball.x + 5), (ball.ogy + 5));
            } else {
                ctx.translate(ball.x + 5, ball.y + 5);
            }
            ctx.beginPath();
            ctx.arc(0, 0, ball.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.filter = 'blur(4px)';
            ctx.fill();
            ctx.restore();
        }

        function drawBoxShadow() {
            for (const tag of hitTags) {
                let index = tagElements.indexOf(tag)
                if (index !== vm.imgMap.middleDivNum){
                    if (!vm.pushedButtons.includes(index)) {
                        vm.pushedButtons.push(index);
                        if (!vm.pushedJumpable.includes(index) && vm.imgMap[vm.pushedButtons[vm.pushedButtons.length - 1]]?.site != null) {
                            vm.pushedJumpable.push(index);
                        }
                        const rect = tag.getBoundingClientRect();
                        const centerX = rect.left + rect.width / 2;
                        const centerY = rect.top + rect.height / 2;
                        tag.style.boxShadow = '#c6d4dcff 0px 6px 12px, #c6d4dcff 0px -6px 12px, inset rgba(36, 36, 36, 0.4) 0px 6px 12px, inset rgba(36, 36, 36, 0.4) 0px -6px 12px';
                        let previousTags = hitTags.pop(tag);
                        unhitTags.push(previousTags);
                        ctx.save();
                        ctx.translate(centerX, centerY);
                        ctx.beginPath();
                        ctx.rect(-rect.width / 2, -rect.height / 2, rect.width, rect.height);
                        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
                        ctx.filter = 'blur(4px)';
                        ctx.fill();
                        ctx.restore();
                    } else {
                        tag.style.boxShadow = '#c6d4dcff 0px 6px 12px, #c6d4dcff 0px -6px 12px, rgba(36, 36, 36, 0.4) 0px 6px 12px, rgba(36, 36, 36, 0.4) 0px -6px 12px';
                        hitTags.pop(tag);
                        let removeIndex = vm.pushedButtons.indexOf(index);
                        vm.pushedButtons.splice(removeIndex, 1);
                    }
                } 
                // else if (!vm.pushedButtons.includes(index)){
                //     window.open('https://csci-4611-fall-2024.github.io/assignment-2-JessRobb/', '_blank');
                // }
            }
            
        }

        
        function undrawBoxShadow() {
            for (const tag of unhitTags) {
                if (!tag) continue;
                let index = tagElements.indexOf(tag)
                if (index !== vm.imgMap.middleDivNum){
                    tag.style.boxShadow = '#c6d4dcff 0px 6px 12px, #c6d4dcff 0px -6px 12px, rgba(36, 36, 36, 0.4) 0px 6px 12px, rgba(36, 36, 36, 0.4) 0px -6px 12px';
                    unhitTags.pop(tag);
                    let removeIndex = vm.pushedButtons.indexOf(index);
                    vm.pushedButtons.splice(removeIndex, 1);
                } 
            }
        }

        function checkSiteOpening() {
            let urlString = vm.imgMap[vm.pushedButtons[vm.pushedButtons.length - 1]]?.site;
            if (urlString){
                window.open(urlString, '_blank');
                vm.hasJumpedInMiddle = false;
            }
        }

        function checkTagCollision() {
            for (const tag of tagElements) {
                const rect = tag.getBoundingClientRect();
                if (
                    ball.x + ball.radius > rect.left &&
                    ball.x - ball.radius < rect.right &&
                    ball.y + ball.radius > rect.top &&
                    ball.y - ball.radius < rect.bottom
                ) {
                    let index = tagElements.indexOf(tag);
                    if (index == vm.imgMap.middleDivNum){
                        checkSiteOpening();
                    }
                    else if (!hitTags.includes(tag)) {
                        hitTags.push(tag);
                        if (unhitTags.length > 0) {
                            if (!unhitTags.includes(tag)) {
                                undrawBoxShadow();
                            }
                        }
                    }
                }
            }
            const backButton = document.querySelector('.back-button');
            const backRect = backButton.getBoundingClientRect();
            if (
                ball.x + ball.radius > backRect.left &&
                ball.x - ball.radius < backRect.right &&
                ball.y + ball.radius > backRect.top &&
                ball.y - ball.radius < backRect.bottom
            ) {
                hitTags.push(backButton);
                vm.$router.push('/')
            }
        }
        
        function jump() {
            ball.vy = -15;
            let gravity = 4;
            
            function applyGravity() {
                ball.vy += gravity;
                ball.y += ball.vy;
                if (ball.y >= ball.ogy) {
                    ball.y = ball.ogy;
                    ball.vy = 0;
                    ball.isJumping = false;
                    checkTagCollision();
                        
                } else {
                    requestAnimationFrame(applyGravity);
                }
            }
            applyGravity();
        }

        function update() {
            ball.vx = 0;
            ball.vy = 0;

            if (keysPressed.has('ArrowRight')) ball.vx += speed;
            if (keysPressed.has('ArrowLeft'))  ball.vx -= speed;
            if (keysPressed.has('ArrowUp'))    ball.vy -= yspeed;
            if (keysPressed.has('ArrowDown'))  ball.vy += yspeed;

            if (keysPressed.has('w')) vm.wrongButtonsPushed = true;
            else if (keysPressed.has('a')) vm.wrongButtonsPushed = true;
            else if (keysPressed.has('s')) vm.wrongButtonsPushed = true;
            else if (keysPressed.has('d')) vm.wrongButtonsPushed = true;
            else vm.wrongButtonsPushed = false;
            
            if (keysPressed.has(' ') & ball.isJumping === false) {
                ball.isJumping = true;
                ball.ogy = ball.y;
                
                if (Date.now() - lastJumpTime > 300) {
                    jump();
                    lastJumpTime = Date.now();
                } else {
                    ball.isJumping = false;
                }
            };

            ball.x += ball.vx;
            ball.rotation += ball.vx * 0.05;
            ball.y += ball.vy || 0;

            if (ball.x >= canvas.width) ball.x = 0;
            if (ball.x < 0) ball.x = canvas.width;
            if (ball.y >= canvas.height) ball.y = 0;
            if (ball.y < 0) ball.y = canvas.height;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            drawBoxShadow();
            drawBallShadow();
            drawBall();
            requestAnimationFrame(update);
        }

        update();

    }
};
</script>