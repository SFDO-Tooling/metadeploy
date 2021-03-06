# Generated by Django 2.1.7 on 2019-03-11 21:24

from django.db import migrations
from django.utils.translation import activate
from parler.models import ParlerOptions


# We have to inline a bunch of logic from django-parler here, because
# the classes you get in a migration via apps.get_model are merely
# data-classes, for the most part, with the bare minimum of
# Django-supplied methods on them. All the logic that django-parler
# provides to handle creating translations does not come along for the
# ride.
#
# This is for good reasons, as the Django migration engine doesn't and
# can't know what state your Python code was in at the point in time
# where the migration is operating on them, but it does lead to this
# unfortunate inlining of some django-parler logic.
def get_translated_fields():
    return ["name", "welcome_text", "copyright_notice"]


def forwards(apps, schema_editor):
    Site = apps.get_model("sites", "Site")
    SiteProfile = apps.get_model("api", "SiteProfile")
    SiteProfileTranslation = apps.get_model("api", "SiteProfileTranslation")
    activate("en-us")
    SiteProfileTranslation.get_translated_fields = get_translated_fields
    SiteProfile._parler_meta = ParlerOptions(
        None,
        shared_model=SiteProfile,
        translations_model=SiteProfileTranslation,
        related_name=SiteProfileTranslation.master.field.remote_field.related_name,
    )
    for site in Site.objects.all():
        SiteProfile.objects.create(site=site, name=site.name)


def backwards(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [("api", "0062_add_site_profile")]

    operations = [migrations.RunPython(forwards, backwards)]
