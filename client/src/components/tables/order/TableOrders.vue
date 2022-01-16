<template>
  <table
    class="table table-striped table-centered w-100 dt-responsive nowrap"
    id="orders-datatable"
  >
    <thead class="table-light">
      <tr>
        <th class="all" style="width: 20px">
          <div class="form-check">
            <input type="checkbox" class="form-check-input" id="customCheck1" />
            <label class="form-check-label" for="customCheck1">&nbsp;</label>
          </div>
        </th>
        <th>Создан</th>
        <th>Обновлён</th>
        <th class="all">Номер</th>
        <th>Клиент</th>
        <th>Склад</th>
        <th>Действие</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="order in orders"
        :key="order._id"
      >
        <td>
          <div class="form-check">
            <input type="checkbox" class="form-check-input" id="customCheck2" />
            <label class="form-check-label" for="customCheck2">&nbsp;</label>
          </div>
        </td>
        <td>{{ moment(order.createdAt).format("DD/MM/YYYY") }}</td>
        <td>{{ moment(order.updatedAt).format("DD/MM/YYYY") }}</td>
        <td>{{ order.orderId }}</td>
        <td>{{ order.customer }}</td>
        <td>{{ order.warehouse }}</td>
        <td></td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { ref, onMounted, getCurrentInstance } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const orders = ref([]);

    const internalInstance = getCurrentInstance();
    const moment = internalInstance.appContext.config.globalProperties.$moment;

    onMounted(() => getOrders());

    async function getOrders() {
      const response = await fetch('/api/v1/order', { headers: { token: store.state.token } });
      if (response.status === 200) orders.value = await response.json();
    }

    return {
      orders,
      moment
    };
  }
}
</script>