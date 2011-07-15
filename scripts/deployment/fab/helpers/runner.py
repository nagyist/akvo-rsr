# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import fabric.api
import fabric.utils


class FabricRunner(object):

    def run(self, command):
        return fabric.api.run(command)

    def sudo(self, command):
        return fabric.api.sudo(command)

    def abort(self, message):
        fabric.utils.abort(message)
