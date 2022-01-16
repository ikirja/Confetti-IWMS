<template>
  <ol class="breadcrumb m-0">
    <li v-for="(breadcrumb, index) in breadcrumbs" :key="breadcrumb" class="breadcrumb-item" :class="{ active: index === breadcrumbs.length - 1}">
      <a v-if="breadcrumb.link" :href="breadcrumb.link">{{ breadcrumb.title }}</a>
      <span v-if="!breadcrumb.link">{{ breadcrumb.title }}</span>
    </li>
  </ol>
</template>

<script>
export default {
  props: [ 'breadcrumbs' ]
}
</script>