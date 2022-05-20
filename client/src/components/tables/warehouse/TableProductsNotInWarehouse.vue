<template>
  <div class="row">
    <div class="col-12">
      <div class="page-title-box">
        <h4 class="page-title">Товары не на складе</h4>
      </div>
    </div>
  </div>
  <div
    v-if="errors.length > 0"
    class="alert alert-danger bg-danger text-white border-0"
    role="alert"
  >
    <div>
      <strong>Товары не валидированы!</strong> Проверьте следующие товары:
      <ul>
        <li v-for="error in errors" :key="error.code">
          <strong>Артикул: {{ error.product.sku }}</strong
          >: {{ error.message }}
        </li>
      </ul>
    </div>
  </div>
  <div
    v-if="addedProducts.length > 0"
    class="alert alert-success bg-success text-white border-0"
    role="alert"
  >
    <div>
      <strong>Успешно!</strong> Добавлено {{ addedProducts.length }} товара/ов
    </div>
  </div>
  <div
    v-if="updatedProducts.length > 0"
    class="alert alert-info bg-info text-white border-0"
    role="alert"
  >
    <div>
      <strong>Успешно!</strong> Обновлено {{ updatedProducts.length }} товара/ов
    </div>
  </div>

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

  <table class="table table-striped table-centered w-100 dt-responsive nowrap">
    <thead class="table-light">
      <tr>
        <th class="all" style="width: 20px">
          <div class="form-check">
            <input v-model="checkedAll" type="checkbox" class="form-check-input" id="checkProducts" />
            <label class="form-check-label" for="checkProducts">&nbsp;</label>
          </div>
        </th>
        <th>#</th>
        <th @click.prevent="sortByColumn('title', true)" :class="{ 'asc': sortColumns.title === 'desc', 'desc': sortColumns.title === 'asc'}" role="button" class="all sort">Товар</th>
        <th v-if="warehouseIsForMarketplace()">РРЦ</th>
        <th>Цена</th>
        <th>Количество</th>
        <th v-if="warehouseIsForMarketplace()" style="width: 250px">Категория</th>
        <th v-if="warehouseIsForMarketplace() && marketplaceName !== 'wildberries'">Характеристики</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="filteredProducts.length === 0">
        <td class="text-center" colspan="10">Нет товаров</td>
      </tr>
      <tr
        v-for="(product, index) in filteredProducts"
        :key="product.product._id"
      >
        <td>
          <div class="form-check">
            <input type="checkbox" v-model="product.checked" class="form-check-input" :id="'customCheck' + index" />
            <label class="form-check-label" :for="'customCheck' + index">&nbsp;</label>
          </div>
        </td>
        <td>{{ index + 1 }}</td>
        <td>
          <div><strong>{{ product.product.title }}</strong></div>
          <div>Артикул: {{ product.product.sku }}</div>
          <div>Штрихкод: {{ product.product.barcode }}</div>
          <div>ЗЦ: {{ product.product.purchasePrice }}</div>
        </td>
        <td v-if="warehouseIsForMarketplace()">
          <div v-if="warehouse?.connection === 'ozon-seller-api'">
            <strong>{{ product.ozon.rrp }}</strong>
          </div>
          <div v-if="warehouse?.connection === 'wildberries-seller-api'">
            <strong>{{ product.wildberries.rrp }}</strong>
          </div>
        </td>
        <td>
          <div>
            <input
              type="number"
              min="0"
              v-model="product.price"
              placeholder="Руб"
              class="form-control"
              :id="'input' + index"
            />
          </div>
        </td>
        <td>
          <div>
            <input
              type="number"
              min="0"
              v-model="product.quantity"
              placeholder="Укажите количество для склада"
              class="form-control"
              :id="'input' + index"
            />
          </div>
        </td>
        <td v-if="warehouseIsForMarketplace()">
          <div v-if="warehouse?.connection === 'ozon-seller-api'">
            <SelectCategoryOzon
              v-if="!product.ozon.category"
              :product-id="product._id"
              @selected-category="selectCategoryForProduct"
              @remove-category-from-product="removeCategoryFromProduct"
            />
            <small v-if="product.ozon.category" class="text-secondary fw-bold">Категория: <span class="text-info">{{ product.ozon.category.title }}</span></small>
          </div>
          <div v-if="warehouse?.connection === 'wildberries-seller-api'">
            <SelectCategoryWildberries
              v-if="!product.wildberries.category"
              :product-id="product._id"
              @selected-category="selectCategoryForProduct"
              @remove-category-from-product="removeCategoryFromProduct"
            />
            <small v-if="product.wildberries.category" class="text-secondary fw-bold">Категория: <span class="text-info">{{ product.wildberries.category.name }}</span></small>
          </div>
        </td>
        <td v-if="warehouseIsForMarketplace() && marketplaceName !== 'wildberries'">
          <div v-if="warehouse?.connection === 'ozon-seller-api'">
            <button class="btn btn-primary" @click="toggleModal(product.product._id)" :disabled="!product.ozon.category">Характеристики</button>
            <ModalAttributesOzon
              :show="product.ozon.showModal"
              :product="product"
              @select-attributes-for-product="selectAttributesForProduct"
              @toggle-modal="toggleModal"
            />
            <small v-if="product.ozon.attributes?.length > 0" class="text-success fw-bold">Характеристики указаны</small>
          </div>
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

  <div class="row mb-2">
    <div class="col-6">
    
    </div>
    <div class="col-6 text-end">
      <button
        v-if="!loading"
        @click.prevent="setProducts"
        class="btn btn-success mb-2"
        :disabled="!products.some(product => product.checked)"
      >
        <i class="mdi mdi-content-save-all me-2"></i> Добавить на склад
      </button>
      <button v-if="loading" class="btn btn-success mb-2" disabled>
        <span
          class="spinner-grow spinner-grow-sm me-1"
          role="status"
          aria-hidden="true"
        ></span>
        Загрузка...
      </button>
    </div>
  </div>
