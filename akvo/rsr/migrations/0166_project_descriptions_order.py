# -*- coding: utf-8 -*-
# Generated by Django 1.11.22 on 2019-09-25 09:44
from __future__ import unicode_literals

import django.contrib.postgres.fields.jsonb
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0165_auto_20190515_1205'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='descriptions_order',
            field=django.contrib.postgres.fields.jsonb.JSONField(default=[b'project_plan_summary', b'goals_overview', b'background', b'current_status', b'target_group', b'project_plan', b'sustainability']),
        ),
    ]
