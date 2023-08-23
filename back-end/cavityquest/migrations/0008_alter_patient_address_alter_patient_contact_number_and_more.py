# Generated by Django 4.2.2 on 2023-08-19 04:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cavityquest', '0007_patient_treatments'),
    ]

    operations = [
        migrations.AlterField(
            model_name='patient',
            name='address',
            field=models.CharField(max_length=120),
        ),
        migrations.AlterField(
            model_name='patient',
            name='contact_number',
            field=models.CharField(max_length=11),
        ),
        migrations.AlterField(
            model_name='patient',
            name='doctors_note',
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name='patient',
            name='first_name',
            field=models.CharField(max_length=50),
        ),
        migrations.AlterField(
            model_name='patient',
            name='gender',
            field=models.CharField(choices=[('Male', 'Male'), ('Female', 'Female')], max_length=6),
        ),
        migrations.AlterField(
            model_name='patient',
            name='last_name',
            field=models.CharField(max_length=50),
        ),
        migrations.AlterField(
            model_name='patient',
            name='middle_name',
            field=models.CharField(max_length=50),
        ),
        migrations.AlterField(
            model_name='patient',
            name='treatments',
            field=models.JSONField(blank=True),
        ),
    ]
