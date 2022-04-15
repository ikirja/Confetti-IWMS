<template>
  <div class="row">
    <div class="col-6">
      <div class="page-title-box">
        <h4 class="page-title">Товары на складе</h4>
      </div>
    </div>
    <div class="col-6 d-flex justify-content-end align-items-center" v-if="!setIsDisabled">
      <button @click="updateProductsToMarketplace('prices')" class="btn btn-outline-warning me-3">Обновить цены</button>
      <button @click="updateProductsToMarketplace('stocks')" class="btn btn-outline-warning me-3">Обновить остатки</button>
      <button @click="addToMarketplace" class="btn btn-outline-success">Добавить на маркетплейс</button>
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
        <th class="all">Товар</th>
        <th v-if="warehouseIsForMarketplace()">РРЦ</th>
        <th>Цена</th>
        <th>Поступление</th>
        <th>Кол-во на складе</th>
        <th v-if="warehouse?.connection === 'ozon-seller-api'">Offer ID</th>
        <th v-if="warehouse?.connection === 'ozon-seller-api'">Product ID</th>
        <th v-if="warehouseIsForMarketplace()" style="width: 250px">Категория</th>
        <th v-if="warehouseIsForMarketplace()">Характеристики</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(productInWarehouse, index) in productsInWarehouse"
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
        <td v-if="warehouseIsForMarketplace()">
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
        <td v-if="warehouse?.connection === 'ozon-seller-api'">
          <div v-if="productInWarehouse.ozon.productId">{{ productInWarehouse.ozon.productId }}</div>
          <div v-else>Товар не выгружен</div>
        </td>
        <td v-if="warehouseIsForMarketplace()">
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
        <td v-if="warehouseIsForMarketplace()">
          <div v-if="warehouse?.connection === 'ozon-seller-api'">
            <button class="btn btn-primary" @click="toggleModal(productInWarehouse.product._id)" :disabled="!productInWarehouse.ozon.category">Характеристики</button>
            <ModalAttributesOzon
              :show="productInWarehouse.ozon.showModal"
              :product="productInWarehouse"
              @select-attributes-for-product="selectAttributesForProduct"
              @toggle-modal="toggleModal"
            />
            <small v-if="productInWarehouse.ozon.attributes?.length > 0" class="text-success fw-bold">Характеристики указаны</small>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
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

import { ref, onMounted, watchEffect, computed } from 'vue';
import { useStore } from 'vuex';
import request from '@/modules/request';
import setProductsToWarehouse from '@/modules/warehouse/set-products-to-warehouse';
import getOzonRRP from '@/modules/marketplace/ozon/get-ozon-rrp';
import getWildberriesRRP from '@/modules/marketplace/wildberries/get-wildberries-rrp';
import addToOzon from '@/modules/warehouse/add-to-ozon';
import updateStocksOzon from '@/modules/warehouse/update-stocks-ozon';
import updatePricesOzon from '@/modules/warehouse/update-prices-ozon';

