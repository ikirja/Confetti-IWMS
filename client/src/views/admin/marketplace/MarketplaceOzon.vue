<template>
  <div class="container-fluid text-start">
    <div class="row">
      <div class="col-12">
        <div class="page-title-box">
          <div class="page-title-right">
            <Breadcrumbs :breadcrumbs="[{ title: 'Главная', link: '/'}, { title: 'Маркетплейсы' }, { title: 'OZON' }]" />
          </div>
          <h4 class="page-title">Маркетплейс: OZON</h4>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="row mb-2">
              <div class="col-sm-5">
                <h4>Настройки</h4>
              </div>
              <div class="col-sm-7">
                <div class="text-sm-end">
                  <button @click="setOzonSellerApiConfig" type="button" class="btn btn-success mb-2">
                    <i class="mdi mdi-content-save-all me-2"></i> Сохранить настройки
                  </button>
                </div>
              </div>
            </div>

            <div class="table-responsive">
              <div class="mb-3">
                <label for="ozon-seller-api-url" class="form-label">OZON Seller API URL</label>
                <input v-model="settings.url" type="text" id="ozon-seller-api-url" class="form-control" :disabled="loading">
              </div>
              <div class="mb-3">
                <label for="ozon-seller-api-client-id" class="form-label">Client ID</label>
                <input v-model="settings.clientId" type="text" id="ozon-seller-api-client-id" class="form-control" :disabled="loading">
              </div>
              <div class="mb-3">
                <label for="ozon-seller-api-key" class="form-label">API-KEY</label>
                <input v-model="settings.apiKey" type="text" id="ozon-seller-api-key" class="form-control" :disabled="loading">
              </div>
              <div class="mb-3">
                <label for="ozon-seller-api-key" class="form-label">HOST</label>
                <input v-model="settings.host" type="text" id="ozon-seller-api-host" class="form-control" :disabled="loading">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumbs from '@/components/layout/Breadcrumbs.vue';

import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import request from '@/modules/request';

export default {
  components: {
    Breadcrumbs
  },
  setup() {
    const store = useStore();
    const settings = ref({
      url: '',
      clientId: '',
      apiKey: '',
      host: ''
    });
    let loading = ref(false);

    onMounted(() => getOzonSellerApiConfig());

    async function getOzonSellerApiConfig() {
      loading.value = true;

      const json = await request('/api/v1/marketplace/ozon/get-config', 'GET', store.state.token);
      setCurrentSettings(json);

      loading.value = false;
    }

    async function setOzonSellerApiConfig() {
      loading.value = true;

      const json = await request('/api/v1/marketplace/ozon/set-config', 'POST', store.state.token, settings.value);
      setCurrentSettings(json);

      if (json.error) return;

      alert('Настройки успешно сохранены');

      loading.value = false;
    }

    function setCurrentSettings(jsonData) {
      if (jsonData.error) return alert('Произошла ошибка');

      settings.value.url = jsonData.url;
      settings.value.clientId = jsonData.clientId;
      settings.value.apiKey = jsonData.apiKey;
      settings.value.host = jsonData.host;
    }

    return {
      settings,
      loading,
      setOzonSellerApiConfig
    }
  }
}
</script>