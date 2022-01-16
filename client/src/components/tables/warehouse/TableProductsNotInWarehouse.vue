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
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(product, index) in products"
        :key="product._id"
      >
        <td>
          <div class="form-check">
            <input type="checkbox" v-model="product.checked" class="form-check-input" :id="'customCheck' + index" />
            <label class="form-check-label" :for="'customCheck' + index">&nbsp;</label>
          </div>
        </td>
        <td>{{ index + 1 }}</td>
        <td>
          <div>
            <input
              type="text"
              :value="product.title"
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
              :value="product.sku"
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
              :value="product.barcode"
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
              :value="product.purchasePrice"
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
        :disabled="products.length === 0"
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
import { ref, onMounted, watchEffect, computed } from "vue";
import { useStore } from "vuex";
import setProductsToWarehouse from '@/modules/warehouse/set-products-to-warehouse';

export default {
  props: [ 'warehouse', 'setIsDisabled' ],
  setup() {
    const store = useStore();
    const warehouse = computed(() => store.state.warehouses.currentWarehouse);
    const products = ref([]);
    const addedProducts = ref([]);
    const updatedProducts = ref([]);
    const errors = ref([]);
    let checkedAll = ref(false);
    let loading = ref(false);

    onMounted(() => getProductsForWarehouse());

    watchEffect(() => {
      if (checkedAll.value) products.value.forEach(product => product.checked = true);
      if (!checkedAll.value) products.value.forEach(product => product.checked = false);
    });

    async function getProductsForWarehouse() {
      const response = await fetch('/api/v1/product', { headers: { token: store.state.token } });
      
      if (response.status === 200) {
        const responseProducts = await response.json();
        const productIdsInWarehouse = warehouse.value.products.map(productInWarehouse => productInWarehouse.product);

        responseProducts.forEach(product => {
          product.product = product._id;
          product.checked = false;
          product.price = null;
          product.quantity = null;
        });

        products.value = responseProducts.filter(product => !productIdsInWarehouse.includes(product._id.toString()));
      }
    }

    async function setProducts() {
      loading.value = true;
      const response = await setProductsToWarehouse(warehouse.value, products.value, store.state.token);
      
      if (response?.error?.length > 0) errors.value = response.error;
      if (response?.addedProducts?.length > 0) addedProducts.value = response.addedProducts;
      if (response?.updatedProducts?.length > 0) updatedProducts.value = response.addedProducts;

      await getProductsForWarehouse();

      loading.value = false;
    }

    return {
      products,
      addedProducts,
      updatedProducts,
      errors,
      checkedAll,
      loading,
      setProducts
    };
  },
}
</script>