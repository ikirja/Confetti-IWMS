<template>
  <div v-if="product.wildberries.category">
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
                  >ID: {{ attribute.type }}</label
                >
                <input
                  v-model="attribute.inputValue"
                  :type="attribute.inputType"
                  :id="attribute.id"
                  class="form-control"
                  :disabled="checkIfAvailable(attribute)"
                />
                <div v-if="attribute.useOnlyDictionaryValues && !checkIfAvailable(attribute)" class="attribute-params">
                  <span v-for="param in attribute.params" :key="param" class="badge badge-dark-lighten me-1">
                    <span v-if="param.value">{{ param.value }}</span>
                    <span v-if="param.count">{{ param.count }}</span>
                    <span @click.prevent="removeValueFromAttribute(attribute, param)" class="attribute-params__remove"><i class="uil-multiply"></i></span>
                  </span>
                </div>
                <small
                  >
                  <span v-if="!attribute.isNumber">Тип: Строка </span>
                  <span v-if="attribute.isNumber">Тип: Число </span>
                  <span v-if="attribute.required" class="text-danger">Обязательно </span>
                  <span v-if="attribute.useOnlyDictionaryValues" class="text-warning">Справочник </span>
                </small
                >
                <div
                  v-if="attribute.useOnlyDictionaryValues && attribute.foundValues?.length > 0 && attribute.inputValue?.length > 0"
                  class="dropdown-attribute-menu"
                >
                  <small>Начните вводить данные</small>
                  <div v-for="value in attribute.foundValues" :key="value.key">
                    <span
                      @click="selectAttributeValue(attribute, value)"
                      class="dropdown-attribute-menu__value"
                      >{{ value.key }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <h5>Характеристики номенклатурной вариации товара</h5>
              </div>
              <div
                class="attribute col-12 col-lg-6 mb-3 position-relative"
                v-for="attribute in attributesNomenslatureVariation"
                :key="attribute"
              >
                <label for="1" class="form-label"
                  >ID: {{ attribute.type }}</label
                >
                <input
                  v-model="attribute.inputValue"
                  :type="attribute.inputType"
                  :id="attribute.id"
                  class="form-control"
                  :disabled="checkIfAvailable(attribute)"
                />
                <div v-if="attribute.useOnlyDictionaryValues && !checkIfAvailable(attribute)" class="attribute-params">
                  <span v-for="param in attribute.params" :key="param" class="badge badge-dark-lighten me-1">
                    <span v-if="param.value">{{ param.value }}</span>
                    <span v-if="param.count">{{ param.count }}</span>
                    <span @click.prevent="removeValueFromAttribute(attribute, param)" class="attribute-params__remove"><i class="uil-multiply"></i></span>
                  </span>
                </div>
                <small
                  >
                  <span v-if="!attribute.isNumber">Тип: Строка </span>
                  <span v-if="attribute.isNumber">Тип: Число </span>
                  <span v-if="attribute.required" class="text-danger">Обязательно </span>
                  <span v-if="attribute.useOnlyDictionaryValues" class="text-warning">Справочник</span>
                </small
                >
                <div
                  v-if="attribute.useOnlyDictionaryValues && attribute.foundValues?.length > 0 && attribute.inputValue?.length > 0"
                  class="dropdown-attribute-menu"
                >
                  <small>Начните вводить данные</small>
                  <div v-for="value in attribute.foundValues" :key="value.key">
                    <span
                      @click="selectAttributeValue(attribute, value)"
                      class="dropdown-attribute-menu__value"
                      >{{ value.key }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <h5>Характеристики номенклатуры товара</h5>
              </div>
              <div
                class="attribute col-12 col-lg-6 mb-3 position-relative"
                v-for="attribute in attributesNomenslature"
                :key="attribute"
              >
                <label for="1" class="form-label"
                  >ID: {{ attribute.type }}</label
                >
                <input
                  v-model="attribute.inputValue"
                  :type="attribute.inputType"
                  :id="attribute.id"
                  class="form-control"
                  :disabled="checkIfAvailable(attribute)"
                />
                <div v-if="attribute.useOnlyDictionaryValues && !checkIfAvailable(attribute)" class="attribute-params">
                  <span v-for="param in attribute.params" :key="param" class="badge badge-dark-lighten me-1">
                    <span v-if="param.value">{{ param.value }}</span>
                    <span v-if="param.count">{{ param.count }}</span>
                    <span @click.prevent="removeValueFromAttribute(attribute, param)" class="attribute-params__remove"><i class="uil-multiply"></i></span>
                  </span>
                </div>
                <small
                  >
                  <span v-if="!attribute.isNumber">Тип: Строка </span>
                  <span v-if="attribute.isNumber">Тип: Число </span>
                  <span v-if="attribute.required" class="text-danger">Обязательно </span>
                  <span v-if="attribute.useOnlyDictionaryValues" class="text-warning">Справочник</span>
                </small
                >
                <div
                  v-if="attribute.useOnlyDictionaryValues && attribute.foundValues?.length > 0 && attribute.inputValue?.length > 0"
                  class="dropdown-attribute-menu"
                >
                  <small>Начните вводить данные</small>
                  <div v-for="value in attribute.foundValues" :key="value.key">
                    <span
                      @click="selectAttributeValue(attribute, value)"
                      class="dropdown-attribute-menu__value"
                      >{{ value.key }}</span
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
import { ref, onMounted, watch } from "vue";
import { useStore } from "vuex";
import request from "@/modules/request";

export default {
  props: ["show", "product"],
  setup(props, { emit }) {
    const store = useStore();
    const attributes = ref([]);
    const attributesNomenslatureVariation = ref([]);
    const attributesNomenslature = ref([]);
    const prevAttributes = ref([]);

    onMounted(() => {
      getCategoryAttributes();
      setInputTypeForAttributes();
    });

    watch(attributes, attributesWatcher, { deep: true });
    watch(attributesNomenslatureVariation, attributesWatcher, { deep: true });
    watch(attributesNomenslature, attributesWatcher, { deep: true });

    function toggleModal() {
      emit("toggleModal", props.product.product._id);
    }

    function attributesWatcher(attributes) {
      attributes.forEach(async (attribute) => {
        if (attribute?.useOnlyDictionaryValues && attribute?.inputValue?.length > 1) {
          const prevAttribute = prevAttributes.value.find(
            (prevAttribute) => prevAttribute.type === attribute.type
          );

          if (!prevAttribute?.inputValue) {
            setPrevAttributes();
            return;
          }
          
          if (attribute.inputValue !== prevAttribute.inputValue) {
            if ((attribute.inputValue.length - prevAttribute.inputValue?.length) > 3) return;

            setPrevAttributes();

            let json = await getAttributeValues(attribute);
            if (json?.data.length > 0) attribute.foundValues = json.data;
          }
        }
      });
    }

    function setPrevAttributes() {
      prevAttributes.value = JSON.parse(JSON.stringify([ ...attributes.value, ...attributesNomenslatureVariation.value, ...attributesNomenslature.value ]));
    }

    function getCategoryAttributes() {
      attributes.value = props.product.wildberries.category.addin.filter(attribute => attribute.isAvailable);
      attributesNomenslatureVariation.value = props.product.wildberries.category.nomenclature.variation.addin.filter(attribute => attribute.isAvailable);
      attributesNomenslature.value = props.product.wildberries.category.nomenclature.addin.filter(attribute => attribute.isAvailable);
    }

    function setInputTypeForAttributes() {
      attributes.value.forEach((attribute) => {
        if (attribute.isNumber) {
          attribute.inputType = "number";
        } else {
          attribute.inputType = "text";
        }
      });
    }

    async function getAttributeValues(attribute) {
      if (!attribute.useOnlyDictionaryValues) return null;

      let body = {
        url: attribute.dictionary,
        query: {
          top: 100,
          pattern: attribute.inputValue
        }
      }

      if (attribute.dictionary === '/ext') {
        body.query.lang = 'ru',
        body.query.option = attribute.type
      }

      const url = '/api/v1/marketplace/wildberries/dictionary';
      const json = await request(url, 'POST', store.state.token, body);

      return json;
    }

    function selectAttributeValue(attribute, value) {
      attribute.foundValues = [];
      attribute.inputValue = '';

      if (attribute.params && attribute.params.length > 0) {
        const foundParam = attribute.params.find(param => param.value === value.key);
        if (!foundParam) attribute.params.push({ value: value.key });
      } else {
        attribute.params = [ { value: value.key } ];
      }
    }

    function removeValueFromAttribute(attribute, param) {
      const foundIndex = attribute.params.findIndex(paramInAttribute => paramInAttribute.value === param.value);
      if (foundIndex !== -1) attribute.params.splice(foundIndex, 1);
    }

    function saveSelectedAttributes() {
      emit('selectAttributesForProduct', {
        product: props.product,
        attributes: attributes.value,
        attributesNomenslatureVariation: attributesNomenslatureVariation.value,
        attributesNomenslature: attributesNomenslature.value
      });
    }

    function checkIfAvailable(attribute) {
      if (
        attribute.type === 'Наименование' ||
        attribute.type === 'Описание'
      ) {
        return true;
      } else {
        return false;
      }
    }

    return {
      attributes,
      attributesNomenslatureVariation,
      attributesNomenslature,
      toggleModal,
      selectAttributeValue,
      removeValueFromAttribute,
      saveSelectedAttributes,
      checkIfAvailable
    };
  },
};
</script>

<style scoped>
.attribute-params__remove {
  cursor: pointer;
}

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