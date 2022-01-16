<template>
  <table
    class="table table-striped table-centered w-100 dt-responsive nowrap"
    id="products-datatable"
  >
    <thead class="table-light">
      <tr>
        <th class="all" style="width: 20px">
          <div class="form-check">
            <input type="checkbox" class="form-check-input" id="customCheck1" />
            <label class="form-check-label" for="customCheck1">&nbsp;</label>
          </div>
        </th>
        <th>Создан</th>
        <th>Обновлён</th>
        <th class="all">Название</th>
        <th>Артикул</th>
        <th>Вес</th>
        <th>Габариты</th>
        <th>Штрихкод</th>
        <th>Описание</th>
        <th>Закупочная цена</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="product in products"
        :key="product._id"
      >
        <td>
          <div class="form-check">
            <input type="checkbox" class="form-check-input" id="customCheck2" />
            <label class="form-check-label" for="customCheck2">&nbsp;</label>
          </div>
        </td>
        <td>{{ moment(product.createdAt).format("DD/MM/YYYY") }}</td>
        <td>{{ moment(product.updatedAt).format("DD/MM/YYYY") }}</td>
        <td>
          <img
            v-if="product.image"
            src="/assets/images/products/product-1.jpg"
            alt="contact-img"
            title="contact-img"
            class="rounded me-3"
            height="48"
          />
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
      </tr>
    </tbody>
  </table>
</template>

<script>
import { ref, onMounted, getCurrentInstance } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const products = ref([]);

    const internalInstance = getCurrentInstance();
    const moment = internalInstance.appContext.config.globalProperties.$moment;

    onMounted(() => getProducts());

    async function getProducts() {
      const response = await fetch('/api/v1/product', { headers: { token: store.state.token }});
      if (response.status === 200) products.value = await response.json();
    }

    return { products, moment };
  }
}
</script>