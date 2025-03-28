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
                  <span v-if="attribute.type === 'String' || attribute.type === 'URL' || attribute.type === 'ImageURL' || attribute.type === 'multiline'">Тип: Строка </span>
                  <span v-if="attribute.type === 'Decimal' || attribute.type === 'Integer'">Тип: Число </span>
                  <span v-if="attribute.type === 'Boolean'">Тип: Булево </span>
                  <span v-if="attribute.is_required" class="text-danger">Обязательно </span>
                  <span v-if="attribute.is_collection" class="text-warning">Справочник </span>
                  <span @click="resetAttribute(attribute)" v-if="attribute.is_collection" class="text-info" role="button">Изменить</span>
                </small
                >
                <div
                  v-if="
                    attribute.is_collection && attribute.foundValues?.length > 0 || attribute.isLoading
                  "
                  class="dropdown-attribute-menu"
                >
                  <small>Начните вводить данные</small>
                  <div v-if="attribute.isLoading" class="d-flex align-items-center">
                    <strong class="text-primary">Загрузка...</strong>
                    <div class="spinner-border spinner-border-sm text-primary ms-auto" role="status" aria-hidden="true"></div>
                  </div>
                  <div v-if="!attribute.isLoading">
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
import isSpecialCollectionAttribute from '@/modules/marketplace/ozon/is-special-collection-attribute';

export default {
  props: ["show", "product"],
  setup(props, { emit }) {
    const store = useStore();
    const attributes = ref([]);
    const prevAttributes = ref([]);

    watchEffect(async () => {
      if (props.show) {
        await getCategoryAttributes(props.product.ozon.category);
        setInputValueForAttributes();
      }
    });

    watch(
      attributes,
      (attributes) => {
        attributes.forEach(async (attribute) => {
          if (attribute?.is_collection && attribute?.inputValue?.length > 0) {
            const prevAttribute = prevAttributes.value.find(
              (prevAttribute) => prevAttribute.id === attribute.id
            );

            if (!prevAttribute.inputValue) {
              setPrevAttributes();
              return;
            }
            
            if (attribute.inputValue !== prevAttribute.inputValue) {
              if ((attribute.inputValue.length - prevAttribute.inputValue?.length) > 3) return;

              setPrevAttributes();

              attribute.isLoading = true;

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
              attribute.isLoading = false;
            }
          }
        });
      },
      { deep: true }
    );

    function setPrevAttributes() {
      prevAttributes.value = JSON.parse(JSON.stringify(attributes.value));
    }

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

    function setInputValueForAttributes() {
      attributes.value.forEach((attribute) => {
        const foundValueInProduct = props.product.ozon?.attributes?.find(productAttribute => productAttribute.id === attribute.id);

        attribute.foundValues = [];
        attribute.selectedValue = null;
        attribute.isLoading = false;

        if (
          attribute.type === "String" ||
          attribute.type === "URL" ||
          attribute.type === "ImageURL" ||
          attribute.type === "multiline"
        ) {
          attribute.inputType = "text";
          attribute.inputValue = foundValueInProduct ? foundValueInProduct.values[0].value : '';
        }

        if (attribute.type === "Decimal" || attribute.type === "Integer") {
          attribute.inputType = "number";
          attribute.inputValue = foundValueInProduct ? foundValueInProduct.values[0].value : 0;
        }

        if (attribute.type === "Boolean") {
          attribute.inputType = "text";
          attribute.inputValue = foundValueInProduct ? foundValueInProduct.values[0].value : '';
        }

        const isSpecial = isSpecialCollectionAttribute(attribute);
        
        if (isSpecial) {
          attribute.is_collection = true;
          attribute.is_required = true;
        }

        if (attribute.is_collection && foundValueInProduct) {
          attribute.selectedValue = {
            id: foundValueInProduct.values[0].dictionary_value_id,
            value: foundValueInProduct.values[0].value
          }
        }
      });
    }

    async function getCategoryAttributeValues(category, attribute, prevResult = []) {
      const url = "/api/v1/marketplace/ozon/get-category-attribute-values";
      const json = await request(url, "POST", store.state.token, {
        categoryId: category.category_id,
        attributeId: attribute.id,
        lastValueId: prevResult.length > 0 ? prevResult[prevResult.length - 1].id : 0,
        limit: 5000,
      });

      json.result = [ ...prevResult, ...json.result ];

      if (json.has_next) return getCategoryAttributeValues(category, attribute, json.result);

      return json;
    }

    function selectAttributeValue(attribute, value) {
      attribute.foundValues = [];
      attribute.inputValue = value.value;
      attribute.selectedValue = value;
    }

    function saveSelectedAttributes() {
      emit('selectAttributesForProduct', { product: props.product, attributes: attributes.value });
    }

    function resetAttribute(attribute) {
      attribute.foundValues = [];
      attribute.inputValue = '';
      attribute.selectedValue = null;
    }

    return {
      attributes,
      toggleModal,
      selectAttributeValue,
      saveSelectedAttributes,
      resetAttribute
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