import React from 'react'
import { Tab } from 'semantic-ui-react'

import Senate from './Senate'

const panes = [
    { menuItem: 'OR Senate', render: () => <Tab.Pane><Senate /></Tab.Pane> },
    { menuItem: 'OR House', render: () => <Tab.Pane>Under construction...</Tab.Pane> }
]

const Tabs = () => <Tab panes={panes} />

export default Tabs
