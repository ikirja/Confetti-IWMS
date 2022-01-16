<template>
  <div class="container-fluid text-start">
    <!-- start page title -->
    <div class="row">
      <div class="col-12">
        <div class="page-title-box">
          <div class="page-title-right">
            <Breadcrumbs :breadcrumbs="[{ title: 'Главная', link: '/'}, { title: 'Клиенты' }]" />
          </div>
          <h4 class="page-title">Клиенты</h4>
        </div>
      </div>
    </div>
    <!-- end page title -->

    <div class="row">
      <div class="col-12">
        <div class="card" v-if="show.tableCustomers">
          <div class="card-body">
            <div class="row mb-2">
              <div class="col-sm-5">
                <a @click.prevent="changeShow('tableCreateCustomer')" href="#" class="btn btn-danger mb-2"
                  ><i class="mdi mdi-plus-circle me-2"></i> Добавить клиента</a
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
              <TableCustomers />
            </div>
          </div>
        </div>
        <div class="card" v-if="show.tableCreateCustomer">
          <div class="card-body">
            <div class="row mb-2">
              <div class="col-sm-5">
                <a @click.prevent="changeShow('tableCustomers')" href="#" class="btn btn-info mb-2"
                  ><i class="mdi mdi-arrow-left me-2"></i> Назад</a
                >
              </div>
            </div>

            <div class="table-responsive">
              <TableCreateCustomer />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumbs from '../../components/layout/Breadcrumbs.vue'
import TableCustomers from '../../components/tables/customer/TableCustomers.vue'
import TableCreateCustomer from '../../components/tables/customer/TableCreateCustomer.vue'

import { ref } from 'vue';

export default {
  components: {
    Breadcrumbs,
    TableCustomers,
    TableCreateCustomer
  },
  setup() {
    let show = ref({
      tableCustomers: true,
      tableCreateCustomer: false
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