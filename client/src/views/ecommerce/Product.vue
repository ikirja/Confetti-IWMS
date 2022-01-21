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
              <li class="breadcrumb-item active">Товары</li>
            </ol>
          </div>
          <h4 class="page-title">Товары</h4>
        </div>
      </div>
    </div>
    <!-- end page title -->

    <div class="row">
      <div class="col-12">
        <div class="card" v-if="show.tableProducts">
          <div class="card-body">
            <div class="row mb-2">
              <div class="col-sm-5">
                <a @click.prevent="changeShow('tableSetProducts')" href="#" class="btn btn-danger mb-2"
                  ><i class="mdi mdi-plus-circle me-2"></i> Добавить товары</a
                >
              </div>
              <div class="col-sm-7">
                <div class="text-sm-end">
                  <!-- <button type="button" class="btn btn-success mb-2 me-1">
                    <i class="mdi mdi-cog-outline"></i>
                  </button>
                  <button type="button" class="btn btn-light mb-2 me-1">
                    Импорт
                  </button>
                  <button type="button" class="btn btn-light mb-2">
                    Экспорт
                  </button> -->
                </div>
              </div>
            </div>

            <div class="table-responsive">
              <TableProducts />
            </div>
          </div>
        </div>
        <div class="card" v-if="show.tableSetProducts">
          <div class="card-body">
            <div class="row mb-2">
              <div class="col-sm-5">
                <a @click.prevent="changeShow('tableProducts')" href="#" class="btn btn-info mb-2"
                  ><i class="mdi mdi-arrow-left me-2"></i> Назад</a
                >
              </div>
            </div>

            <div class="table-responsive">
              <TableSetProducts />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TableProducts from '@/components/tables/product/TableProducts.vue'
import TableSetProducts from '@/components/tables/product/TableSetProducts.vue'

import { ref } from 'vue';

export default {
  components: {
    TableProducts,
    TableSetProducts
  },
  setup() {
    let show = ref({
      tableProducts: true,
      tableSetProducts: false
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