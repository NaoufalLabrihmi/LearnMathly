from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form, Query
from fastapi import status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import shutil
import os
import sqlite3
from fastapi.staticfiles import StaticFiles
import time

# --- CONFIG ---
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
UPLOAD_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "pdfs"))
VIDEO_UPLOAD_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "videos"))

if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)
if not os.path.exists(VIDEO_UPLOAD_DIR):
    os.makedirs(VIDEO_UPLOAD_DIR)

# --- DB SETUP ---
DB_PATH = "./app.db"
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        hashed_password TEXT
    )''')
    c.execute('''CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT,
        teacher_id INTEGER,
        teacher_name TEXT,
        pdf_url TEXT,
        created_at TEXT,
        updated_at TEXT
    )''')
    c.execute('''CREATE TABLE IF NOT EXISTS quizzes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        course_id INTEGER,
        title TEXT
    )''')
    c.execute('''CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quiz_id INTEGER,
        text TEXT,
        options TEXT,
        correct_option_index INTEGER
    )''')
    c.execute('''CREATE TABLE IF NOT EXISTS quiz_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        quiz_id INTEGER,
        score INTEGER,
        total_questions INTEGER,
        completed_at TEXT
    )''')
    c.execute('''CREATE TABLE IF NOT EXISTS videos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT,
        teacher_id INTEGER,
        teacher_name TEXT,
        video_url TEXT,
        created_at TEXT
    )''')
    conn.commit()
    conn.close()

init_db()

# --- AUTH ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    # Ensure 'sub' is always a string
    if 'sub' in to_encode:
        to_encode['sub'] = str(to_encode['sub'])
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(status_code=401, detail="Could not validate credentials")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    conn = get_db()
    user = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    conn.close()
    if user is None:
        raise credentials_exception
    return user

# --- MODELS ---
class UserBase(BaseModel):
    name: str
    email: str

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int

class Token(BaseModel):
    access_token: str
    token_type: str

class CourseBase(BaseModel):
    title: str
    description: str
    teacher_id: int
    teacher_name: str
    pdf_url: str

class CourseCreate(CourseBase):
    pass

class CourseOut(CourseBase):
    id: int
    created_at: str
    updated_at: str

class QuizBase(BaseModel):
    course_id: int
    title: str

class QuizCreate(QuizBase):
    pass

class QuizOut(QuizBase):
    id: int

class QuestionBase(BaseModel):
    quiz_id: int
    text: str
    options: List[str]
    correct_option_index: int

class QuestionCreate(QuestionBase):
    pass

class QuestionOut(QuestionBase):
    id: int

class QuizResultBase(BaseModel):
    user_id: int
    quiz_id: int
    score: int
    total_questions: int
    completed_at: str

class QuizResultCreate(QuizResultBase):
    pass

class QuizResultOut(QuizResultBase):
    id: int

class VideoBase(BaseModel):
    title: str
    description: str
    teacher_id: int
    teacher_name: str
    video_url: str

class VideoCreate(VideoBase):
    pass

class VideoOut(VideoBase):
    id: int
    created_at: str

# --- FASTAPI APP ---
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Serve static PDF files
app.mount("/pdfs", StaticFiles(directory=UPLOAD_DIR), name="pdfs")
# Serve static video files
app.mount("/video-files", StaticFiles(directory=VIDEO_UPLOAD_DIR), name="video-files")

# --- AUTH ENDPOINTS ---
@app.post("/auth/signup", response_model=UserOut)
def signup(user: UserCreate):
    conn = get_db()
    c = conn.cursor()
    hashed_password = get_password_hash(user.password)
    try:
        c.execute("INSERT INTO users (name, email, hashed_password) VALUES (?, ?, ?)",
                  (user.name, user.email, hashed_password))
        conn.commit()
        user_id = c.lastrowid
        return UserOut(id=user_id, name=user.name, email=user.email)
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Email already registered")
    finally:
        conn.close()

@app.post("/auth/token", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    conn = get_db()
    user = conn.execute("SELECT * FROM users WHERE email = ?", (form_data.username,)).fetchone()
    conn.close()
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    access_token = create_access_token(data={"sub": str(user["id"])})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/auth/me", response_model=UserOut)
def get_me(current_user=Depends(get_current_user)):
    return UserOut(id=current_user["id"], name=current_user["name"], email=current_user["email"])

# --- COURSE ENDPOINTS ---
@app.post("/courses/", response_model=CourseOut)
def create_course(course: CourseCreate, current_user=Depends(get_current_user)):
    now = datetime.utcnow().isoformat()
    conn = get_db()
    c = conn.cursor()
    c.execute("INSERT INTO courses (title, description, teacher_id, teacher_name, pdf_url, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
              (course.title, course.description, course.teacher_id, course.teacher_name, course.pdf_url, now, now))
    conn.commit()
    course_id = c.lastrowid
    conn.close()
    return CourseOut(id=course_id, created_at=now, updated_at=now, **course.dict())

@app.put("/courses/{course_id}", response_model=CourseOut)
def update_course(course_id: int, course: CourseCreate, current_user=Depends(get_current_user)):
    now = datetime.utcnow().isoformat()
    conn = get_db()
    c = conn.cursor()
    c.execute("""
        UPDATE courses SET title=?, description=?, teacher_id=?, teacher_name=?, pdf_url=?, updated_at=? WHERE id=?
    """, (course.title, course.description, course.teacher_id, course.teacher_name, course.pdf_url, now, course_id))
    conn.commit()
    updated = c.execute("SELECT * FROM courses WHERE id = ?", (course_id,)).fetchone()
    conn.close()
    if not updated:
        raise HTTPException(status_code=404, detail="Course not found")
    return CourseOut(**dict(updated))

@app.get("/courses/", response_model=List[CourseOut])
def list_courses():
    conn = get_db()
    courses = conn.execute("SELECT * FROM courses").fetchall()
    conn.close()
    return [CourseOut(**dict(row)) for row in courses]

@app.get("/courses/{course_id}", response_model=CourseOut)
def get_course(course_id: int):
    conn = get_db()
    course = conn.execute("SELECT * FROM courses WHERE id = ?", (course_id,)).fetchone()
    conn.close()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return CourseOut(**dict(course))

@app.delete("/courses/{course_id}")
def delete_course(course_id: int, current_user=Depends(get_current_user)):
    conn = get_db()
    # Fetch the course to get the pdf_url
    course = conn.execute("SELECT pdf_url FROM courses WHERE id = ?", (course_id,)).fetchone()
    pdf_url = course["pdf_url"] if course else None
    # Delete the course from the database
    conn.execute("DELETE FROM courses WHERE id = ?", (course_id,))
    conn.commit()
    conn.close()
    # Remove the PDF file if it exists and is local
    if pdf_url and pdf_url.startswith("/pdfs/"):
        filename = pdf_url.split("/pdfs/")[-1]
        file_path = os.path.join(UPLOAD_DIR, filename)
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception as e:
                print(f"[DELETE] Failed to remove PDF: {file_path} ({e})")
    return {"ok": True}

# --- PDF UPLOAD ---
@app.post("/upload/pdf/")
def upload_pdf(file: UploadFile = File(...)):
    abs_upload_dir = os.path.abspath(UPLOAD_DIR)
    print(f"[UPLOAD] Incoming file: {file.filename}")
    if not os.path.exists(abs_upload_dir):
        os.makedirs(abs_upload_dir)
    filename = f"{int(time.time())}_{file.filename}"
    file.file.seek(0)  # Ensure pointer is at start
    try:
        contents = file.file.read()
        print(f"[UPLOAD] Read {len(contents)} bytes from upload.")
        if not contents or len(contents) == 0:
            print("[UPLOAD] ERROR: Uploaded file is empty.")
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")
        with open(os.path.join(abs_upload_dir, filename), "wb") as f:
            f.write(contents)
        print(f"[UPLOAD] Saved file to {os.path.join(abs_upload_dir, filename)}")
    except Exception as e:
        print(f"[UPLOAD] ERROR: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to write file: {e}")
    if os.path.exists(os.path.join(abs_upload_dir, filename)):
        size = os.path.getsize(os.path.join(abs_upload_dir, filename))
        print(f"[UPLOAD] File on disk: {os.path.join(abs_upload_dir, filename)} ({size} bytes)")
        if size == 0:
            os.remove(os.path.join(abs_upload_dir, filename))
            print("[UPLOAD] ERROR: File on disk is empty after write.")
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")
    else:
        print(f"[UPLOAD] ERROR: File not found after write: {os.path.join(abs_upload_dir, filename)}")
        raise HTTPException(status_code=500, detail="Failed to save PDF.")
    return {"url": f"/pdfs/{filename}"}

# --- QUIZ ENDPOINTS ---
@app.post("/quizzes/", response_model=QuizOut)
def create_quiz(quiz: QuizCreate, current_user=Depends(get_current_user)):
    conn = get_db()
    c = conn.cursor()
    c.execute("INSERT INTO quizzes (course_id, title) VALUES (?, ?)", (quiz.course_id, quiz.title))
    conn.commit()
    quiz_id = c.lastrowid
    conn.close()
    return QuizOut(id=quiz_id, **quiz.dict())

@app.put("/quizzes/{quiz_id}", response_model=QuizOut)
def update_quiz(quiz_id: int, quiz: QuizCreate, current_user=Depends(get_current_user)):
    conn = get_db()
    c = conn.cursor()
    c.execute("UPDATE quizzes SET title=? WHERE id=?", (quiz.title, quiz_id))
    conn.commit()
    updated = c.execute("SELECT * FROM quizzes WHERE id = ?", (quiz_id,)).fetchone()
    conn.close()
    if not updated:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return QuizOut(**dict(updated))

@app.get("/quizzes/", response_model=List[QuizOut])
def list_quizzes():
    conn = get_db()
    quizzes = conn.execute("SELECT * FROM quizzes").fetchall()
    conn.close()
    return [QuizOut(**dict(row)) for row in quizzes]

@app.get("/quizzes/{quiz_id}", response_model=QuizOut)
def get_quiz(quiz_id: int):
    conn = get_db()
    quiz = conn.execute("SELECT * FROM quizzes WHERE id = ?", (quiz_id,)).fetchone()
    conn.close()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return QuizOut(**dict(quiz))

# --- QUESTION ENDPOINTS ---
@app.post("/questions/", response_model=QuestionOut)
def create_question(question: QuestionCreate, current_user=Depends(get_current_user)):
    conn = get_db()
    c = conn.cursor()
    c.execute("INSERT INTO questions (quiz_id, text, options, correct_option_index) VALUES (?, ?, ?, ?)",
              (question.quiz_id, question.text, ','.join(question.options), question.correct_option_index))
    conn.commit()
    question_id = c.lastrowid
    conn.close()
    return QuestionOut(id=question_id, **question.dict())

@app.put("/questions/{question_id}", response_model=QuestionOut)
def update_question(question_id: int, question: QuestionCreate, current_user=Depends(get_current_user)):
    conn = get_db()
    c = conn.cursor()
    c.execute("""
        UPDATE questions SET text=?, options=?, correct_option_index=? WHERE id=?
    """, (question.text, ','.join(question.options), question.correct_option_index, question_id))
    conn.commit()
    updated = c.execute("SELECT * FROM questions WHERE id = ?", (question_id,)).fetchone()
    conn.close()
    if not updated:
        raise HTTPException(status_code=404, detail="Question not found")
    # Return options as list
    return QuestionOut(id=updated["id"], quiz_id=updated["quiz_id"], text=updated["text"], options=updated["options"].split(','), correct_option_index=updated["correct_option_index"])

@app.get("/questions/{quiz_id}", response_model=List[QuestionOut])
def list_questions(quiz_id: int):
    conn = get_db()
    questions = conn.execute("SELECT * FROM questions WHERE quiz_id = ?", (quiz_id,)).fetchall()
    conn.close()
    return [QuestionOut(id=row["id"], quiz_id=row["quiz_id"], text=row["text"], options=row["options"].split(','), correct_option_index=row["correct_option_index"]) for row in questions]

# --- QUIZ RESULT ENDPOINTS ---
@app.post("/results/", response_model=QuizResultOut)
def create_result(result: QuizResultCreate, current_user=Depends(get_current_user)):
    conn = get_db()
    c = conn.cursor()
    c.execute("INSERT INTO quiz_results (user_id, quiz_id, score, total_questions, completed_at) VALUES (?, ?, ?, ?, ?)",
              (result.user_id, result.quiz_id, result.score, result.total_questions, result.completed_at))
    conn.commit()
    result_id = c.lastrowid
    conn.close()
    return QuizResultOut(id=result_id, **result.dict())

@app.get("/results/{user_id}", response_model=List[QuizResultOut])
def list_results(user_id: int):
    conn = get_db()
    results = conn.execute("SELECT * FROM quiz_results WHERE user_id = ?", (user_id,)).fetchall()
    conn.close()
    return [QuizResultOut(**dict(row)) for row in results]

@app.get("/debug/courses")
def debug_list_courses():
    conn = get_db()
    courses = conn.execute("SELECT id, title, pdf_url FROM courses").fetchall()
    conn.close()
    return [dict(row) for row in courses]

# --- PDF DELETE ENDPOINT ---
@app.delete("/pdf_delete")
def delete_pdf(url: str = Query(...), current_user=Depends(get_current_user)):
    if not url.startswith("/pdfs/"):
        raise HTTPException(status_code=400, detail="Invalid PDF url")
    filename = url.split("/pdfs/")[-1]
    file_path = os.path.join(UPLOAD_DIR, filename)
    if os.path.exists(file_path):
        try:
            os.remove(file_path)
            return {"ok": True}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to delete PDF: {e}")
    else:
        raise HTTPException(status_code=404, detail="PDF not found")

# --- VIDEO ENDPOINTS ---
@app.post("/videos/", response_model=VideoOut, status_code=status.HTTP_201_CREATED)
def upload_video(
    title: str = Form(...),
    description: str = Form(...),
    teacher_id: int = Form(...),
    teacher_name: str = Form(...),
    file: UploadFile = File(...),
    current_user=Depends(get_current_user)
):
    abs_upload_dir = os.path.abspath(VIDEO_UPLOAD_DIR)
    if not os.path.exists(abs_upload_dir):
        os.makedirs(abs_upload_dir)
    filename = f"{int(time.time())}_{file.filename}"
    file.file.seek(0)
    try:
        contents = file.file.read()
        if not contents or len(contents) == 0:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")
        with open(os.path.join(abs_upload_dir, filename), "wb") as f:
            f.write(contents)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to write file: {e}")
    video_url = f"/video-files/{filename}"
    now = datetime.utcnow().isoformat()
    conn = get_db()
    c = conn.cursor()
    c.execute("INSERT INTO videos (title, description, teacher_id, teacher_name, video_url, created_at) VALUES (?, ?, ?, ?, ?, ?)",
              (title, description, teacher_id, teacher_name, video_url, now))
    conn.commit()
    video_id = c.lastrowid
    conn.close()
    return VideoOut(id=video_id, title=title, description=description, teacher_id=teacher_id, teacher_name=teacher_name, video_url=video_url, created_at=now)

@app.get("/videos/", response_model=List[VideoOut])
def list_videos():
    conn = get_db()
    videos = conn.execute("SELECT * FROM videos ORDER BY created_at DESC").fetchall()
    conn.close()
    return [VideoOut(**dict(row)) for row in videos]

@app.get("/videos/{video_id}", response_model=VideoOut)
def get_video(video_id: int):
    conn = get_db()
    video = conn.execute("SELECT * FROM videos WHERE id = ?", (video_id,)).fetchone()
    conn.close()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    return VideoOut(**dict(video))

@app.delete("/videos/{video_id}")
def delete_video(video_id: int, current_user=Depends(get_current_user)):
    conn = get_db()
    video = conn.execute("SELECT * FROM videos WHERE id = ?", (video_id,)).fetchone()
    if not video:
        conn.close()
        raise HTTPException(status_code=404, detail="Video not found")
    video_url = video["video_url"]
    conn.execute("DELETE FROM videos WHERE id = ?", (video_id,))
    conn.commit()
    conn.close()
    # Remove the video file if it exists and is local
    if video_url and video_url.startswith("/video-files/"):
        filename = video_url.split("/video-files/")[-1]
        file_path = os.path.join(VIDEO_UPLOAD_DIR, filename)
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception as e:
                print(f"[DELETE] Failed to remove video: {file_path} ({e})")
    return {"ok": True} 