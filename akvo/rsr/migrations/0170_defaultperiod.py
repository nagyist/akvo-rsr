# -*- coding: utf-8 -*-
# Generated by Django 1.11.23 on 2019-12-09 12:30
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


def create_default_periods(apps, schema_editor):
    Indicator = apps.get_model('rsr', 'Indicator')
    DefaultPeriod = apps.get_model('rsr', 'DefaultPeriod')
    project_ids = set(Indicator.objects.filter(default_periods=True).values_list(
        'result__project_id', flat=True))

    for project_id in project_ids:
        default_indicator = Indicator.objects.filter(default_periods=True, result__project_id=project_id).first()
        default_periods = [
            DefaultPeriod(project_id=project_id, period_start=period.period_start, period_end=period.period_end)
            for period in default_indicator.periods.all()
        ]
        DefaultPeriod.objects.bulk_create(default_periods)

    Project = apps.get_model('rsr', 'Project')

    def project_parents(project_id):
        parents = (
            Project.objects.filter(related_projects__related_project_id=project_id,
                                   related_projects__relation=u'2') |
            Project.objects.filter(related_to_projects__project_id=project_id,
                                   related_to_projects__relation=u'1')
        ).distinct()
        return parents

    for project_id in project_ids:
        parents = project_parents(project_id)
        if not parents.exists():
            continue
        parent_id = parents.first().pk
        parent_default_periods = DefaultPeriod.objects.filter(project=parent_id)
        for period in DefaultPeriod.objects.filter(project=project_id):
            parent_period = parent_default_periods.filter(
                period_start=period.period_start, period_end=period.period_end).first()
            if parent_period is not None:
                period.parent = parent_period
                period.save(update_fields=['parent'])
            else:
                print('Count not find parent for {} in {}'.format(period, project_id))


class Migration(migrations.Migration):

    dependencies = [
        ('rsr', '0169_dropdown_custom_field'),
    ]

    operations = [
        migrations.CreateModel(
            name='DefaultPeriod',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('period_start', models.DateField(blank=True, help_text='The start date of the reporting period.', null=True, verbose_name='period start')),
                ('period_end', models.DateField(blank=True, help_text='The end date of the reporting period.', null=True, verbose_name='period end')),
                ('parent', models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='child_periods', to='rsr.DefaultPeriod', verbose_name='parent period')),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='default_periods', to='rsr.Project', verbose_name='project')),
            ],
            options={
                'ordering': ['period_start', 'period_end'],
                'verbose_name': 'default period',
                'verbose_name_plural': 'default periods',
            },
        ),
        migrations.RunPython(
            create_default_periods,
            reverse_code=lambda x, y: None,
        ),
        migrations.RemoveField(
            model_name='indicator',
            name='default_periods',
        ),
    ]
