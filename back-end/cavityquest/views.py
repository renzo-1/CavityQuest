from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from base64 import b64decode, b64encode
# Create your views here.
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status

from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import PatientSerializer, ImageUploadSerializer, ClinicSerilizer, DentistSerializer
from .models import Patient, ImageUpload, Clinic, Dentist
from django.core.files.base import ContentFile
import json
from django.core import serializers

# Create your views here.


def base64_file(data, name=None):
    _format, _img_str = data.split(';base64,')
    _name, ext = _format.split('/')
    if not name:
        name = _name.split(":")[-1]
    return ContentFile(b64decode(_img_str), name='{}.{}'.format(name, ext))


class PatientsViewSet(viewsets.ModelViewSet):
    serializer_class = PatientSerializer
    queryset = Patient.objects.all()

    def create(self, request, format=None):
        patient_data = request.data
        image_uploads = request.FILES.getlist('image_uploads[]')
        serializer = self.get_serializer(data=patient_data)

        if serializer.is_valid():
            serializer.save()
            headers = self.get_success_headers(serializer.data)
            if len(image_uploads) > 0:
                patient = serializer.instance
                for img in image_uploads:
                    ImageUpload.objects.create(patient=patient, image=img)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, pk):
        patientInstance = get_object_or_404(self.get_queryset(), pk=pk)
        new_image_uploads = []

        try:
            new_image_uploads = request.data.getlist('new_image_uploads[]')
        except:
            pass

        try:
            if len(new_image_uploads) > 0:
                print('hello')
                for i, file in enumerate(new_image_uploads):
                    newFile = base64_file(file, f'detection{i}')

                    ImageUpload.objects.create(
                        patient=patientInstance, image=newFile)
                serialized_instance = serializers.serialize(
                    'json', [patientInstance])
                return Response(serialized_instance, status=status.HTTP_202_ACCEPTED, headers=None)
            else:
                print('hello1')
                data = request.data
                serializer = self.get_serializer(
                    patientInstance, data=data, partial=True)
                serializer.is_valid(raise_exception=True)
                serializer.save()
                headers = self.get_success_headers(self.get_serializer)
                return Response(serializer.data, status=status.HTTP_202_ACCEPTED, headers=headers)
        except:
            print()
            return Response({'message': 'Error editing patient data.'}, status=status.HTTP_400_BAD_REQUEST)


class ImageUploadViewSet(viewsets.ModelViewSet):
    queryset = ImageUpload.objects.all()
    serializer_class = ImageUploadSerializer
    parser_classes = (MultiPartParser, FormParser)


class ClinicViewSet(viewsets.ModelViewSet):
    queryset = Clinic.objects.all()
    serializer_class = ClinicSerilizer


class DentistViewSet(viewsets.ModelViewSet):
    queryset = Dentist.objects.all()
    serializer_class = DentistSerializer
