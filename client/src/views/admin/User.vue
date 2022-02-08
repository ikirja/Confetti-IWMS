<template>
  <div class="container-fluid text-start">
    <div class="row">
      <div class="col-12">
        <div class="page-title-box">
          <div class="page-title-right">
            <Breadcrumbs :breadcrumbs="[{ title: 'Главная', link: '/'}, { title: 'Пользователи' }]" />
          </div>
          <h4 class="page-title">Пользователи</h4>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <div class="card" v-if="show.tableUsers">
          <div class="card-body">
            <div class="row mb-2">
              <div class="col-sm-5">
                <a @click.prevent="changeShow('tableCreateUser')" href="#" class="btn btn-danger mb-2"
                  ><i class="mdi mdi-plus-circle me-2"></i> Добавить пользователя</a
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
              <Table 
                :columns="columns"
                :entries="entries"
                :actions="actions"
              />
            </div>
          </div>
        </div>
        <div class="card" v-if="show.tableCreateUser">
          <div class="card-body">
            <div class="row mb-2">
              <div class="col-sm-5">
                <a @click.prevent="changeShow('tableUsers')" href="#" class="btn btn-info mb-2"
                  ><i class="mdi mdi-arrow-left me-2"></i> Назад</a
                >
              </div>
            </div>

            <div class="table-responsive">
              <TableCreateUser />
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
import TableCreateUser from '@/components/tables/user/TableCreateUser.vue';

import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import request from '@/modules/request';

export default {
  components: {
    Breadcrumbs,
    Table,
    TableCreateUser
  },
  setup() {
    const store = useStore();
    const columns = [
      { id: 1, title: 'ID' },
      { id: 2, title: 'Логин' },
      { id: 3, title: 'Имя' },
      { id: 4, title: 'Фамилия' },
      { id: 5, title: 'Администратор' },
      { id: 6, title: 'Версия' }
    ];
    const entries = ref([]);
    let show = ref({
      tableUsers: true,
      tableCreateUser: false
    });
    const actions = {
      setUserAdmin: {
        method: setUserAdmin,
        classes: {
          'mdi': true,
          'mdi-account-convert': true
        }
      }
    }

    onMounted(() => getUsers());

    function changeShow(type) {
      for (const key in show.value) {
        if (key == type) {
          show.value[key] = true
        } else {
          show.value[key] = false
        }
      }
    }

    async function getUsers() {
      const url = '/api/v1/user';
      const jsonData = await request(url, 'GET', store.state.token);
      entries.value = jsonData;
    }

    async function setUserAdmin(user) {
      const json = await request(
        '/api/v1/user',
        'POST',
        store.state.token,
        { userId: user._id }
      )
      if (json.error) return alert('Произошла ошибка');

      getUsers();
    }

    return {
      columns,
      entries,
      actions,
      show,
      changeShow
    }
  }
}
</script>