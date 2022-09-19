<template>
  <div class="d-flex justify-content-between mb-2">
    <div class="d-flex align-items-center">
      <span class="text-nowrap me-1">Показать по:</span>
      <select @change="paginateEntries" v-model="currentShowEntries" class="form-select">
        <option v-for="entry in showEntries" :key="entry" :value="entry">{{ entry }}</option>
      </select>
    </div>
    <div class="d-flex align-items-center">
      <input @input="searchEvent" v-model="searchInput" type="search" class="form-control" placeholder="Найти" />
    </div>
  </div>

  <table
    class="table table-striped table-centered w-100 dt-responsive nowrap"
  >
    <thead class="table-light">
      <tr>
        <th @click.prevent="sortByColumn('title')" class="all sort" :class="{ 'asc': sortColumns.title === 'desc', 'desc': sortColumns.title === 'asc'}" role="button">Название</th>
        <th>Фото</th>
        <th @click.prevent="sortByColumn('createdAt')" class="sort" :class="{ 'asc': sortColumns.createdAt === 'desc', 'desc': sortColumns.createdAt === 'asc'}" role="button">Создан</th>
        <th @click.prevent="sortByColumn('updatedAt')" class="sort" :class="{ 'asc': sortColumns.updatedAt === 'desc', 'desc': sortColumns.updatedAt === 'asc'}" role="button">Обновлён</th>
        <th @click.prevent="sortByColumn('sku')" class="sort" :class="{ 'asc': sortColumns.sku === 'desc', 'desc': sortColumns.sku === 'asc' }" role="button">Артикул</th>
        <th @click.prevent="sortByColumn('weight')" class="sort" :class="{ 'asc': sortColumns.weight === 'desc', 'desc': sortColumns.weight === 'asc'}" role="button">Вес</th>
        <th>Габариты</th>
        <th @click.prevent="sortByColumn('barcode')" class="sort" :class="{ 'asc': sortColumns.barcode === 'desc', 'desc': sortColumns.barcode === 'asc'}" role="button">Штрихкод</th>
        <th @click.prevent="sortByColumn('description')" class="sort" :class="{ 'asc': sortColumns.description === 'desc', 'desc': sortColumns.description === 'asc'}" role="button">Описание</th>
        <th @click.prevent="sortByColumn('purchasePrice')" class="sort" :class="{ 'asc': sortColumns.purchasePrice === 'desc', 'desc': sortColumns.purchasePrice === 'asc'}" role="button">Закупочная цена</th>
        <th>Действие</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="filteredProducts.length === 0">
        <td class="text-center" colspan="10">Нет товаров</td>
      </tr>
      <tr
        v-for="product in filteredProducts"
        :key="product._id"
      >
        <td>
          <p class="m-0 d-inline-block align-middle font-16">
            <a href="#" class="text-body">{{ product.title }}</a>
            <br />
            <span class="text-warning mdi mdi-star"></span>
            <span class="text-warning mdi mdi-star"></span>
            <span class="text-warning mdi mdi-star"></span>
            <span class="text-warning mdi mdi-star"></span>
            <span class="text-warning mdi mdi-star"></span>
          </p>
        </td>
        <td>
          <img
            v-if="product.image"
            :src="'/upload/' + product.image.file + '.jpg'"
            alt="contact-img"
            title="contact-img"
            class="rounded me-3"
            height="48"
          />
        </td>
        <td>{{ moment(product.createdAt).format("DD/MM/YYYY") }}</td>
        <td>{{ moment(product.updatedAt).format("DD/MM/YYYY") }}</td>
        <td>{{ product.sku }}</td>
        <td>{{ product.weight }}</td>
        <td>
          {{ product.dimensions.width }}x{{ product.dimensions.height }}x{{
            product.dimensions.depth
          }}
        </td>
        <td>{{ product.barcode }}</td>
        <td>{{ product.description.substring(0, 50) }}...</td>
        <td>{{ product.purchasePrice }} руб.</td>
        <td>
          <a :href="'/ecommerce/product/' + product._id" class="action-icon">
            <i class="mdi mdi-eye"></i
          ></a>
          <a @click.prevent="toggleModal(product._id)" href="#" class="action-icon">
            <i class="mdi mdi-file-upload"></i>
          </a>
          <a @click.prevent="archiveProduct(product._id)" href="#" class="action-icon">
            <i class="uil-trash-alt"></i
          ></a>
          <ModalImageUpload
            :show="product.showModal"
            :product="product"
            @toggle-modal="toggleModal"
          />
        </td>
      </tr>
    </tbody>
  </table>

  <div class="d-flex justify-content-between mb-2">
    <div class="d-flex align-items-center">
      <span>С {{ showInfo.from }} по {{ showInfo.to }} из {{ showInfo.total }}</span>
    </div>

    <div class="d-flex align-items-center">
      <div class="dataTables_paginate paging_simple_numbers">
        <ul class="pagination pagination-rounded mb-0">
          <li class="paginate_button page-item previous" :class="{ 'disabled': currentPage == 1 }">
            <a @click.prevent="paginateEvent(currentPage - 1)" href="#" class="page-link"><i class="mdi mdi-chevron-left"></i></a>
          </li>
          <li v-for="page in showPagination" :key="page" class="paginate_button page-item" :class="{ active: page == currentPage, 'disabled': page === '...' }">
            <a @click.prevent="paginateEvent(page)" href="#" class="page-link">{{ page }}</a>
          </li>
          <li class="paginate_button page-item next" :class="{ 'disabled': currentPage == totalPages }">
            <a @click.prevent="paginateEvent(currentPage + 1)" href="#" class="page-link"><i class="mdi mdi-chevron-right"></i></a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import ModalImageUpload from '@/components/modals/product/ModalImageUpload.vue';

