<template>
    <nav class="navbar is-link" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <router-link to="/" class="navbar-item">
          <img v-bind:src="imagePath" width="28" height="28">
        </router-link>

        <button class="button navbar-burger" id="burger" v-on:click="toggleBurger()">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <div class="navbar-menu" id="menu">
        <div class="navbar-start">
          <router-link to="/" class="navbar-item">Home</router-link>
          <router-link to="/about" class="navbar-item">About</router-link>
        </div>
        <div class="navbar-end">
        </div>
      </div>
    </nav>
</template>

<script>
 export default {
     name: 'Navbar',
     data () {
       return {
         imagePath: '/creative-project-3/dist/static/images/icon.png'
       }
     },
     methods: {
       toggleBurger: function() {
         var burger = document.getElementById("burger");
         var menu = document.getElementById("menu");
         burger.classList.toggle("is-active");
         menu.classList.toggle("is-active");  
       }
     }
 }
</script>

<style scoped>
 
</style>
