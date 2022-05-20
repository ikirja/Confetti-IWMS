<template>
  <div class="row">
    <div class="col-6">
      <div class="page-title-box">
        <h4 class="page-title">Товары на складе</h4>
      </div>
    </div>
    <div class="col-6 d-flex justify-content-end align-items-center" v-if="!setIsDisabled">
      <button @click="updateProductsToMarketplace('prices')" class="btn btn-outline-warning me-3" :disabled="isLoadingMarketplace">Обновить цены</button>
      <button @click="updateProductsToMarketplace('stocks')" class="btn btn-outline-warning me-3" :disabled="isLoadingMarketplace">Обновить остатки</button>
      <button @click="setImtId" v-if="marketplaceName === 'wildberries'" class="btn btn-outline-info me-3" :disabled="isLoadingMarketplace">Записать ID {{ marketplaceName }}</button>
      <button @click="addToMarketplace" class="btn btn-outline-success" :disabled="isLoadingMarketplace">Добавить на маркетплейс</button>
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
        <th class="all" style="width: 20px" v-if="!setIsDisabled">
          <div class="form-check">
            <input v-model="checkedAll" type="checkbox" class="form-check-input" id="checkProducts" />
            <label class="form-check-label" for="checkProducts">&nbsp;</label>
          </div>
        </th>
        <th>#</th>
        <th @click.prevent="sortByColumn('title', true)" :class="{ 'asc': sortColumns.title === 'desc', 'desc': sortColumns.title === 'asc'}" role="button" class="all sort">Товар</th>
        <th v-if="marketplaceName">РРЦ</th>
        <th @click.prevent="sortByColumn('price')" class="sort" :class="{ 'asc': sortColumns.price === 'desc', 'desc': sortColumns.price === 'asc'}" role="button">Цена</th>
        <th>Поступление</th>
        <th @click.prevent="sortByColumn('inStock')" class="sort" :class="{ 'asc': sortColumns.inStock === 'desc', 'desc': sortColumns.inStock === 'asc'}" role="button">Кол-во на складе</th>
        <th v-if="warehouse?.connection === 'ozon-seller-api'">Offer ID</th>
        <th v-if="warehouse?.connection === 'ozon-seller-api' || warehouse?.connection === 'wildberries-seller-api'">Product ID</th>
        <th v-if="marketplaceName" style="width: 250px">Категория</th>
        <th v-if="marketplaceName">Характеристики</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="filteredProducts.length === 0">
        <td class="text-center" colspan="10">Нет товаров</td>
      </tr>
      <tr
        v-for="(productInWarehouse, index) in filteredProducts"
        :key="productInWarehouse.product._id"
      >
        <td v-if="!setIsDisabled">
          <div class="form-check">
            <input type="checkbox" v-model="productInWarehouse.checked" class="form-check-input" :id="'customCheck' + index" />
            <label class="form-check-label" :for="'customCheck' + index">&nbsp;</label>
          </div>
        </td>
        <td>{{ index + 1 }}</td>
        <td>
          <div><strong>{{ productInWarehouse.product.title }}</strong></div>
          <div>Артикул: {{ productInWarehouse.product.sku }}</div>
          <div>Штрихкод: {{ productInWarehouse.product.barcode }}</div>
          <div>ЗЦ: {{ productInWarehouse.product.purchasePrice }}</div>
        </td>
        <td v-if="marketplaceName">
          <div v-if="warehouse?.connection === 'ozon-seller-api'">
            <strong>{{ productInWarehouse.ozon.rrp }}</strong>
          </div>
          <div v-if="warehouse?.connection === 'wildberries-seller-api'">
            <strong>{{ productInWarehouse.wildberries.rrp }}</strong>
          </div>
        </td>
        <td>
          <div>
            <input
              type="number"
              min="0"
              v-model="productInWarehouse.price"
              placeholder="Руб"
              class="form-control"
              :id="'input' + index"
              :disabled="setIsDisabled"
            />
          </div>
        </td>
        <td>
          <div>
            <input
              type="number"
              min="0"
              v-model="productInWarehouse.quantity"
              placeholder="Укажите количество для склада"
              class="form-control"
              :id="'input' + index"
              :disabled="setIsDisabled"
            />
          </div>
        </td>
        <td>
          <div>
            <strong>{{ productInWarehouse.inStock }}</strong>
          </div>
        </td>
        <td v-if="warehouse?.connection === 'ozon-seller-api'">
          <div v-if="productInWarehouse.ozon.offerId">{{ productInWarehouse.ozon.offerId }}</div>
          <div v-else>Товар не выгружен</div>
        </td>
        <td v-if="warehouse?.connection === 'ozon-seller-api' || warehouse?.connection === 'wildberries-seller-api'">
          <div v-if="productInWarehouse[marketplaceName].productId">{{ productInWarehouse[marketplaceName].productId }}</div>
          <div v-else>Товар не выгружен</div>
        </td>
        <td v-if="marketplaceName">
          <div v-if="warehouse?.connection === 'ozon-seller-api'">
            <SelectCategoryOzon
              v-if="!productInWarehouse.ozon.category"
              :product-id="productInWarehouse.product._id"
              @selected-category="selectCategoryForProduct"
              @remove-category-from-product="removeCategoryFromProduct"
            />
            <small v-if="productInWarehouse.ozon.category" class="text-secondary fw-bold">Категория: <span class="text-info">{{ productInWarehouse.ozon.category.title }}</span></small>
          </div>
          <div v-if="warehouse?.connection === 'wildberries-seller-api'">
            <SelectCategoryWildberries
              v-if="!productInWarehouse.wildberries.category"
              :product-id="productInWarehouse._id"
              @selected-category="selectCategoryForProduct"
              @remove-category-from-product="removeCategoryFromProduct"
            />
            <small v-if="productInWarehouse.wildberries.category" class="text-secondary fw-bold">Категория: <span class="text-info">{{ productInWarehouse.wildberries.category.name }}</span></small>
          </div>
        </td>
        <td v-if="marketplaceName">
          <div v-if="warehouse?.connection === 'ozon-seller-api'">
            <button class="btn btn-primary" @click="toggleModal(productInWarehouse.product._id)" :disabled="!productInWarehouse.ozon.category">Характеристики</button>
            <ModalAttributesOzon
              :show="productInWarehouse.ozon.showModal"
              :product="productInWarehouse"
              @select-attributes-for-product="selectOzonAttributesForProduct"
              @toggle-modal="toggleModal"
            />
            <small v-if="productInWarehouse.ozon.attributes?.length > 0" class="text-success fw-bold">Характеристики указаны</small>
          </div>
          <div v-if="warehouse?.connection === 'wildberries-seller-api'">
            <button class="btn btn-primary" @click="toggleModal(productInWarehouse.product._id)" :disabled="!productInWarehouse.wildberries.category">Характеристики</button>
            <ModalAttributesWildberries
              :show="productInWarehouse.wildberries.showModal"
              :product="productInWarehouse"
              @select-attributes-for-product="selectWildberriesAttributesForProduct"
              @toggle-modal="toggleModal"
            />
            <small v-if="productInWarehouse.wildberries.attributes?.length > 0" class="text-success fw-bold">Характеристики указаны</small>
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

  <div class="row mb-2" v-if="!setIsDisabled">
    <div class="col-6">
    
    </div>
    <div class="col-6 text-end">
      <button
        v-if="!loading"
        @click.prevent="setProducts"
        class="btn btn-success mb-2"
        :disabled="!productsInWarehouse.some(product => product.checked)"
      >
        <i class="mdi mdi-content-save-all me-2"></i> Сохранить изменения
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
import ModalAttributesWildberries from '@/components/modals/marketplace/wildberries/ModalAttributesWildberries.vue';

