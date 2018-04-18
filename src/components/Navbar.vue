<template>
    <div>

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
          <!-- If logged in -->
          <div v-if="loggedIn">
            <div class="navbar-item">
              <div class="field is-horizontal">
                <div class="field-body">
                  <div class="field">
                    <p class="control">
                      <button class="button is-link">Welcome {{username}}!</button>
                    </p>
                  </div>
                  <div class="field">
                    <p class="control">
                      <button class="button is-danger" v-on:click="logOut()">Log Out</button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- If not logged in -->
          <div v-else>
            <div class="navbar-item">
              <div class="field is-horizontal">
                <div class="field-body">

                  <div class="field">
                    <p class="control is-expanded has-icons-left">
                      <input class="input" type="text" placeholder="Username" v-model="loginUsername">
                      <span class="icon is-small is-left">
                        <i class="fas fa-user"></i>
                      </span>
                    </p>
                  </div>

                  <div class="field">
                    <p class="control is-expanded has-icons-left">
                      <input class="input" type="password" placeholder="Password" v-model="loginPassword">
                      <span class="icon is-small is-left">
                        <i class="fas fa-lock"></i>
                      </span>
                    </p>
                  </div>

                  <div class="field">
                    <p class="control">
                      <button class="button is-success" v-on:click="logIn()" type="submit">Log In</button>
                    </p>
                  </div>

                  <div class="field">
                    <p class="control">
                      <button class="button is-link" v-on:click="toggleSignupModal()">Sign Up</button>
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </nav>

    <div class="modal" v-bind:class="{ 'is-active': signupModal }" id="signup-modal">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Create Account</p>
          <button class="delete" aria-label="close" id="close-modal" v-on:click="toggleSignupModal()"></button>
        </header>
        <section class="modal-card-body">
          <div class="field">
            <label class="label">Choose a Username</label>
            <div class="control has-icons-left">
              <input class="input" type="text" placeholder="Username" v-model="createUsername">
              <span class="icon is-small is-left">
                <i class="fas fa-user"></i>
              </span>
            </div>
          </div>
          <div class="field">
            <label class="label">Choose a Password</label>
            <div class="control has-icons-left">
              <input class="input" type="password" placeholder="Password" v-model="createPassword">
              <span class="icon is-small is-left">
                <i class="fas fa-lock"></i>
              </span>
            </div>
          </div>
          <div class="field">
            <label class="label">Verify Your Password</label>
            <div class="control has-icons-left">
              <input class="input" type="password" placeholder="Enter same password as above" v-model="verifyCreatePassword">
              <span class="icon is-small is-left">
                <i class="fas fa-lock"></i>
              </span>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success" v-on:click="register()">Make Account</button>
          <button class="button is-danger" v-on:click="toggleSignupModal()">Cancel</button>
        </footer>
      </div>
    </div>

    </div>
</template>

<script>
 export default {
     name: 'Navbar',
     data () {
       return {
         imagePath: '/static/images/icon.png',
         loginUsername: '',
         loginPassword: '',
         createUsername: '',
         createPassword: '',
         verifyCreatePassword: ''
       }
     },
     computed: {
       loggedIn: function() { 
         return this.$store.getters.loggedIn;
       },
       username: function() {
         if(!this.$store.getters.loggedIn) return '';
         else return this.$store.getters.token.username;
       },
       signupModal: function() {
         return this.$store.getters.signupModal;
       }
     },
     methods: {
       toggleBurger: function() {
         var burger = document.getElementById("burger");
         var menu = document.getElementById("menu");
         burger.classList.toggle("is-active");
         menu.classList.toggle("is-active");  
       },
       toggleSignupModal: function() {
         this.createUsername = '';
         this.createPassword = '';
         this.verifyCreatePassword = '';
         this.$store.commit('toggleSignupModal');
       },
       logIn: function() {
         let credentials = {
           username: this.loginUsername,
           password: this.loginPassword
         };
         this.$store.dispatch('logIn', credentials);
       },
       logOut: function() {
         this.$store.dispatch('logOut');
         this.loginUsername = '';
         this.loginPassword = '';
       },
       register: function() {
         if(this.createUsername === '' || this.createPassword === '') alert('Username and password are required.');
         else if(this.createPassword !== this.verifyCreatePassword) alert('Your password entries do not match.');
         else {
           let credentials = {
             username: this.createUsername,
             password: this.createPassword
           };
           this.$store.dispatch('register', credentials);
         }
       }
     }
 }
</script>

<style scoped>
 
</style>
