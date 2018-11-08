import json
from django.utils.html import escape

import pytest

from ..templatetags.api_bootstrap import serialize


@pytest.mark.django_db
def test_serialize(user_factory):
    user = user_factory(
        email='template_tags@example.com',
        username='template_tags@example.com',
    )
    actual = serialize(user)
    expected = escape(json.dumps({
        'id': str(user.id),
        'username': 'template_tags@example.com',
        'email': 'template_tags@example.com',
        'valid_token_for': 'https://example.com',
        'org_name': 'Sample Org',
        'org_type': 'Developer Edition',
        'is_staff': False,
    }))
    assert actual == expected
