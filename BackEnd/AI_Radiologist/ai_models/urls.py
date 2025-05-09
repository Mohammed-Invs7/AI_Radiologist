from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import (
    RadiologyModalityViewSet,
    BodyAnatomicalRegionViewSet,
    AIModelViewSet,
    AIModelFileViewSet,
    AdminRadiologyOptionsView,
    RadiologyDetailsViewSet,
)

router = DefaultRouter()
router.register('modalities', RadiologyModalityViewSet)
router.register('anatomies',  BodyAnatomicalRegionViewSet)
router.register('models',     AIModelViewSet)
router.register('model-files',AIModelFileViewSet)
router.register(r'radiology-details', RadiologyDetailsViewSet, basename='radiology-details')

urlpatterns = [
    path('radio-options/', AdminRadiologyOptionsView.as_view(),   name='model-radio-details-options'),
    path('', include(router.urls)),
]
