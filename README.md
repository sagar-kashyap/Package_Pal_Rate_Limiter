<!-- <p align="center">
  <img src="https://raw.githubusercontent.comsagar-kashyap/Package_Pal_Rate_Limiter/main/public/packagepal-logo.png" alt="PackagePal Logo" width="400">
</p> -->

<h1 align="center">PackagePal</h1>

<p align="center">
  <strong>Discover equivalent software packages across different programming languages with the power of AI.</strong>
  <br />
  <em>The ultimate companion for developers migrating tech stacks.</em>
</p>

<p align="center">
  <!-- IMPORTANT: Update the links to point to YOUR repo and YOUR license -->
  <a href="https://github.com/sagar-kashyap/Package_Pal_Rate_Limiter/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/sagar-kashyap/Package_Pal_Rate_Limiter" alt="License">
  </a>
  <a href="https://github.com/sagar-kashyap/Package_Pal_Rate_Limiter/stargazers">
    <img src="https://img.shields.io/github/stars/sagar-kashyap/Package_Pal_Rate_Limiter" alt="Stars">
  </a>
    <img src="https://img.shields.io/badge/version-1.0.0-blue" alt="Version">
</p>

<p align="center">
  <a href="https://packagepal.dev"><strong>Visit the Live App »</strong></a>
</p>

---

![PackagePal Demo GIF](https://github.com/sagar-kashyap/Package_Pal_Rate_Limiter/blob/main/how%20to%20use%20package%20pal.gif)

## 🤔 Why PackagePal?

Every developer has faced this challenge: you're a Python expert learning Node.js and you think, "Okay, I need something like `requests`... what's the standard library for making HTTP calls here?" This leads to endless searching on Google, Stack Overflow, and blog posts, breaking your development flow.

PackagePal was built to solve this exact problem. It's not just a keyword search; it uses the power of Google's Gemini AI to understand the *functionality* and *purpose* of a package, then finds its philosophical equivalents in other ecosystems. It's the tool I wish I had when migrating projects.

## ✨ Features

*   **🧠 AI-Powered Suggestions:** Leverages the Gemini API for intelligent, context-aware package recommendations.
*   **🌐 Multi-Language Support:** Find equivalents across major ecosystems like JavaScript, Python, Go, Rust, Java, and more.
*   **⚡ Blazing Fast:** Uses a Redis cache to store recent searches for near-instantaneous results on common queries.
*   **💻 Clean, Responsive UI:** A simple and intuitive interface built with React and TypeScript.

## 🛠️ Tech Stack

This project is a full-stack application built with a modern, scalable tech stack.

| Category          | Technology                                                                                                                                                               |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Frontend**      | ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![TypeScript](https://img.shields.io/badge/typescript-%233178C6.svg?style=for-the-badge&logo=typescript&logoColor=white)                  |
| **Backend**       | ![Node.js](https://img.shields.io/badge/node.js-%23339933.svg?style=for-the-badge&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23000000.svg?style=for-the-badge&logo=express&logoColor=white) ![TypeScript](https://img.shields.io/badge/typescript-%233178C6.svg?style=for-the-badge&logo=typescript&logoColor=white)                      |
| **AI Engine**     | ![Google Gemini](https://img.shields.io/badge/Gemini_API-4285F4?style=for-the-badge&logo=google&logoColor=white)                                                          |
| **Database/Cache**| ![Redis](https://img.shields.io/badge/redis-%23DC382D.svg?style=for-the-badge&logo=redis&logoColor=white)                                                                  |
| **Deployment**    | ![Google Cloud](https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white) ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)                              |


## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   Node.js (v18.x or later)
*   npm or yarn
*   Git
*   Gemini API key

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/sagar-kashyap/Package_Pal_Rate_Limiter
    cd Package_Pal_Rate_Limiter
    ```

2.  **Setup the Backend (`/functions`):**
    *   Navigate to the server directory: `cd src`
    *   Install dependencies: `npm install`
    *   Create a `.env` file by copying the example: `cp .env.example .env`
    *   Add your environment variables to the `.env` file:
        ```env
        # .env file for the server
        PORT=8080
        GEMINI_API_KEY=your_google_gemini_api_key
        REDIS_URL=your_redis_connection_url_string
        REDIS_HOST=your_redis_connection_host_string
        REDIS_PORT=your_redis_connection_port
        REDIS_PASSWORD=your_redis_connection_password
        ```

3.  **Setup the Frontend:**
    *   Navigate to the directory: `/Package_Pal_Rate_Limiter`
    *   Install dependencies: `npm install`
    *   Create a `.env.local` file. This is mainly for defining the backend URL.
        ```env
        # .env.local file for the client
        GEMINI_API_KEY=your_google_gemini_api_key
        SERVER_URL=your_backend_url
        ```

### Running the Application

1.  **Start the Backend Server:**
    *   From the `/functions` directory:
        ```sh
        npx ts-node src/server.ts
        
        ```
    *   The server should now be running on `http://localhost:3001`.

2.  **Start the Frontend Development Server:**
    *   From the `/Package_Pal_Rate_Limiter` directory:
        ```sh
        npm run dev
        ```
    *   Open your browser and navigate to `http://localhost:5173` (or the URL provided by Vite).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/sagar-kashyap/Package_Pal_Rate_Limiter/blob/main/LICENSE) file for details.

## 📬 Contact

[Sagar Kashyap] - [@YourTwitterHandle](https://twitter.com/Sagar_ketchup) - [sagarkashyap.cc@gmail.com](mailto:sagarkashyap.cc@gmail.com)

Project Link: [https://github.com/sagar-kashyap/Package_Pal_Rate_Limiter](https://github.com/sagar-kashyap/Package_Pal_Rate_Limiter)
# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
