# 📝 LearnMathly Setup Guide (For Beginners)

Welcome to LearnMathly! This guide will help you run the app on your computer, even if you have never set up a coding project before. Follow each step carefully.

---

## 1️⃣ Prerequisites: What You Need

### For Everyone
- **A computer running Windows, macOS, or Linux**
- **Internet connection**

### For the Backend (Server)
- **Python 3.8 or newer**
- **pip** (Python package manager, usually comes with Python)

### For the Frontend (Website)
- **Node.js (v16 or newer)**
- **npm** (comes with Node.js)

---

## 2️⃣ Install Prerequisites

### Install Python
- Download Python from [python.org/downloads](https://www.python.org/downloads/)
- During installation, **check the box that says "Add Python to PATH"**
- After install, open Command Prompt and run:
  ```bash
  python --version
  pip --version
  ```
  Both should show a version number.

### Install Node.js & npm
- Download Node.js from [nodejs.org](https://nodejs.org/)
- Install (npm comes with it)
- Check install:
  ```bash
  node --version
  npm --version
  ```

---

## 3️⃣ Download the LearnMathly Project
- Download or clone the project folder to your computer (e.g., `C:/Users/yourname/Desktop/LearnMathly`)
- The folder should contain two main subfolders: `backend` and `src`

---

## 4️⃣ Set Up the Backend (FastAPI Server)

1. **Open Command Prompt** (Windows: Win+R, type `cmd`, press Enter)
2. **Navigate to the backend folder:**
   ```bash
   cd C:/Users/yourname/Desktop/LearnMathly/backend
   ```
3. **Install backend dependencies:**
   ```bash
   python -m pip install -r requirements.txt
   ```
4. **Start the backend server:**
   ```bash
   python -m uvicorn main:app --reload
   ```
   - If you see `Uvicorn running on http://127.0.0.1:8000`, the backend is running!
   - API docs: [http://localhost:8000/docs](http://localhost:8000/docs)

**Troubleshooting:**
- If you get an error about `pip` or `python` not found, make sure Python is installed and added to PATH.
- If you get a permissions error, try running Command Prompt as Administrator.

---

## 5️⃣ Set Up the Frontend (React Website)

1. **Open a new Command Prompt window**
2. **Navigate to the src folder:**
   ```bash
   cd C:/Users/yourname/Desktop/LearnMathly
   ```
3. **Install frontend dependencies:**
   ```bash
   npm install
   ```
4. **Start the frontend development server:**
   ```bash
   npm run dev
   ```
   - You should see a message like `Local: http://localhost:5173/`
   - Open that link in your browser to use LearnMathly!

**Troubleshooting:**
- If you get an error about `npm` or `node` not found, make sure Node.js is installed and added to PATH.
- If you see errors about missing packages, try running `npm install` again.

---

## 6️⃣ Using LearnMathly
- **Teachers:** Register and log in to create courses and quizzes.
- **Students:** Browse and take courses/quizzes without logging in.
- **PDFs:** Uploaded PDFs are stored in `backend/pdfs/` and served at `/pdfs/{filename}`.

---

## 7️⃣ Stopping the App
- To stop the backend or frontend, go to the Command Prompt window and press `Ctrl+C`.

---

## 8️⃣ Common Problems & Solutions
- **"ModuleNotFoundError"**: Run the install commands again (`pip install ...` or `npm install`).
- **Port already in use**: Make sure no other app is using port 8000 (backend) or 5173 (frontend), or restart your computer.
- **Database issues**: The app uses a file called `app.db` in the backend folder. If you want to reset everything, you can delete this file (you will lose all data).

---

## 9️⃣ Need Help?
- Check the README files in the project for more details.
- Ask a friend or search online for errors you see.

---

**Enjoy using LearnMathly!** 🎓💙 