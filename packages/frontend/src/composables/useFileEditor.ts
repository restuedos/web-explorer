// composables/useFileEditor.ts
import { ref } from 'vue';

export function useFileEditor(initialContent: string | null, emit: (event: 'updateFileContent', content: string) => void) {
  const editableContent = ref(initialContent || '');
  const isEditing = ref(false);

  const trackChanges = () => {
    isEditing.value = true;
  };

  const saveFileContent = () => {
    emit("updateFileContent", editableContent.value);
    isEditing.value = false;
  };

  const updateContent = (newContent: string | null) => {
    editableContent.value = newContent || '';
    isEditing.value = false;
  };

  return {
    editableContent,
    isEditing,
    trackChanges,
    saveFileContent,
    updateContent
  };
}
