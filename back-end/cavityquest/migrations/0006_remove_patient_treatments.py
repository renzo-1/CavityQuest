# Generated by Django 4.2.2 on 2023-08-19 04:35

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('cavityquest', '0005_alter_patient_treatments'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='patient',
            name='treatments',
        ),
    ]
