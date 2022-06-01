from django.urls import path
from django.views.generic import TemplateView

# from .views import Index
# from .views import login_view, Logout, login_ajax, logout_ajax

from .views import new_pazzle
urlpatterns = [
    path('', TemplateView.as_view(template_name="webapp/index.html"), name='index'),
    # path('articles', ArticlesView.as_view(), name='articles'),
    path('new_pazzle/<int:size>', new_pazzle, name='new_pazzle'),
    # path('login/', login_ajax, name='login'),
    # path('logout/', Logout.as_view(), name='logout'),
    # path('logout_ajax/', logout_ajax, name='logout_ajax'),

]
