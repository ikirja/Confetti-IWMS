<template>
  <div class="brand"><span class="fs-1 fw-bold">Confetti</span></div>
  <div class="brand-info mb-3"><span>Inventory & Warehouse Management System</span></div>
  <div>
    <div class="form-floating mb-3">
      <input
        v-model="email"
        type="email"
        class="form-control"
        id="floatingEmail"
        placeholder="email@domain.com"
      />
      <label for="floatingEmail">Email</label>
    </div>
    <div class="form-floating mb-3">
      <input
        v-model="password"
        type="password"
        class="form-control"
        id="floatingPassword"
        placeholder="Password"
      />
      <label for="floatingPassword">Пароль</label>
    </div>
    <button @click.prevent="login" class="btn btn-primary">Войти</button>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();
    let email = ref('');
    let password = ref('');

    function login() {
      const payload = { username: email.value, password: password.value };
      store.dispatch('login', payload)
    }

    return {
      email,
      password,
      login
    }
  },
}
</script>