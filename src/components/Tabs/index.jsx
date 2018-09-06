import React from 'react'
import { Tab } from 'semantic-ui-react'

import US_HOUSE_DATA from '../../data/us_house.json'
import Overview from './Overview'

const panes = [
    { menuItem: 'US House', render: () => <Tab.Pane><Overview data={US_HOUSE_DATA} /></Tab.Pane> }
]

const Tabs = () => <Tab panes={panes} />

export default Tabs
