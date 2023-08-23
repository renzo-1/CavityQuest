from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from base64 import b64decode, b64encode
# Create your views here.
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import PatientSerializer, ImageUploadSerializer
from .models import Patient, ImageUpload
from django.core.files.base import ContentFile

# Create your views here.


# def isBase64(s):
#     try:
#         return b64encode(b64decode(s)) == s
#     except Exception:
#         print('false')

#         return False


def base64_file(data, name=None):
    _format, _img_str = data.split(';base64,')
    _name, ext = _format.split('/')
    if not name:
        name = _name.split(":")[-1]
    return ContentFile(b64decode(_img_str), name='{}.{}'.format(name, ext))


class PatientsViewset(viewsets.ModelViewSet):
    serializer_class = PatientSerializer
    queryset = Patient.objects.all()

    def create(self, request, format=None):
        patient_data = request.data.copy()
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
                    print('file', newFile)

                    ImageUpload.objects.create(
                        patient=patientInstance, image=newFile)

                headers = self.get_success_headers(self.get_serializer)
                return Response('Image upload success', status=status.HTTP_202_ACCEPTED, headers=headers)

            else:
                data = request.data
                print(data)
                serializer = self.get_serializer(
                    patientInstance, data=data, partial=True)
                serializer.is_valid(raise_exception=True)
                print('hello1')
                serializer.save()
                headers = self.get_success_headers(self.get_serializer)
                return Response('Edit succes', status=status.HTTP_202_ACCEPTED, headers=headers)
        except:
            return Response({'message': 'Error editing patient data.'}, status=status.HTTP_400_BAD_REQUEST)


class ImageUploadViewSet(viewsets.ModelViewSet):
    queryset = ImageUpload.objects.all()
    serializer_class = ImageUploadSerializer
    parser_classes = (MultiPartParser, FormParser)
