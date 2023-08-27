from django.contrib import admin
from .models import Patient, ImageUpload, Clinic, Dentist

# Register your models here.


class ImageUploadInline(admin.TabularInline):
    model = ImageUpload
    extra = 1


class ClinicInline(admin.TabularInline):
    model = Clinic


class DentistsInline(admin.TabularInline):
    model = Dentist


class PatientInline(admin.TabularInline):
    model = Patient


class ClinicAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    inlines = [PatientInline, DentistsInline]


class DentistAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')


class PatientAdmin(admin.ModelAdmin):
    list_display = ('id', 'clinic', 'first_name', 'middle_name', 'last_name', 'gender', 'date_of_birth', 'address', 'contact_number',
                    'date_added', 'date_modified', 'doctors_note', 'dentist', 'treatments')
    inlines = [ImageUploadInline]


class ImageUploadAdmin(admin.ModelAdmin):
    list_display = ('image', 'patient', 'date_created')


admin.site.register(Clinic, ClinicAdmin)
admin.site.register(Dentist, DentistAdmin)
admin.site.register(Patient, PatientAdmin)
admin.site.register(ImageUpload, ImageUploadAdmin)
