<template>
  <div v-if="authenticated">
    <div class="wrapper">
      <LeftSidebar />
      <!-- <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </div>
   -->
      <div class="content-page">
        <div class="content">
          <Header />
          <router-view />
        </div>
        <Footer />
      </div>
    </div>
  </div>
  <div v-if="!authenticated">
    <div class="wrapper">
      <Auth />
    </div>
  </div>
</template>

<script>
import LeftSidebar from "@/components/layout/LeftSidebar.vue";
import Header from "@/components/layout/Header.vue";
import Footer from "@/components/layout/Footer.vue";
import Auth from "@/views/Auth.vue";

import { computed, } from 'vue';
import { useStore } from 'vuex';

export default {
  components: {
    LeftSidebar,
    Header,
    Footer,
    Auth
  },
  setup() {
    const store = useStore();
    const authenticated = computed(() => store.state.token && store.state.token.length > 0 ? true : false);

    return { authenticated }
  }
};
</script>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
