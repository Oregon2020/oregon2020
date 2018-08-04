import { fromJS } from 'immutable'

import { page, PAGE_STATE } from './page'

const INITIAL_STATE = fromJS({
    page: PAGE_STATE
})

const reducers = {
    page
}

export { reducers, INITIAL_STATE }
