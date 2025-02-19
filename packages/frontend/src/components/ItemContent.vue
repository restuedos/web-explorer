<script setup lang="ts">
import { ref, watch  } from 'vue';

interface Item {
  id: string;
  name: string;
  type: 'folder' | 'file';
  children?: Item[];
}

const props = defineProps<{
  items: Item[];
  selectedItem: Item | null;
  fileContent?: string | null;
}>();

const emit = defineEmits<{
  (e: 'openFolder', folder: Item): void;
  (e: 'openFile', file: Item): void;
  (e: 'updateFileContent', content: string): void; // ✅ Emit event for updates
}>();

const editableContent = ref(props.fileContent || '');
const isEditing = ref(false);

watch(() => props.fileContent, (newContent) => {
  editableContent.value = newContent || '';
  isEditing.value = false;
});

const handleClick = (item: Item) => {
  if (item.type === 'folder') {
    emit('openFolder', item);
  } else {
    emit('openFile', item);
  }
};

const trackChanges = () => {
  isEditing.value = true;
};

const saveFileContent = () => {
  emit("updateFileContent", editableContent.value);
  isEditing.value = false; // Reset editing state after saving
};
</script>

<template>
  <div class="item-content">
    <div class="header" v-if="selectedItem">
      <h2>
        {{ selectedItem.name }}
        <span v-if="isEditing" class="editing-status">(Editing...)</span>
      </h2>
    </div>

    <div class="content">
      <div v-if="selectedItem?.type === 'file'" class="file-editor">
        <textarea 
          v-model="editableContent"
          @input="trackChanges"
          class="file-textarea"
        ></textarea>
        <button 
          @click="saveFileContent" 
          :disabled="!isEditing"
          class="save-button"
        >
          Save
        </button>
      </div>

      <div v-else-if="items.length" class="item-grid">
        <div 
          v-for="item in items" 
          :key="item.id" 
          class="item-card"
          @click="handleClick(item)"
        >
          <i class="pi" :class="item.type === 'folder' ? 'pi-folder' : 'pi-file'"></i>
          <span class="item-name">{{ item.name }}</span>
        </div>
      </div>

      <div v-else-if="selectedItem?.type === 'folder'" class="empty-state">
        This folder is empty
      </div>

      <div v-else class="empty-state">
        Select a folder to view its contents
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.file-textarea {
  width: 100%;
  height: 300px;
  border: 1px solid #ccc;
  padding: 10px;
  font-size: 1rem;
  font-family: monospace;
  resize: vertical;
  outline: none;
}

.item-content {
  height: 100%;
  display: flex;
  flex-direction: column;

  .header {
    padding: 0 0 1rem;
    border-bottom: 1px solid #ddd;

    h2 {
      margin: 0;
      font-size: 1.2rem;
      color: #333;
    }
    
    .editing-status {
      font-size: 0.9rem;
      color: #ff9800;
      margin-left: 10px;
    }
  }

  .content {
    flex: 1;
    padding: 1rem 0;
  }

  .item-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 1rem;

    .item-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1rem;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s ease-in-out;

      &:hover {
        background-color: #f5f5f5;
      }

      i {
        font-size: 2rem;
        margin-bottom: 0.5rem;
      }

      .pi-file {
        color: #777;
      }

      .pi-folder {
        color: #ffa500;
      }

      .item-name {
        text-align: center;
        word-break: break-word;
      }
    }
  }

  .file-editor {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .file-textarea {
    width: 100%;
    height: 300px;
    border: 1px solid #ccc;
    padding: 10px;
    font-size: 1rem;
    font-family: monospace;
    resize: vertical;
    outline: none;
  }

  .save-button {
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.2s ease-in-out;

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    &:hover:not(:disabled) {
      background-color: #0056b3;
    }
  }

  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #666;
  }
}
</style>
