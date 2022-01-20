<template>
  <div v-if="product.ozon.category">
    <div
      class="modal fade"
      :class="{ show: show, 'd-block': show }"
      tabindex="-1"
      :aria-labelledby="'modalAttributets' + product.product._id"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5
              class="modal-title"
              :id="'modalAttributets' + product.product._id"
            >
              Характеристики товара: {{ product.product.title }}
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
              <div
                class="attribute col-12 col-lg-6 mb-3 position-relative"
                v-for="attribute in attributes"
                :key="attribute"
              >
                <label for="1" class="form-label"
                  >ID: {{ attribute.id }} - {{ attribute.name }}</label
                >
                <input
                  v-model="attribute.inputValue"
                  :type="attribute.inputType"
                  :id="attribute.id"
                  class="form-control"
                  :disabled="attribute.selectedValue"
                />
                <small
                  >
                  <span v-if="attribute.type === 'String' || attribute.type === 'URL' || attribute.type === 'ImageURL' || attribute.type === 'multiline'">Тип: Строка</span>
                  <span v-if="attribute.type === 'Decimal' || attribute.type === 'Integer'">Тип: Число</span>
                  <span v-if="attribute.type === 'Boolean'">Тип: Булево</span> |
                  <span v-if="attribute.is_required" class="text-danger">Обязательно </span>
                  <span v-if="attribute.is_collection" class="text-warning">Справочник</span>
                </small
                >
                <div
                  v-if="
                    attribute.is_collection && attribute.foundValues?.length > 0
                  "
                  class="dropdown-attribute-menu"
                >
                  <small>Начните вводить данные</small>
                  <div v-for="value in attribute.foundValues" :key="value.id">
                    <span
                      @click="selectAttributeValue(attribute, value)"
                      class="dropdown-attribute-menu__value"
                      >{{ value.value }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              @click="toggleModal"
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Закрыть
            </button>
            <button @click="saveSelectedAttributes" type="button" class="btn btn-success">
              <i class="mdi mdi-content-save-all me-2"></i> Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="show" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
import { ref, watch, watchEffect } from "vue";
import { useStore } from "vuex";
import request from "@/modules/request";

export default {
  props: ["show", "product"],
  setup(props, { emit }) {
    const store = useStore();
    const attributes = ref([]);
    const prevAttributes = ref([]);

    watchEffect(async () => {
      if (props.show) {
        await getCategoryAttributes(props.product.ozon.category);
        setEmptyInputValueForAttributes();
      }
    });

    watch(
      attributes,
      (attributes) => {
        attributes.forEach(async (attribute) => {
          if (attribute?.is_collection && attribute?.inputValue?.length > 1) {
            const prevAttribute = prevAttributes.value.find(
              (prevAttribute) => prevAttribute.id === attribute.id
            );

            if (attribute.inputValue !== prevAttribute.inputValue) {
              prevAttributes.value = JSON.parse(JSON.stringify(attributes));

              let values = await getCategoryAttributeValues(
                props.product.ozon.category,
                attribute
              );
              values = values.result.filter((item) =>
                item.value
                  .toLowerCase()
                  .includes(attribute.inputValue.toLowerCase())
              );
              attribute.foundValues = values;
            }
          }
        });
      },
      { deep: true }
    );

    function toggleModal() {
      emit("toggleModal", props.product.product._id);
    }

    async function getCategoryAttributes(category) {
      const url = "/api/v1/marketplace/ozon/get-category-attribute";
      const json = await request(url, "POST", store.state.token, {
        categoryId: category.category_id,
      });
      attributes.value = json.result[0].attributes;
      prevAttributes.value = JSON.parse(
        JSON.stringify(json.result[0].attributes)
      );
    }

    function setEmptyInputValueForAttributes() {
      attributes.value.forEach((attribute) => {
        attribute.foundValues = [];
        attribute.selectedValue = null;
        if (
          attribute.type === "String" ||
          attribute.type === "URL" ||
          attribute.type === "ImageURL" ||
          attribute.type === "multiline"
        ) {
          attribute.inputType = "text";
          attribute.inputValue = "";
        }

        if (attribute.type === "Decimal" || attribute.type === "Integer") {
          attribute.inputType = "number";
          attribute.inputValue = 0;
        }

        if (attribute.type === "Boolean") {
          attribute.inputType = "text";
          attribute.inputValue = "";
        }
      });
    }

    async function getCategoryAttributeValues(category, attribute) {
      const url = "/api/v1/marketplace/ozon/get-category-attribute-values";
      const json = await request(url, "POST", store.state.token, {
        categoryId: category.category_id,
        attributeId: attribute.id,
        lastValueId: 0,
        limit: 5000,
      });
      return json;
    }

    function selectAttributeValue(attribute, value) {
      attribute.foundValues = [];
      attribute.inputValue = value.value;
      attribute.selectedValue = value;
    }

    function saveSelectedAttributes() {
      emit('selectAttributesForProduct', { productInWarehouse: props.product, attributes: attributes.value });
    }

    return {
      attributes,
      toggleModal,
      selectAttributeValue,
      saveSelectedAttributes
    };
  },
};
</script>

<style scoped>
.dropdown-attribute-menu {
  position: absolute;
  top: 90px;
  width: 94%;
  max-height: 400px;
  padding: 10px 10px 15px 10px;
  border: 1px solid rgb(210, 213, 217);
  border-radius: 4px;
  background-color: #fff;
  overflow: scroll;
  z-index: 1;
}
.dropdown-attribute-menu__value {
  display: block;
  margin: 5px 0px;
  padding: 5px;
  border-radius: 4px;
  cursor: pointer;
}
.dropdown-attribute-menu__value:hover {
  color: #fff;
  background-color: rgb(114, 124, 245);
}
</style>