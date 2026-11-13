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

## 3. Production Cloud Deployment: Supabase + Render

### Step A: Database on Supabase (PostgreSQL with pgvector)
1. Go to [supabase.com](https://supabase.com) and create a free project.
2. In the Supabase SQL Editor, enable pgvector (optional enhancement):
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```
3. Copy your project connection URI from **Project Settings → Database → Connection string (URI)**:
   ```
   postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```

### Step B: Web Service on Render
1. Go to [render.com](https://render.com) and click **New → Web Service**.
2. Connect your Git repository.
3. Choose **Docker** as the runtime.
4. Set the following Environment Variables:
   - `DATABASE_URL`: *Your Supabase PostgreSQL URI from Step A*
   - `LLM_PROVIDER`: `gemini` (or `openai`)
   - `LLM_MODEL`: `gemini-1.5-flash`
   - `LLM_API_KEY`: *Your Google AI Studio API key (optional)*
   - `DEMO_MODE`: `true`
5. Click **Create Web Service**.
6. Render will automatically build the multi-stage Dockerfile and start the application.

---

## 4. Free-Tier Cold Start & Keep-Alive Notes

When running on free-tier container services (such as Render or Fly.io):
- If the instance goes to sleep after inactivity, the first incoming HTTP request wakes the server within 15–25 seconds.
- The VERITY frontend includes a non-blocking connection banner ("Connecting to Verity Engine...").
- To prevent sleeping during live evaluation, configure a free periodic health ping (e.g. UptimeRobot) targeting `https://<YOUR-APP>/api/health` every 10 minutes.

