<template>
  <div class="end-bar">
    <div class="rightbar-title">
      <a href="javascript:void(0);" class="end-bar-toggle float-end">
        <i class="dripicons-cross noti-icon"></i>
      </a>
      <h5 class="m-0">Настройки</h5>
    </div>

    <div class="rightbar-content h-100" data-simplebar>
      <div class="p-3">
        <div class="alert alert-warning" role="alert">
          <strong>Управление </strong> цветовой схемой.
        </div>

        <h5 class="mt-3">Цветовая схема</h5>
        <hr class="mt-1" />

        <div class="form-check form-switch mb-1" @click="changeStyle('light')">
          <input
            class="form-check-input"
            type="checkbox"
            v-model="styles.light"
          />
          <label class="form-check-label" for="light-mode-check"
            >Светлый режим</label
          >
        </div>

        <div class="form-check form-switch mb-1" @click="changeStyle('dark')">
          <input
            class="form-check-input"
            type="checkbox"
            v-model="styles.dark"
          />
          <label class="form-check-label" for="dark-mode-check"
            >Тёмный режим</label
          >
        </div>
      </div>
    </div>
  </div>

  <div class="rightbar-overlay"></div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();
    const style = computed(() => store.state.style);
    let styles = ref({
      light: false,
      dark: false
    });

    // Не работает изначальное назначение чекбокса, доработать
    onMounted(() => {
      if (style.value === 'light') styles.value.light = true;
      if (style.value === 'dark') styles.value.dark = true;
    });

    function changeStyle(style) {
      if (style === 'light') styles.value.dark = false;
      if (style === 'dark') styles.value.light = false;
      store.dispatch('changeStyle', style);
    }

    return {
      styles,
      changeStyle
    }
  },
}
</script>
<style scoped>
.rightbar-content {
  text-align: left;
}
</style>