/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
 */

// TODO: several of these constants should be derived from the RSR settings
export const
    API_LIMIT = 100,
    // From rsr.models.indicator.IndicatorPeriodData
    UPDATE_STATUS_NEW = 'N',
    UPDATE_STATUS_DRAFT = 'D',
    UPDATE_STATUS_PENDING = 'P',
    UPDATE_STATUS_REVISION = 'R',
    UPDATE_STATUS_APPROVED = 'A',


    OBJECTS_APP = 'app',
    OBJECTS_RESULTS = 'results',
    OBJECTS_INDICATORS = 'indicators',
    OBJECTS_PERIODS = 'periods',
    OBJECTS_UPDATES = 'updates',
    OBJECTS_COMMENTS = 'comments',
    OBJECTS_USERS = 'users',

    // List of the models used in the accordion, in hierarchy order
    MODELS_LIST = [
        OBJECTS_RESULTS, OBJECTS_INDICATORS, OBJECTS_PERIODS, OBJECTS_UPDATES, OBJECTS_COMMENTS
    ],

    // Lookup of the parent FK field name on a model
    PARENT_FIELD = {
        [OBJECTS_RESULTS]: null,
        [OBJECTS_INDICATORS]: 'result',
        [OBJECTS_PERIODS]: 'indicator',
        [OBJECTS_UPDATES]: 'period',
        [OBJECTS_COMMENTS]: 'data'
    }
;

