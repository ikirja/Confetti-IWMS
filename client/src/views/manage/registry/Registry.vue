<template>
  <div class="container-fluid text-start">
    <div class="row">
      <div class="col-12">
        <div class="page-title-box">
          <div class="page-title-right">
            <Breadcrumbs :breadcrumbs="[{ title: 'Главная', link: '/'}, { title: 'Регистр сведений' }]" />
          </div>
          <h4 class="page-title">Регистр сведений</h4>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <div class="card" v-if="show.tableRegistries">
          <div class="card-body">
            <div class="row mb-2">
              <!-- <div class="col-sm-5">
                <a @click.prevent="changeShow('tableCreateCustomer')" href="#" class="btn btn-danger mb-2"
                  ><i class="mdi mdi-plus-circle me-2"></i> Добавить клиента</a
                >
              </div> -->
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
              <Table 
                :columns="columns"
                :entries="entries"
                :isLoading="isLoading"
              />
            </div>
          </div>
        </div>
        <div class="card" v-if="show.tableRegistry">
          <div class="card-body">
            <div class="row mb-2">
              <div class="col-sm-5">
                <a href="#" class="btn btn-info mb-2"
                  ><i class="mdi mdi-arrow-left me-2"></i> Назад</a
                >
              </div>
            </div>

            <div class="table-responsive">

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumbs from '@/components/layout/Breadcrumbs.vue';
import Table from '@/components/tables/Table.vue';

import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import request from '@/modules/request';

export default {
  components: {
    Breadcrumbs,
    Table
  },
  setup() {
    const store = useStore();
    const columns = [
      {
        id: 1,
        title: 'Дата создания'
      },
      {
        id: 2,
        title: 'Дата обновления'
      },
      {
        id: 3,
        title: 'Тип',
      },
      {
        id: 4,
        title: 'Название',
      },
      {
        id: 5,
        title: 'Данные',
      }
    ];
    const entries = ref([]);
    let isLoading = ref(false);
    let show = ref({
      tableRegistries: true,
      tableRegistry: false
    });

    onMounted(() => getRegistries());

    function changeShow(type) {
      for (const key in show.value) {
        if (key == type) {
          show.value[key] = true
        } else {
          show.value[key] = false
        }
      }
    }

    async function getRegistries() {
      isLoading = true;

      const url = '/api/v1/registry';
      const jsonData = await request(url, 'GET', store.state.token);
      entries.value = jsonData.map(entry => {
        return { createdAt: entry.createdAt, updatedAt: entry.updatedAt, type: entry.type, title: entry.title, fields: entry.fields }
      });

      isLoading = false;
    }

    return {
      columns,
      entries,
      isLoading,
      show,
      changeShow
    }
  }
}
</script>