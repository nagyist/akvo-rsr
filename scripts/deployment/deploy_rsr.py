#!/usr/bin/env python

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os, subprocess, sys


def exit_if_config_file_is_missing(config_file_path):
    if not os.path.exists(config_file_path):
        config_file_name = config_file_path.split('/')[-1]
        print ">> Configuration file missing: %s" % config_file_path
        print ">> Copy the %s.template file and edit as necessary" % config_file_name
        sys.exit(1)
    else:
        print ">> Found expected configuration file: %s" % config_file_path

exit_if_config_file_is_missing("deploy_rsr_config.py")
exit_if_config_file_is_missing("fab/config/values.py")
print "\r"


from deploy_rsr_config import LIVE_DATABASE_HOST, DEPLOYMENT_HOST, USERNAME, PASSWORD


FABRIC_SCRIPTS_HOME = os.path.realpath(os.path.join(os.path.dirname(__file__), 'fab'))


def deployment_host_contains(expected_host):
    return DEPLOYMENT_HOST.lower().find(expected_host.lower()) != -1

def attempting_to_deploy_to_live_server():
    return deployment_host_contains("www.akvo.org") or (deployment_host_contains("akvo.org") and not deployment_host_contains(".akvo.org"))

def verify_configuration():
    if LIVE_DATABASE_HOST == DEPLOYMENT_HOST:
        print ">> Cannot deploy to the same host as the database host: %s" % DEPLOYMENT_HOST
        sys.exit(1)
    elif attempting_to_deploy_to_live_server():
        print ">> Deployment to live server not yet supported: %s" % DEPLOYMENT_HOST
        sys.exit(1)
    else:
        print ">> Fetching data from: %s" % LIVE_DATABASE_HOST
        print ">> Deploying RSR to:   %s\n" % DEPLOYMENT_HOST

def run_fab_task(fully_qualified_task, host):
    exit_code = subprocess.call(["fab", "-f", "fabfile.py", fully_qualified_task, "-H", host, "-u", USERNAME, "-p", PASSWORD])

    if exit_code > 0:
        print "\n>> Deployment failed due to errors above.\n"
        sys.exit(1)

def deploy_rsr():
    os.chdir(FABRIC_SCRIPTS_HOME)
    run_fab_task("fab.tasks.environment.linux.systempackages.verify_system_packages", DEPLOYMENT_HOST)
    run_fab_task("fab.tasks.environment.python.systempackages.update_system_python_packages", DEPLOYMENT_HOST)
    run_fab_task("fab.tasks.data.retrieval.fetch_rsr_data", LIVE_DATABASE_HOST)
    run_fab_task("fab.tasks.app.deployment.deploy_rsr_app:host_controller_mode=remote", DEPLOYMENT_HOST)
    run_fab_task("fab.tasks.environment.python.virtualenv.rsr.rebuild_rsr_env:host_controller_mode=remote", DEPLOYMENT_HOST)


if __name__ == "__main__":
    verify_configuration()
    deploy_rsr()
