// composables/useUrlShortener.ts
import { ref, onMounted } from 'vue';
import axios from 'axios';

export interface Link {
  id: string;
  link: string;
  shortenedLink: string;
}

export function useUrlShortener() {
  const links = ref<Link[]>([]);
  const selectedLink = ref<Link | null>(null);

  // Fetch all links from the API
  const fetchLinks = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/links');
      links.value = response.data;
    } catch (error) {
      console.error('Failed to fetch links:', error);
      alert('Failed to fetch links.');
    }
  };

  // Create a new shortened link
  const createLink = async () => {
    const link = prompt('Enter link:');
    if (!link) return;

    try {
      await axios.post('http://localhost:3000/api/v1/links', { link });
      await fetchLinks(); // Refresh list after creation
    } catch (error) {
      console.error('Failed to create link:', error);
      alert('Failed to create link.');
    }
  };

  // Delete a link by ID
  const deleteLink = async (id: string) => {
    const confirmDelete = confirm('Are you sure you want to delete this link?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3000/api/v1/links/${id}`);
      await fetchLinks(); // Refresh list after deletion
    } catch (error) {
      console.error('Failed to delete link:', error);
      alert('Failed to delete link.');
    }
  };

  // Fetch links when the composable is used
  onMounted(fetchLinks);

  return {
    links,
    selectedLink,
    fetchLinks,
    createLink,
    deleteLink,
  };
}
