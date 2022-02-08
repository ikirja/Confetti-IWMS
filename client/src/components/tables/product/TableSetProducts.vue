<template>
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
    v-if="createdProducts.length > 0"
    class="alert alert-success bg-success text-white border-0"
    role="alert"
  >
    <div>
      <strong>Созданные товары:</strong>
      <ul>
        <li v-for="product in createdProducts" :key="product._id">
          <strong>Артикул: {{ product.sku }}</strong>: {{ product.title }}
        </li>
      </ul>
    </div>
  </div>
  <div
    v-if="updatedProducts.length > 0"
    class="alert alert-info bg-info text-white border-0"
    role="alert"
  >
    <div>
      <strong>Обновлённые товары:</strong>
      <ul>
        <li v-for="product in updatedProducts" :key="product._id">
          <strong>Артикул: {{ product.sku }}</strong>: {{ product.title }}
        </li>
      </ul>
    </div>
  </div>
  <table class="table table-striped table-centered w-100 dt-responsive nowrap">
    <thead class="table-light">
      <tr>
        <th>#</th>
        <th class="all">Название</th>
        <th>Артикул</th>
        <th>Вес</th>
        <th>Габариты</th>
        <th>Штрихкод</th>
        <th>Описание</th>
        <th>Закупочная цена</th>
        <th style="width: 85px">Действие</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(product, index) in products"
        :key="product._id"
      >
        <td>{{ index + 1 }}</td>
        <td>
          <div>
            <input
              type="text"
              v-model="products[index].title"
              class="form-control"
              :id="'input' + index"
            />
          </div>
        </td>
        <td>
          <div>
            <input
              type="text"
              v-model="products[index].sku"
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
              v-model="products[index].weight"
              placeholder="Грамм"
              class="form-control"
              :id="'input' + index"
            />
          </div>
        </td>
        <td>
          <div class="row">
            <div class="col-4">
              <input
                type="number"
                min="0"
                v-model="products[index].dimensions.width"
                placeholder="Ширина"
                class="form-control"
                :id="'input' + index"
              />
            </div>
            <div class="col-4">
              <input
                type="number"
                min="0"
                v-model="products[index].dimensions.height"
                placeholder="Высота"
                class="form-control"
                :id="'input' + index"
              />
            </div>
            <div class="col-4">
              <input
                type="number"
                min="0"
                v-model="products[index].dimensions.depth"
                placeholder="Глубина"
                class="form-control"
                :id="'input' + index"
              />
            </div>
          </div>
        </td>
        <td>
          <div>
            <input
              type="text"
              v-model="products[index].barcode"
              class="form-control"
              :id="'input' + index"
            />
          </div>
        </td>
        <td>
          <div>
            <textarea
              v-model="products[index].description"
              class="form-control"
              :id="'input' + index"
              rows="1"
            ></textarea>
          </div>
        </td>
        <td>
          <div>
            <input
              type="number"
              min="0"
              v-model="products[index].purchasePrice"
              placeholder="Руб"
              class="form-control"
              :id="'input' + index"
            />
          </div>
        </td>
        <td class="table-action table-action_fix-width">
          <a @click.prevent="removeProductInput(index)" href="#" class="action-icon">
            <i class="mdi mdi-delete"></i
          ></a>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="row mb-2">
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
        :disabled="products.length === 0"
      >
        <i class="mdi mdi-content-save-all me-2"></i> Сохранить
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
import { ref } from "vue";
import { useStore } from "vuex";
import validateProducts from "@/modules/product/validate-products";
import request from '@/modules/request';

export default {
  setup() {
    const store = useStore();
    const products = ref([]);
    const createdProducts = ref([]);
    const updatedProducts = ref([]);
    const errors = ref([]);
    let loading = ref(false);

    function addNewProductInput() {
      products.value.push({
        title: "",
        sku: "",
        weight: null,
        dimensions: {
          width: null,
          height: null,
          depth: null,
        },
        barcode: "",
        description: "",
        purchasePrice: null,
      });
    }

    function removeProductInput(index) {
      products.value.splice(index, 1);
    }

    async function setProducts() {
      loading.value = true;
      errors.value = [];

      const validated = validateProducts(products.value);
      if (validated.errors.length > 0) {
        errors.value = validated.errors;
        loading.value = false;
        return;
      }

      const json = await request('/api/v1/product', 'POST', store.state.token, validated.products);

      if (json.error.length === 0) products.value = [];
      
      if (json.error.length > 0) {
        errors.value = json.error;
        
        let productSkus = [];
        errors.value.forEach(error => productSkus.push(error.product.sku));
        products.value = products.value.filter(product => productSkus.includes(product.sku));
      }
      if (json.createdProducts.length > 0) createdProducts.value = json.createdProducts;
      if (json.updatedProducts.length > 0) updatedProducts.value = json.updatedProducts;

      loading.value = false;
    }

    return {
      products,
      createdProducts,
      updatedProducts,
      errors,
      loading,
      addNewProductInput,
      removeProductInput,
      setProducts,
    };
  },
};
</script>

<style scoped>
.table-action_fix-width {
  min-width: 120px;
}
</style>