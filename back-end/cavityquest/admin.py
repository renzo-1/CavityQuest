from django.contrib import admin
from .models import Patient, ImageUpload

# Register your models here.


class ImageUploadInline(admin.TabularInline):
    model = ImageUpload
    extra = 1


class PatientAdmin(admin.ModelAdmin):
    list_display = ('id', 'first_name', 'middle_name', 'last_name', 'gender', 'date_of_birth', 'address', 'contact_number',
                    'date_added', 'date_modified', 'doctors_note', 'image_uploads')
    inlines = [ImageUploadInline]


class ImageUploadAdmin(admin.ModelAdmin):
    list_display = ('image', 'patient', 'date_created')


admin.site.register(Patient, PatientAdmin)
admin.site.register(ImageUpload, ImageUploadAdmin)
