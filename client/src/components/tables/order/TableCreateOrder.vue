<template>
  <div
    v-if="errors.length > 0"
    class="alert alert-danger bg-danger text-white border-0"
    role="alert"
  >
    <div>
      <strong>Заказ не создан!</strong> Проверьте данные:
      <ul>
        <li v-for="error in errors" :key="error.code">
          <strong>{{ error.code }}</strong
          >: {{ error.message }}
        </li>
      </ul>
    </div>
  </div>
  <div
    v-if="createdOrder._id"
    class="alert alert-success bg-success text-white border-0"
    role="alert"
  >
    <div>
      <strong>Заказ успешно создан</strong>: {{ createdStatus.orderId }}
    </div>
  </div>
  <table class="table table-striped table-centered w-100 dt-responsive nowrap">
    <thead class="table-light">
      <tr>
        <th class="all">Клиент</th>
        <th>Склад</th>
        <th>Товары</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <div>
            <input
              type="text"
              v-model="order.customer"
              placeholder="Клиент"
              class="form-control"
            />
          </div>
        </td>
        <td>
          <div>
            <input
              type="text"
              v-model="order.warehouse"
              placeholder="Склад"
              class="form-control"
            />
          </div>
        </td>
        <td>
          <div>
            <input
              type="text"
              v-model="order.products"
              placeholder="Товары"
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
        @click.prevent="placeOrder"
        class="btn btn-success mb-2"
        :disabled="!order.canBePlaced"
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
import createOrder from '@/modules/order/create-order';

export default {
  setup() {
    const store = useStore();
    const order = ref({});
    const errors = ref([]);
    let createdOrder = ref({});
    let loading = ref(false);

    async function placeOrder() {
      loading.value = true;
      
      const response = await createOrder(order.value, store.state.token);
      if (response.errors?.length > 0) errors.value = response.errors;
      if (response.createdOrder?._id) {
        order.value = {};
        createdOrder.value = response.createdOrder;
      }

      loading.value = false;
    }

    return {
      order,
      errors,
      createdOrder,
      loading,
      placeOrder
    };
  },
};
</script>

<style scoped>
.table-action_fix-width {
  min-width: 120px;
}
</style>