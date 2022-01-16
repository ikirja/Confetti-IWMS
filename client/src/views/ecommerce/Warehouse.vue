<template>
  <div class="container-fluid text-start">
    <!-- start page title -->
    <div class="row">
      <div class="col-12">
        <div class="page-title-box">
          <div class="page-title-right">
            <ol class="breadcrumb m-0">
              <li class="breadcrumb-item">
                <a href="javascript: void(0);">Главная</a>
              </li>
              <li class="breadcrumb-item active">Склады</li>
            </ol>
          </div>
          <h4 class="page-title">Склады</h4>
        </div>
      </div>
    </div>
    <!-- end page title -->

    <div class="row">
      <div class="col-12">
        <div class="card" v-if="show.tableWarehouses">
          <div class="card-body">
            <div class="row mb-2">
              <div class="col-sm-5">
                <a @click.prevent="changeShow('tableCreateWarehouse')" href="#" class="btn btn-danger mb-2"
                  ><i class="mdi mdi-plus-circle me-2"></i> Создать склад</a
                >
              </div>
              <!-- <div class="col-sm-7">
                <div class="text-sm-end">
                  <button type="button" class="btn btn-success mb-2 me-1">
                    <i class="mdi mdi-cog-outline"></i>
                  </button>
                  <button type="button" class="btn btn-light mb-2 me-1">
                    Импорт
                  </button>
                  <button type="button" class="btn btn-light mb-2">
                    Экспорт
                  </button>
                </div>
              </div> -->
            </div>

            <div class="table-responsive">
              <TableWarehouses
                @show-warehouse="viewWarehouse"
                @set-products-to-warehouse="setProductsToWarehouseView"
              />
            </div>
          </div>
        </div>
        <div class="card" v-if="show.tableCreateWarehouse">
          <div class="card-body">
            <div class="row mb-2">
              <div class="col-sm-5">
                <a @click.prevent="changeShow('tableWarehouses')" href="#" class="btn btn-info mb-2"
                  ><i class="mdi mdi-arrow-left me-2"></i> Назад</a
                >
              </div>
            </div>

            <div class="table-responsive">
              <TableCreateWarehouse />
            </div>
          </div>
        </div>
        <div class="card" v-if="show.tableSetProductsToWarehouse">
          <div class="card-body">
            <div class="row mb-2">
              <div class="col-sm-5">
                <a @click.prevent="changeShow('tableWarehouses')" href="#" class="btn btn-info mb-2"
                  ><i class="mdi mdi-arrow-left me-2"></i> Назад</a
                >
              </div>
            </div>

            <div class="table-responsive">
              <TableSetProductsToWarehouse />
            </div>
          </div>
        </div>
        <div class="card" v-if="show.tableWarehouse">
          <div class="card-body">
            <div class="row mb-2">
              <div class="col-sm-5">
                <a @click.prevent="changeShow('tableWarehouses')" href="#" class="btn btn-info mb-2"
                  ><i class="mdi mdi-arrow-left me-2"></i> Назад</a
                >
              </div>
            </div>

            <div class="table-responsive">
              <TableWarehouse />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TableWarehouses from '../../components/tables/warehouse/TableWarehouses.vue'
import TableCreateWarehouse from '../../components/tables/warehouse/TableCreateWarehouse.vue'
import TableSetProductsToWarehouse from '../../components/tables/warehouse/TableSetProductsToWarehouse.vue'
import TableWarehouse from '../../components/tables/warehouse/TableWarehouse.vue'

import { ref } from 'vue';
import { useStore } from 'vuex';

export default {
  components: {
    TableWarehouses,
    TableCreateWarehouse,
    TableSetProductsToWarehouse,
    TableWarehouse
  },
  setup() {
    const store = useStore();

    let show = ref({
      tableWarehouses: true,
      tableCreateWarehouse: false,
      tableSetProductsToWarehouse: false,
      tableWarehouse: false
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

    function viewWarehouse(warehouse) {
      store.dispatch('changeCurrentWarehouse', warehouse);
      changeShow('tableWarehouse');
    }

    function setProductsToWarehouseView(warehouse) {
      store.dispatch('changeCurrentWarehouse', warehouse);
      changeShow('tableSetProductsToWarehouse');
    }

    return { 
      show,
      changeShow,
      viewWarehouse,
      setProductsToWarehouseView
    }
  }
}
</script>