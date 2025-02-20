// composables/useSearch.ts
import { ref } from 'vue';
import axios from 'axios';
import { Item } from '@/composables/useExplorer';

export function useSearch(openFolder: (item: any) => void, openFile: (item: any) => void) {
  const searchQuery = ref('');
  const searchResults = ref<Item[]>([])
  const isLoading = ref(false);

  const fetchSearchResults = async () => {
    if (!searchQuery.value) {
      searchResults.value = [];
      return;
    }

    isLoading.value = true;
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/items/search?q=${searchQuery.value}`);
      searchResults.value = response.data;
    } catch (error) {
      console.error('Search failed:', error);
      searchResults.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  const handleSearchItemClick = (item: any) => {
    if (item.type === 'folder') {
      openFolder(item); // Open the folder
    } else {
      openFile(item); // Open the file
    }
  };


  return { searchQuery, searchResults, isLoading, fetchSearchResults, handleSearchItemClick };
}