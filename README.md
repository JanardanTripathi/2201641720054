# 🔗 URL Shortener with Logging

A simple **URL Shortener Web App** built with **Vite + React**.  
It allows users to shorten long URLs and integrates with a **custom logging service** to capture frontend logs.

---

## ✨ Features
- 🔗 Shorten any valid URL using [shrtco.de API](https://shrtco.de/docs/).  
- 📋 Copy shortened link with one click.  
- 📊 Frontend logging middleware integrated with a centralized logging API (`evaluation-service/logs`).  
- 🔐 Secure API calls with **JWT token management** (supports static token or OAuth2 client credentials flow).  
- ⚡ Built with **Vite + React** for fast dev & build.  
- 🎨 Responsive UI with improved user experience.  

---

## 🛠️ Tech Stack
- **React (Vite)** – frontend framework  
- **TypeScript** – type safety  
- **shrtco.de API** – URL shortening service  
- **Custom Logging API** – log frontend events & errors  
- **Token Manager** – handles JWT authentication & refresh  

---

## 📂 Project Structure
src/
├── components/ # UI components (form, result display, etc.)
├── logger.ts # Logging utility for sending logs
├── tokenManager.ts# Handles token caching & refresh
├── api.ts # API integration for URL shortening
├── App.tsx # Main app
└── index.tsx # Entry point

yaml
Copy code

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the repo
```bash
git clone https://github.com/JanardanTripathi/2201641720054.git
cd 2201641720054
2️⃣ Install dependencies
bash
Copy code
npm install
3️⃣ Create .env file
Add your environment variables inside .env:

ini
Copy code
VITE_LOG_API=http://20.244.56.144/evaluation-service/logs
VITE_ACCESS_TOKEN=your_static_access_token   # (optional if using OAuth2)
VITE_AUTH_URL=http://20.244.56.144/auth      # only if dynamic tokens are required
VITE_CLIENT_ID=your_client_id
VITE_CLIENT_SECRET=your_client_secret
👉 You can also create a .env.example with placeholder values for sharing.

4️⃣ Run the app
bash
Copy code
npm run dev
App will run on http://localhost:5173

🧪 Usage
Enter a long URL into the input box.

Click Shorten.

Get the shortened link instantly.

Copy the shortened link with one click.

All frontend actions (success/error) are logged to the evaluation-service API.

📝 Scripts
npm run dev – start development server

npm run build – build for production

npm run preview – preview production build

bash
Copy code
npm run build
Then drag & drop the dist/ folder into Netlify.

Or connect your GitHub repo directly to Netlify/Vercel for CI/CD.
#Result
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/3b01647c-e8bd-4cdd-8fad-6245436b33b2" />

📌 Notes
Make sure your .env file is never pushed to GitHub (it’s ignored in .gitignore).

The logging API requires a valid Bearer token. If your static token expires, configure AUTH_URL, CLIENT_ID, and CLIENT_SECRET for auto-refresh.


