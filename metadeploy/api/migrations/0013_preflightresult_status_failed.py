# Generated by Django 2.1.2 on 2018-10-24 18:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_product_blank_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='preflightresult',
            name='status',
            field=models.CharField(
                choices=[
                    ('started', 'started'),
                    ('complete', 'complete'),
                    ('failed', 'failed'),
                ],
                default='started',
                max_length=64,
            ),
        ),
    ]
