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
        <th>Связь</th>
        <th style="width: 85px">Действие</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="warehouse in warehouses"
        :key="warehouse._id"
      >
        <td>
          <div class="form-check">
            <input type="checkbox" class="form-check-input" id="customCheck2" />
            <label class="form-check-label" for="customCheck2">&nbsp;</label>
          </div>
        </td>
        <td>{{ moment(warehouse.createdAt).format("DD/MM/YYYY") }}</td>
        <td>{{ moment(warehouse.updatedAt).format("DD/MM/YYYY") }}</td>
        <td>{{ warehouse.title }}</td>
        <td>{{ warehouse.connection }}</td>
        <td class="table-action table-action_fix-width">
          <a @click.prevent="showWarehouse(warehouse)" href="#" class="action-icon">
            <i class="mdi mdi-eye"></i
          ></a>
          <a @click.prevent="showSetProductsToWarehouseView(warehouse)" href="#" class="action-icon">
            <i class="mdi mdi-database-plus"></i
          ></a>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { ref, onMounted, getCurrentInstance } from "vue";
import { useStore } from "vuex";
import request from '@/modules/request';

export default {
  setup(props, { emit }) {
    const store = useStore();
    const warehouses = ref([]);

    const internalInstance = getCurrentInstance();
    const moment = internalInstance.appContext.config.globalProperties.$moment;

    onMounted(() => getWarehouses());

    async function getWarehouses() {
      const json = await request('/api/v1/warehouse', 'GET', store.state.token);
      warehouses.value = json;
    }

    function showWarehouse(warehouse) {
      emit('showWarehouse', warehouse);
    }

    function showSetProductsToWarehouseView(warehouse) {
      emit('setProductsToWarehouse', warehouse);
    }

    return { 
      warehouses, 
      moment,
      showWarehouse,
      showSetProductsToWarehouseView
    }
  }
}
</script>

<style scoped>
.table-action_fix-width {
  min-width: 85px;
}
</style>