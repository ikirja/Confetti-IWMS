import { createStore } from 'vuex'

export default createStore({
  state: {
    token: localStorage.getItem('token'),
    warehouses: {
      currentWarehouse: {}
    }
  },
  mutations: {
    setToken(state, token) {
      localStorage.setItem('token', token);
      state.token = token;
    },
    unsetToken(state) {
      localStorage.removeItem('token');
      state.token = '';
    },
    setCurrentWarehouse(state, warehouse) {
      state.warehouses.currentWarehouse = warehouse;
    }
  },
  actions: {
    async login({ commit }, payload) {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.status !== 200) {
        commit('unsetToken');
        return alert('Проверьте логин и/или пароль');
      }

      const jsonData = await response.json();
      commit('setToken', jsonData.accessToken);
    },
    logout({ commit }) {
      commit('unsetToken');
    },
    changeCurrentWarehouse({ commit }, warehouse) {
      commit('setCurrentWarehouse', warehouse);
    }
  }
})
