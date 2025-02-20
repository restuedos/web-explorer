// composables/useItemTree.ts
import { ref } from 'vue';

export function useItemTree(emit: (e: 'selectItem', item: any) => void) {
  const expandedFolders = ref<Set<string>>(new Set());

  const toggleFolder = (item: any) => {
    if (item.type === 'folder') {
      expandedFolders.value.has(item.id)
        ? expandedFolders.value.delete(item.id)
        : expandedFolders.value.add(item.id);
    }
  };

  const handleClick = (item: any) => {
    emit('selectItem', item);
    toggleFolder(item);
  };

  return { expandedFolders, toggleFolder, handleClick };
}
