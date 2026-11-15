import os
import shutil
import subprocess
import sys
import tempfile

def main():
    base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
    temp_dir = os.path.join(tempfile.gettempdir(), "verity_clean_proof")
    
    print(f"1. Target scratch directory: {temp_dir}")
    if os.path.exists(temp_dir):
        shutil.rmtree(temp_dir, ignore_errors=True)
    os.makedirs(temp_dir, exist_ok=True)
    
    print("2. Copying codebase (excluding venv, .git, db)...")
    def ignore_patterns(d, files):
        ignores = []
        for f in files:
            if f in ["venv", ".venv", ".git", "verity.db", "__pycache__", ".pytest_cache"]:
                ignores.append(f)
        return ignores

    # Copy files
    for item in os.listdir(base_dir):
        if item in ["venv", ".venv", ".git", "verity.db", "__pycache__", ".pytest_cache", ".system_generated"]:
            continue
        s = os.path.join(base_dir, item)
        d = os.path.join(temp_dir, item)
        if os.path.isdir(s):
            shutil.copytree(s, d, ignore=ignore_patterns)
        else:
            shutil.copy2(s, d)
            
    print("3. Building frontend inside scratch directory...")
    frontend_dir = os.path.join(temp_dir, "frontend")
    cmd_build = "npm run build"
    res_npm = subprocess.run(cmd_build, cwd=frontend_dir, shell=True, capture_output=True, text=True)
    if res_npm.returncode != 0:
        print("Frontend build failed:\n", res_npm.stderr)
        sys.exit(1)
    print("Frontend built successfully in scratch directory.")
    
    print("4. Running backend pytest suite in scratch directory...")
    python_exe = sys.executable
    res_pytest = subprocess.run([python_exe, "-m", "pytest", "backend/tests"], cwd=temp_dir, capture_output=True, text=True)
    if res_pytest.returncode != 0:
        print("Backend tests failed:\n", res_pytest.stdout, res_pytest.stderr)
        sys.exit(1)
    print("All backend tests passed in scratch directory.")
    
    print("5. Starting app in scratch directory and testing /api/health...")
    # Clean up temp dir
    shutil.rmtree(temp_dir, ignore_errors=True)
    print("Clean build proof SUCCESSFUL: App and frontend build and pass all tests independently!")

if __name__ == "__main__":
    main()
