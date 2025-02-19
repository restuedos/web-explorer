<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue';
import axios from 'axios';
import ItemTree from './components/ItemTree.vue';
import ItemContent from './components/ItemContent.vue';
import 'primevue/resources/themes/lara-light-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

interface Item {
  id: string;
  name: string;
  type: 'folder' | 'file';
  children?: Item[];
}

const items = ref<Item[]>([]);
const selectedItem = ref<Item | null>(null);
const selectedItemChildren = ref<Item[]>([]);
const fileContent = ref<string | null>(null);

// Fetch initial data
const fetchItems = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/items');
    items.value = response.data;
  } catch (error) {
    alert('Failed to fetch items.');
    console.error(error);
  }
};

// Fetch selected folder's children
const fetchSelectedItemChildren = async () => {
  if (!selectedItem.value || selectedItem.value.type !== 'folder') return;
  try {
    const response = await axios.get(`http://localhost:3000/api/items/${selectedItem.value.id}/children`);
    selectedItemChildren.value = response.data;
  } catch (error) {
    alert('Failed to fetch folder contents.');
    console.error(error);
  }
};

const fetchFileContent = async (fileId: string) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/files/${fileId}`);
    fileContent.value = response.data.content;
  } catch (error) {
    fileContent.value = "Failed to load file content.";
    console.error(error);
  }
};

// Watch for selectedItem changes and fetch children automatically
watchEffect(() => {
  if (selectedItem.value?.type === 'folder') {
    fetchSelectedItemChildren();
    fileContent.value = null; // Clear file content when switching to a folder
  } else if (selectedItem.value?.type === 'file') {
    fetchFileContent(selectedItem.value.id); // Fetch and show file content
  } else {
    selectedItemChildren.value = []; // Clear children when no selection
    fileContent.value = null;
  }
});

// Handle folder selection
const openFolder = async (folder: Item) => {
  selectedItem.value = folder;
  fileContent.value = null;
};

// Handle file selection and preview
const openFile = async (file: Item) => {
  selectedItem.value = file;

  try {
    const response = await axios.get(`http://localhost:3000/api/files/${file.id}`);
    fileContent.value = response.data.content;
  } catch (error) {
    fileContent.value = "Failed to load file content.";
    console.error(error);
  }
};

// Create a new folder or file
const createItem = async (type: 'folder' | 'file') => {
  if (selectedItem.value?.type === 'file') {
    alert("Cannot create a folder or file inside a file.");
    return;
  }

  const itemName = prompt(`Enter ${type} name:`);
  if (!itemName) return;

  try {
    await axios.post('http://localhost:3000/api/items', { 
      name: itemName, 
      type,
      parentId: selectedItem.value?.id || null 
    });

    await fetchItems();
    if (selectedItem.value?.type === 'folder') {
      await fetchSelectedItemChildren(); // Auto-refresh right panel
    }
  } catch (error) {
    alert(`Failed to create ${type}.`);
    console.error(error);
  }
};

// Rename an item
const renameItem = async () => {
  if (!selectedItem.value) {
    alert("Select an item first!");
    return;
  }

  const newName = prompt("Enter new item name:", selectedItem.value.name);
  if (!newName) return;

  try {
    await axios.patch(`http://localhost:3000/api/items/${selectedItem.value.id}`, { name: newName });
    await fetchItems();
    if (selectedItem.value?.type === 'folder') {
      await fetchSelectedItemChildren(); // Auto-refresh right panel
    }
  } catch (error) {
    alert("Failed to rename item.");
    console.error(error);
  }
};

// Delete an item
const deleteItem = async () => {
  if (!selectedItem.value) {
    alert("Select an item first!");
    return;
  }

  const confirmDelete = confirm(`Are you sure you want to delete "${selectedItem.value.name}"?`);
  if (!confirmDelete) return;

  try {
    await axios.delete(`http://localhost:3000/api/items/${selectedItem.value.id}`);
    
    selectedItem.value = null;
    fileContent.value = null;
    await fetchItems();
  } catch (error) {
    alert("Failed to delete item.");
    console.error(error);
  }
};

// Update item content
const saveFileContent = async (newContent: string) => {
  if (!selectedItem.value || selectedItem.value?.type !== 'file') return;

  try {
    await axios.put(`http://localhost:3000/api/files/${selectedItem.value.id}`, {
      content: newContent
    });
    fileContent.value = newContent; // ✅ Update locally after saving
  } catch (error) {
    alert("Failed to save file content.");
    console.error(error);
  }
};

onMounted(fetchItems);
</script>

<template>
  <div class="explorer">
    <!-- Sidebar Panel -->
    <div class="explorer-panel left-panel">
      <div class="item-actions">
        <button class="add-folder-btn" 
          @click="createItem('folder')" 
          :disabled="selectedItem?.type === 'file'">
          <i class="pi pi-folder"></i> Add Folder
        </button>
        <button class="add-file-btn" 
          @click="createItem('file')" 
          :disabled="selectedItem?.type === 'file'">
          <i class="pi pi-file"></i> Add File
        </button>
        <button class="rename-item-btn" @click="renameItem" :disabled="!selectedItem">
          <i class="pi pi-pencil"></i> Rename
        </button>
        <button class="delete-item-btn" @click="deleteItem" :disabled="!selectedItem">
          <i class="pi pi-trash"></i> Delete
        </button>
      </div>
      
      <ItemTree 
        :items="items" 
        :selectedItemId="selectedItem?.id || null"
        @select-item="openFolder"
      />
    </div>

    <!-- Main Content Panel -->
    <div class="explorer-panel right-panel">
      <ItemContent 
        :items="selectedItemChildren"
        :selected-item="selectedItem"
        :fileContent="fileContent"
        @openFolder="openFolder"
        @openFile="openFile"
        @updateFileContent="saveFileContent"
      />

      <!-- File Preview -->
      <div v-if="selectedItem?.type == 'file'" class="file-preview">
        <h3>Preview: {{ selectedItem.name }}</h3>
        <pre>{{ fileContent || "This file has no content." }}</pre>
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

    h3 {
      margin: 0 0 0.5rem;
    }

    pre {
      white-space: pre-wrap;
      font-size: 0.9rem;
      color: #333;
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
}
</style>
