## 1. 💻 Code Conventions
- **Python**: follow [PEP8](https://peps.python.org/pep-0008/).  
- **Variables**: `snake_case` → e.g., `user_name`, `is_active`.  
- **Functions**: `snake_case` → e.g., `get_user_profile()`.  
- **Classes**: `CamelCase` → e.g., `UserProfile`, `BlogPost`.  
- **Constants**: `UPPER_CASE` → e.g., `MAX_RETRIES = 5`.  
- **Templates (HTML/CSS)**: clear names, no obscure abbreviations.  

---

## 2. 🌱 Git Workflow
- **One branch per feature or bugfix**:  
  - Example: `feature/user-login` or `fix/password-reset`.
  - Or you can use your own branch  
- **Always branch off `main`**.  
- **Never push directly to `main`**.  
- **Push** to your own branch/fork first.  
- **Pull Request (PR)** is required before merging:  
  - The PR title must describe the feature/fix.  
  - Add a short description of the changes.  
- **Code Review**: at least one approval is required before merging.  

---

## 3. ✅ Best Practices
- Use `.env` for sensitive configuration (never commit it) and keep `.env.example` updated.  
- Use a virtual environment — it makes updating `requirements.txt` easier and prepares for production containerization.  
- Respect the **code review** process before merging.  
- Document new features directly in `README.md`.  

---

## 4. 📂 Project Structure
Quick overview of the folder organization:  

```
CareU/
├── firstapp/               # Django app (models, views, forms, urls…)
│   ├── ...                 
│
├── static/                 # Global static files (CSS, JS, images)
│
├── templates/              # Global templates
│   ├── includes/           # Template partials (navbar, footer, etc.)
│   ├── base.html           # Base template for extending other pages
│
├── website/                # Project core
│   ├── settings/           # Configurations (base, dev, prod)
│   ├── urls.py             # Main routes
│   ├── asgi.py, wsgi.py    # Server entry points
│
├── .env                    # Local environment variables (never committed)
├── .env.example            # Example environment file to share safe defaults
├── .gitignore              # Git ignore rules (ignore .env, venv, etc.)
├── GUIDELINES.md           # Contribution and coding guidelines
├── manage.py               # Django management script (runserver, migrate, etc.)
├── README.md               # Project documentation
└── requirements.txt        # Python dependencies
```
---
## 5. 📊 Project Tracking (Jira)

- All tasks, features, and bug reports must be created and tracked in **Jira**.  
- Before starting any new work, make sure the corresponding Jira ticket exists (or create one) and is assigned to you.  
- Workflow on Jira must reflect the actual progress:  
  - **To Do → In Progress → In Review → Done**.  
- Do not close a ticket until the Pull Request has been merged.  
- If anything goes wrong with your setup or devflow, create a ticket in the **IT HELP SUPPORT**.  


---

📌 Jira is the single source of truth for project status. Always keep it updated to ensure visibility for the whole team.

---

💡 Keep it simple, clean, and consistent.  
Happy coding! 🚀