import { ref, onMounted, computed, getCurrentInstance } from "vue";
import { useStore } from "vuex";
import request from '@/modules/request';
import { paginateArray, paginateInfo, getTotalPages, pagination, searchInArray } from '@/modules/helpers/data-table';

export default {
  components: {
    ModalImageUpload
  },
  setup() {
    const sortColumns = ref({
      createdAt: 'asc',
      updatedAt: 'asc',
      title: 'asc',
      sku: 'asc',
      weight: 'asc',
      barcode: 'asc',
      description: 'asc',
      purchasePrice: 'asc'
    });

    const showEntries = ref([ 10, 25, 50, 75, 100 ]);
    const currentShowEntries = ref(10);
    const currentPage = ref(1);
    const totalPages = ref(1);
    const searchInput = ref('');
    const showInfo = computed(() => paginateInfo(getCurrentProducts(), currentShowEntries.value, currentPage.value));
    const showPagination = computed(() => pagination(totalPages.value, currentPage.value, 3));
    const filteredProducts = ref([]);
    const searchProducts = ref([]);
    
    const store = useStore();
    const products = ref([]);

    const internalInstance = getCurrentInstance();
    const moment = internalInstance.appContext.config.globalProperties.$moment;

    onMounted(async () => getProducts());

    async function getProducts() {
      const json = await request('/api/v1/product', 'GET', store.state.token);
      json.forEach(product => product.showModal = false);
      products.value = json;

      sortByColumn('sku');
      totalPages.value = getTotalPages(products.value, currentShowEntries.value);
    }

    function toggleModal(productId) {
      products.value.forEach(product => {
        if (product._id.toString() === productId.toString()) {
          product.showModal = !product.showModal;
          const body = document.querySelector("body");
          product.showModal ? body.classList.add("modal-open") : body.classList.remove("modal-open");
        }
      });
    }

    async function archiveProduct(productId) {
      const json = await request('/api/v1/product/archive', 'POST', store.state.token, { productId });

      if (json.error) return alert(json.error[0]?.message || JSON.stringify(json));

      getProducts();
      alert('Успешно');
    }

    function getCurrentProducts() {
      if (searchProducts.value.length <= 0) return products.value;
      return searchProducts.value;
    }

    function paginateEntries() {  
      if (searchInput.value.length >= 1) {
        searchProducts.value = searchInArray(products.value, searchInput.value);
        filteredProducts.value = paginateArray(searchProducts.value, currentShowEntries.value, currentPage.value);
        totalPages.value = getTotalPages(searchProducts.value, currentShowEntries.value);
      } else {
        searchProducts.value = [];
        filteredProducts.value = paginateArray(products.value, currentShowEntries.value, currentPage.value);
        totalPages.value = getTotalPages(products.value, currentShowEntries.value);
      }
    }

    function paginateEvent(page) {
      currentPage.value = page;
      paginateEntries();
    }

    function searchEvent() {
      currentPage.value = 1;
      paginateEntries();
    }

    function sortByColumn(dataType) {
      const currentProducts = getCurrentProducts();
      let sortType = sortColumns.value[dataType];
      
      if (sortType === 'asc') {
        currentProducts.sort((a, b) => {
          if (a[dataType] < b[dataType]) return -1;
          if (a[dataType] > b[dataType]) return 1;
          return 0;
        });
      }

      if (sortType === 'desc') {
        currentProducts.sort((a, b) => {
          if (a[dataType] > b[dataType]) return -1;
          if (a[dataType] < b[dataType]) return 1;
          return 0;
        });
      }

      sortType === 'asc' ? sortColumns.value[dataType] = 'desc' : sortColumns.value[dataType] = 'asc';

      searchProducts.value = currentProducts;
      paginateEntries();
    }

    return {
      sortColumns,
      showEntries,
      currentShowEntries,
      showInfo,
      showPagination,
      currentPage,
      totalPages,
      searchInput,
      filteredProducts,
      moment,
      toggleModal,
      archiveProduct,
      paginateEntries,
      paginateEvent,
      searchEvent,
      sortByColumn
    };
  }
}
</script>

<style scoped>
.sort {
  position: relative;
}
.sort.asc::after {
  content: url('/assets/images/icons/angle-up.svg');
  position: absolute;
  width: 20px;
}
.sort.desc::after {
  content: url('/assets/images/icons/angle-down.svg');
  position: absolute;
  width: 20px;
}
</style>