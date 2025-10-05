# CareU
Fitness and Health tracking app


# Developper Workspace Setup
## Windows First installation
### Local scripts
First verify that you have python, git and Node.js installed on your computer. If not you can dowload it from the official website at :

Python : https://www.python.org/downloads/    \
Git : https://git-scm.com/downloads           \
Node : https://nodejs.org/en/download/current


you can verify your installation by typing the following command in a powershell :

```
.> python --version
Python 3.0.0 
# (or above)

.>git --version
git version 2.51.0.windows.1 
# (or above)

.> node --version
v24.0.0 
# (or above)
```
To avoid futhur issue please use the basic configuration for all and add them to path 
(**which is not preselect for python dowload**) unless you know what you are doing.

### Workspace configuration
If not already done clone the CareU repository by using the following command.
```
.> git clone https://github.com/AdLedoux/CareU.git
```
Once in the repository go to server in a powershell and type the following command to setup python virtual environment :
```
.\CareU\server> python -m venv env
```

Then activate it by using the following command :
```
.\CareU\server> .\env\Scripts\activate
```
Once done a little icon should appear in your powershell if not restart your powershell and retry. Then install all the requirement module by using :
```
(env) .\CareU\server> pip install -r requirement.txt
``` 
You can now start the Django serveur with :
```
(env) .\CareU\server> py manage.py runserver
...
Django version 5.2.7, using settings 'website.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```
Get the ip and port server number here *http://127.0.0.1:8000/* and verify it is the same in the *env/* folder. If not change it.

Start now a new powershell and go to the client directory and tape the following command :
```
.\CareU\client> npm install
```
Then launch the frontend server  with 
```
.\CareU\client> npm run dev
```
The application should be accessible in the given ip address. Enjoy !

## Other launch


# Production Installation
The production installation will be made later using docker....
