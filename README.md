# CareU

## Description
CareU is a web application designed to help users monitor their physical activity, nutrition, and overall health.  
It includes a Django-based backend (server) and a React-based frontend (client).

## Table of content

---



## 🚀 Production Installation

## 🧾 License



---

## 🧑‍💻 Developer Workspace Setup (🪟 Windows — First Installation)
### 1. Prerequisites
Make sure the following tools are installed on your computer:

- **Python** → https://www.python.org/downloads/  
- **Git** → https://git-scm.com/downloads  
- **Node.js (includes npm)** → https://nodejs.org/en/download 


you can verify your installation by typing the following command in a powershell :

```powershell
.> python --version
Python 3.x.x
# (3.10 or above recommended)

.>git --version
git version 2.x.x 
# (or above)

.> node --version
v20.0.0 
# (or above)

.> npm --version
10.x.x 
#(or above)
```
⚠️ During installation, make sure to check “**Add to PATH**” for all tools
(especially for Python, as it’s not selected by default).


### 2. Clone the Repository
Open PowerShell and run:

```powershell
.> git clone https://github.com/AdLedoux/CareU.git
.> cd CareU
```

### 3. Backend Setup (Django)
Navigate to the server directory and create a Python virtual environment:

```powershell
.\CareU> cd server
.\CareU\server> python -m venv env
```

Activate the virtual environment:

```powershell
.\CareU\server> .\env\Scripts\activate
```

If activation works, you should see ``(env)`` before your PowerShell prompt.
If not, restart PowerShell and retry.

Install all required Python dependencies:

```powershell
(env) .\CareU\server> pip install -r requirements.txt
``` 

💡 Make sure the file is named requirements.txt (plural).
If it’s currently named requirement.txt, rename it to match convention.

Run the Django development server and database:
```powershell
(env) .\CareU\server> python manage.py makemigrations
(env) .\CareU\server> python manage.py migrate
(env) .\CareU\server> python manage.py runserver
...
Django version 5.2.7, using settings 'website.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```
Your backend should now be running at http://127.0.0.1:8000/.

Check ``5. Common Tips`` if it differ.

### 4. Frontend Setup (React / Vite)
Open a **new PowerShell window** (keep the Django server running) and navigate to the client folder:

```powershell
.>cd CareU\client
```

Install all Node dependencies:

```powershell
.\CareU\client> npm install
```

Start the frontend development server:

```powershell
.\CareU\client> npm start
```
Now open the URL in your browser (e.g., http://127.0.0.1:5173/) to access the app.

### 5. Common Tips
If the frontend and backend ports differ, update your environment variables or .env files accordingly.

To stop the servers, press CTRL + C in each terminal.

You can restart them at any time using the same commands:
```powershell
(env) .\CareU\server> python manage.py makemigrations
(env) .\CareU\server> python manage.py migrate
(env) .\CareU\server> python manage.py runserver

.\CareU\client> npm install
.\CareU\client> npm start
```

Some additional guidelines have been wrote in ``GUIDELINES.md``.

---

## 🧑‍💼 Contributors
