# 🖼️ Image Search App

A full-stack **MERN** application that implements **JWT authentication** and integrates the **Pixabay API** to search and display images from your text input.

## 🚀 Features

- User authentication using **JWT (JSON Web Tokens)**
- Secure **login** and **registration**
- Protected routes to access image search functionality
- Integration with **Pixabay API** to fetch and display high-quality images
- Responsive UI with modern design

## 🛠️ Tech Stack

- **MongoDB** – Database
- **Express.js** – Backend framework
- **React.js** – Frontend library
- **Node.js** – Runtime environment
- **JWT (jsonwebtoken)** – Authentication
- **Pixabay API** – Image data source

## 🔐 Authentication Flow

1. User registers with email and password
2. Password is hashed using **bcrypt**
3. Upon login, server generates a **JWT token**
4. Token is stored in client-side  **cookies**
5. Protected routes verify JWT token before granting access

## 📷 Image Search Flow

- Authenticated users can input a search query
- Query is sent to a backend route, which calls the **Pixabay API**
- API response is parsed and displayed as a gallery of images

## 🧩 UI/UX Design

This app uses **shadcn/ui + Tailwind CSS** to deliver:

- Minimalist, accessible components
- Responsive grid layout for the image gallery
- Consistent theme and modern design
- Customizable cards, buttons, and inputs with shadcn/ui

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Subhashree-Nayak507/Image_Search.git
cd Image_Search
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
MONGO_URI=your_mongodb_connection_string
PORT=your_port_number
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### 4. Build the App

```bash
npm run build

```
