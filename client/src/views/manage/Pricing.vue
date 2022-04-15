<template>
  <div class="container-fluid text-start">
    <div class="row">
      <div class="col-12">
        <div class="page-title-box">
          <div class="page-title-right">
            <Breadcrumbs :breadcrumbs="[{ title: 'Главная', link: '/'}, { title: 'Ценообразование' }]" />
          </div>
          <h4 class="page-title">Справочник ценообразования</h4>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <div
          v-if="errors.length > 0"
          class="alert alert-danger bg-danger text-white border-0"
          role="alert"
        >
          <div>
            <strong>Ошибка:</strong> проверьте введенные данные:
            <ul>
              <li v-for="error in errors" :key="error.code">
                <strong>Код &dash; {{ error.code }}</strong
                >: {{ error.message }}
              </li>
            </ul>
          </div>
        </div>

        <div class="card" >
          <div class="card-body">
            <div class="row mb-2">
              <div class="col-sm-5">
                <a @click.prevent="calculatePricing" href="#" class="btn btn-success mb-2"
                  ><i class="mdi mdi-check-bold me-2"></i> Рассчитать</a
                >
              </div>
              <div class="col-sm-7">
                <!-- <div class="text-sm-end">
                  <button type="button" class="btn btn-light mb-2">
                    Рассчитать
                  </button>
                </div> -->
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <h3>РРЦ: {{ rrp }} руб.</h3>
              </div>
            </div>
            <div class="row mt-3">
              <div class="col-12 col-md-4">
                <div class="form-floating mb-3">
                  <input
                    v-model="pricing.price"
                    type="number"
                    class="form-control"
                    id="price"
                    placeholder="Цена"
                  />
                  <label for="price">Закупочная цена</label>
                </div>
              </div>
              <div class="col-12 col-md-4">
                <div class="form-floating mb-3">
                  <input
                    v-model="pricing.weight"
                    type="number"
                    class="form-control"
                    id="weight"
                    placeholder="Вес"
                  />
                  <label for="weight">Вес (грамм)</label>
                </div>
              </div>
              <div class="col-12">
                <div class="form-check mb-3">
                  <input
                    v-model="pricing.marketplace"
                    type="radio"
                    class="form-check-input"
                    id="marketplace-ozon"
                    name="marketplace"
                    value="ozon"
                    placeholder="Выберите маркетплейс"
                  />
                  <label for="marketplace-ozon">OZON</label>
                </div>
                <div class="form-check mb-3">
                  <input
                    v-model="pricing.marketplace"
                    type="radio"
                    class="form-check-input"
                    id="marketplace-wildberries"
                    name="marketplace"
                    value="wildberries"
                    placeholder="Выберите маркетплейс"
                  />
                  <label for="marketplace-wildberries">Wildberries</label>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumbs from '@/components/layout/Breadcrumbs.vue';

import { ref } from 'vue';
import getOzonRrp from '@/modules/marketplace/ozon/get-ozon-rrp';
import getWildberriesRrp from '@/modules/marketplace/wildberries/get-wildberries-rrp';

export default {
  components: {
    Breadcrumbs
  },
  setup() {
    let errors = ref([]);
    let rrp = ref(0);
    const pricing = {
      price: '',
      weight: '',
      marketplace: ''
    }

    function validatePricing() {
      const validated = {
        product: {},
        errors: []
      }

      if (!pricing.price || typeof pricing.price !== 'number' || pricing.price <= 0) validated.errors.push({ code: 1, message: 'Check price' });
      if (!pricing.weight || typeof pricing.weight !== 'number' || pricing.weight <= 0) validated.errors.push({ code: 2, message: 'Check weight' });
      if (!pricing.marketplace) validated.errors.push({ code: 3, message: 'Check marketplace' });

      if (validated.errors.length > 0) return validated;

      validated.product = {
        purchasePrice: pricing.price,
        weight: pricing.weight
      }

      return validated;
    }

    function calculatePricing() {
      const validated = validatePricing();
      if (validated.errors.length > 0) return errors.value = validated.errors;

      errors.value = [];

      if (pricing.marketplace === 'ozon') return rrp.value = getOzonRrp(validated.product);
      if (pricing.marketplace === 'wildberries') return rrp.value = getWildberriesRrp(validated.product);
    }

    return {
      errors,
      rrp,
      pricing,
      calculatePricing
    }
  }
}
</script>