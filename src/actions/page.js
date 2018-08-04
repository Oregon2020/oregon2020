export const ACTIONS = {
    SET_LOADING_STATUS: 'SET_LOADING_STATUS'
}

export const setLoadingStatus = loadingStatus => ({
    type: ACTIONS.SET_LOADING_STATUS,
    loadingStatus
})
