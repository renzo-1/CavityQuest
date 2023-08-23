# Generated by Django 4.2.2 on 2023-08-19 05:00

import cavityquest.models
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('cavityquest', '0012_alter_imageupload_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='imageupload',
            name='image',
            field=models.ImageField(blank=True, default=None, null=True, upload_to=cavityquest.models.content_file_name),
        ),
        migrations.AlterField(
            model_name='imageupload',
            name='patient',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='image_uploads', to='cavityquest.patient'),
        ),
    ]