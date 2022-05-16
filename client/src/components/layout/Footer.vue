<template>
  <footer class="footer text-start">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-6">
          confetti.app.version.1.0.0_beta_4
        </div>
        <div class="col-md-6">
          <div class="text-md-end footer-links d-none d-md-block">
            {{ fullYear }} &copy; Confetti: Inventory & Warehouse Management System
            <!-- <a href="javascript: void(0);">About</a>
            <a href="javascript: void(0);">Support</a>
            <a href="javascript: void(0);">Contact Us</a> -->
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  setup() {
    let fullYear = new Date().getFullYear();

    return { fullYear }
  },
}
</script>