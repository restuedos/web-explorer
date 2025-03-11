<script setup lang="ts">
import { ref, watch, computed, onMounted, nextTick } from 'vue';
import ItemTree from '@/components/ItemTree.vue';
import ItemContent from '@/components/ItemContent.vue';
import 'primevue/resources/themes/lara-light-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import { useExplorer } from '@/composables/useExplorer';
import { useSearch } from '@/composables/useSearch';

const {
  items, selectedItem, selectedItemChildren, fileContent,
  openFolder, openFile, createItem, renameItem, deleteItem, saveFileContent
} = useExplorer();

const { searchQuery, searchResults, fetchSearchResults, handleSearchItemClick } = useSearch(openFolder, openFile);

const searchResultsHeight = ref(0);

// Function to update the height dynamically
const updateSearchResultsHeight = () => {
  nextTick(() => {
    const searchResultsElement = document.querySelector('.search-results');
    searchResultsHeight.value = searchResultsElement ? searchResultsElement.clientHeight : 0;
  });
};

// Watch searchResults and update height when it changes
watch(() => searchResults.value, updateSearchResultsHeight, { deep: true });

// Call function on mount
onMounted(updateSearchResultsHeight);

const previewBottomOffset = computed(() => `-${searchResultsHeight.value}px`);

const isExpanded = ref(false);

const truncatedContent = computed(() => {
  return fileContent.value && fileContent.value.length > 200
    ? fileContent.value.slice(0, 200)
    : fileContent.value;
});
</script>

<template>
  <div class="explorer">
    <!-- Sidebar Panel -->
    <div class="explorer-panel left-panel">
      <div class="search-bar">
        <input type="text" v-model="searchQuery" @input="fetchSearchResults" placeholder="Search..." />
      </div>
      <div class="item-actions">
        <button class="add-folder-btn" @click="createItem('folder')" :disabled="selectedItem?.type === 'file'">
          <i class="pi pi-folder"></i> Add Folder
        </button>
        <button class="add-file-btn" @click="createItem('file')" :disabled="selectedItem?.type === 'file'">
          <i class="pi pi-file"></i> Add File
        </button>
        <button class="rename-item-btn" @click="renameItem" :disabled="!selectedItem">
          <i class="pi pi-pencil"></i> Rename
        </button>
        <button class="delete-item-btn" @click="deleteItem" :disabled="!selectedItem">
          <i class="pi pi-trash"></i> Delete
        </button>
      </div>

      <ItemTree :items="items" :selectedItemId="selectedItem?.id || null" @select-item="openFolder" />
    </div>

    <!-- Main Content Panel -->
    <div class="explorer-panel right-panel">
      <div v-if="searchQuery && searchResults.length" class="search-results">
        <h3>Search Results</h3>
        <ul>
          <li v-for="item in searchResults" :key="item.id" @click="handleSearchItemClick(item)">
            <i v-if="item.type === 'folder'" class="pi pi-folder"></i>
            <i v-if="item.type === 'file'" class="pi pi-file"></i>
            {{ item.name }}
          </li>
        </ul>
      </div>
      <ItemContent :items="selectedItemChildren" :selected-item="selectedItem" :fileContent="fileContent"
        @openFolder="openFolder" @openFile="openFile" @updateFileContent="saveFileContent" />

      <!-- File Preview -->
      <div v-if="selectedItem?.type == 'file'" class="file-preview" :style="{ bottom: previewBottomOffset }">
        <h3>Preview: {{ selectedItem.name }}</h3>
        <p>
          {{ isExpanded ? fileContent : truncatedContent }}
          <span v-if="fileContent && fileContent.length > 500" @click="isExpanded = !isExpanded" class="expand-toggle">
            {{ isExpanded ? "[Show Less]" : "[...]" }}
          </span>
        </p>
      </div>

    </div>
  </div>
</template>

<style lang="scss">
.explorer {
  display: flex;
  height: 100vh;
  width: 100%;

  .explorer-panel {
    padding: 1rem;
    overflow: auto;
  }

  .left-panel {
    width: 300px;
    border-right: 1px solid #ddd;
    background-color: #f5f5f5;
    display: flex;
    flex-direction: column;
  }

  .right-panel {
    flex: 1;
    background-color: #fff;
    position: relative;
  }

  .file-preview {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: #f9f9f9;
    padding: 1rem;
    border-top: 1px solid #ddd;
    overflow: auto;
    max-height: 200px;
    transition: bottom 0.3s ease;

    h3 {
      margin: 0 0 0.5rem;
    }

    p {
      font-family: monospace;
      white-space: pre-wrap;
      font-size: 0.9rem;
      color: #333;
      overflow-wrap: break-word;
    }

    .expand-toggle {
      color: blue;
      cursor: pointer;
      font-weight: bold;
      text-decoration: underline;
    }
  }

  .search-bar {
    padding: 0.5rem;

    input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
  }

  .search-results {
    padding: 1rem;
    border-bottom: 1px solid #ddd;

    ul {
      list-style: none;
      padding: 0;

      li {
        padding: 5px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 5px;

        &:hover {
          background-color: #f0f0f0;
        }
      }
    }
  }

  .item-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 10px;
  }

  .add-folder-btn,
  .add-file-btn,
  .rename-item-btn,
  .delete-item-btn {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    border-radius: 4px;
    justify-content: center;

    &:hover {
      background-color: #0056b3;
    }

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  }

  .rename-item-btn {
    background-color: #ffc107;

    &:hover {
      background-color: #d39e00;
    }

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  }

  .delete-item-btn {
    background-color: #dc3545;

    &:hover {
      background-color: #b02a37;
    }

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  }
}
</style>
