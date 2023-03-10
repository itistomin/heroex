from django.views.generic import TemplateView
from django.contrib import admin
from django.urls import path, include, re_path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView


api_urlpatterns = [
    path('token/', include('authentication.urls')),
    path('user/', include('userprofile.urls')),
    path('stock/', include('stock.urls')),
    path('weeks/', include('gameweek.urls')),
]


docs_urlpatterns = [
    path('', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
]


urlpatterns = [
    path('admin/', admin.site.urls),
    path('docs/', include(docs_urlpatterns)),
    path('api/', include(api_urlpatterns)),
    re_path(r'^', TemplateView.as_view(template_name='index.html')),
]
