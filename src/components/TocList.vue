<template>
  <mdui-list class="items toc-items">
    <template v-for="(h, index) in headings" :key="h.id">
      <div v-if="index > 0 && h.level === 2" class="divider"></div>
      <mdui-list-item
        :href="'#' + h.id"
        rounded
        alignment="center"
        :active="activeId === h.id"
        :class="[
          'item',
          'toc-level-' + h.level,
          { 'item-bold': h.level === 2, active: activeId === h.id }
        ]"
        @click="emit('select', h.id)"
      >
        {{ h.text }}
      </mdui-list-item>
    </template>
  </mdui-list>
</template>

<script setup>
// 目录条目用真实锚点（href="#id"），不拦截默认行为：
// 浏览器会原生把 #id 写进 URL，章节链接因此可以直接分享；
// 吸顶栏遮挡由标题上的 scroll-margin-top 处理。
defineProps({
  headings: {
    type: Array,
    default: () => []
  },
  activeId: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['select'])
</script>

<style scoped>
.divider {
  height: 0.2rem;
}
</style>
