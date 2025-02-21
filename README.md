# **Windows Explorer-like Application**  

A **Windows Explorer-like** file management app built with a **monorepo** structure using:  
- **Backend**: ElysiaJS (Bun) + PostgreSQL + TypeORM  
- **Frontend**: Vue 3 + Vite + PrimeVue  

This project provides an **efficient, modern, and fast file-exploring experience**.

---

## 📂 **Project Structure**  

```
.
├── .env.example
├── .env.docker
├── .gitignore
├── .dockerignore
├── docker-compose.yml
├── Dockerfile.backend
├── Dockerfile.frontend
├── package.json
├── README.md
├── packages/
│   ├── backend/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── src/
│   │   │   ├── config/
│   │   │   │   ├── database.ts
│   │   │   ├── controllers/
│   │   │   │   ├── item.controller.ts
│   │   │   ├── entities/
│   │   │   │   ├── Item.ts
│   │   │   ├── middlewares/
│   │   │   │   ├── error.middleware.ts
│   │   │   ├── repositories/
│   │   │   │   ├── item.repository.ts
│   │   │   ├── services/
│   │   │   │   ├── item.service.ts
│   │   │   ├── routes.ts
│   │   │   ├── index.ts
│   ├── frontend/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── tsconfig.app.json
│   │   ├── tsconfig.node.json
│   │   ├── vite.config.ts
│   │   ├── index.html
│   │   ├── public/
│   │   │   ├── vite.svg
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── ItemContent.vue
│   │   │   │   ├── ItemTree.vue
│   │   │   ├── composables/
│   │   │   │   ├── useExplorer.ts
│   │   │   │   ├── useFileEditor.ts
│   │   │   │   ├── useItemTree.ts
│   │   │   │   ├── useSearch.ts
│   │   │   ├── App.vue
│   │   │   ├── main.ts
│   │   │   ├── style.css
│   │   │   ├── vue-shim.d.ts
```

---

## 🚀 **Features**  

### **Backend (ElysiaJS + Bun)**  
✅ **ElysiaJS** - High-performance web framework  
✅ **PostgreSQL + TypeORM** - Database & ORM integration  
✅ **Dockerized** - Runs easily with Docker  
✅ **Modular structure** - Organized controllers, repositories, and services  

### **Frontend (Vue 3 + Vite)**  
✅ **Vue 3 + Composition API** - Reactive UI  
✅ **PrimeVue + PrimeIcons** - Beautiful components  
✅ **Vite** - Super-fast development  
✅ **Axios** - API communication  

---

## 🔧 **Setup & Installation**  

### **1️⃣ Prerequisites**  

Ensure you have the following installed:  
- **[Bun](https://bun.sh/)**  
- **[Docker & Docker Compose](https://www.docker.com/)**  
- **[PostgreSQL](https://www.postgresql.org/)** (for local development)  

---

### **2️⃣ Environment Variables**  

Create a `.env` file in the root directory:  

```ini
# Database Config
DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=web_explorer
```

---

### **3️⃣ Running the Application**  

#### **🔹 Running with Docker**  

1. **Start everything with Docker**  
   ```sh
   docker-compose up --build
   ```

2. Open in browser:  
   - **Frontend** → `http://localhost:8080`  
   - **Backend** → `http://localhost:3000`  

---

#### **🔹 Running Locally (Without Docker)**  

1. **Install dependencies**  
   ```sh
   bun install
   ```

2. **Start both backend & frontend**  
   ```sh
   bun run dev
   ```

4. Open `http://localhost:5173` (Vite default port).  

---

## 🛠 **Development Commands**  

| Command                  | Description                                  |
|--------------------------|----------------------------------------------|
| `bun run dev`           | Start both backend & frontend (local)       |
| `bun run dev:backend`   | Start only backend                          |
| `bun run dev:frontend`  | Start only frontend                         |
| `bun run start`         | Start both backend & frontend (production)  |
| `bun run start:backend` | Start only backend in production            |
| `bun run start:frontend`| Start only frontend in production           |
| `bun run build`         | Build both backend & frontend for production |
| `bun run build:backend` | Build backend only                          |
| `bun run build:frontend`| Build frontend only                         |

---

## 📜 **API Endpoints**  

All API endpoints are under the `/api/v1` group.

| Method | Endpoint                     | Description               |
|--------|------------------------------|---------------------------|
| GET    | `/api/v1/items`              | Get all items            |
| GET    | `/api/v1/items/:id/children` | Get item children        |
| GET    | `/api/v1/items/:id/content`  | Get file content         |
| GET    | `/api/v1/items/search?q=`    | Search items             |
| POST   | `/api/v1/items`              | Create a new item        |
| PUT    | `/api/v1/items/:id/content`  | Update file content      |
| PATCH  | `/api/v1/items/:id`          | Rename an item           |
| DELETE | `/api/v1/items/:id`          | Delete an item           |

---

## 🤝 **Contributing**  

Feel free to fork this repo and submit pull requests! 🚀  

---

## ⚖️ **License**  

MIT License © 2025 Web Explorer  

