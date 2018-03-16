<template>
    <div id="app">
	<navbar></navbar>
	<router-view/>
        <git-footer></git-footer>
    </div>
</template>

<script>
 import Navbar from './components/Navbar.vue'
 import GitFooter from './components/GitFooter.vue'
 export default {
     name: 'App',
     components: { Navbar, GitFooter }
 }
</script>

<style>

</style>
