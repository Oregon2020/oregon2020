import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
    Grid,
    GridColumn,
    GridRow,
    Segment
} from 'semantic-ui-react'

import Header from './Header'

const Layout = (props) => {
    const { isPageLoading } = props
    return (
        <Segment
            id="Layout"
            basic
            disabled={isPageLoading}
            loading={isPageLoading}
        >
            <Grid id="LayoutGrid">
                <GridRow id="HeaderRow">
                    <GridColumn>
                        <Header />
                    </GridColumn>
                </GridRow>
                <GridRow id="ContentRow">
                    <Segment basic textAlign="center" style={{ width: '100%' }}>
                        Coming soon...
                    </Segment>
                </GridRow>
            </Grid>
        </Segment>
    )
}

Layout.contextTypes = {
    store: PropTypes.object.isRequired
}

Layout.propTypes = {
    // redux props
    isPageLoading: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
    isPageLoading: state.getIn(['page', 'isLoading'])
})

export default withRouter(connect(mapStateToProps)(Layout))
