import { ACTIONS } from '../actions/page'

const PAGE_STATE = {
    isLoading: false
}

const page = (state, action) => {
    switch (action.type) {
        case ACTIONS.SET_LOADING_STATUS:
            return state.set('isLoading', action.loadingStatus)
        default:
            return state
    }
}

export { page, PAGE_STATE }
