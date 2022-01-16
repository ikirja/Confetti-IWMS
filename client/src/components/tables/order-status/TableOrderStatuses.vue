<template>
  <table
    class="table table-striped table-centered w-100 dt-responsive nowrap"
    id="warehouses-datatable"
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
        <th class="all">Название</th>
        <th style="width: 85px">Действие</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="status in orderStatuses"
        :key="status._id"
      >
        <td>
          <div class="form-check">
            <input type="checkbox" class="form-check-input" id="customCheck2" />
            <label class="form-check-label" for="customCheck2">&nbsp;</label>
          </div>
        </td>
        <td>{{ moment(status.createdAt).format("DD/MM/YYYY") }}</td>
        <td>{{ moment(status.updatedAt).format("DD/MM/YYYY") }}</td>
        <td>{{ status.title }}</td>
        <td class="table-action table-action_fix-width">
          <a @click.prevent="deleteOrderStatus(status)" href="#" class="action-icon">
            <i class="uil-trash-alt"></i
          ></a>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { ref, onMounted, getCurrentInstance } from "vue";
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();
    const orderStatuses = ref([]);

    const internalInstance = getCurrentInstance();
    const moment = internalInstance.appContext.config.globalProperties.$moment;

    onMounted(() => getOrderStatuses());

    async function getOrderStatuses() {
      const response = await fetch('/api/v1/order-status', { headers: { token: store.state.token } });
      if (response.status === 200) orderStatuses.value = await response.json();
    }

    async function deleteOrderStatus(status) {
      alert('Функционал в разработке ' + status._id.toString());
    }

    return { 
      orderStatuses, 
      moment,
      deleteOrderStatus
    }
  }
}
</script>