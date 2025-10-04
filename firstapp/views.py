from django.shortcuts import render

# Create your views here.
from django.shortcuts import render, redirect
from .forms import LoginForm

def login_view(request):
    if request.method == "POST":
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data["username"]
            password = form.cleaned_data["password"]

            if username == "admin" and password == "1234":
                return redirect("success")
            else:
                form.add_error(None, "Invalid username or password")
    else:
        form = LoginForm()
    return render(request, "login.html", {"form": form})


def success_view(request):
    return render(request, "success.html")

from django.shortcuts import render
from .forms import LoginForm

def login_view(request):
    form = LoginForm(request.POST or None)
    if request.method == "POST":
        if form.is_valid():
            username = form.cleaned_data.get("username")
            password = form.cleaned_data.get("password")
            print("Username:", username)
            print("Password:", password)
            # later, you can add authentication here
    return render(request, "login.html", {"form": form})


from django.shortcuts import render, redirect
from .forms import LoginForm

def login_view(request):
    form = LoginForm(request.POST or None)
    if request.method == "POST":
        if form.is_valid():
            username = form.cleaned_data.get("username")
            password = form.cleaned_data.get("password")
            print("Username:", username)
            print("Password:", password)
            return redirect("success")  # 👈 go to success page
    return render(request, "login.html", {"form": form})

def success_view(request):
    return render(request, "success.html")


from django.http import HttpResponse

def home(request):
    return HttpResponse("Welcome to CareU! <a href='/login/'>Login here</a>")

