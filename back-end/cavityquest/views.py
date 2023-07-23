from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse

# Create your views here.
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import PatientSerializer, ImageUploadSerializer
from .models import Patient, ImageUpload
from django.core.files.base import ContentFile

# Create your views here.


class PatientsViewset(viewsets.ModelViewSet):
    serializer_class = PatientSerializer
    queryset = Patient.objects.all()

    def create(self, request, format=None):
        patient_data = request.data.copy()
        image_uploads = request.FILES.getlist('image_uploads[]')
        print(image_uploads)
        serializer = PatientSerializer(data=patient_data)

        if serializer.is_valid():
            serializer.save()
            headers = self.get_success_headers(serializer.data)
            if image_uploads:
                patient = serializer.instance
                for img in image_uploads:
                    ImageUpload.objects.create(patient=patient, image=img)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        else:
            return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST, headers=headers)
        

class ImageUploadViewSet(viewsets.ModelViewSet):
    queryset = ImageUpload.objects.all()
    serializer_class = ImageUploadSerializer
    parser_classes = (MultiPartParser, FormParser)