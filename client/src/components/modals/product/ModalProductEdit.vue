<template>
  <div>
    <div
      class="modal fade"
      :class="{ show: show, 'd-block': show }"
      tabindex="-1"
      :aria-labelledby="'modalProductEdit' + product._id"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5
              class="modal-title"
              :id="'modalProductEdit' + product._id"
            >
              Редактирование товара
            </h5>
            <button
              @click="toggleModal"
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-hidden="true"
            ></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-12 col-lg-6 text-start mb-3">
                <label for="title" class="form-label"
                  >Название</label
                >
                <input
                  id="title"
                  type="text"
                  class="form-control"
                  v-model="productEdit.title"
                />
              </div>
              <div class="col-12 col-lg-6 text-start mb-3">
                <label for="sku" class="form-label"
                  >Артикул</label
                >
                <input
                  id="sku"
                  type="text"
                  class="form-control"
                  v-model="productEdit.sku"
                  disabled
                />
              </div>
              <div class="col-12 col-lg-6 text-start mb-3">
                <label for="weight" class="form-label"
                  >Вес</label
                >
                <input
                  id="weight"
                  type="number"
                  class="form-control"
                  v-model="productEdit.weight"
                />
              </div>
              <div class="col-12 col-lg-6 text-start mb-3">
                <label for="width" class="form-label"
                  >Ширина</label
                >
                <input
                  id="width"
                  type="number"
                  class="form-control"
                  v-model="productEdit.dimensions.width"
                />
              </div>
              <div class="col-12 col-lg-6 text-start mb-3">
                <label for="height" class="form-label"
                  >Высота</label
                >
                <input
                  id="height"
                  type="number"
                  class="form-control"
                  v-model="productEdit.dimensions.height"
                />
              </div>
              <div class="col-12 col-lg-6 text-start mb-3">
                <label for="depth" class="form-label"
                  >Глубина</label
                >
                <input
                  id="depth"
                  type="number"
                  class="form-control"
                  v-model="productEdit.dimensions.depth"
                />
              </div>
              <div class="col-12 col-lg-6 text-start mb-3">
                <label for="barcode" class="form-label"
                  >Штрихкод</label
                >
                <input
                  id="barcode"
                  type="text"
                  class="form-control"
                  v-model="productEdit.barcode"
                />
              </div>
              <div class="col-12 col-lg-6 text-start mb-3">
                <label for="purchasePrice" class="form-label"
                  >Закупочная цена</label
                >
                <input
                  id="purchasePrice"
                  type="number"
                  class="form-control"
                  v-model="productEdit.purchasePrice"
                  disabled
                />
              </div>
              <div class="col-12 text-start mb-3">
                <label for="description" class="form-label"
                  >Описание</label
                >
                <textarea
                  id="description"
                  type="text"
                  class="form-control"
                  v-model="productEdit.description"
                ></textarea>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              @click="setProduct"
              type="button"
              class="btn btn-success"
              data-bs-dismiss="modal"
            >
              Сохранить
            </button>
            <button
              @click="toggleModal"
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="show" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
import { ref, watchEffect } from "vue";
import { useStore } from "vuex";
import request from "@/modules/request";

export default {
  props: ["show", "product"],
  setup(props, { emit }) {
    const store = useStore();
    const productEdit = ref({
      title: '',
      sku: '',
      weight: 0,
      dimensions: {
        width: 0,
        height: 0,
        depth: 0
      },
      barcode: '',
      description: '',
      purchasePrice: 0
    });

    watchEffect(() => {
      if (props.show) {
        productEdit.value = {
          title: props.product.title,
          sku: props.product.sku,
          weight: props.product.weight,
          dimensions: {
            width: props.product.dimensions.width,
            height: props.product.dimensions.height,
            depth: props.product.dimensions.depth
          },
          barcode: props.product.barcode,
          description: props.product.description,
          purchasePrice: props.product.purchasePrice
        }
      }
    });

    async function setProduct() {
      const json = await request('/api/v1/product', 'POST', store.state.token, [ productEdit.value ]);
      
      if (json.error && json.error.length > 0) return alert(JSON.stringify(json));
      toggleModal();
    }

    function toggleModal() {
      emit("toggleModal");
    }

    return {
      productEdit,
      setProduct,
      toggleModal
    };
  },
};
</script>