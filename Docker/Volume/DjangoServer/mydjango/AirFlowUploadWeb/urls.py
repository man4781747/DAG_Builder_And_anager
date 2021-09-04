from django.conf.urls import url
from . import views

'''
設定 API
1. test/   測試 Django 正常與否API
2. GetOneBoardName/ 傳送單個討論版名稱給使用者
'''
urlpatterns = [
    url(r'test/', views.test),
    url(r'MainWeb/', views.MainWeb),
    url(r'UploadFile/', views.GetUploadedFile),
    url(r'UploadDAGPythonFile/', views.UploadDAGPythonFile),
    url(r'GetDAGs/', views.GetDAGs_buildByDAGBuilder),
    url(r'GetDAGRunsList/', views.GetDAGRunsList),
]
