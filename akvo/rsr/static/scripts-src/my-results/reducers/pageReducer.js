/*
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please see
    < http://www.gnu.org/licenses/agpl.html >.
*/


export const
    PAGE_SET_DATA = "PAGE_SET_DATA";

export default function pageReducer(state={}, action) {
    switch(action.type) {
        case PAGE_SET_DATA: {
            const data = action.payload.data;
            state = data;
            break;
        }
    }
    return state;
}
