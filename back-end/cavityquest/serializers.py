from rest_framework import serializers
from .models import Patient, ImageUpload


class ImageUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageUpload
        fields = '__all__'


class PatientSerializer(serializers.ModelSerializer):
    image_uploads = ImageUploadSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Patient
        fields = '__all__'