export default {
  props: [ 'setIsDisabled' ],
  components: {
    SelectCategoryOzon,
    SelectCategoryWildberries,
    ModalAttributesOzon
  },
  setup() {
    const store = useStore();
    const warehouse = computed(() => store.state.warehouses.currentWarehouse);
    const productsInWarehouse = ref([]);
    const addedProducts = ref([]);
    const updatedProducts = ref([]);
    const errors = ref([]);
    let checkedAll = ref(false);
    let loading = ref(false);

    onMounted(async () => await getWarehouseWithProducts());

    watchEffect(() => {
      if (checkedAll.value) productsInWarehouse.value.forEach(product => product.checked = true);
      if (!checkedAll.value) productsInWarehouse.value.forEach(product => product.checked = false);
    });

    async function getWarehouseWithProducts() {
      const url = `/api/v1/warehouse/${warehouse.value._id}`;
      const jsonData = await request(url, 'GET', store.state.token);

      if (jsonData.products) {
        jsonData.products.forEach(product => {
          product.checked = false;
          product.inStock = product.quantity;
          product.quantity = 0;

          if (warehouse.value.connection === 'ozon-seller-api') {
            product.ozon.showModal = false;
            product.ozon.rrp = getOzonRRP(product);
          }

          if (warehouse.value.connection === 'wildberries-seller-api') {
            product.wildberries.showModal = false;
            product.wildberries.rrp = getWildberriesRRP(product);
          }
        });

        productsInWarehouse.value = jsonData.products;
      }
    }

    function warehouseIsForMarketplace() {
      let isForMarketplace = false;

      if (warehouse.value.connection === 'ozon-seller-api') isForMarketplace = true;
      if (warehouse.value.connection === 'wildberries-seller-api') isForMarketplace = true;

      return isForMarketplace;
    }

    function getWarehouseMarketplaceName() {
      if (warehouseIsForMarketplace()) {
        let marketplace = '';

        if (warehouse.value.connection === 'ozon-seller-api') marketplace = 'ozon';
        if (warehouse.value.connection === 'wildberries-seller-api') marketplace = 'wildberries';

        return marketplace;
      } else {
        return null;
      }
    }

    async function selectCategoryForProduct({ category, productId }) {
      productsInWarehouse.value.forEach(productInWarehouse => {
        if (productInWarehouse.product._id.toString() === productId.toString()) {
          const marketplace = getWarehouseMarketplaceName();

          if (marketplace) {
            if (marketplace === 'ozon') productInWarehouse[marketplace].categoryId = category.category_id;
            if (marketplace === 'wildberries') productInWarehouse[marketplace].categoryId = category.id;
            productInWarehouse[marketplace].category = category;
          }
        }
      });
    }

    function removeCategoryFromProduct(productId) {
      productsInWarehouse.value.forEach(productInWarehouse => {
        if (productInWarehouse.product._id.toString() === productId.toString()) {
          const marketplace = getWarehouseMarketplaceName();

          if (marketplace) {
            productInWarehouse[marketplace].categoryId = null;
            productInWarehouse[marketplace].category = null;
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

    function toggleModal(productInWarehouseId) {
      productsInWarehouse.value.forEach(productInWarehouse => {
        if (productInWarehouse.product._id.toString() === productInWarehouseId.toString()) {
          productInWarehouse.ozon.showModal = !productInWarehouse.ozon.showModal;
          const body = document.querySelector("body");
          productInWarehouse.ozon.showModal ? body.classList.add("modal-open") : body.classList.remove("modal-open");
        }
      });
    }

    async function addToMarketplace() {
      const body = {
        warehouseId: warehouse.value._id,
        products: []
      }

      productsInWarehouse.value.forEach(productInWarehouse => productInWarehouse.checked ? body.products.push(productInWarehouse.product._id) : '');
      if (body.products.length === 0) return alert('Не выбраны товары');

      const jsonData = await addToOzon(body, store.state.token);
      if (jsonData.error) return alert(JSON.stringify(jsonData));

      alert('Успешно');
    }

    async function updateProductsToMarketplace(type) {
      const body = {
        warehouseId: warehouse.value._id,
        products: []
      }

      if (type === 'stocks') productsInWarehouse.value.forEach(productInWarehouse => productInWarehouse.quantity = productInWarehouse.inStock);

      body.products = productsInWarehouse.value.filter(productInWarehouse => productInWarehouse.checked);
      if (body.products.length === 0) return alert('Не выбраны товары');

      let jsonData = null;
      if (type === 'stocks') jsonData = await updateStocksOzon(body, store.state.token);
      if (type === 'prices') jsonData = await updatePricesOzon(body, store.state.token);
      if (jsonData.error) return alert(JSON.stringify(jsonData));

      getWarehouseWithProducts();
      alert('Успешно');
    }

    async function setProducts() {
      loading.value = true;

      const productsToSet = productsInWarehouse.value.map(productInWarehouse => {
        productInWarehouse.product = productInWarehouse.product._id;
        return productInWarehouse;
      });

      const response = await setProductsToWarehouse(warehouse.value, productsToSet, store.state.token);
      
      if (response?.error?.length > 0) errors.value = response.error;
      if (response?.addedProducts?.length > 0) addedProducts.value = response.addedProducts;
      if (response?.updatedProducts?.length > 0) updatedProducts.value = response.updatedProducts;

      await getWarehouseWithProducts();

      loading.value = false;
    }
    
    return {
      warehouse,
      productsInWarehouse,
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
      addToMarketplace,
      updateProductsToMarketplace,
      setProducts
    }
  },
}
</script>