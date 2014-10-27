# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rsr.models import Project
from akvo.utils import pagination

from django.shortcuts import get_object_or_404, render


def directory(request):
    projects_list = Project.objects.published()
    page = request.GET.get('page')

    page, paginator, page_range = pagination(page, projects_list, 10)

    context = {
        'page': page,
        'paginator': paginator,
        'page_range': page_range,
        }
    return render(request, 'project_directory.html', context)


def main(request, project_id):
    context = {'project': get_object_or_404(Project, pk=project_id)}
    return render(request, 'project_main.html', context)


def search(request):
    context = {'projects': Project.objects.published()}
    return render(request, 'project_search.html', context)
