<template>
  <div class="row">
    <div class="col-12">
      <div class="page-title-box">
        <h4 class="page-title">Товары на складе</h4>
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
        <th class="all">Название</th>
        <th>Артикул</th>
        <th>Штрихкод</th>
        <th>Закупочная цена</th>
        <th>Цена</th>
        <th>Количество</th>
        <th v-if="warehouse?.connection !== 'default'" style="width: 250px">Категория</th>
        <th v-if="warehouse?.connection !== 'default'">Характеристики</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(productInWarehouse, index) in productsInWarehouse"
        :key="productInWarehouse.product._id"
      >
        <td>
          <div class="form-check">
            <input type="checkbox" v-model="productInWarehouse.checked" class="form-check-input" :id="'customCheck' + index" />
            <label class="form-check-label" :for="'customCheck' + index">&nbsp;</label>
          </div>
        </td>
        <td>{{ index + 1 }}</td>
        <td>
          <div>
            <input
              type="text"
              :value="productInWarehouse.product.title"
              class="form-control"
              :id="'input' + index"
              disabled
            />
          </div>
        </td>
        <td>
          <div>
            <input
              type="text"
              :value="productInWarehouse.product.sku"
              class="form-control"
              :id="'input' + index"
              disabled
            />
          </div>
        </td>
        <td>
          <div>
            <input
              type="text"
              :value="productInWarehouse.product.barcode"
              class="form-control"
              :id="'input' + index"
              disabled
            />
          </div>
        </td>
        <td>
          <div>
            <input
              type="number"
              :value="productInWarehouse.product.purchasePrice"
              class="form-control"
              :id="'input' + index"
              disabled
            />
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
        <td v-if="warehouse?.connection !== 'default'">
          <SelectCategory
            v-if="!productInWarehouse.ozon.category"
            :product-id="productInWarehouse.product._id"
            @selected-category="selectCategoryForProduct"
            @remove-category-from-product="removeCategoryFromProduct"
          />
          <small v-if="productInWarehouse.ozon.category" class="text-secondary fw-bold">Категория: <span class="text-info">{{ productInWarehouse.ozon.category.title }}</span></small>
        </td>
        <td v-if="warehouse?.connection !== 'default'">
          <button class="btn btn-primary" @click="toggleModal(productInWarehouse.product._id)" :disabled="!productInWarehouse.ozon.category">Характеристики</button>
          <ModalAttributes
            :show="productInWarehouse.ozon.showModal"
            :product="productInWarehouse"
            @select-attributes-for-product="selectAttributesForProduct"
            @toggle-modal="toggleModal"
          />
          <small v-if="productInWarehouse.ozon.attributes?.length > 0" class="text-success fw-bold">Характеристики указаны</small>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="row mb-2">
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
import SelectCategory from '@/components/forms/SelectCategory.vue';
import ModalAttributes from '@/components/modals/marketplace/ozon/ModalAttributes.vue';

import { ref, onMounted, watchEffect, computed } from 'vue';
import { useStore } from 'vuex';
import request from '@/modules/request';
import setProductsToWarehouse from '@/modules/warehouse/set-products-to-warehouse';

export default {
  props: [ 'setIsDisabled' ],
  components: {
    SelectCategory,
    ModalAttributes
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
          if (warehouse.value.connection === 'ozon-seller-api') product.ozon.showModal = false;
        });
        productsInWarehouse.value = jsonData.products;
      }
    }

    async function selectCategoryForProduct({ category, productId }) {
      productsInWarehouse.value.forEach(productInWarehouse => {
        if (productInWarehouse.product._id.toString() === productId.toString()) {
          productInWarehouse.ozon.categoryId = category.category_id;
          productInWarehouse.ozon.category = category;
        }
      });
    }

    function removeCategoryFromProduct(productId) {
      productsInWarehouse.value.forEach(productInWarehouse => {
        if (productInWarehouse.product._id.toString() === productId.toString()) {
          productInWarehouse.ozon.categoryId = null;
          productInWarehouse.ozon.category = null;
        }
      });
    }

    function selectAttributesForProduct({ productInWarehouse, attributes }) {
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

      if (selectedAttributes.length > 0) productInWarehouse.ozon.attributes = selectedAttributes;

      toggleModal(productInWarehouse.product._id);
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
      selectCategoryForProduct,
      removeCategoryFromProduct,
      selectAttributesForProduct,
      toggleModal,
      setProducts
    }
  },
}
</script>