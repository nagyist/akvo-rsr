#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import imp, mox, os

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.config.rsr.database import RSRDatabaseConfig
from fab.format.timestamp import TimeStampFormatter

CONFIG_VALUES_TEMPLATE_PATH = os.path.realpath(os.path.join(os.path.dirname(__file__), '../../../config/values.py.template'))
imp.load_source('config_values', CONFIG_VALUES_TEMPLATE_PATH)

from config_values import DatabaseAdminConfigValues


class RSRDatabaseConfigTest(mox.MoxTestBase):

    def setUp(self):
        super(RSRDatabaseConfigTest, self).setUp()
        self.database_admin_config_values = DatabaseAdminConfigValues()
        self.mock_time_stamp_formatter = self.mox.CreateMock(TimeStampFormatter)

        self.database_config = RSRDatabaseConfig(self.database_admin_config_values, self.mock_time_stamp_formatter)

    def test_can_create_instance(self):
        """fab.tests.config.rsr.database_config_test  Can create RSRDatabaseConfig instance"""

        self.assertIsInstance(RSRDatabaseConfig.create_instance(), RSRDatabaseConfig)

    def test_has_admin_login_user_name(self):
        """fab.tests.config.rsr.database_config_test  Has admin login user name"""

        self.assertEqual(self.database_admin_config_values.admin_user, self.database_config.admin_user)

    def test_has_admin_login_password(self):
        """fab.tests.config.rsr.database_config_test  Has admin login password"""

        self.assertEqual(self.database_admin_config_values.admin_password, self.database_config.admin_password)


def suite():
    return TestSuiteLoader().load_tests_from(RSRDatabaseConfigTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
