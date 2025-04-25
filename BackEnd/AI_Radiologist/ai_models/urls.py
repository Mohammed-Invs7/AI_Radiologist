from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import (
    RadiologyModalityViewSet,
    BodyAnatomicalRegionViewSet,
    AIModelViewSet,
    AIModelFileViewSet,
)

router = DefaultRouter()
router.register('modalities', RadiologyModalityViewSet)
router.register('anatomies',  BodyAnatomicalRegionViewSet)
router.register('models',     AIModelViewSet)
router.register('model-files',AIModelFileViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
