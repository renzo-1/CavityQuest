from django.db import models
from django import forms

# Create your models here.

treatments = ["Dental Braces", "Tooth Extraction", "Crown", "Veneers",
              "Partial Denture", "Full Denture", "Wisdom Tooth Surgery"]


class Clinic(models.Model):
    id = models.AutoField(primary_key=True, auto_created=True)
    name = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.id}"


class Dentist(models.Model):
    name = models.CharField(max_length=50)

    id = models.AutoField(primary_key=True, auto_created=True)

    clinic = models.ForeignKey(
        Clinic, on_delete=models.CASCADE, related_name='%(class)s_clinic')

    def __str__(self):
        return f"{self.id}"


class Patient(models.Model):
    GENDER_CHOICES = [('Male', 'Male'), ('Female', 'Female')]

    clinic = models.ForeignKey(
        Clinic, on_delete=models.CASCADE, related_name='%(class)s_clinic')

    dentist = models.ForeignKey(
        Dentist, on_delete=models.CASCADE, related_name="dentist", null=True, blank=True)

    id = models.AutoField(primary_key=True, auto_created=True)
    first_name = models.CharField(max_length=50)
    middle_name = models.CharField(max_length=50, null=True, blank=True)
    last_name = models.CharField(max_length=50)
    gender = models.CharField(
        max_length=6, choices=GENDER_CHOICES)
    date_of_birth = models.DateField(null=True)
    address = models.CharField(max_length=120)
    contact_number = models.CharField(max_length=11)
    date_added = models.DateField(auto_now=True)
    date_modified = models.DateField(auto_now=True)
    doctors_note = models.TextField(blank=True)
    treatments = models.JSONField(null=True, blank=True, default=list)

    def __str__(self):
        return f"{self.id}"


def content_file_name(instance, filename):
    # file will be uploaded to MEDIA_ROOT/<patientname>/<filename>
    folder_name = instance.patient.first_name + "_" + \
        instance.patient.middle_name + "_" + instance.patient.middle_name

    return f"{folder_name}/{filename}"


class ImageUpload(models.Model):
    patient = models.ForeignKey(
        Patient, on_delete=models.CASCADE, related_name="image_uploads")

    image = models.ImageField(
        upload_to=content_file_name, default=None)

    date_created = models.DateField(auto_now=True)

    def __str__(self):
        return f"{self.patient}"
