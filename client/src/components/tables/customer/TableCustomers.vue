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
        <th class="all">Имя</th>
        <th>Телефон</th>
        <th>Дополнительные данные</th>
        <th style="width: 85px">Действие</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="customer in customers"
        :key="customer._id"
      >
        <td>
          <div class="form-check">
            <input type="checkbox" class="form-check-input" id="customCheck2" />
            <label class="form-check-label" for="customCheck2">&nbsp;</label>
          </div>
        </td>
        <td>{{ moment(customer.createdAt).format("DD/MM/YYYY") }}</td>
        <td>{{ moment(customer.updatedAt).format("DD/MM/YYYY") }}</td>
        <td>{{ customer.title }}</td>
        <td>{{ customer.phone }}</td>
        <td>
          <div v-for="field in customer.fields" :key="field">
            {{ field.key }} - {{ field.data }}
          </div>
        </td>
        <td class="table-action table-action_fix-width">
          <a @click.prevent="showCustomer(customer)" href="#" class="action-icon">
            <i class="mdi mdi-eye"></i
          ></a>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { ref, onMounted, getCurrentInstance } from "vue";
import { useStore } from "vuex";

export default {
  setup(props, { emit }) {
    const store = useStore();
    const customers = ref([]);

    const internalInstance = getCurrentInstance();
    const moment = internalInstance.appContext.config.globalProperties.$moment;

    onMounted(() => getCustomers());

    async function getCustomers() {
      const response = await fetch('/api/v1/customer', { headers: { token: store.state.token } });
      if (response.status === 200) customers.value = await response.json();
    }

    function showCustomer(customer) {
      emit('showCustomer', customer);
    }

    return { 
      customers, 
      moment,
      showCustomer
    }
  }
}
</script>

<style scoped>
.table-action_fix-width {
  min-width: 85px;
}
</style>