<template>
  <div class="d-flex justify-content-center align-items-center vw-100 vh-100">
    <div style="width: 300px;">
      <AuthForm />

      <a href="#" class="d-block mt-2">Добавить пользователя</a>
    </div>
  </div>
</template>

<script>
import AuthForm from '@/components/forms/AuthForm.vue';

export default {
  components: {
    AuthForm
  }
}
</script>