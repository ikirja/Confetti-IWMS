<template>
  <div class="container-fluid text-start">
    <div class="row">
      <div class="col-12">
        <div class="page-title-box">
          <div class="page-title-right">
            <Breadcrumbs :breadcrumbs="[{ title: 'Главная', link: '/'}, { title: 'Товары', link: '/ecommerce/product' }, { title: product.title }]" />
          </div>
          <h4 class="page-title">Товар</h4>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="row">
              <div class="col-lg-5">
                <a href="javascript: void(0);" class="text-center d-block mb-4">
                  <img
                    :src="'/upload/' + product.image?.file + '.jpg'"
                    class="img-fluid"
                    style="max-width: 280px"
                    :alt="product.title"
                  />
                </a>

                <div class="d-lg-flex d-none flex-wrap justify-content-center">
                  <a v-for="image in product.images" :key="image" href="javascript: void(0);" @click.prevent="setProductMainImage(image)" class="position-relative">
                    <img
                      :src="'/upload/' + image.file + '.jpg'"
                      class="img-fluid img-thumbnail p-2"
                      style="max-width: 75px"
                      :alt="product.title"
                    />
                    <span v-if="product.image?._id.toString() === image._id.toString()" class="position-absolute top-0 start-50 translate-middle badge rounded-pill bg-primary">
                      Главное
                      <span class="visually-hidden">Главное изображение</span>
                    </span>
                  </a>
                </div>
              </div>
              <div class="col-lg-7">
                <form class="ps-lg-4">
                  <h3 class="mt-0">
                    {{ product.title }}
                  </h3>
                  <p class="mb-1">Создан: {{ moment(product.createdAt).format('DD/MM/YYYY') }}</p>
                  <p class="font-16">
                    <span class="text-warning mdi mdi-star"></span>
                    <span class="text-warning mdi mdi-star"></span>
                    <span class="text-warning mdi mdi-star"></span>
                    <span class="text-warning mdi mdi-star"></span>
                    <span class="text-warning mdi mdi-star"></span>
                  </p>

                  <div class="mt-3">
                    <h4>
                      <span class="badge badge-success-lighten">В наличии</span>
                    </h4>
                  </div>

                  <div class="mt-4">
                    <h6 class="font-14">Закупочная цена:</h6>
                    <h3>{{ product.purchasePrice }} руб.</h3>
                  </div>

                  <div class="mt-4">
                    <h6 class="font-14">Описание:</h6>
                    <p>
                      {{ product.description }}
                    </p>
                  </div>

                  <!-- <div class="mt-4">
                    <div class="row">
                      <div class="col-md-4">
                        <h6 class="font-14">Available Stock:</h6>
                        <p class="text-sm lh-150">1784</p>
                      </div>
                      <div class="col-md-4">
                        <h6 class="font-14">Number of Orders:</h6>
                        <p class="text-sm lh-150">5,458</p>
                      </div>
                      <div class="col-md-4">
                        <h6 class="font-14">Revenue:</h6>
                        <p class="text-sm lh-150">$8,57,014</p>
                      </div>
                    </div>
                  </div> -->
                </form>
              </div>
            </div>

            <!-- <div class="table-responsive mt-4">
              <table class="table table-bordered table-centered mb-0">
                <thead class="table-light">
                  <tr>
                    <th>Outlets</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>ASOS Ridley Outlet - NYC</td>
                    <td>$139.58</td>
                    <td>
                      <div class="progress-w-percent mb-0">
                        <span class="progress-value">478 </span>
                        <div class="progress progress-sm">
                          <div
                            class="progress-bar bg-success"
                            role="progressbar"
                            style="width: 56%"
                            aria-valuenow="56"
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td>$1,89,547</td>
                  </tr>
                  <tr>
                    <td>Marco Outlet - SRT</td>
                    <td>$149.99</td>
                    <td>
                      <div class="progress-w-percent mb-0">
                        <span class="progress-value">73 </span>
                        <div class="progress progress-sm">
                          <div
                            class="progress-bar bg-danger"
                            role="progressbar"
                            style="width: 16%"
                            aria-valuenow="16"
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td>$87,245</td>
                  </tr>
                  <tr>
                    <td>Chairtest Outlet - HY</td>
                    <td>$135.87</td>
                    <td>
                      <div class="progress-w-percent mb-0">
                        <span class="progress-value">781 </span>
                        <div class="progress progress-sm">
                          <div
                            class="progress-bar bg-success"
                            role="progressbar"
                            style="width: 72%"
                            aria-valuenow="72"
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td>$5,87,478</td>
                  </tr>
                  <tr>
                    <td>Nworld Group - India</td>
                    <td>$159.89</td>
                    <td>
                      <div class="progress-w-percent mb-0">
                        <span class="progress-value">815 </span>
                        <div class="progress progress-sm">
                          <div
                            class="progress-bar bg-success"
                            role="progressbar"
                            style="width: 89%"
                            aria-valuenow="89"
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td>$55,781</td>
                  </tr>
                </tbody>
              </table>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumbs from '@/components/layout/Breadcrumbs.vue';

import { ref, onMounted, getCurrentInstance } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import request from '@/modules/request'

export default {
  components: {
    Breadcrumbs
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const product = ref({});

    const internalInstance = getCurrentInstance();
    const moment = internalInstance.appContext.config.globalProperties.$moment;

    onMounted(() => getProduct());

    async function getProduct() {
      const json = await request('/api/v1/product/' + route.params.id, 'GET', store.state.token);
      if (json.error) return alert('Произошла ошибка получения товара');

      product.value = json;
    }

    async function setProductMainImage(image) {
      if (image._id.toString() === product.value.image._id.toString()) return;

      const json = await request('/api/v1/product/set-main-image', 'POST', store.state.token, {
        productId: product.value._id,
        imageId: image._id
      });

      if (json.error) return alert('Произошла ошибка');
      await getProduct();
    }

    return {
      product,
      moment,
      setProductMainImage
    }
  },
};
</script>