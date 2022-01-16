<template>
  <div
    v-if="errors.length > 0"
    class="alert alert-danger bg-danger text-white border-0"
    role="alert"
  >
    <div>
      <strong>Статус не валидирован!</strong> Проверьте данные
    </div>
  </div>
  <div
    v-if="createdStatus._id"
    class="alert alert-success bg-success text-white border-0"
    role="alert"
  >
    <div>
      <strong>Статус успешно создан</strong>: {{ createdStatus.title }}
    </div>
  </div>
  <table class="table table-striped table-centered w-100 dt-responsive nowrap">
    <thead class="table-light">
      <tr>
        <th class="all">Название</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <div>
            <input
              type="text"
              v-model="orderStatus.title"
              placeholder="Название статуса"
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
        @click.prevent="createStatus"
        class="btn btn-success mb-2"
        :disabled="!orderStatus.title"
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
import createOrderStatus from '@/modules/order-status/create-order-status';

export default {
  setup() {
    const store = useStore();
    const orderStatus = ref({ title: null });
    const errors = ref([]);
    let createdStatus = ref({});
    let loading = ref(false);

    async function createStatus() {
      loading.value = true;
      
      const response = await createOrderStatus(orderStatus.value, store.state.token);
      if (response.errors?.length > 0) errors.value = response.errors;
      if (response.createdStatus?._id) {
        orderStatus.value = { title: null };
        createdStatus.value = response.createdStatus;
      }

      loading.value = false;
    }

    return {
      orderStatus,
      errors,
      createdStatus,
      loading,
      createStatus
    };
  },
};
</script>

<style scoped>
.table-action_fix-width {
  min-width: 120px;
}
</style>