<template>
  <div class="row">
    <div class="col-6">
      <div class="page-title-box">
        <h4 class="page-title">Поставка</h4>
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
        <th class="all">Товар</th>
        <th v-if="warehouse?.connection === 'ozon-seller-api'">РРЦ</th>
        <th>Цена</th>
        <th>Поступление</th>
        <th>Кол-во на складе</th>
        <th>Действие</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(product, index) in products"
        :key="product"
      >
        <td>
          <div class="form-check">
            <input type="checkbox" v-model="product.checked" class="form-check-input" :id="'customCheck' + index" />
            <label class="form-check-label" :for="'customCheck' + index">&nbsp;</label>
          </div>
        </td>
        <td>{{ index + 1 }}</td>
        <td>
          <div class="position-relative">
            <input
              type="text"
              v-model="product.product.title"
              @input="predictions(index)"
              placeholder="Введите название товара"
              class="form-control"
              :disabled="product.loaded"
            />
            <div v-if="!product.loaded && product.predictions.length > 0" class="product-predictions shadow-lg rounded">
              <div v-for="prediction in product.predictions" :key="prediction" @click="setPredictionProduct(prediction, index)" class="product-predictions__item rounded">{{ prediction.product.title }}</div>
            </div>
          </div>
          <div>Артикул: {{ product.product.sku }}</div>
          <div>Штрихкод: {{ product.product.barcode }}</div>
          <div>ЗЦ: {{ product.product.purchasePrice }}</div>
        </td>
        <td v-if="warehouse?.connection === 'ozon-seller-api'">
          <div>
            <strong>{{ product.ozon.rrp }}</strong>
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
              :disabled="true"
            />
          </div>
        </td>
        <td>
          <div>
            <input
              type="number"
              v-model="product.quantity"
              placeholder="Укажите количество для склада"
              class="form-control"
              :id="'input' + index"
              :disabled="!product.loaded"
            />
          </div>
        </td>
        <td>
          <div>
            <strong>{{ product.inStock }}</strong>
          </div>
        </td>
        <td>
          <a @click.prevent="removeProductInput(index)" href="#" class="action-icon">
            <i class="mdi mdi-delete"></i
          ></a>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="row mb-2" v-if="!setIsDisabled">
    <div class="col-6">
      <a @click.prevent="addNewProductInput" href="#" class="btn btn-primary mb-2"
        ><i class="mdi mdi-plus-circle me-2"></i> Добавить товар</a
      >
    </div>
    <div class="col-6 text-end">
      <button
        v-if="!loading"
        @click.prevent="setProducts"
        class="btn btn-success mb-2"
        :disabled="!products.some(product => product.checked)"
      >
        <i class="mdi mdi-content-save-all me-2"></i> Сохранить поставку
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
import { ref, onMounted, watchEffect, computed } from 'vue';
import { useStore } from 'vuex';
import request from '@/modules/request';
import setProductsToWarehouse from '@/modules/warehouse/set-products-to-warehouse';
import getOzonRRP from '@/modules/marketplace/ozon/get-ozon-rrp';

export default {
  props: [ 'setIsDisabled' ],
  setup() {
    const store = useStore();
    const warehouse = computed(() => store.state.warehouses.currentWarehouse);
    const products = ref([]);
    const productsInWarehouse = ref([]);
    const addedProducts = ref([]);
    const updatedProducts = ref([]);
    const errors = ref([]);
    let checkedAll = ref(false);
    let loading = ref(false);

    onMounted(async () => await getWarehouseWithProducts());

    watchEffect(() => {
      if (checkedAll.value) products.value.forEach(product => product.checked = true);
      if (!checkedAll.value) products.value.forEach(product => product.checked = false);
    });

    function addNewProductInput() {
      products.value.push({
        checked: false,
        id: '',
        product: {
          title: '',
          sku: '',
          barcode: '',
          purchasePrice: 0
        },
        price: 0,
        quantity: 0,
        inStock: 0,
        loaded: false,
        predictions: [],
        ozon: {
          rrp: 0
        }
      });
    }

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
            product.ozon.rrp = getOzonRRP(product.product);
          }
        });
        productsInWarehouse.value = jsonData.products;
      }
    }

    function removeProductInput(index) {
      products.value.splice(index, 1);
    }

    function predictions(index) {
      if (products.value[index].product.title.length > 1) {
        products.value[index].predictions = findPredictions(products.value[index].product.title);
      } else {
        products.value[index].predictions = [];
      }
    }

    function findPredictions(string) {
      return productsInWarehouse.value.filter(product => product.product.title.toLowerCase().includes(string.toLowerCase()));
    }

    function setPredictionProduct(prediction, index) {
      products.value[index].id = prediction.product._id;
      products.value[index].product.title = prediction.product.title;
      products.value[index].product.sku = prediction.product.sku;
      products.value[index].product.barcode = prediction.product.barcode;
      products.value[index].product.purchasePrice = prediction.product.purchasePrice;
      products.value[index].price = prediction.price;
      products.value[index].quantity = prediction.quantity;
      products.value[index].inStock = prediction.inStock;

      if (warehouse.value.connection === 'ozon-seller-api') products.value[index].ozon.rrp = prediction.ozon.rrp;

      products.value[index].loaded = true;
    }

    async function setProducts() {
      loading.value = true;

      const productsToSet = [];

      products.value.forEach(product => {
        if (product.loaded) {
          const foundProductInWarehouse = productsInWarehouse.value.find(productInWarehouse => productInWarehouse.product._id.toString() === product.id.toString());

          foundProductInWarehouse.checked = true;
          foundProductInWarehouse.product = foundProductInWarehouse.product._id;
          foundProductInWarehouse.quantity = product.quantity;

          productsToSet.push(foundProductInWarehouse)
        }
      });

      const response = await setProductsToWarehouse(warehouse.value, productsToSet, store.state.token);
      
      if (response?.error?.length > 0) errors.value = response.error;
      if (response?.error?.length === 0) products.value = [];
      if (response?.addedProducts?.length > 0) addedProducts.value = response.addedProducts;
      if (response?.updatedProducts?.length > 0) updatedProducts.value = response.updatedProducts;

      await getWarehouseWithProducts();

      loading.value = false;
    }
    
    return {
      warehouse,
      products,
      productsInWarehouse,
      addedProducts,
      updatedProducts,
      errors,
      checkedAll,
      loading,
      removeProductInput,
      predictions,
      setPredictionProduct,
      setProducts,
      addNewProductInput
    }
  },
}
</script>

<style scoped>
.product-predictions {
  position: absolute;
  background-color: #fff;
  width: 100%;
  margin-top: 10px;
  padding: 10px;
  z-index: 2;
}
.product-predictions__item {
  padding: 5px;
  cursor: pointer;
}
.product-predictions__item:hover {
  color: #fff;
  background-color: #727cf5;
}
</style>