# DSA Stats

DSAStats is an application that aggregates your DSA (Data Structures and Algorithms) statistics/ranks from platforms like LeetCode, GeeksforGeeks, and CodeChef etc into a unified and visually appealing dashboard. It simplifies progress tracking and allows you to share or download your stats in a beautiful way.

## Features

- Aggregate DSA stats from multiple platforms
- Shareable stats page with a unique link
- Downloadable snapshots of your stats for sharing
- Beautiful, responsive UI to share with the world

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: in-House
- **Deployment**: Vercel (Frontend), Render (Backend)

## Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)

### Clone the Repository

```bash
git clone https://github.com/yourusername/dsastats.git
cd dsastats
```

### Install Dependencies

#### Frontend:

```bash
cd frontend
npm install
```

#### Backend:

```bash
cd backend
npm install
```

### Environment Variables

Create `.env` files in both `frontend` and `backend` directories and add the following:

#### Frontend `.env`

```env
VITE_APP_BACKEND = http://localhost:3000
```

#### Backend `.env`

```env
PORT=5000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
```

### Run the Application

#### Start Backend:

```bash
cd backend
npm run dev
```

#### Start Frontend:

```bash
cd frontend
npm start
```

The app will be available at `http://localhost:3000`.

## Usage

1. Add your platform usernames (e.g., LeetCode, CodeChef).
2. View your unified stats dashboard.
3. Share your stats page using the unique link or download a snapshot.

## Future Enhancements

- Add support for more platforms (e.g., AtCoder, HackerRank)
- Include detailed problem-level analytics
- Introduce themes and customizable dashboards
