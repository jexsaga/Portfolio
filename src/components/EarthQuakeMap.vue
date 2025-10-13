<template>
    <div class="left-text">
        <p>
        Interactive visualization of earthquake data from NASA and USGS, spanning 1905-2007.
        </p>
        <p>
        Given: Starter code to load data, create background and add control panel.
        </p>
        <p>
        Implemented: dual-view system with morphing between 2D map and 3D textured globe, mesh deformation, and coordinate conversion from spherical to Cartesian.
        </p>
        <p>
        Focus: applying computer graphics to real-world geospatial data for dynamic, informative visual exploration.
        </p>
    </div>
    <div>
        <img src="../assets/EarthQuakeMap.png" alt="earthquakemap" width="100%" @click="openLink" class="clickable-image"/>
    </div>
</template>


<script>
export default {
  methods: {
    openLink() {
      window.open('https://csci-4611-fall-2024.github.io/assignment-3-JessRobb/', '_blank');
    }
  }
}
</script>
