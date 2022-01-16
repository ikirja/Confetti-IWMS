<template>
  <div class="row">
    <div class="col-12">
      <div class="page-title-box">
        <h4 class="page-title">Склад: {{ warehouse.title }}</h4>
      </div>
    </div>
  </div>
  <TableProductsInWarehouse
    :setIsDisabled="true"
  />
</template>

<script>
import TableProductsInWarehouse from '@/components/tables/warehouse/TableProductsInWarehouse.vue';

import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  components: {
    TableProductsInWarehouse
  },
  setup() {
    const store = useStore();
    const warehouse = computed(() => store.state.warehouses.currentWarehouse);

    return { warehouse }
  },
}
</script>