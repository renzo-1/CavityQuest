from django.conf.urls.static import static
from django.conf import settings
from django.urls import path
from . import views

urlpatterns = [
    path('user/', views.get_user_info)
]

urlpatterns =+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
