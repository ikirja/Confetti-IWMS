<template>
  <div>
    <select v-model="selectedParent" class="form-select mb-1" @change="getCategoryByParent" :disabled="categoriesParent.length === 0">
      <option disabled selected value>Выберите категорию</option>
      <option v-for="category in categoriesParent" :key="category.name" :value="category">{{ category.name }}</option>
    </select>

    <select v-if="categoriesByParent.length > 0" v-model="selectedByParent" class="form-select mb-1" @change="setCategoryForProduct" :disabled="categoriesByParent.length === 0">
      <option disabled selected value>Выберите категорию</option>
      <option v-for="category in categoriesByParent" :key="category.id" :value="category">{{ category.name }}</option>
    </select>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import request from '@/modules/request';

export default {
  props: [ 'productId' ],
  setup(props, { emit }) {
    const store = useStore();
    const selectedParent = ref({});
    const selectedByParent = ref({});
    const categoriesParent = ref([]);
    const categoriesByParent = ref([]);

    onMounted(async () => await getCategoryParent());

    async function getCategoryParent() {
      const json = await request('/api/v1/marketplace/wildberries/get-category-parent', 'GET', store.state.token);
      if (json.data && typeof json.data === 'object') categoriesParent.value = Object.entries(json.data).map(item => item[1]);
    }

    async function getCategoryByParent() {
      const json = await request('/api/v1/marketplace/wildberries/get-category-by-parent', 'POST', store.state.token, {
        parent: selectedParent.value.name
      });

      if (json.data && Array.isArray(json.data)) categoriesByParent.value = json.data;
    }

    function setCategoryForProduct() {
      emit('selectedCategory', { category: selectedByParent.value, productId: props.productId });
    }

    return {
      selectedParent,
      selectedByParent,
      categoriesParent,
      categoriesByParent,
      getCategoryByParent,
      setCategoryForProduct
    }
  }
}
</script>