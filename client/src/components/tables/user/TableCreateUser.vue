<template>
  <div
    v-if="errors.length > 0"
    class="alert alert-danger bg-danger text-white border-0"
    role="alert"
  >
    <div>
      <strong>Пользователь не валидирован!</strong> Проверьте данные
    </div>
  </div>
  <div
    v-if="userCreated"
    class="alert alert-success bg-success text-white border-0"
    role="alert"
  >
    <div>
      <strong>Пользователь успешно создан</strong>
    </div>
  </div>
  <table class="table table-striped table-centered w-100 dt-responsive nowrap">
    <thead class="table-light">
      <tr>
        <th class="all">Email</th>
        <th>Пароль</th>
        <th>Имя</th>
        <th>Фамилия</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <div>
            <input
              type="text"
              v-model="user.username"
              placeholder="Email пользователя"
              class="form-control"
            />
          </div>
        </td>
        <td>
          <div>
            <input
              type="password"
              v-model="user.password"
              placeholder="Пароль пользователя"
              class="form-control"
            />
          </div>
        </td>
        <td>
          <div>
            <input
              type="text"
              v-model="user.firstName"
              placeholder="Имя пользователя"
              class="form-control"
            />
          </div>
        </td>
        <td>
          <div>
            <input
              type="text"
              v-model="user.lastName"
              placeholder="Фамилия пользователя"
              class="form-control"
            />
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="row mb-2">
    <div class="col-12 text-end">
      <button
        v-if="!loading"
        @click.prevent="createUser"
        class="btn btn-success mb-2"
        :disabled="user.username.length == 0 || user.password.length < 6 || user.username.firstName == 0 || user.lastName.length == 0"
      >
        <i class="mdi mdi-content-save-all me-2"></i> Сохранить
      </button>
      <button v-if="loading" class="btn btn-success mb-2" disabled>
        <span
          class="spinner-grow spinner-grow-sm me-1"
          role="status"
          aria-hidden="true"
        ></span>
        Загрузка...
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import request from '@/modules/request';

export default {
  setup() {
    const store = useStore();
    const user = ref({
      username: '',
      password: '',
      firstName: '',
      lastName: ''
    });
    let userCreated = ref(false);
    const errors = ref([]);
    let loading = ref(false);

    async function createUser() {
      loading.value = true;
      errors.value = [];

      const jsonData = await request('/api/v1/auth/register', 'POST', store.state.token, user.value);

      if (jsonData.error) {
        userCreated.value = false;
        errors.value = jsonData.error;
        return;
      }
      
      user.value = {
        username: '',
        password: '',
        firstName: '',
        lastName: ''
      }

      userCreated.value = true;
      loading.value = false;
    }

    return {
      user,
      userCreated,
      errors,
      loading,
      createUser
    };
  },
};
</script>