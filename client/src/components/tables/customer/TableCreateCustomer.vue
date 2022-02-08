<template>
  <div
    v-if="errors.length > 0"
    class="alert alert-danger bg-danger text-white border-0"
    role="alert"
  >
    <div>
      <strong>Клиент не валидирован!</strong> Проверьте данные:
      <ul>
        <li v-for="error in errors" :key="error.code">
          <strong>{{ error.code }}</strong
          >: {{ error.message }}
        </li>
      </ul>
    </div>
  </div>
  <div
    v-if="createdCustomer.title"
    class="alert alert-success bg-success text-white border-0"
    role="alert"
  >
    <div>
      <strong>Клиент успешно создан</strong> {{ createdCustomer.title }} - {{ createdCustomer.phone }}
    </div>
  </div>
  <div
    v-if="updatedCustomer.title"
    class="alert alert-info bg-info text-white border-0"
    role="alert"
  >
    <div>
      <strong>Клиент успешно обновлён</strong> {{ updatedCustomer.title }} - {{ updatedCustomer.phone }}
    </div>
  </div>
  <table class="table table-striped table-centered w-100 dt-responsive nowrap">
    <thead class="table-light">
      <tr>
        <th class="all">Фамилия</th>
        <th>Имя</th>
        <th>Отчестве</th>
        <th>Телефон</th>
        <th>Дополнительные данные</th>
        <th>Действие</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <div>
            <input
              type="text"
              v-model="customer.lastName"
              placeholder="Фамилия"
              class="form-control"
            />
          </div>
        </td>
        <td>
          <div>
            <input
              type="text"
              v-model="customer.firstName"
              placeholder="Имя"
              class="form-control"
            />
          </div>
        </td>
        <td>
          <div>
            <input
              type="text"
              v-model="customer.secondName"
              placeholder="Отчество"
              class="form-control"
            />
          </div>
        </td>
        <td>
          <div>
            <input
              type="text"
              v-model="customer.phone"
              v-maska="'+7 (###) ###-##-##'"
              placeholder="+7 (999) 123-12-12"
              class="form-control"
            />
          </div>
        </td>
        <td>
          <div v-for="field in fields" :key="field">
            <div class="row">
              <div class="col-6">
                <input
                  type="text"
                  v-model="field.key"
                  placeholder="Название"
                  class="form-control"
                />
              </div>
              <div class="col-6">
                <input
                  type="text"
                  v-model="field.data"
                  placeholder="Значение"
                  class="form-control"
                />
              </div>
            </div>
          </div>
        </td>
        <td>
          <a @click.prevent="addField" href="#" class="action-icon">
            <i class="mdi mdi-database-plus"></i
          ></a>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="row mb-2">
    <div class="col-12 text-end">
      <button
        v-if="!loading"
        @click.prevent="createCustomer"
        class="btn btn-success mb-2"
        :disabled="!customer.title || !customer.phone"
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
import { ref, computed } from "vue";
import { useStore } from "vuex";
import validateCustomer from "@/modules/customer/validate-customer";
import request from '@/modules/request';

export default {
  setup() {
    const store = useStore();
    const customer = ref({
      lastName: null,
      firstName: null,
      secondName: null,
      phone: null,
      fields: []
    });
    customer.value.title = computed(() => `${customer.value.lastName} ${customer.value.firstName} ${customer.value.secondName}`);
    const fields = ref([]);
    const errors = ref([]);
    let createdCustomer = ref({});
    let updatedCustomer = ref({});
    let loading = ref(false);

    function addField() {
      fields.value.push({ key: null, data: null });
    }

    async function createCustomer() {
      loading.value = true;
      errors.value = [];

      customer.value.fields = fields.value;

      const validated = validateCustomer(customer.value);
      if (validated.errors.length > 0) return (errors.value = validated.errors);

      const json = await request('/api/v1/customer', 'POST', store.state.token, validated.customer);

      if (json.error) {
        errors.value = json.error;
        return;
      }
      
      customer.value = {
        lastName: null,
        firstName: null,
        secondName: null,
        phone: null,
        fields: []
      };

      if (json.createdCustomer?.title) createdCustomer.value = json.createdCustomer;
      if (json.updatedCustomer?.title) updatedCustomer.value = json.updatedCustomer;

      loading.value = false;
    }

    return {
      customer,
      createdCustomer,
      updatedCustomer,
      fields,
      errors,
      loading,
      addField,
      createCustomer
    };
  },
};
</script>

<style scoped>
.table-action_fix-width {
  min-width: 120px;
}
</style>