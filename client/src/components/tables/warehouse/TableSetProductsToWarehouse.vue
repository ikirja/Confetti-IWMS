<template>
<div>
  <div class="row">
    <div class="col-12">
      <div class="page-title-box">
        <h4 class="page-title">Склад: {{ warehouse.title }}</h4>
      </div>
    </div>
  </div>
  <TableProductsInWarehouse />
  <TableProductsNotInWarehouse />
</div>
</template>

<script>
import TableProductsInWarehouse from '@/components/tables/warehouse/TableProductsInWarehouse.vue';
import TableProductsNotInWarehouse from '@/components/tables/warehouse/TableProductsNotInWarehouse.vue';

import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  components: {
    TableProductsInWarehouse,
    TableProductsNotInWarehouse
  },
  setup() {
    const store = useStore();
    const warehouse = computed(() => store.state.warehouses.currentWarehouse);

    return { warehouse }
  }
};
</script>