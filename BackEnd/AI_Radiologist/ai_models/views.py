from drf_spectacular.utils import extend_schema
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from users.permissions import IsAdminUser
from .models import AIModel, AIModelFile, RadiologyModality, BodyAnatomicalRegion, RadiologyDetails
from .serializers import (
    AIModelSerializer,
    AIModelFileSerializer,
    AIModelFileRenameSerializer,
    RadiologyModalitySerializer,
    BodyAnatomicalRegionSerializer,
    RadiologyDetailsSerializer,
)
import os
from rest_framework.decorators import action


class RadiologyModalityViewSet(viewsets.ModelViewSet):
    """
    RadiologyModalityViewSet
    ------------------------
    Provides CRUD operations for RadiologyModality objects.

    Endpoints:
      - GET  /modalities/         → list all modalities
      - POST /modalities/         → create a new modality
      - GET  /modalities/{id}/    → retrieve a single modality
      - PUT  /modalities/{id}/    → update a modality
      - PATCH/modalities/{id}/    → partial update
      - DELETE /modalities/{id}/  → delete a modality

    Permissions:
      - Only users with admin privileges (IsAdminUser) can access.
    """
    queryset = RadiologyModality.objects.all()
    serializer_class = RadiologyModalitySerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class BodyAnatomicalRegionViewSet(viewsets.ModelViewSet):
    """
    BodyAnatomicalRegionViewSet
    ---------------------------
    Provides CRUD operations for BodyAnatomicalRegion objects.

    Endpoints:
      - GET  /anatomies/         → list all anatomical regions
      - POST /anatomies/         → create a new region
      - GET  /anatomies/{id}/    → retrieve a single region
      - PUT  /anatomies/{id}/    → update a region
      - PATCH/anatomies/{id}/    → partial update
      - DELETE /anatomies/{id}/  → delete a region

    Permissions:
      - Only users with admin privileges (IsAdminUser) can access.
    """
    queryset = BodyAnatomicalRegion.objects.all()
    serializer_class = BodyAnatomicalRegionSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class AIModelViewSet(viewsets.ModelViewSet):
    """
    AIModelViewSet
    --------------
    Provides CRUD operations for AIModel objects, with special handling:
      - On create/update, enforces exactly one active model per RadiologyDetails.
      - Supports uploading multiple files alongside the model via `upload_files`.
      - Returns nested `modalities` and `anatomies` for display, plus a `files` list.

    Endpoints:
      - GET  /models/         → list all AI models
      - POST /models/         → create a new AI model (include `upload_files` multipart)
      - GET  /models/{id}/    → retrieve a single AI model with its files and details
      - PUT/PATCH /models/{id}/ → update model metadata and/or upload additional files
      - DELETE /models/{id}/  → delete a model (files cascade-delete)

    Permissions:
      - Only users with admin privileges (IsAdminUser) can access.
    """
    queryset = AIModel.objects.all()
    serializer_class = AIModelSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class AIModelFileViewSet(viewsets.ModelViewSet):
    """
    AIModelFileViewSet
    ------------------
    Provides CRUD operations for individual AIModelFile objects.
    Use this endpoint to:
      - List or retrieve file entries (`GET /model-files/`, `GET /model-files/{id}/`)
      - Upload a single file to an existing model (`POST /model-files/` with `model` and `file`)
      - Update a file metadata or replace the file (`PUT/PATCH /model-files/{id}/`)
      - Delete a specific file without touching the parent AIModel (`DELETE /model-files/{id}/`)

    Permissions:
      - Only users with admin privileges (IsAdminUser) can access.
    """
    queryset = AIModelFile.objects.all()
    serializer_class = AIModelFileSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    http_method_names = ['get', 'post', 'delete']

    @extend_schema(
        request=AIModelFileRenameSerializer,
        responses=AIModelFileSerializer
    )
    @action(
        detail=True,
        methods=['post'],
        url_path='rename',
        serializer_class=AIModelFileRenameSerializer
    )
    def rename(self, request, pk=None):
        """
        POST /model-files/{id}/rename/
        Body: { "new_name": "my_new_filename.txt" }
        """
        instance = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        new_name = serializer.validated_data['new_name']


        old_fs_path = instance.file.path
        directory = os.path.dirname(old_fs_path)


        old_ext = os.path.splitext(old_fs_path)[1]
        if not new_name.lower().endswith(old_ext.lower()):
            new_filename = new_name + old_ext
        else:
            new_filename = new_name

        new_fs_path = os.path.join(directory, new_filename)


        os.rename(old_fs_path, new_fs_path)


        folder = os.path.dirname(instance.file.name)
        instance.file.name = os.path.join(folder, new_filename)

        instance.save()


        return Response(
            AIModelFileSerializer(instance, context={'request': request}).data,
            status=status.HTTP_200_OK
        )

class AdminRadiologyOptionsView(APIView):
    """
    Returns JSON of all RadiologyModality objects
    each with the list of BodyAnatomicalRegion’s.

    Response format:
    [
      {
        "modality": { "id": 2, "name": "X-ray" },
        "regions": [
          { "id": 3, "name": "Chest" },
          { "id": 5, "name": "Abdomen" }
        ]
      },
      ...
    ]
    """
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        # get all RadiologyDetails that have an active model
        active_details = RadiologyDetails.objects.select_related('radio_mod', 'body_ana').distinct()

        # group by modality
        grouping = {}
        for det in active_details:
            mod = det.radio_mod
            reg = det.body_ana
            grouping.setdefault(mod, set()).add(reg)

        data = []
        for mod, regs in grouping.items():
            data.append({
                "modality": {"id": mod.id, "name": mod.name},
                "regions": [{"id": r.id, "name": r.name} for r in regs]
            })

        return Response(data)


class RadiologyDetailsViewSet(viewsets.ModelViewSet):
    """
    CRUD for RadiologyDetails (links between a modality and an anatomical region).

    list     GET    /radiology-details/
    retrieve GET    /radiology-details/{id}/
    create   POST   /radiology-details/
    update   PUT    /radiology-details/{id}/
    partial  PATCH  /radiology-details/{id}/
    destroy  DELETE /radiology-details/{id}/
    """
    queryset         = RadiologyDetails.objects.all()
    serializer_class = RadiologyDetailsSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]