<script setup lang="ts">
import { ref } from 'vue';

interface Item {
  id: string;
  name: string;
  type: 'folder' | 'file';
  children?: Item[];
}

defineProps<{
  items: Item[];
  selectedItemId: string | null;
}>();

const emit = defineEmits<{
  (e: 'selectItem', item: Item): void;
}>();

const expandedFolders = ref<Set<string>>(new Set());

const toggleFolder = (item: Item) => {
  if (item.type === 'folder') {
    expandedFolders.value.has(item.id)
      ? expandedFolders.value.delete(item.id)
      : expandedFolders.value.add(item.id);
  }
};

const handleClick = (item: Item) => {
  emit('selectItem', item);
  toggleFolder(item);
};
</script>

<template>
  <div class="item-tree">
    <div v-for="item in items" :key="item.id" class="item">
      <div 
        class="item-header"
        :class="{ 'selected-item': item.id === selectedItemId }" 
        @click="handleClick(item)"
      >
        <span class="item-icon">
          <i :class="[
            'pi',
            item.type === 'folder' 
              ? expandedFolders.has(item.id) 
                ? 'pi-folder-open' 
                : 'pi-folder'
              : 'pi-file'
          ]"></i>
        </span>
        <span class="item-name">{{ item.name }}</span>
      </div>

      <!-- Show children (both folders and files) inside expanded folders -->
      <transition name="fade">
        <div 
          v-if="expandedFolders.has(item.id) && item.children?.length" 
          class="item-children"
        >
          <ItemTree 
            :items="item.children" 
            :selectedItemId="selectedItemId"
            @selectItem="emit('selectItem', $event)"
          />
        </div>
      </transition>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.item-tree {
  .item {
    margin: 4px 0;
  }

  .item-header {
    display: flex;
    align-items: center;
    padding: 4px 8px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.2s;

    &:hover {
      background-color: #e0e0e0;
    }
  }

  .selected-item {
    background-color: #007bff !important;
    color: white;
    font-weight: bold;
  }

  .item-icon {
    margin-right: 8px;
    color: #666;
  }

  .item-children {
    margin-left: 20px;
  }

  /* Smooth transition effect */
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }
}
</style>
