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

        <div class="form-check form-switch mb-1">
          <input
            class="form-check-input"
            type="checkbox"
            name="color-scheme-mode"
            value="light"
            id="light-mode-check"
            checked
          />
          <label class="form-check-label" for="light-mode-check"
            >Светлый режим</label
          >
        </div>

        <div class="form-check form-switch mb-1">
          <input
            class="form-check-input"
            type="checkbox"
            name="color-scheme-mode"
            value="dark"
            id="dark-mode-check"
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

<style scoped>
.rightbar-content {
  text-align: left;
}
</style>