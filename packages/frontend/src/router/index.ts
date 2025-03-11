// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import FileManager from '@/views/FileManager.vue';

const routes = [
  {
    path: '/',
    name: 'File Manager',
    component: FileManager
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
