// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import FileManager from '@/views/FileManager.vue';
import UrlShortener from '@/views/UrlShortener.vue';

const routes = [
  {
    path: '/',
    name: 'File Manager',
    component: FileManager
  },
  {
    path: '/url-shortener',
    name: 'URL Shortener',
    component: UrlShortener
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
