# -*- coding: utf-8 -*-
#!/usr/bin/env python

"""
Script for setting all budgets with budget item 13 to 14 and remove budget item 13 (total) from RSR.
"""

import os
os.environ['DJANGO_SETTINGS_MODULE'] = 'akvo.settings'

from akvo.rsr.models import BudgetItem, BudgetItemLabel, Project


def set_budget_totals():
    '''Change all budget items with id 13 to 14'''

    print "\nGetting all budget items...\n"

    budget_items = BudgetItem.objects.filter(label_id="13")
    budgets_count = budget_items.count()

    for count, item in enumerate(budget_items, start=1):
        item.label_id = 14
        item.save()

        print "Budget item", str(item.pk), "adjusted (" + str(count), "out of", str(budgets_count) + ")..."


def remove_budgetitem_label():
    '''Remove budget item label 13 (total)'''

    BudgetItemLabel.objects.filter(id="13").delete()
    print "\nRemoved the total budget item, label 13..."


def update_budgetitem_label():
    '''Update label of budget item 14'''

    total_budget_label = BudgetItemLabel.objects.get(id="14")
    total_budget_label.label = 'total'
    total_budget_label.save()

    print "\nUpdated label of item 14 to 'total'...\n"


def update_projects():
    '''Updates all projects using the budget sum calculator'''

    print "\nGetting all projects...\n"

    projects = Project.objects.all()
    projects_count = projects.count()

    for count, project in enumerate(projects):
        project.update_budget()
        project.update_funds_needed()

        print "Updating project:", project.id, "(" + str(count), "out of", str(projects_count) + ")..."


if __name__ == '__main__':
    set_budget_totals()
    remove_budgetitem_label()
    update_budgetitem_label()
    update_projects()

    print "\nDone!\n"
