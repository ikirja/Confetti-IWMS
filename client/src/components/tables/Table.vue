<template>
  <table class="table table-striped table-centered w-100 dt-responsive nowrap">
    <thead class="table-light">
      <tr>
        <!-- <th class="all" style="width: 20px">
          <div class="form-check">
            <input type="checkbox" class="form-check-input" id="check-all" />
            <label class="form-check-label" for="check-all">&nbsp;</label>
          </div>
        </th> -->
        <th v-for="column in columns" :key="column.id" style="white-space: pre-line">{{ column.title }}</th>
        <th v-if="actions" style="width: 85px">Действие</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="isLoading">
        <td :colspan="columns.length" class="text-center">
          <div class="spinner-grow text-primary" role="status"></div>
        </td>
      </tr>
      <tr v-else-if="entries.length === 0">
        <td :colspan="columns.length" class="text-center">
          <div>Данные не найдены</div>
        </td>
      </tr>
      <tr v-for="entry in entries" :key="entry">
        <!-- <td>
          <div class="form-check">
            <input type="checkbox" class="form-check-input" :id="entry" />
            <label class="form-check-label" for="entry">&nbsp;</label>
          </div>
        </td> -->
        <td v-for="(value, name) in entry" :key="value">
          <div v-if="name === 'createdAt' || name === 'updatedAt'">
            {{ moment(value).format("DD/MM/YYYY") }}
          </div>
          <div v-else-if="typeof value === 'boolean'">
            <span v-if="value"><span class="badge bg-success">Да</span></span>
            <span v-else><span class="badge bg-danger">Нет</span></span>
          </div>
          <div v-else>{{ value }}</div>
        </td>
        <td v-if="actions" class="table-action table-action_fix-width">
          <a v-for="action in actions" :key="action" @click.prevent="action.method(entry)" href="#" class="action-icon">
            <i :class="action.classes"></i
          ></a>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { getCurrentInstance } from "vue";

export default {
  props: ["columns", "entries", "isLoading", "actions"],
  setup() {
    const internalInstance = getCurrentInstance();
    const moment = internalInstance.appContext.config.globalProperties.$moment;

    return {
      moment,
    };
  },
};
</script>