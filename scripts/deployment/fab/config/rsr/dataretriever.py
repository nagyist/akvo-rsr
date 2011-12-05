# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os

from fab.config.values import DataHostConfigValues, DeploymentHostConfigValues
from fab.format.timestamp import TimeStampFormatter


class RSRDataRetrieverConfig(object):

    def __init__(self, deployment_host_config_values, data_host_config_values, time_stamp_formatter):
        self.time_stamp_formatter = time_stamp_formatter

        self.data_dumps_home    = os.path.join(deployment_host_config_values.deployment_processing_home, 'data_dumps')
        self.rsr_env_path       = os.path.join(data_host_config_values.virtualenvs_home, 'current')
        self.rsr_app_path       = os.path.join(data_host_config_values.django_apps_home, 'current')
        self.rsr_log_file_path  = os.path.join(deployment_host_config_values.logging_home, 'akvo.log')

    @staticmethod
    def create_instance():
        return RSRDataRetrieverConfig(DeploymentHostConfigValues(), DataHostConfigValues(), TimeStampFormatter())

    def time_stamped_rsr_data_dump_path(self):
        rsr_data_dir_name = self.time_stamp_formatter.append_timestamp("rsrdb")
        return os.path.join(self.data_dumps_home, rsr_data_dir_name)
