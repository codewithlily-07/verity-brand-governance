# VERITY Deployment Guide

**Target Topology:** Single-container deployment where FastAPI serves both the REST API and the built production React SPA. Database supports Supabase PostgreSQL or zero-config local SQLite.

---

## 1. Quick Start: Local Run (No External Accounts Required)

VERITY is configured to run immediately with zero external dependencies using local SQLite and pre-built frontend assets.

```bash
# 1. Activate Python virtual environment
.\venv\Scripts\activate  # Windows
# or: source venv/bin/activate  # Linux/macOS

# 2. Run the application
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000
```

- Open the website in your browser: **`http://127.0.0.1:8000`**
- Interactive OpenAPI documentation: **`http://127.0.0.1:8000/docs`**

---

## 2. Running with Docker / Docker Compose

### Using Docker Compose (App + PostgreSQL with pgvector)

```bash
# Start both PostgreSQL and VERITY app
docker-compose up --build
```
The application will be live at `http://localhost:8000`.

### Building the Standalone Container Image

```bash
docker build -t verity-app .
docker run -p 8000:8000 verity-app
```

---

## 3. Production Cloud Deployment: Supabase (Durable PostgreSQL) + Render

### Step A: Database on Supabase (Durable PostgreSQL)
1. Navigate to [supabase.com](https://supabase.com) and sign in.
2. Click **New Project**, choose your organization, specify a project name (e.g. `verity-production`), set a strong database password, and choose your preferred cloud region.
3. Once the database is provisioned (approx. 1-2 minutes):
   - Navigate to **Project Settings** (gear icon) → **Database**.
   - Under **Connection Pooling**, choose **Session mode** or **Transaction mode** (port `6543` or direct `5432`).
   - Copy the URI connection string:
     ```
     postgresql://postgres.[PROJECT_REF]:[YOUR_PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
     ```
   - Replace `[YOUR_PASSWORD]` with your actual database password.
4. *Optional vector indexing:* In the Supabase SQL Editor, run:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```

### Step B: Web Service Configuration on Render
1. Open [render.com](https://render.com) and go to your dashboard.
2. Click **New → Web Service** (or select your existing `verity-brand-governance` service).
3. Connect your GitHub repository.
4. Set the runtime to **Docker** (Render detects the root `Dockerfile`).
5. In **Environment Variables**, set:
   - `DATABASE_URL`: *Paste your Supabase PostgreSQL URI from Step A*
   - `DEMO_MODE`: `true`
   - `LLM_PROVIDER`: `gemini` (or `openai`)
   - `LLM_MODEL`: `gemini-1.5-flash`
   - `LLM_API_KEY`: *(Optional) Your Google AI Studio API key*
6. In **Health Check Path**, enter `/api/ready`.
7. Click **Save Changes** / **Manual Deploy → Deploy latest commit**.

### Step C: Verifying Persistence (Survives Restarts)
1. Open the live deployment URL.
2. Visit `https://<YOUR-RENDER-URL>/api/ready` in your browser. Confirm it returns:
   ```json
   {
     "status": "ready",
     "service": "VERITY",
     "database": "connected",
     "database_type": "postgresql"
   }
   ```
3. Register a new user account (e.g. `judge@verity.internal`) and submit a new content review.
4. Go to Render Dashboard → Click **Manual Deploy** → **Restart service** (or redeploy).
5. Refresh the website once restarted: your user account, workspace, submissions, and review history will remain intact.

---

## 4. Free-Tier Cold Start & Keep-Alive Notes

When running on free-tier container services (such as Render or Fly.io):
- If the instance goes to sleep after inactivity, the first incoming HTTP request wakes the server within 15–25 seconds.
- The VERITY frontend includes a non-blocking connection banner ("Connecting to Verity Engine...").
- To prevent sleeping during live evaluation, configure a free periodic health ping (e.g. UptimeRobot) targeting `https://<YOUR-APP>/api/health` every 10 minutes.

