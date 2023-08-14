from django.db import models
# Create your models here.


class Patient(models.Model):
    GENDER_CHOICES = [('Male', 'Male'), ('Female', 'Female')]

    id = models.AutoField(primary_key=True, auto_created=True)
    first_name = models.CharField(max_length=50, null=True)
    middle_name = models.CharField(max_length=50, null=True)
    last_name = models.CharField(max_length=50, null=True)
    gender = models.CharField(
        max_length=6, choices=GENDER_CHOICES, null=True)
    date_of_birth = models.DateField(null=True)
    address = models.CharField(max_length=120, null=True)
    contact_number = models.CharField(max_length=11, null=True)
    date_added = models.DateField(auto_now=True)
    date_modified = models.DateField(auto_now=True)
    doctors_note = models.TextField(null=True, blank=True)

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
        return f"{self.patient.id}_{self.patient.last_name}"
