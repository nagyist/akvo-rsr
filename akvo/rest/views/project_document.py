# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import ProjectDocument, ProjectDocumentCategory

from ..serializers import ProjectDocumentSerializer, ProjectDocumentCategorySerializer
from ..viewsets import PublicProjectViewSet


class ProjectDocumentViewSet(PublicProjectViewSet):
    """
    """
    queryset = ProjectDocument.objects.all()
    serializer_class = ProjectDocumentSerializer
    filter_fields = ('project', 'format', 'language', 'title_language', 'document_date', )


class ProjectDocumentCategoryViewSet(PublicProjectViewSet):
    """
    """
    queryset = ProjectDocumentCategory.objects.all()
    serializer_class = ProjectDocumentCategorySerializer
    filter_fields = ('document', 'category', )
    project_relation = 'document__project__'
