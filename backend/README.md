# 🚀 LearnMathly FastAPI Backend

Welcome to the **LearnMathly** backend! This is a modern, production-ready FastAPI server for managing courses, quizzes, PDF uploads, and authentication for your learning platform.

---

## ✨ Features
- JWT authentication (register, login)
- Course CRUD (with PDF upload)
- Quiz CRUD (with questions)
- Quiz results tracking
- PDF upload and serving
- SQLite database (easy local dev)

---

## 🛠️ Prerequisites
- Python 3.8+
- pip (Python package manager)

---

## 📦 Installation

Clone the repo and install dependencies:

```bash
cd backend
python -m pip install -r requirements.txt
```

---

## 🚦 Running the Server

Start the FastAPI server with hot-reload:

```bash
python -m uvicorn main:app --reload
```

- The API will be available at: [http://localhost:8000](http://localhost:8000)
- Interactive API docs: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 📄 File Uploads
- Uploaded PDFs are stored in the `pdfs/` folder (auto-created).
- Serve and access PDFs via `/pdfs/{filename}` endpoint.

---

## 🗄️ Database
- Uses SQLite (`app.db`) for easy local development.
- Tables: users, courses, quizzes, questions, quiz_results

---

## 🧑‍💻 API Endpoints
- See full interactive docs at `/docs` after running the server.

---

## 💡 Tips
- Update your frontend to use these endpoints instead of Supabase.
- For production, consider using a robust database and secure your `SECRET_KEY`.

---

Made with ❤️ using FastAPI. 