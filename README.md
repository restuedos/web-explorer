# Windows Explorer-like Application

This is a Windows Explorer-like application built with a monorepo architecture, leveraging **Typescript**, **ElysiaJS**, **Vue 3**, and **Bun**. The project is structured into two main packages: `backend` and `frontend`, each serving its respective purpose.

---

## Project Structure

```
.
├── bun.lock
├── package.json
├── package-lock.json
├── packages
│   ├── backend
│   │   ├── package.json
│   │   ├── src
│   │   │   ├── entities
│   │   │   │   └── Item.ts
│   │   │   └── index.ts
│   │   └── tsconfig.json
│   └── frontend
│       ├── index.html
│       ├── package.json
│       ├── public
│       │   └── vite.svg
│       ├── src
│       │   ├── App.vue
│       │   ├── components
│       │   │   ├── ItemContent.vue
│       │   │   └── ItemTree.vue
│       │   ├── main.ts
│       │   └── style.css
│       ├── tsconfig.app.json
│       ├── tsconfig.json
│       ├── tsconfig.node.json
│       └── vite.config.ts
└── README.md
```

---

## Features

### Backend
- Built with **ElysiaJS**, a fast and expressive backend framework.
- Uses **Bun** as the runtime for its speed and modern tooling.
- Integrates with **PostgreSQL** via `pg` and **TypeORM** for database management.
- Defines entities (e.g., `Item.ts`) to model data structures.
- Serves as the API layer for the frontend.

### Frontend
- Built with **Vue 3** for a reactive and component-based UI.
- Uses **Vite** for fast development and bundling.
- Includes reusable components like `ItemTree.vue` (for displaying a tree structure) and `ItemContent.vue` (for displaying item details).
- Styled with **PrimeVue** and **PrimeIcons** for a polished and responsive design.
- Uses **Axios** for API communication with the backend.

---

## Prerequisites

Before running the project, ensure you have the following installed:

- [Bun](https://bun.sh) (v1.0 or later)
- [Node.js](https://nodejs.org) (v18 or later)
- [PostgreSQL](https://www.postgresql.org) (for the backend database)

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/windows-explorer-app.git
   cd windows-explorer-app
   ```

2. Install dependencies for the project:
   ```bash
   bun install
   ```

3. Set up the PostgreSQL database and update the connection details in the backend configuration.

---

## Running the Application

The root `package.json` includes scripts to simplify development and building:

### Development
To start both the frontend and backend in development mode, run:
```bash
bun run dev
```
This uses `concurrently` to run the frontend and backend simultaneously.

- Frontend will be available at `http://localhost:5173`.
- Backend will be available at `http://localhost:3000`.

### Build
To build both the frontend and backend for production, run:
```bash
bun run build
```

---

## Backend Details

### Scripts
| Script      | Description                                      |
|-------------|--------------------------------------------------|
| `dev`       | Starts the backend in development mode.          |
| `build`     | Builds the backend for production.               |
| `start`     | Runs the backend from the compiled output.       |

### Dependencies
- **ElysiaJS**: Backend framework for building APIs.
- **PostgreSQL**: Database driver (`pg`).
- **TypeORM**: Object-Relational Mapping (ORM) for database management.
- **Reflect-metadata**: Required for TypeORM decorators.

---

## Frontend Details

### Scripts
| Script      | Description                                      |
|-------------|--------------------------------------------------|
| `dev`       | Starts the frontend in development mode.         |
| `build`     | Builds the frontend for production.              |
| `preview`   | Serves the production build locally for testing. |

### Dependencies
- **Vue 3**: Frontend framework for building UIs.
- **PrimeVue**: UI component library.
- **PrimeIcons**: Icon library for PrimeVue.
- **Axios**: HTTP client for API communication.
- **Vite**: Build tool for fast development.

---

## Development Scripts (Root)

The following scripts are available in the root `package.json`:

| Script            | Description                                                                 |
|--------------------|-----------------------------------------------------------------------------|
| `dev`             | Starts both the frontend and backend in development mode concurrently.      |
| `dev:frontend`    | Starts only the frontend in development mode.                               |
| `dev:backend`     | Starts only the backend in development mode.                                |
| `build`           | Builds both the frontend and backend for production.                        |
| `build:frontend`  | Builds only the frontend for production.                                    |
| `build:backend`   | Builds only the backend for production.                                     |

---

## Technologies Used

- **Bun**: Fast runtime and package manager.
- **Typescript**: Type-safe development.
- **ElysiaJS**: Backend framework for building APIs.
- **Vue 3**: Frontend framework for building UIs.
- **Vite**: Frontend build tool for fast development.
- **PrimeVue**: UI component library.
- **TypeORM**: ORM for database management.
- **PostgreSQL**: Relational database.
- **Concurrently**: Run multiple commands concurrently.

---

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Submit a pull request with a detailed description of your changes.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- Thanks to the **Bun**, **Vue**, and **ElysiaJS** communities for their amazing tools and support.
- Inspired by the simplicity and functionality of Windows Explorer.

---

Enjoy exploring! 🚀