# 🎓 LearnMathly — Modern Learning Platform

## About LearnMathly

**LearnMathly** is a next-generation learning platform designed for teachers and students to create, share, and experience interactive courses and quizzes—all in one beautiful, modern app.

Whether you're an educator looking to digitize your classroom, a tutor sharing custom materials, or a student eager to learn at your own pace, LearnMathly empowers you with:

- 📚 **Course Creation:** Teachers can easily upload PDF materials, add rich descriptions, and organize content for any subject.
- 📝 **Interactive Quizzes:** Build quizzes with multiple questions, options, and instant feedback to reinforce learning.
- 📄 **Seamless PDF Viewing:** Students can view course materials directly in the browser, with smooth navigation and progress tracking.
- 🏆 **Progress & Results:** Track quiz scores, completion rates, and celebrate learning milestones.
- 🔒 **Secure & Simple:** Only teachers need to register/login; students can access courses and quizzes freely.

### Why LearnMathly?
- **All-in-one:** No more juggling between file sharing, quiz tools, and gradebooks—LearnMathly brings it all together.
- **Modern UX:** Enjoy a visually stunning interface with glassmorphism, gradients, and responsive design.
- **Open & Extensible:** Built with open-source tools (React, FastAPI), easy to customize and extend for your needs.
- **For Everyone:** Perfect for schools, tutoring centers, online educators, and self-learners.

> _LearnMathly is more than a tool—it's a vision for the future of digital learning: interactive, accessible, and inspiring._

---

## ✨ Features
- 🧑‍🏫 Teacher registration & login (JWT auth)
- 📚 Course management (CRUD, PDF upload)
- 📝 Quiz creation with multiple questions
- 📄 PDF presentation & in-browser viewing
- 🏆 Quiz results & progress tracking
- 🎨 Beautiful, modern UI (glassmorphism, gradients)
- ⚡ Fast, local development (Vite + FastAPI)

---

## 🛠️ Tech Stack
- **Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn-ui
- **Backend:** FastAPI, SQLite, JWT Auth
- **PDF:** react-pdf, FastAPI static serving

---

## 📁 Folder Structure
```
LearnMathly/
├── backend/         # FastAPI backend (API, DB, PDF storage)
│   ├── main.py
│   ├── app.db
│   ├── pdfs/
│   └── requirements.txt
└── src/             # React frontend (Vite, TS, Tailwind)
    ├── pages/
    ├── components/
    ├── context/
    ├── types/
    └── ...
```

---

## 🚀 Getting Started

### 1️⃣ Backend (FastAPI)
```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload
```
- API: [http://localhost:8000](http://localhost:8000)
- Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### 2️⃣ Frontend (React)
```bash
cd src
npm install
npm run dev
```
- App: [http://localhost:5173](http://localhost:5173) (default Vite port)

---

## 🖼️ Screenshots
> _Add your screenshots or demo GIFs here!_

---

## 📄 API & Usage
- **PDF Upload:** POST `/upload/pdf/` (returns URL)
- **Course CRUD:** `/courses/`
- **Quiz CRUD:** `/quizzes/`, `/questions/`
- **Auth:** `/auth/signup`, `/auth/token`, `/auth/me`
- See `/docs` for full API reference

---

## 💡 Tips & Notes
- All PDFs are stored in `backend/pdfs/` and served at `/pdfs/{filename}`
- Only teachers can register/login; students view courses/quizzes without auth
- To reset the database, delete all rows in `app.db` (see backend README)
- For production, use a secure `SECRET_KEY` and a robust DB

---

## 🧑‍💻 Contributing
PRs welcome! Open issues or feature requests anytime.

---

## ❤️ Made with FastAPI, React, and lots of ☕
