# Generated by Django 2.1.5 on 2019-02-12 20:39

from django.db import migrations
from sfdo_template_helpers.crypto import fernet_decrypt, fernet_encrypt


def forwards(apps, schema_editor):
    SocialToken = apps.get_model("socialaccount", "SocialToken")

    for token in SocialToken.objects.all():
        token.token = fernet_encrypt(token.token)
        token.token_secret = fernet_encrypt(token.token_secret)
        token.save()


def backwards(apps, schema_editor):
    SocialToken = apps.get_model("socialaccount", "SocialToken")

    for token in SocialToken.objects.all():
        token.token = fernet_decrypt(token.token)
        token.token_secret = fernet_decrypt(token.token_secret)
        token.save()


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0049_add_all_other_translations"),
        ("socialaccount", "0003_extra_data_default_dict"),
    ]

    operations = [migrations.RunPython(forwards, backwards)]
