#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import unittest2

from testing.helpers.execution import TestSuiteLoader, TestRunner

from fab.os.linux.packageinfo import UbuntuPackageInfo


class UbuntuPackageInfoTest(unittest2.TestCase):

    def setUp(self):
        self.package_info = UbuntuPackageInfo.from_text(self._installed_package_info_full())

    def test_can_parse_package_info_text(self):
        """fab.tests.os.linux.ubuntu_package_info_test  Can parse package info text"""

        self.assertIsInstance(self.package_info, UbuntuPackageInfo)

    def test_can_determine_equality_between_package_info_instances(self):
        """fab.tests.os.linux.ubuntu_package_info_test  Can determine equality between package info instances"""

        package_info1a = UbuntuPackageInfo('package1', '1:1.1', 'installed')
        package_info1b = UbuntuPackageInfo('package1', '1:1.1', 'installed')

        self.assertEqual(package_info1a, package_info1a, "Same instance should be equal to itself")
        self.assertNotEqual(UbuntuPackageInfo('package1', '1:1.1', 'installed'),
                            UbuntuPackageInfo('package2', '1:1.1', 'installed'),
                            "Instances should not be equal when package names differ")
        self.assertNotEqual(UbuntuPackageInfo('package1', '1:1.1', 'installed'),
                            UbuntuPackageInfo('package1', '1:2.1', 'installed'),
                            "Instances should not be equal when package versions differ")
        self.assertNotEqual(UbuntuPackageInfo('package1', '1:1.1', 'installed'),
                            UbuntuPackageInfo('package1', '1:1.1', 'not installed'),
                            "Instances should not be equal when package installation states differ")
        self.assertEqual(package_info1a, package_info1b, "Different instances with same package name, version and state should be equal")

    def test_has_expected_package_info_members(self):
        """fab.tests.os.linux.ubuntu_package_info_test  Has expected package info members"""

        self.assertEqual("g++", self.package_info.name)
        self.assertEqual("4:4.2.3-1ubuntu6", self.package_info.version)
        self.assertEqual("installed", self.package_info.state)
        self.assertEqual("g++ (4:4.2.3-1ubuntu6)", self.package_info.name_and_installed_version)

    def test_can_parse_package_version_with_colons(self):
        """fab.tests.os.linux.ubuntu_package_info_test  Can parse package version with colons"""

        self.assertEqual("4:4.2.3-1ubuntu6", self.package_info.version)

    def test_can_recognise_an_installed_package(self):
        """fab.tests.os.linux.ubuntu_package_info_test  Can recognise an installed package"""

        self.assertTrue(self.package_info.is_installed(), "Should recognise an installed package")

    def test_can_recognise_a_package_that_is_not_installed(self):
        """fab.tests.os.linux.ubuntu_package_info_test  Can recognise a package that is not installed"""

        self.assertFalse(UbuntuPackageInfo.from_text(self._not_installed_package_info_partial()).is_installed(),
                         "Should recognise a package that is not installed")

    def test_name_and_installed_version_member_should_display_version_if_package_is_installed(self):
        """fab.tests.os.linux.ubuntu_package_info_test  The name_and_installed_version member should display version if package is installed"""

        self.assertTrue(self.package_info.is_installed(), "Package state should be 'installed'")
        self.assertEqual("g++ (4:4.2.3-1ubuntu6)", self.package_info.name_and_installed_version)

    def test_name_and_installed_version_member_should_display_none_if_package_is_not_installed(self):
        """fab.tests.os.linux.ubuntu_package_info_test  The name_and_installed_version member should display state if package is not installed"""

        not_installed_package_info = UbuntuPackageInfo.from_text(self._not_installed_package_info_partial())

        self.assertFalse(not_installed_package_info.is_installed(), "Package state should be 'not installed'")
        self.assertEqual("g++ (not installed)", not_installed_package_info.name_and_installed_version)

    def _installed_package_info_full(self):
        return "\r\n".join(["Package: g++",
                            "State: installed",
                            "Automatically installed: no",
                            "Version: 4:4.2.3-1ubuntu6",
                            "Priority: optional",
                            "Section: devel",
                            "Maintainer: Ubuntu Core developers <ubuntu-devel-discuss@lists.ubuntu.com>",
                            "Uncompressed Size: 41.0k",
                            "Depends: cpp (>= 4:4.2.3-1ubuntu6), g++-4.2 (>= 4.2.3-1), gcc (>= 4:4.2.3-1ubuntu6), gcc-4.2 (>= 4.2.3-1)",
                            "Suggests: g++-multilib",
                            "Provides: c++-compiler",
                            "Description: The GNU C++ compiler",
                            " This is the GNU C++ compiler, a fairly portable optimizing compiler for C++. ",
                            " ",
                            " This is a dependency package providing the default GNU C++ compiler."])

    def _not_installed_package_info_partial(self):
        return "\r\n".join(["Package: g++",
                            "State: not installed",
                            "Automatically installed: no",
                            "Version: 4:4.2.3-1ubuntu6",
                            "Priority: optional"])


def suite():
    return TestSuiteLoader().load_tests_from(UbuntuPackageInfoTest)

if __name__ == "__main__":
    from fab.tests.test_settings import TEST_MODE
    TestRunner(TEST_MODE).run_test_suite(suite())
