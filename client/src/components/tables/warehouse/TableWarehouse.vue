<template>
  <div class="row">
    <div class="col-4">
      <div class="page-title-box">
        <h4 class="page-title">Склад: {{ warehouse.title }} <small class="text-secondary">Связь: {{ warehouse.connection }}</small></h4>
      </div>
    </div>
    <div class="col-8 d-flex justify-content-end align-items-center">
      <div class="me-3">
        <button v-if="!show.tableProductsSupply" @click.prevent="changeShow('tableProductsSupply')" class="btn btn-primary">Поставка</button>
        <button v-if="show.tableProductsSupply" @click.prevent="changeShow('tableProductsInWarehouse')" class="btn btn-danger">Отменить</button>
      </div>
      <div class="me-3">
        <select class="form-select" name="connection" v-model="selectedConnectionWarehouse" :disabled="!canChangeConnectionWarehouse">
          <option v-for="warehouse in connectionWarehouses" :key="warehouse" :value="warehouse.warehouse_id" :selected="warehouse.warehouse_id === selectedConnectionWarehouse">{{ warehouse.name }}</option>
        </select>
      </div>
      <div class="me-3">
        <button v-if="!canChangeConnectionWarehouse" @click="canChangeConnectionWarehouse = !canChangeConnectionWarehouse" class="btn btn-info">Изменить склад</button>
        <button v-if="canChangeConnectionWarehouse" @click="changeConnectionWarehouse" class="btn btn-danger"><i class="mdi mdi-content-save-all me-2"></i> Сохранить склад</button>
      </div>
      <div class="me-3">
        <select class="form-select" name="connection" v-model="selectedConnection" :disabled="!canChangeConnection">
          <option v-for="connection in connections" :key="connection" :value="connection" :selected="connection === selectedConnection">{{ connection }}</option>
        </select>
      </div>
      <div>
        <button v-if="!canChangeConnection" @click="canChangeConnection = !canChangeConnection" class="btn btn-info">Изменить связь</button>
        <button v-if="canChangeConnection" @click="changeConnection" class="btn btn-success"><i class="mdi mdi-content-save-all me-2"></i> Сохранить связь</button>
      </div>
    </div>
  </div>
  <div class="row" v-if="show.tableProductsSupply">
    <div class="col-12">
      <TableProductsSupply />
    </div>
  </div>
  <div class="row" v-if="show.tableProductsInWarehouse">
    <div class="col-12">
      <TableProductsInWarehouse
        :setIsDisabled="true"
      />
    </div>
  </div>
</template>

<script>
import TableProductsSupply from '@/components/tables/warehouse/TableProductsSupply.vue';
import TableProductsInWarehouse from '@/components/tables/warehouse/TableProductsInWarehouse.vue';

import getWarehouseList from '@/modules/marketplace/ozon/get-warehouse-list';
import getConnections from '@/modules/warehouse/get-connections';
import setConnection from '@/modules/warehouse/set-connection';
import setConnectionWarehouse from '@/modules/warehouse/set-connection-warehouse';

import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
  components: {
    TableProductsSupply,
    TableProductsInWarehouse
  },
  setup() {
    const store = useStore();
    const warehouse = computed(() => store.state.warehouses.currentWarehouse);
    const connections = ref([]);
    const connectionWarehouses = ref([]);
    const selectedConnectionWarehouse = ref('');
    const selectedConnection = ref('');
    let canChangeConnection = ref(false);
    let canChangeConnectionWarehouse = ref(false);

    let show = ref({
      tableProductsInWarehouse: true,
      tableProductsSupply: false
    });

    function changeShow(type) {
      for (const key in show.value) {
        if (key == type) {
          show.value[key] = true
        } else {
          show.value[key] = false
        }
      }
    }

    onMounted(async () => {
      connections.value = await getConnections(store.state.token)
      selectedConnection.value = warehouse.value.connection;

      connectionWarehouses.value = await getWarehouseList(store.state.token);
      selectedConnectionWarehouse.value = warehouse.value.connectionWarehouse;
    });

    async function changeConnection() {
      const response = await setConnection({ warehouseId: warehouse.value._id, connection: selectedConnection.value, token: store.state.token });
      if (response.error) return alert('Произошла ошибка');

      store.dispatch('changeCurrentWarehouse', response);
      canChangeConnection.value = !canChangeConnection.value;
    }

    async function changeConnectionWarehouse() {
      const response = await setConnectionWarehouse({ warehouseId: warehouse.value._id, connectionWarehouseId: selectedConnectionWarehouse.value, token: store.state.token });
      if (response.error) return alert('Произошла ошибка');

      store.dispatch('changeCurrentWarehouse', response);
      canChangeConnectionWarehouse.value = !canChangeConnectionWarehouse.value;
    }

    return {
      warehouse,
      connections,
      connectionWarehouses,
      selectedConnectionWarehouse,
      selectedConnection,
      canChangeConnection,
      canChangeConnectionWarehouse,
      show,
      changeShow,
      changeConnection,
      changeConnectionWarehouse
    }
  },
}
</script>