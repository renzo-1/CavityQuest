from rest_framework import serializers
from .models import Patient, ImageUpload, Clinic, Dentist


class ImageUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageUpload
        fields = '__all__'


class PatientSerializer(serializers.ModelSerializer):
    image_uploads = ImageUploadSerializer(
        many=True,
        required=False
    )

    class Meta:
        model = Patient
        fields = '__all__'


class DentistSerializer(serializers.ModelSerializer):
    patients = PatientSerializer(
        many=True,
        required=False
    )

    class Meta:
        model = Dentist
        fields = '__all__'


class ClinicSerilizer(serializers.ModelSerializer):
    patient_clinic = PatientSerializer(
        many=True,
        required=False
    )

    dentist_clinic = DentistSerializer(
        many=True,
        required=False
    )

    class Meta:
        model = Clinic
        fields = '__all__'
