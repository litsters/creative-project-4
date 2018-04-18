import Vue from 'vue';
import Vuex from 'vuex';

import axios from 'axios';

Vue.use(Vuex);

const getAuthHeader = () => {
  let headers = {headers: {'Authorization': JSON.parse(localStorage.getItem('bbtoken')).jwt}};
  return headers;
}

export default new Vuex.Store({
  state: {
    savedSearches: [],
    selectedSearch: null,
    searchField: '',
    locationField: '',
    token: null,
    signupModal: false
  },
  getters: {
    savedSearches: state => state.savedSearches,
    selectedSearch: state => state.selectedSearch,
    searchField: state => state.searchField,
    locationField: state => state.locationField,
    loggedIn: state => {
      return state.token !== null;
    },
    token: state => state.token,
    signupModal: state => state.signupModal,
    user_id: state => {
      if(state.token !== null) return state.token.id;
      else return -1;
    }
  },
  mutations: {
    setSaved(state, searches) {
      state.savedSearches = searches;
    },
    setSelected(state, savedSearch) {
      state.selectedSearch = savedSearch;
    },
    setSearchField(state, keywords) {
      state.searchField = keywords;
    },
    setLocationField(state, location) {
      state.locationField = location;
    },
    clearSearch(state) {
      state.locationField = '';
      state.searchField = '';
      state.selectedSearch = null;
    },
    addSavedSearch(state, newSearch) {
      state.savedSearches.push(newSearch);
      state.selectedSearch = newSearch;
    },
    setToken(state, token) {
      localStorage.removeItem('bbtoken');
      let temp = JSON.stringify(token, null, 2);
      localStorage.setItem('bbtoken', temp);
      state.token = token;
    },
    clearToken(state) {
      localStorage.removeItem('bbtoken');
      state.token = null;
    },
    toggleSignupModal(state) {
      state.signupModal = !state.signupModal;
    }
  },
  actions: {
    // Saved searches
    getSavedSearches(context) {
      axios.get('/api/searches/' + context.getters.user_id, getAuthHeader()).then(response => {
        context.commit('setSaved', response.data.searches);
      }).catch(err => {
        alert(err);
      });
    },
    editSavedSearch(context, item) {
      axios.put('/api/searches/' + context.getters.user_id + '/' + item.id, item, getAuthHeader()).then(response => {
        context.dispatch('getSavedSearches');
      }).catch(err => {
        alert(err);
      });
    },
    deleteSavedSearch(context, id) {
      axios.delete('/api/searches/' + context.getters.user_id + '/' + id, getAuthHeader()).then(response => {
        context.dispatch('getSavedSearches');
        if(context.state.selectedSearch !== null && id === context.state.selectedSearch.id){
          context.commit('clearSearch');
        }
      }).catch(err => {
        alert(err);
      });      
    },
    saveNewSearch(context, item) {
      axios.post('/api/searches/' + context.getters.user_id, item, getAuthHeader()).then(response => {
        context.commit('addSavedSearch', item);
      }).catch(err => {
        alert(err);
      });
    },
    // Log in
    logIn(context, credentials) {
      axios.post('/api/login', credentials).then(response => {
        context.commit('setToken', response.data);
        context.dispatch('getSavedSearches');
      }).catch(error => {
        if(error.response.status === 400){
          alert('Username and password are required. Please try again.');
        } else if(error.response.status === 403){
          alert('Incorrect username or password.');
        } else alert(error);
      });
    },
    logOut(context) {
      context.commit('clearToken');
      context.commit('clearSearch');
      context.commit('setSaved', []);
    },
    // Register
    register(context, credentials) {
      axios.post('/api/register', credentials).then(response => {
        context.commit('toggleSignupModal');
        context.commit('setToken', response.data);
      }).catch(error => {
        if(error.response.status === 409){
          alert('That username already exists.');
        } else alert(error);
      });
    },
    //Initialize token
    initialize(context) {
      let temp = localStorage.getItem('bbtoken');
      if(temp === null || temp === undefined) context.commit('clearToken');
      else{
        let token = JSON.parse(temp);
        context.commit('setToken', token);
      }
    }
  }
});
