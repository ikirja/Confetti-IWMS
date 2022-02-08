<template>
  <div
    v-if="errors.length > 0"
    class="alert alert-danger bg-danger text-white border-0"
    role="alert"
  >
    <div>
      <strong>Склад не валидирован!</strong> Проверьте данные
    </div>
  </div>
  <div
    v-if="createdWarehouse._id"
    class="alert alert-success bg-success text-white border-0"
    role="alert"
  >
    <div>
      <strong>Склад успешно создан</strong> {{ createdWarehouse.title }}
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
              v-model="warehouse.title"
              placeholder="Название склада"
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
        @click.prevent="createWarehouse"
        class="btn btn-success mb-2"
        :disabled="!warehouse.title"
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
import validateWarehouse from "@/modules/warehouse/validate-warehouse";
import request from '@/modules/request';

export default {
  setup() {
    const store = useStore();
    const warehouse = ref({ title: null });
    let createdWarehouse = ref({});
    const errors = ref([]);
    let loading = ref(false);

    async function createWarehouse() {
      loading.value = true;
      errors.value = [];

      const validated = validateWarehouse(warehouse.value);
      if (validated.errors.length > 0) return (errors.value = validated.errors);

      const json = await request('/api/v1/warehouse', 'POST', store.state.token, validated.warehouse);

      if (json.error) {
        errors.value = json.error;
        return;
      }
      
      warehouse.value = { title: null };
      createdWarehouse.value = json;
      loading.value = false;
    }

    return {
      warehouse,
      createdWarehouse,
      errors,
      loading,
      createWarehouse
    };
  },
};
</script>

<style scoped>
.table-action_fix-width {
  min-width: 120px;
}
</style>