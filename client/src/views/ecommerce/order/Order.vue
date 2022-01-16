<template>
  <div class="container-fluid text-start">
    <!-- start page title -->
    <div class="row">
      <div class="col-12">
        <div class="page-title-box">
          <div class="page-title-right">
            <Breadcrumbs :breadcrumbs="[{ title: 'Главная', link: '/'}, { title: 'Все заказы' }]" />
          </div>
          <h4 class="page-title">Заказы</h4>
        </div>
      </div>
    </div>
    <!-- end page title -->

    <div class="row">
      <div class="col-12">
        <div class="card" v-if="show.tableOrders">
          <div class="card-body">
            <div class="row mb-2">
              <div class="col-sm-5">
                <a @click.prevent="changeShow('tableCreateOrder')" href="#" class="btn btn-danger mb-2"
                  ><i class="mdi mdi-plus-circle me-2"></i> Создать заказ</a
                >
              </div>
              <div class="col-sm-7">
                <!-- <div class="text-sm-end">
                  <button type="button" class="btn btn-success mb-2 me-1">
                    <i class="mdi mdi-cog-outline"></i>
                  </button>
                  <button type="button" class="btn btn-light mb-2 me-1">
                    Импорт
                  </button>
                  <button type="button" class="btn btn-light mb-2">
                    Экспорт
                  </button>
                </div> -->
              </div>
            </div>

            <div class="table-responsive">
              <TableOrders />
            </div>
          </div>
        </div>
        <div class="card" v-if="show.tableCreateOrder">
          <div class="card-body">
            <div class="row mb-2">
              <div class="col-sm-5">
                <a @click.prevent="changeShow('tableOrders')" href="#" class="btn btn-info mb-2"
                  ><i class="mdi mdi-arrow-left me-2"></i> Назад</a
                >
              </div>
            </div>

            <div class="table-responsive">
              <!-- <TableCreateOrder /> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import TableOrders from '@/components/tables/order/TableOrders.vue'
// import TableSetProducts from '@/components/tables/order/TableCreateOrder.vue'

import { ref } from 'vue';

export default {
  components: {
    Breadcrumbs,
    TableOrders,
    // TableCreateOrder
  },
  setup() {
    let show = ref({
      tableOrders: true,
      tableCreateOrder: false
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

    return { show, changeShow }
  }
}
</script>