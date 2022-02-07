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
        title: 'Тип'
      },
      {
        id: 4,
        title: 'Название'
      },
      {
        id: 5,
        title: 'Данные'
      }
    ];
    const entries = ref([]);
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
      const url = '/api/v1/registry';
      let jsonData = await request(url, 'GET', store.state.token);
      jsonData = jsonData.filter(entry => entry.type === 'ozon');
      
      jsonData.sort((a, b) => {
        if (a.createdAt > b.createdAt) return -1;
        if (a.createdAt < b.createdAt) return 1;
        return 0;
      });

      entries.value = jsonData.map(entry => {
        let title = '';
        entry.title === 'product-import' ? title = 'Импорт товаров' : '';
        entry.title === 'product-prices' ? title = 'Обновление цен' : '';
        entry.title === 'product-stocks' ? title = 'Обновление остатков' : '';

        let data = '';

        for (const prop in entry.fields) {
          let info = '';
          console.log(prop)
          console.log(entry.fields[prop])
          prop === 'taskId' ? info = `Task ID: ${entry.fields[prop]} ` : '';

          if (prop === 'status') {
            info = 'Статус: ';
            entry.fields[prop] === 'created' ? info = info.concat('Создано ') :
            entry.fields[prop] === 'done' ? info = info.concat('Выполнено ') : '';
          }

          if (prop === 'products' && entry.fields[prop].length > 0) {
            info = 'Товары: ';
            entry.fields[prop].forEach(product => product.offer_id ? info = info.concat(`Артикул: ${product.offer_id} | `) : '');
          } 
          data = data.concat(info)
        }

        return {
          createdAt: entry.createdAt,
          updatedAt: entry.updatedAt,
          type: 'OZON',
          title,
          data
        }
      });
    }

    return {
      columns,
      entries,
      show,
      changeShow
    }
  }
}
</script>