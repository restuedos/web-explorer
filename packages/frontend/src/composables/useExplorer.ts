// composables/useExplorer.ts
import { ref, onMounted, watchEffect } from 'vue';
import axios from 'axios';

export interface Item {
  id: string;
  name: string;
  type: 'folder' | 'file';
  children?: Item[];
}

export function useExplorer() {
  const items = ref<Item[]>([]);
  const selectedItem = ref<Item | null>(null);
  const selectedItemChildren = ref<Item[]>([]);
  const fileContent = ref<string | null>(null);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/items');
      items.value = response.data;
    } catch (error) {
      alert('Failed to fetch items.');
      console.error(error);
    }
  };

  const fetchSelectedItemChildren = async () => {
    if (!selectedItem.value || selectedItem.value.type !== 'folder') return;
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/items/${selectedItem.value.id}/children`);
      selectedItemChildren.value = response.data;
    } catch (error) {
      alert('Failed to fetch folder contents.');
      console.error(error);
    }
  };

  const fetchFileContent = async (fileId: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/items/${fileId}/content`);
      fileContent.value = response.data.content;
    } catch (error) {
      fileContent.value = "Failed to load file content.";
      console.error(error);
    }
  };

  watchEffect(() => {
    if (selectedItem.value?.type === 'folder') {
      fetchSelectedItemChildren();
      fileContent.value = null;
    } else if (selectedItem.value?.type === 'file') {
      fetchFileContent(selectedItem.value.id);
    } else {
      selectedItemChildren.value = [];
      fileContent.value = null;
    }
  });

  const openFolder = (folder: Item) => {
    selectedItem.value = folder;
    fileContent.value = null;
  };

  const openFile = async (file: Item) => {
    selectedItem.value = file;
    await fetchFileContent(file.id);
  };

  const createItem = async (type: 'folder' | 'file') => {
    if (selectedItem.value?.type === 'file') {
      alert("Cannot create a folder or file inside a file.");
      return;
    }

    const itemName = prompt(`Enter ${type} name:`);
    if (!itemName) return;

    try {
      await axios.post('http://localhost:3000/api/v1/items', {
        name: itemName,
        type,
        parentId: selectedItem.value?.id || null
      });
      await fetchItems();
      if (selectedItem.value?.type === 'folder') {
        await fetchSelectedItemChildren();
      }
    } catch (error) {
      alert(`Failed to create ${type}.`);
      console.error(error);
    }
  };

  const renameItem = async () => {
    if (!selectedItem.value) {
      alert("Select an item first!");
      return;
    }

    const newName = prompt("Enter new item name:", selectedItem.value.name);
    if (!newName) return;

    try {
      await axios.patch(`http://localhost:3000/api/v1/items/${selectedItem.value.id}`, { name: newName });
      
      selectedItem.value.name = newName;
      
      await fetchItems();
      if (selectedItem.value?.type === 'folder') {
        await fetchSelectedItemChildren();
      }
    } catch (error) {
      alert("Failed to rename item.");
      console.error(error);
    }
  };

  const deleteItem = async () => {
    if (!selectedItem.value) {
      alert("Select an item first!");
      return;
    }

    const confirmDelete = confirm(`Are you sure you want to delete "${selectedItem.value.name}"?`);
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3000/api/v1/items/${selectedItem.value.id}`);
      selectedItem.value = null;
      fileContent.value = null;
      await fetchItems();
    } catch (error) {
      alert("Failed to delete item.");
      console.error(error);
    }
  };

  const saveFileContent = async (newContent: string) => {
    if (!selectedItem.value || selectedItem.value?.type !== 'file') return;
    try {
      await axios.put(`http://localhost:3000/api/v1/items/${selectedItem.value.id}/content`, { content: newContent });
      fileContent.value = newContent;
    } catch (error) {
      alert("Failed to save file content.");
      console.error(error);
    }
  };

  onMounted(fetchItems);

  return {
    items,
    selectedItem,
    selectedItemChildren,
    fileContent,
    fetchItems,
    openFolder,
    openFile,
    createItem,
    renameItem,
    deleteItem,
    saveFileContent
  };
}
