<script setup lang="ts">
import { ref, onMounted } from 'vue';
import 'primevue/resources/themes/lara-light-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { useUrlShortener } from '@/composables/useUrlShortener';

const { links, fetchLinks, createLink, deleteLink } = useUrlShortener();
const toast = useToast();

onMounted(fetchLinks);

const handleDelete = async (id: string) => {
  await deleteLink(id);
  toast.add({ severity: 'success', summary: 'Deleted', detail: 'Link removed successfully', life: 2000 });
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    toast.add({ severity: 'info', summary: 'Copied', detail: 'Link copied to clipboard!', life: 2000 });
  });
};
</script>

<template>
  <Toast />

  <div class="container">
    <!-- Add Link Button -->
    <button class="add-link-btn" @click="createLink">
      <i class="pi pi-plus-circle"></i> Add New Link
    </button>

    <div class="card">
      <DataTable :value="links" tableStyle="min-width: 100%">
        <Column field="link" header="Original Link">
          <template #body="{ data }">
            <a :href="data.link" target="_blank" class="link-text" v-tooltip="data.link">
              {{ data.link }}
            </a>
          </template>
        </Column>

        <Column field="shortenedLink" header="Shortened Link">
          <template #body="{ data }">
            <div class="shortened-container">
              <a :href="data.shortenedLink" target="_blank" class="shortened-text" v-tooltip="data.shortenedLink">
                {{ data.shortenedId }}
              </a>
              <Button icon="pi pi-copy" class="copy-btn" v-tooltip="'Copy link'"
                @click="copyToClipboard(data.shortenedLink)" />
            </div>
          </template>
        </Column>

        <Column header="Action">
          <template #body="{ data }">
            <Button icon="pi pi-trash" class="delete-btn" v-tooltip="'Delete link'" @click="handleDelete(data.id)" />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<style scoped>
div.container {
  padding: 20px;
  margin: 0;
  box-sizing: border-box;
  background-color: #f8f9fa;
}

/* Add Link Button */
.add-link-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  border: none;
  background: #007ad9;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  border-radius: 8px;
  margin-bottom: 20px;
  transition: background 0.3s ease, transform 0.2s ease;
}

.add-link-btn:hover {
  background: #005fa3;
  transform: translateY(-2px);
}

/* Card Styling */
.card {
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background: white;
}

/* Link Styling */
.link-text,
.shortened-text {
  display: block;
  max-width: 280px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-decoration: none;
  color: #007ad9;
  font-weight: 500;
  transition: color 0.3s ease;
}

.link-text:hover,
.shortened-text:hover {
  color: #005fa3;
  text-decoration: underline;
}

/* Shortened Link Container */
.shortened-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Copy Button */
.copy-btn {
  background: transparent;
  color: #007ad9;
  border: none;
  transition: color 0.3s ease;
}

.copy-btn:hover {
  color: #005fa3;
}

/* Delete Button */
.delete-btn {
  background: transparent;
  color: red;
  border: none;
  transition: color 0.3s ease;
}

.delete-btn:hover {
  color: darkred;
}

/* Responsive */
@media (max-width: 768px) {
  .link-text,
  .shortened-text {
    max-width: 200px;
  }
}
</style>
