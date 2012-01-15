#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import subprocess, unittest2

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.config.values.standard import UserCredentials


class UserCredentialsTest(unittest2.TestCase):

    def test_has_deployment_user_name(self):
        """fab.tests.config.values.user_credentials_test  Has deployment user name"""

        self.assertEqual(subprocess.check_output('whoami').strip(), UserCredentials().deployment_user)

    def test_has_ssh_id_file_path(self):
        """fab.tests.config.values.user_credentials_test  Has SSH ID file path"""

        self.assertEqual(UserCredentials.DEFAULT_SSH_ID_PATH, UserCredentials().ssh_id_file_path)


def suite():
    return TestSuiteLoader().load_tests_from(UserCredentialsTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
