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
        <th v-for="column in columns" :key="column.id">{{ column.title }}</th>
        <!-- <th style="width: 85px">Действие</th> -->
      </tr>
    </thead>
    <tbody>
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
        <!-- <td class="table-action table-action_fix-width">
          <a @click.prevent="actionOne" href="#" class="action-icon">
            <i class="mdi mdi-eye"></i
          ></a>
          <a @click.prevent="actionTwo" href="#" class="action-icon">
            <i class="mdi mdi-database-plus"></i
          ></a>
        </td> -->
      </tr>
    </tbody>
  </table>
</template>

<script>
import { getCurrentInstance } from "vue";

export default {
  props: ["columns", "entries"],
  setup() {
    const internalInstance = getCurrentInstance();
    const moment = internalInstance.appContext.config.globalProperties.$moment;

    return {
      moment,
    };
  },
};
</script>