import subprocess
import re
import os

patterns = [
    (r"sk-[a-zA-Z0-9]{20,}", "OpenAI / Claude API key"),
    (r"AIzaSy[a-zA-Z0-9_-]{33}", "Google API Key"),
    (r"password\s*[:=]\s*['\"][^'\"]+['\"]", "Hardcoded password"),
    (r"postgres(?:ql)?://[^\s'\"<>]+:[^\s'\"<>]+@[^\s'\"<>]+", "Postgres URI with credentials"),
    (r"service_role[_\s]*key\s*[:=]\s*['\"][^'\"]+['\"]", "Supabase Service Role Key"),
    (r"eyJ[a-zA-Z0-9_-]{10,}\.eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}", "JWT token"),
    (r"bearer\s+[a-zA-Z0-9_.-]{30,}", "Bearer Token")
]

print("=== CHECKING GIT COMMIT LOG ===")
p = subprocess.run(["git", "log", "-p"], capture_output=True, text=True, errors="replace")
git_log = p.stdout

for pat, desc in patterns:
    matches = re.findall(pat, git_log, re.IGNORECASE)
    # filter out obvious dummy examples
    matches = [m for m in matches if "[PASSWORD]" not in m and "placeholder" not in m.lower() and "your-" not in m.lower()]
    if matches:
        print(f"[ALERT] Found {len(matches)} matches for {desc} in git log! e.g. {matches[0][:25]}...")
    else:
        print(f"[OK] No {desc} in git log.")

print("\n=== CHECKING WORKTREE FILES ===")
worktree_matches = []
for root, dirs, files in os.walk("."):
    dirs[:] = [d for d in dirs if d not in [".git", "node_modules", "venv", ".venv", ".pytest_cache", "dist", "build", ".system_generated"]]
    for f in files:
        if f.endswith(('.png', '.ico', '.svg', '.jpg', '.jpeg', '.woff', '.woff2', '.db', '.pyc', '.zip')):
            continue
        fpath = os.path.join(root, f)
        try:
            with open(fpath, "r", encoding="utf-8", errors="ignore") as fh:
                content = fh.read()
                for pat, desc in patterns:
                    found = re.findall(pat, content, re.IGNORECASE)
                    found = [m for m in found if "[PASSWORD]" not in m and "placeholder" not in m.lower() and "your-" not in m.lower() and "dummy" not in m.lower() and "example" not in m.lower()]
                    if found:
                        worktree_matches.append((fpath, desc, found[:2]))
        except Exception as e:
            pass

if worktree_matches:
    for fpath, desc, sample in worktree_matches:
        print(f"[ALERT] Found {desc} in {fpath}: {sample}")
else:
    print("[OK] No secrets found in worktree files.")

print("\n=== SCAN SUMMARY FINISHED ===")
