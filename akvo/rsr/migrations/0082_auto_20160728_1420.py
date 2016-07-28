# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import akvo.rsr.fields


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0081_auto_20160721_0945'),
    ]

    operations = [
        migrations.AlterField(
            model_name='crsadd',
            name='loan_status_year',
            field=models.PositiveIntegerField(help_text='CRS reporting year (CRS++ Column 1).', null=True, verbose_name='loan status year', blank=True),
        ),
        migrations.AlterField(
            model_name='fss',
            name='phaseout_year',
            field=models.PositiveIntegerField(help_text='If there are plans to phase out operations from the partner country, this shows the projected year of last disbursements.', null=True, verbose_name='phaseout year', blank=True),
        ),
        migrations.AlterField(
            model_name='fssforecast',
            name='year',
            field=models.PositiveIntegerField(help_text='The calendar year that the forward spend covers.', null=True, verbose_name='year', blank=True),
        ),
        migrations.AlterField(
            model_name='indicator',
            name='baseline_year',
            field=models.PositiveIntegerField(help_text='The year the baseline value was taken.', null=True, verbose_name='baseline year', blank=True),
        ),
        migrations.AlterField(
            model_name='project',
            name='hierarchy',
            field=models.PositiveIntegerField(blank=True, help_text='If you are reporting multiple levels of projects in RSR, you can specify whether this is a core, sub, or lower sub activity here.', null=True, verbose_name='hierarchy', choices=[(1, 'Core Activity'), (2, 'Sub Activity'), (3, 'Lower Sub Activity')]),
        ),
    ]
