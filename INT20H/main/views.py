from django.shortcuts import render, redirect
from django.contrib import messages, admin
from .models import CustomUser
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login
from django.contrib.auth.views import LoginView
from django.db import IntegrityError
from django.contrib.auth.models import BaseUserManager
from .email import email_confirmation, send_password_reset_email
from datetime import datetime, timedelta
from django.contrib.auth import logout
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.http import HttpResponse
from django.http import JsonResponse
import json
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponseRedirect


def home(request):
    return HttpResponse('Hello World!')


# @api_view(['POST'])
# @authentication_classes([TokenAuthentication])
# @permission_classes([IsAuthenticated])
# def test(request):
#     print(request.user.username)
#     print(request.headers)
#     return HttpResponse('test')


# @api_view(['POST'])
# @authentication_classes([TokenAuthentication])
# @permission_classes([IsAuthenticated])
# def admin_redirection(request):
#     print(request.user.username)
#     if request.user.is_staff:
#         return HttpResponseRedirect('/admin/')
#     else:
#         return JsonResponse({'error': 'You are not authorized to access this page'})


def register(request):
    # Only POST
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        email = BaseUserManager.normalize_email(data.get('email'))
        password = data.get('password')
        try:
            new_user = CustomUser.objects.create_user(username=username,
                                                      email=email,
                                                      password=password,
                                                      is_active=False)
        except IntegrityError:
            existing_user = CustomUser.objects.get(email=email)
            if not existing_user.is_active:
                if datetime.now() - existing_user.date_joined.replace(tzinfo=None) >= timedelta(days=1):
                    existing_user.date_joined = datetime.now()
                    existing_user.username = username
                    existing_user.set_password(password)
                    existing_user.save()
                    email_confirmation(request, existing_user, username)
                return JsonResponse({'username': username})
            else:
                return JsonResponse({'error': 'Такий email вже існує'})

        email_confirmation(request, new_user, username)
        return JsonResponse({'username': username})


def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = BaseUserManager.normalize_email(data.get('email'))
        password = data.get('password')
        user = authenticate(request, email=email, password=password)
        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            return JsonResponse({'success': 'login',
                                 'autorization': token.key,
                                 'userId': user.pk})
        else:
            return JsonResponse({'error': 'Bad Credentials'})


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def profile(request):
    print(request.POST)
    avatar = request.FILES['avatar']
    username = request.POST.get("username")
    phone = request.POST.get("phone")
    password = request.POST.get("password")
    changed = []
    if avatar:
        request.user.avatar = avatar
        changed.append('avatar')
    if username != '':
        request.user.username = username
        changed.append('username')
    if phone and phone != '':
        request.user.phone = phone
        changed.append('phone')
    if password != '':
        if not request.user.check_password(password):
            request.user.set_password(password)
            request.user.save()
            changed.append('password')
        else:
            return JsonResponse({'error': 'The new password is the same as the old one'})
    request.user.save()
    token, created = Token.objects.get_or_create(user=request.user)
    return JsonResponse({'changed': changed,
                         'authorization': token.key})


def reset_password(request):
    if request.method == 'POST':
        data = request.POST['data']

        try:
            validate_email(data)
        except ValidationError as e:  # Значить телефон
            user = CustomUser.objects.filter(phone=data).first()
        else:
            user = CustomUser.objects.filter(email=data).first()

        if user:
            send_password_reset_email(user, request.META['HTTP_HOST'])
            return render(request, 'main/password_reset/reset_password_done.html', {'data': data})
        else:
            messages.error(request, 'Ви ввели неіснуючий email або телефон')
    return render(request, 'main/password_reset/reset_password.html')

