<template>
  <div>
    <select v-for="depthLevel in depthLevels" :key="depthLevel.index" v-model="depthLevel.selected" class="form-select mb-1" @change="selectNextCategories(depthLevel.selected, depthLevel.index)" :disabled="depthLevel.categories.length === 0">
      <option disabled selected value>Выберите категорию</option>
      <option v-for="category in depthLevel.categories" :key="category.category_id" :value="category">{{ category.title }}</option>
    </select>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import sortOzonCategoryAsc from '@/modules/marketplace/ozon/sort-category-title-asc';

export default {
  props: [ 'productId' ],
  setup(props, { emit }) {
    const store = useStore();
    const selected = ref({});
    const depthLevels = ref([
      {
        index: 1,
        selected: {},
        categories: []
      }
    ]);

    onMounted(async () => await getCategoryTree());

    async function getCategoryTree() {
      const response = await fetch('/api/v1/marketplace/ozon/get-category-tree', { headers: { token: store.state.token } });
      const jsonData = await response.json();

      if (jsonData.result) {
        jsonData.result.sort(sortOzonCategoryAsc);
        depthLevels.value[0].categories = jsonData.result;
      }
    }

    function selectNextCategories(category, index) {
      if (index < depthLevels.value.length) {
        depthLevels.value = depthLevels.value.slice(0, index);
        emit('removeCategoryFromProduct', props.productId);
      }
      
      if (category.children.length === 0) return emit('selectedCategory', { category, productId: props.productId });

      depthLevels.value.push({
        index: index + 1,
        selected: {},
        categories: category.children.sort(sortOzonCategoryAsc)
      });
    }

    return {
      selected,
      depthLevels,
      selectNextCategories
    }
  }
}
</script>