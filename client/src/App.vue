<template>
  <div v-if="authecticated">
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
    <RightSidebar />
  </div>
  <div v-if="!authecticated">
    <div class="wrapper">
      <Auth />
    </div>
  </div>
</template>

<script>
import LeftSidebar from "@/components/layout/LeftSidebar.vue";
import Header from "@/components/layout/Header.vue";
import Footer from "@/components/layout/Footer.vue";
import RightSidebar from "@/components/layout/RightSidebar.vue";
import Auth from "@/views/Auth.vue";

import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  components: {
    LeftSidebar,
    Header,
    Footer,
    RightSidebar,
    Auth
  },
  setup() {
    const store = useStore();
    const authecticated = computed(() => store.state.token && store.state.token.length > 0 ? true : false);

    return { authecticated }
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