import { ref, onMounted, watchEffect, computed } from 'vue';
import { useStore } from 'vuex';

import { paginateArray, paginateInfo, getTotalPages, pagination, searchInArrayWithProductObj } from '@/modules/helpers/data-table';

import getWarehouseMarketplaceName from '@/modules/warehouse/get-warehouse-marketplace-name';
import getWarehouseWithProducts from '@/modules/warehouse/get-warehouse-with-products';
import getSelectedOzonAttributes from '@/modules/warehouse/get-selected-ozon-attributes';
import getSelectedWildberriesAttributes from '@/modules/warehouse/get-selected-wildberries-attributes';
import addToMarketplaceFromWarehouse from '@/modules/warehouse/add-to-marketplace-from-warehouse';
import setImtIdWildberries from '@/modules/warehouse/set-imt-id-wildberries';
import getWbProductList from '@/modules/marketplace/wildberries/get-product-list';
import updateProductsToMarketplaceFromWarehouse from '@/modules/warehouse/update-products-to-marketplace-from-warehouse';
import setProductsToWarehouse from '@/modules/warehouse/set-products-to-warehouse';

export default {
  props: [ 'setIsDisabled' ],
  components: {
    SelectCategoryOzon,
    SelectCategoryWildberries,
    ModalAttributesOzon,
    ModalAttributesWildberries
  },
  setup() {
    const sortColumns = ref({
      title: 'asc',
      price: 'asc',
      inStock: 'asc',
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
    const marketplaceName = computed(() => getWarehouseMarketplaceName(warehouse.value))
    const productsInWarehouse = ref([]);
    const addedProducts = ref([]);
    const updatedProducts = ref([]);
    const errors = ref([]);
    let checkedAll = ref(false);
    let loading = ref(false);
    let isLoadingMarketplace = ref(false);

    onMounted(async () => {
      productsInWarehouse.value = await getWarehouseWithProducts({ warehouse: warehouse.value, token: store.state.token });

      sortByColumn('sku', true);
      totalPages.value = getTotalPages(productsInWarehouse.value, currentShowEntries.value);
    });

    watchEffect(() => {
      if (checkedAll.value) productsInWarehouse.value.forEach(product => product.checked = true);
      if (!checkedAll.value) productsInWarehouse.value.forEach(product => product.checked = false);
    });

    async function selectCategoryForProduct({ category, productId }) {
      if (!marketplaceName.value) return;

      productsInWarehouse.value.forEach(productInWarehouse => {
        if (productInWarehouse.product._id.toString() === productId.toString()) {
          if (marketplaceName.value === 'ozon') productInWarehouse[marketplaceName.value].categoryId = category.category_id;
          if (marketplaceName.value === 'wildberries') productInWarehouse[marketplaceName.value].categoryId = category.id;
          productInWarehouse[marketplaceName.value].category = category;
        }
      });
    }

    function removeCategoryFromProduct(productId) {
      if (!marketplaceName.value) return;

      productsInWarehouse.value.forEach(productInWarehouse => {
        if (productInWarehouse.product._id.toString() === productId.toString()) {
          productInWarehouse[marketplaceName.value].categoryId = null;
          productInWarehouse[marketplaceName.value].category = null;
        }
      });
    }

    function selectOzonAttributesForProduct({ product, attributes }) {
      const selectedAttributes = getSelectedOzonAttributes(attributes);
      if (selectedAttributes.length > 0) product.ozon.attributes = selectedAttributes;

      toggleModal(product.product._id);
    }

    function selectWildberriesAttributesForProduct({ product, attributes, attributesNomenslatureVariation, attributesNomenslature }) {
      const selectedAttributes = getSelectedWildberriesAttributes(product, attributes, attributesNomenslatureVariation, attributesNomenslature);

      if (
        !selectedAttributes.attributes.isSet ||
        !selectedAttributes.attributesNomenclatureVariation.isSet ||
        !selectedAttributes.attributesNomenclature.isSet
      ) {
        alert('Не все обязательные характеристики заполнены');
        return;
      }

      product.wildberries.category.addin = selectedAttributes.attributes.addins;
      product.wildberries.category.nomenclature.variation.addin = selectedAttributes.attributesNomenclatureVariation.addins;
      product.wildberries.category.nomenclature.addin = selectedAttributes.attributesNomenclature.addins;

      toggleModal(product.product._id);
    }

    function toggleModal(productInWarehouseId) {
      productsInWarehouse.value.forEach(productInWarehouse => {
        if (productInWarehouse.product._id.toString() === productInWarehouseId.toString()) {
          const body = document.querySelector("body");

          productInWarehouse[marketplaceName.value].showModal = !productInWarehouse[marketplaceName.value].showModal;
          productInWarehouse[marketplaceName.value].showModal ? body.classList.add("modal-open") : body.classList.remove("modal-open");
        }
      });
    }

    async function addToMarketplace() {
      isLoadingMarketplace.value = true;

      const responseMessage = await addToMarketplaceFromWarehouse(marketplaceName.value, warehouse.value, productsInWarehouse.value, store.state.token);
      alert(responseMessage);

      isLoadingMarketplace.value = false;
    }

    async function setImtId() {
      isLoadingMarketplace.value = true;

      const wbProducts = await getWbProductList(1000, store.state.token);
      if (wbProducts.error) return alert(JSON.stringify(wbProducts));

      const responseMessage = await setImtIdWildberries({
        warehouseId: warehouse.value._id,
        wbProducts
      }, store.state.token);

      productsInWarehouse.value = await getWarehouseWithProducts({ warehouse: warehouse.value, token: store.state.token });

      alert(responseMessage);

      isLoadingMarketplace.value = false;
    }

    async function updateProductsToMarketplace(type) {
      isLoadingMarketplace.value = true;

      const responseMessage = await updateProductsToMarketplaceFromWarehouse(marketplaceName.value, warehouse.value, productsInWarehouse.value, type, store.state.token);
      productsInWarehouse.value = await getWarehouseWithProducts({ warehouse: warehouse.value, token: store.state.token });
      alert(responseMessage);

      isLoadingMarketplace.value = false;
    }

    async function setProducts() {
      loading.value = true;
      isLoadingMarketplace.value = true;

      const productsToSet = productsInWarehouse.value.map(productInWarehouse => {
        productInWarehouse.product = productInWarehouse.product._id;
        return productInWarehouse;
      });

      const response = await setProductsToWarehouse(warehouse.value, productsToSet, store.state.token);
      
      if (response?.error?.length > 0) errors.value = response.error;
      if (response?.addedProducts?.length > 0) addedProducts.value = response.addedProducts;
      if (response?.updatedProducts?.length > 0) updatedProducts.value = response.updatedProducts;

      productsInWarehouse.value = await getWarehouseWithProducts({ warehouse: warehouse.value, token: store.state.token });

      loading.value = false;
      isLoadingMarketplace.value = false;
    }

    function getCurrentProducts() {
      if (searchProducts.value.length <= 0) return productsInWarehouse.value;
      return searchProducts.value;
    }

    function paginateEntries() {  
      if (searchInput.value.length >= 1) {
        searchProducts.value = searchInArrayWithProductObj(productsInWarehouse.value, searchInput.value);
        filteredProducts.value = paginateArray(searchProducts.value, currentShowEntries.value, currentPage.value);
        totalPages.value = getTotalPages(searchProducts.value, currentShowEntries.value);
      } else {
        searchProducts.value = [];
        filteredProducts.value = paginateArray(productsInWarehouse.value, currentShowEntries.value, currentPage.value);
        totalPages.value = getTotalPages(productsInWarehouse.value, currentShowEntries.value);
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
      productsInWarehouse,
      addedProducts,
      updatedProducts,
      errors,
      checkedAll,
      loading,
      isLoadingMarketplace,
      selectCategoryForProduct,
      removeCategoryFromProduct,
      selectOzonAttributesForProduct,
      selectWildberriesAttributesForProduct,
      toggleModal,
      addToMarketplace,
      setImtId,
      updateProductsToMarketplace,
      setProducts,
      paginateEntries,
      paginateEvent,
      searchEvent,
      sortByColumn
    }
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