</template>

<script>
import SelectCategoryOzon from '@/components/forms/ozon/SelectCategoryOzon.vue';
import SelectCategoryWildberries from '@/components/forms/wildberries/SelectCategoryWildberries.vue';
import ModalAttributesOzon from '@/components/modals/marketplace/ozon/ModalAttributesOzon.vue';

import { ref, onMounted, watchEffect, computed } from "vue";
import { useStore } from "vuex";
import request from '@/modules/request';

import { paginateArray, paginateInfo, getTotalPages, pagination, searchInArrayWithProductObj } from '@/modules/helpers/data-table';

import getWarehouseMarketplaceName from '@/modules/warehouse/get-warehouse-marketplace-name';
import setProductsToWarehouse from '@/modules/warehouse/set-products-to-warehouse';
import getOzonRRP from '@/modules/marketplace/ozon/get-ozon-rrp';
import getWildberriesRRP from '@/modules/marketplace/wildberries/get-wildberries-rrp';

export default {
  props: [ 'setIsDisabled' ],
  components: {
    SelectCategoryOzon,
    SelectCategoryWildberries,
    ModalAttributesOzon
  },
  setup() {
    const sortColumns = ref({
      title: 'asc',
      sku: 'asc'
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
    const warehouse = computed(() => store.state.warehouses.currentWarehouse);
    const marketplaceName = computed(() => getWarehouseMarketplaceName(warehouse.value));
    const products = ref([]);
    const addedProducts = ref([]);
    const updatedProducts = ref([]);
    const errors = ref([]);
    let checkedAll = ref(false);
    let loading = ref(false);

    onMounted(async () => {
      await getProductsForWarehouse();

      sortByColumn('sku', true);
      totalPages.value = getTotalPages(products.value, currentShowEntries.value);
    });

    watchEffect(() => {
      if (checkedAll.value) products.value.forEach(product => product.checked = true);
      if (!checkedAll.value) products.value.forEach(product => product.checked = false);
    });

    async function getProductsForWarehouse() {
      const json = await request('/api/v1/product', 'GET', store.state.token);

      const responseProducts = json;
      const productIdsInWarehouse = warehouse.value.products.map(productInWarehouse => productInWarehouse.product);

      responseProducts.forEach(product => {
        product.product = product;
        product.checked = false;
        product.price = null;
        product.quantity = null;

        if (warehouse.value.connection === 'ozon-seller-api') {
          product.ozon = {
            showModal: false,
            rrp: getOzonRRP(product)
          }
        }

        if (warehouse.value.connection === 'wildberries-seller-api') {
          product.wildberries = {
            showModal: false,
            rrp: getWildberriesRRP(product)
          }
        }
      });

      products.value = responseProducts.filter(product => !productIdsInWarehouse.includes(product._id.toString()));
    }

    function warehouseIsForMarketplace() {
      let isForMarketplace = false;

      if (warehouse.value.connection === 'ozon-seller-api') isForMarketplace = true;
      if (warehouse.value.connection === 'wildberries-seller-api') isForMarketplace = true;

      return isForMarketplace;
    }

    async function selectCategoryForProduct({ category, productId }) {
      products.value.forEach(product => {
        if (product.product._id.toString() === productId.toString()) {
          const marketplace = getWarehouseMarketplaceName(warehouse.value);

          if (marketplace) {
            if (marketplace === 'ozon') product[marketplace].categoryId = category.category_id;
            if (marketplace === 'wildberries') product[marketplace].categoryId = category.id;
            product[marketplace].category = category;
          }
        }
      });
    }

    function removeCategoryFromProduct(productId) {
      products.value.forEach(product => {
        if (product.product._id.toString() === productId.toString()) {
          const marketplace = getWarehouseMarketplaceName(warehouse.value);

          if (marketplace) {
            product[marketplace].categoryId = null;
            product[marketplace].category = null;
          }
        }
      });
    }

    function selectAttributesForProduct({ product, attributes }) {
      let selectedAttributes = [];

      attributes.forEach(attribute => {
        if (attribute.inputValue.length > 0) {
          let selectedAttribute = {
            complex_id: 0,
            id: attribute.id,
            values: []
          }

          if (attribute.is_collection && attribute.selectedValue) {
            selectedAttribute.values.push({
              dictionary_value_id: attribute.selectedValue.id,
              value: attribute.selectedValue.value
            });
          } else {
            selectedAttribute.values.push({
              value: attribute.inputValue
            });
          }

          selectedAttributes.push(selectedAttribute);
        }
      });

      if (selectedAttributes.length > 0) product.ozon.attributes = selectedAttributes;

      toggleModal(product.product._id);
    }

    function toggleModal(productId) {
      products.value.forEach(product => {
        if (product.product._id.toString() === productId.toString()) {
          product.ozon.showModal = !product.ozon.showModal;
          const body = document.querySelector("body");
          product.ozon.showModal ? body.classList.add("modal-open") : body.classList.remove("modal-open");
        }
      });
    }

    async function setProducts() {
      loading.value = true;

      const productsToSet = products.value.map(product => {
        product.product = product.product._id;
        return product;
      });

      const response = await setProductsToWarehouse(warehouse.value, productsToSet, store.state.token);
      
      if (response?.error?.length > 0) errors.value = response.error;
      if (response?.addedProducts?.length > 0) addedProducts.value = response.addedProducts;
      if (response?.updatedProducts?.length > 0) updatedProducts.value = response.addedProducts;

      await getProductsForWarehouse();

      sortColumns.value.sku = 'asc';
      sortByColumn('sku', true);
      paginateEvent(1);

      loading.value = false;
    }

    function getCurrentProducts() {
      if (searchProducts.value.length <= 0) return products.value;
      return searchProducts.value;
    }

    function paginateEntries() {  
      if (searchInput.value.length >= 1) {
        searchProducts.value = searchInArrayWithProductObj(products.value, searchInput.value);
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

    function sortByColumn(dataType, inProductObj = false) {
      const currentProducts = getCurrentProducts();
      let sortType = sortColumns.value[dataType];
      
      if (sortType === 'asc') {
        currentProducts.sort((a, b) => {
          if (inProductObj) {
            if (a.product[dataType] < b.product[dataType]) return -1;
            if (a.product[dataType] > b.product[dataType]) return 1;
          } else {
            if (a[dataType] < b[dataType]) return -1;
            if (a[dataType] > b[dataType]) return 1;
          }
          
          return 0;
        });
      }

      if (sortType === 'desc') {
        currentProducts.sort((a, b) => {
          if (inProductObj) {
            if (a.product[dataType] > b.product[dataType]) return -1;
            if (a.product[dataType] < b.product[dataType]) return 1;
          } else {
            if (a[dataType] > b[dataType]) return -1;
            if (a[dataType] < b[dataType]) return 1;
          }
          
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
      warehouse,
      marketplaceName,
      products,
      addedProducts,
      updatedProducts,
      errors,
      checkedAll,
      loading,
      warehouseIsForMarketplace,
      selectCategoryForProduct,
      removeCategoryFromProduct,
      selectAttributesForProduct,
      toggleModal,
      setProducts,
      paginateEntries,
      paginateEvent,
      searchEvent,
      sortByColumn
    };
  },
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