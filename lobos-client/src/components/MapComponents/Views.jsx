import sc_state from '../../geojson/South_Carolina/sc_state.json'
import sc_counties from '../../geojson/South_Carolina/sc_counties.json'
import sc_congressional_districts from '../../geojson/South_Carolina/sc_congressional_districts.json'
import sc_precincts from '../../geojson/South_Carolina/sc_precincts.json'
import ut_state from '../../geojson/Utah/utah_state.json'
import ut_counties from '../../geojson/Utah/utah_counties.json'
import ut_congressional_districts from '../../geojson/Utah/utah_congressional_districts.json'
import ut_precincts from '../../geojson/Utah/utah_precincts.json'
import { States } from '../../enums'


/* Load in all the map layers? */
const views = {
    [States.SOUTH_CAROLINA]: {
        'state': sc_state,
        'county': sc_counties,
        'congressional': sc_congressional_districts,
        'precinct': sc_precincts
    },
    [States.UTAH]: {
        'state': ut_state,
        'county': ut_counties,
        'congressional': ut_congressional_districts,
        'precinct': ut_precincts
    },
    [States.NONE]: {
        'state': {
            "type" : "FeatureCollection",
            "features": [sc_state, ut_state]
        }
    }
}

export default views;