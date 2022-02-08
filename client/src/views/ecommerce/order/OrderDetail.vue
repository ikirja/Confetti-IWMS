<template>
  <div class="container-fluid text-start">
    <div class="row">
      <div class="col-12">
        <div class="page-title-box">
          <div class="page-title-right">
            <Breadcrumbs
              :breadcrumbs="[
                { title: 'Главная', link: '/' },
                { title: 'Заказы', link: '/ecommerce/order' },
                { title: order.orderId },
              ]"
            />
          </div>
          <h4 class="page-title">
            Заказ: <strong>{{ order.orderId }}</strong>
          </h4>
        </div>
      </div>
    </div>

    <div class="row justify-content-center">
      <div class="col-lg-7 col-md-10 col-sm-11">
        <div class="horizontal-steps mt-4 mb-4 pb-5" id="tooltip-container">
          <div class="horizontal-steps-content">
            <div v-for="status in orderStatuses" :key="status" class="step-item" :class="{ 'current': status.isCurrent }">
              <span>{{ status.title }}</span>
            </div>
          </div>

          <div class="process-line" :style="{ width: statusProgressLine + '%' }"></div>
        </div>
      </div>
      <div v-if="nextStatus.hasNext" class="col-lg-4 col-12 d-flex justify-content-center align-items-center">
        <button class="btn btn-primary mb-4" @click.prevent="changeOrderStatus(nextStatus.status)">Перевести к "{{ nextStatus.title }}"</button>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-8">
        <div class="card">
          <div class="card-body">
            <h4 class="header-title mb-3">Товары заказа #{{ order.orderId }}</h4>

            <div class="table-responsive">
              <table class="table mb-0">
                <thead class="table-light">
                  <tr>
                    <th>Товар</th>
                    <th>Кол-во</th>
                    <th>Цена</th>
                    <th>Итого</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="product in order.products" :key="product">
                    <td>{{ product.product.title }}</td>
                    <td>{{ product.quantity }}</td>
                    <td>{{ product.price }} руб.</td>
                    <td>{{ product.quantity * product.price }} руб.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card">
          <div class="card-body">
            <h4 class="header-title mb-3">Информация</h4>

            <div class="table-responsive">
              <table class="table mb-0">
                <thead class="table-light">
                  <tr>
                    <th>Инфо</th>
                    <th>Цена</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>Всего:</th>
                    <th>{{ order.total }} руб.</th>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <h4 class="header-title mb-3">{{ order.customer?.title }}</h4>

            <ul class="list-unstyled mb-0">
              <li>
                <p class="mb-2">
                  <span class="fw-bold me-2">Телефон:</span> {{ order.customer?.phone }}
                </p>
                <p v-for="field in order.customer?.fields" :key="field" class="mb-2">
                  <span class="fw-bold me-2">{{ field.key }}:</span> {{ field.data }}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumbs from "@/components/layout/Breadcrumbs.vue";

import { ref, onMounted, getCurrentInstance } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import request from "@/modules/request";

export default {
  components: {
    Breadcrumbs,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const order = ref({});
    const orderStatuses = ref([]);
    const statusProgressLine = ref(0);
    const nextStatus = ref({
      hasNext: false,
      title: '',
      status: {}
    });

    const internalInstance = getCurrentInstance();
    const moment = internalInstance.appContext.config.globalProperties.$moment;

    onMounted(async () => {
      await getOrder();
      await getOrderStatuses();
    });

    async function getOrder() {
      const json = await request(
        "/api/v1/order/" + route.params.id,
        "GET",
        store.state.token
      );
      if (json.error) return alert("Произошла ошибка получения заказа");

      order.value = json;
      order.value.total = order.value.products.reduce((total, product) => {
        return total + product.price * product.quantity
      }, 0);
    }

    async function getOrderStatuses() {
      const json = await request(
        '/api/v1/order-status',
        'GET',
        store.state.token
      );
      if (json.error) return alert("Произошла ошибка получения статусов заказа");

      orderStatuses.value = json;

      orderStatuses.value.forEach((status, index) => {
        status._id.toString() === order.value.status._id.toString() ? status.isCurrent = true : status.isCurrent = false;
        if (status.isCurrent) statusProgressLine.value = (index) * 100 / (orderStatuses.value.length - 1);

        if (status.isCurrent && orderStatuses.value.length > index + 1) {
          nextStatus.value.hasNext = true;
          nextStatus.value.title = orderStatuses.value[index + 1].title;
          nextStatus.value.status = orderStatuses.value[index + 1];
        } else if (status.isCurrent && orderStatuses.value.length == index +1) {
          nextStatus.value.hasNext = false;
        }
      });
    }

    async function changeOrderStatus(status) {
      const json = await request(
        '/api/v1/order/status',
        'POST',
        store.state.token,
        {
          orderId: order.value._id,
          statusId: status._id
        }
      );
      if (json.error) return alert('Произошла ошибка смены статуса заказа');

      await getOrder();
      await getOrderStatuses();
    }

    return {
      order,
      orderStatuses,
      statusProgressLine,
      nextStatus,
      changeOrderStatus,
      moment
    };
  },
};
</script>