# InternHelp Platform

A full-stack internship & certification platform.

## 🚀 Features
- User Authentication (Firebase)
- Internship purchase system (Fake Payment)
- Module-based learning system
- Progress tracking
- Certificate generation (PDF)
- Profile page
- Dark mode

## 🛠 Tech Stack
- React.js
- Firebase (Auth + Firestore)
- jsPDF

## � Security Setup

This project no longer stores Firebase config in source code. Instead, use environment variables from `.env` (see `.env.example`).

### Setup your local environment
1. Copy `.env.example` to `.env`
2. Fill in your Firebase values
3. Run `npm start`

### Sharing safely
- Never commit `.env` to Git.
- Keep keys private while sharing code.
- Replace real keys with placeholders before zipping for others.

## �📌 Note
This project uses a simulated payment system for demonstration purposes.