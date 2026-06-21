from django.urls import path
from . import views
from .views import RegisterView

urlpatterns = [
    path('api/students/', views.student_list),
    path('api/students/<int:id>/', views.delete_student),
    path('api/students/update/<int:id>/', views.update_student),
    path('register/', RegisterView.as_view(), name='register'),
]