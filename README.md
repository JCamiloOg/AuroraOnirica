# 🌙 Aurora Onírica (Creadores Oníricos)

Plataforma web full-stack diseñada para la publicación, gestión y divulgación de contenidos digitales, artículos de blog, eventos culturales/educativos y glosarios interactivos con soporte nativo multilenguaje (Español e Inglés) y un panel de administración completo.

---

## 📌 Tabla de Contenidos
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
- [Características y Funcionamiento](#-características-y-funcionamiento)
- [Requisitos Previos](#-requisitos-previos)
- [Configuración de la Base de Datos (MySQL)](#-configuración-de-la-base-de-datos-mysql)
- [Variables de Entorno (`.env`)](#-variables-de-entorno-env)
- [Instalación y Ejecución en Desarrollo](#-instalación-y-ejecución-en-desarrollo)
- [Scripts Disponibles](#-scripts-disponibles)
- [Estructura de la API](#-estructura-de-la-api)

---

## 🚀 Tecnologías Utilizadas

### **Frontend (`/client`)**
- **Framework & Builder:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vitejs.dev/)
- **Estilos & UI:** [Tailwind CSS v4](https://tailwindcss.com/), Radix UI Primitives, Lucide React, FontAwesome Icons.
- **Animaciones & Efectos:** GSAP, AOS (Animate On Scroll), SplitType, Tailwind Animate.
- **Enrutamiento:** [React Router v7](https://reactrouter.com/)
- **Formularios & Validación:** React Hook Form
- **Cliente HTTP:** Axios (con interceptores para encabezados de idioma `accept-language`)
- **Internacionalización (i18n):** `i18next`, `react-i18next`, `i18next-browser-languagedetector`
- **Notificaciones:** Sonner

### **Backend (`/server`)**
- **Entorno de Ejecución:** [Node.js](https://nodejs.org/) con [TypeScript](https://www.typescriptlang.org/) y `tsx watch`
- **Framework Web:** [Express v5](https://expressjs.com/)
- **Base de Datos:** MySQL (con controlador de alto rendimiento `mysql2/promise` y Pool de conexiones)
- **Autenticación & Seguridad:** JSON Web Tokens (JWT), `bcrypt` para hashing de contraseñas, `cookie-parser`, `express-session`, CORS.
- **Gestión de Archivos e Imágenes:** Multer, Sharp (compresión y procesamiento de imágenes), soporte opcional con ImgBB.
- **Tareas Automatizadas (Cron):** `node-cron` (limpieza automática de registros con borrado suave).
- **Internacionalización Backend:** `i18next`, `i18next-fs-backend`

---

## 📁 Arquitectura del Proyecto

El repositorio está estructurado como un monorepo modular dividido en cliente y servidor:

```text
AuroraOnirica/
├── client/                   # Aplicación Frontend (React + Vite)
│   ├── public/               # Recursos estáticos
│   ├── src/
│   │   ├── components/       # Componentes reutilizables de la UI y Admin
│   │   ├── config/           # Configuración de Axios e i18n
│   │   ├── data/             # Datos estáticos y constantes
│   │   ├── hooks/            # Hooks personalizados de React
│   │   ├── locales/          # Archivos de traducción i18n (es/en)
│   │   ├── pages/            # Páginas públicas y vistas de Administración
│   │   │   └── admin/        # Panel de administración (Blog, Eventos, Glosario, Usuarios)
│   │   ├── routes/           # Definición de rutas con React Router
│   │   ├── services/         # Servicios de llamadas a la API REST
│   │   ├── styles/           # Archivos CSS globales y Tailwind
│   │   ├── types/            # Definiciones de TypeScript
│   │   ├── App.tsx           # Componente principal
│   │   └── main.tsx          # Punto de entrada
│   ├── package.json
│   └── vite.config.ts
│
├── server/                   # Aplicación Backend (Node.js + Express)
│   ├── public/               # Servidor estático para imágenes (/articles, /events)
│   ├── locales/              # Traducciones del backend
│   ├── src/
│   │   ├── config/           # Conexión a BD, variables de entorno e i18n
│   │   ├── controllers/      # Controladores REST (públicos y de administración)
│   │   ├── jobs/             # Tareas programadas (Cron jobs de limpieza)
│   │   ├── middlewares/      # Middlewares (autenticación JWT, validación, i18n)
│   │   ├── models/           # Consultas SQL y modelos de datos
│   │   ├── routes/           # Enrutadores API Express
│   │   ├── types/            # Tipos de TypeScript del backend
│   │   ├── utils/            # Utilidades generales
│   │   ├── app.ts            # Configuración de la aplicación Express
│   │   └── server.ts         # Inicialización del servidor HTTP
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

---

## ⚙️ Características y Funcionamiento

### 1. **Portal Público**
- **Inicio / Landing Page:** Presentación con efectos dinámicos, scroll suave y diseño adaptativo.
- **Blog / Artículos:** Catálogo de publicaciones con paginación, filtros e imágenes.
- **Eventos:** Listado de eventos culturales/formativos (modality presencial o virtual), enlace de inscripción y detalle del evento.
- **Glosario Interactivo:** Términos y definiciones organizados alfabéticamente.
- **Multilenguaje al instante:** Cambio fluido de idioma (Español / Inglés) sin recargar la página.

### 2. **Panel de Administración (`/admin`)**
- **Autenticación Segura:** Inicio de sesión basado en JWT y cookies seguras.
- **Gestión de Artículos (CRUD):** Creación, modificación y desactivación de artículos con soporte de títulos, subtítulos y texto en múltiples idiomas e imágenes asociadas.
- **Gestión de Eventos (CRUD):** Control de fechas, horarios, enlaces de registro y modalidades.
- **Gestión de Glosario (CRUD):** Alta y modificación de términos en español e inglés.
- **Gestión de Usuarios:** Registro de administradores, cambio de contraseñas y desactivación de usuarios.

### 3. **Mecanismo de Borrado Suave (Soft Delete) y Limpieza Automática**
- Al eliminar un registro o usuario desde el panel de administración, el sistema marca el campo `status = 0` y registra la fecha en `delete_at`.
- Un **Cron Job** convocado mediante `node-cron` se ejecuta periódicamente para purgar permanentemente de la base de datos y del sistema de archivos las entidades con más de 30 días en estado desactivado.

---

## 📋 Requisitos Previos

Antes de ejecutar el proyecto en desarrollo, asegúrate de contar con:
- **Node.js** v18.0.0 o superior
- **pnpm** (recomendado) o `npm` / `yarn`
- Servidor de **MySQL** (ej. MySQL Server local, XAMPP, Laragon o contenedor Docker)

---

## 🗄️ Configuración de la Base de Datos (MySQL)

Crea una base de datos en MySQL (por ejemplo `aurora_onirica`) y ejecuta la siguiente estructura de tablas con sus relaciones de traducción:

```sql
CREATE DATABASE IF NOT EXISTS aurora_onirica CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE aurora_onirica;

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  status TINYINT(1) DEFAULT 1,
  delete_at DATETIME NULL
);

-- Tabla de Artículos
CREATE TABLE IF NOT EXISTS articles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE NOT NULL,
  main_image VARCHAR(255) NOT NULL,
  delete_url VARCHAR(255) NULL,
  status TINYINT(1) DEFAULT 1,
  delete_at DATETIME NULL
);

CREATE TABLE IF NOT EXISTS articles_translations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  article_id INT NOT NULL,
  lang VARCHAR(5) NOT NULL,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255) NOT NULL,
  text TEXT NOT NULL,
  FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
);

-- Tabla de Eventos
CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE NOT NULL,
  hour VARCHAR(50) NOT NULL,
  modality ENUM('Presencial', 'Virtual') NOT NULL,
  address VARCHAR(255) NULL,
  inscription_link VARCHAR(255) NULL,
  image VARCHAR(255) NOT NULL,
  delete_url VARCHAR(255) NULL,
  status TINYINT(1) DEFAULT 1,
  delete_at DATETIME NULL
);

CREATE TABLE IF NOT EXISTS events_translations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  lang VARCHAR(5) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Tabla de Glosario
CREATE TABLE IF NOT EXISTS glossary (
  id INT AUTO_INCREMENT PRIMARY KEY,
  status TINYINT(1) DEFAULT 1,
  delete_at DATETIME NULL
);

CREATE TABLE IF NOT EXISTS glossary_translations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  word_id INT NOT NULL,
  lang VARCHAR(5) NOT NULL,
  word VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  FOREIGN KEY (word_id) REFERENCES glossary(id) ON DELETE CASCADE
);
```

---

## 🔑 Variables de Entorno (`.env`)

### **Backend (`/server/.env.development`)**
Crea el archivo `.env.development` dentro de la carpeta `server/`:

```env
NODE_ENV=development
PORT=4000
HOSTNAME=http://localhost:4000
CORS_ORIGIN=http://localhost:3000

# Configuración de Base de Datos MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_DATABASE=aurora_onirica

# Clave Secreta para JWT
SECRET_KEY=tu_clave_secreta_super_segura

# (Opcional) API Key de ImgBB para hosting externo de imágenes
API_KEY_IMGBB=tu_api_key_imgbb
```

### **Frontend (`/client/.env`)**
Crea el archivo `.env` dentro de la carpeta `client/`:

```env
VITE_CORS_ORIGIN=http://localhost:4000/api
```

---

## 💻 Instalación y Ejecución en Desarrollo

Sigue los siguientes pasos para poner en marcha la aplicación localmente:

### **1. Clonar el repositorio**
```bash
git clone <URL_DEL_REPOSITO>
cd AuroraOnirica
```

### **2. Configurar y Levantar el Backend**
```bash
# Navegar a la carpeta del servidor
cd server

# Instalar dependencias
pnpm install

# Iniciar servidor en modo desarrollo (con reload automático)
pnpm run dev
```
El backend iniciará en `http://localhost:4000`.

### **3. Configurar y Levantar el Frontend**
Abre una nueva terminal:

```bash
# Navegar a la carpeta del cliente
cd client

# Instalar dependencias
pnpm install

# Iniciar el servidor de desarrollo Vite
pnpm run dev
```
El cliente iniciará en `http://localhost:3000`.

---

## 📜 Scripts Disponibles

### **En el Cliente (`/client`)**
| Comando | Descripción |
| :--- | :--- |
| `pnpm run dev` | Inicia el servidor de desarrollo con Vite en el puerto `3000`. |
| `pnpm run build` | Compila el proyecto TypeScript y genera el bundle optimizado para producción. |
| `pnpm run preview` | Previsualiza localmente el build de producción. |
| `pnpm run lint` | Ejecuta el linter (ESLint) para verificar la calidad del código. |

### **En el Servidor (`/server`)**
| Comando | Descripción |
| :--- | :--- |
| `pnpm run dev` | Inicia el backend en modo escucha mediante `tsx watch`. |
| `pnpm run build` | Compila el código TypeScript a JavaScript (`dist/`). |
| `pnpm run start` | Ejecuta el servidor compilado en entorno de producción. |

---

## 🌐 Estructura de la API REST (`/api`)

| Prefijo de Ruta | Descripción |
| :--- | :--- |
| `/api/articles` | Obtención pública de artículos y paginación según el idioma activo (`accept-language`). |
| `/api/events` | Obtención pública de eventos culturales y formativos. |
| `/api/glossary` | Obtención de palabras y términos del glosario. |
| `/api/admin/users` | Autenticación, login y gestión de administradores. |
| `/api/admin/articles` | CRUD de artículos e subida de imágenes principales (Requiere JWT). |
| `/api/admin/events` | CRUD de eventos e imágenes publicitarias (Requiere JWT). |
| `/api/admin/glossary` | CRUD de términos del glosario (Requiere JWT). |

---

## 🛡️ Licencia
Este proyecto es de uso privado para la plataforma **Aurora Onírica**. Todos los derechos reservados.
