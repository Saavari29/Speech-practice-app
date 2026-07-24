# 🎤 Oratory
 
> Practice your speeches. Get instant AI feedback. Speak with confidence.
 
Oratory is a full-stack speech practice web app that records your voice, transcribes it, and delivers detailed AI-powered feedback on your pace, filler words, tone, and relevance — all in one clean, intuitive interface.
 
---
 
## ✨ Features
 
- 🎙 **In-browser speech recording** with guided prep timer and countdown
- 🤖 **AI analysis** powered by Google Gemini 2.5 Flash
- 📊 **Detailed feedback** — filler words, pace (WPM), relevance score, tone consistency
- 📋 **Speech history** — review all past speeches and their analyses
- 📈 **Dashboard** — track total speeches and daily practice streak
- 🔐 **JWT authentication** — secure signup and login
- 🎯 **Difficulty levels** — Easy, Medium, and Hard with varying durations and prep times
---
 
## 🖥 Tech Stack
 
### Frontend
- React (Create React App)
- React Router DOM
- Axios
- CSS Variables + Google Fonts (Inter, Syne)
### Backend
- FastAPI
- PostgreSQL
- SQLAlchemy
- Google Gemini (`google-genai`)
- JWT Authentication (`python-jose`)
- Bcrypt password hashing

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL
- Google Gemini API key

## 🔌 API Endpoints
 
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Register a new user |
| POST | `/auth/login` | Login and get JWT token |
| GET | `/difficulties` | Get all difficulty levels |
| POST | `/speeches` | Upload audio and trigger AI analysis |
| GET | `/speeches` | Get all speeches for current user |
| GET | `/analysis/{speech_id}` | Get analysis for a specific speech |
 
---

## 🔌 API Endpoints
 
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Register a new user |
| POST | `/auth/login` | Login and get JWT token |
| GET | `/difficulties` | Get all difficulty levels |
| POST | `/speeches` | Upload audio and trigger AI analysis |
| GET | `/speeches` | Get all speeches for current user |
| GET | `/analysis/{speech_id}` | Get analysis for a specific speech |
 
---

