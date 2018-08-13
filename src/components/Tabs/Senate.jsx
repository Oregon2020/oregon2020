import React from 'react'
import {
    Button, Dropdown, FormField, Segment, Table
} from 'semantic-ui-react'

import OR_SENATE from '../../data/or_senate.json'
import sankey from '../Diagrams/Sankey'

const FOLLOW_THE_MONEY_CATEGORIES = {
    'd-cci': { label: 'industry', accessKey: 'General_Industry', nameField: 'General_Industry' },
    'd-ccg': { label: 'sector', accessKey: 'Broad_Sector', nameField: 'Broad_Sector' },
    'd-eid': { label: 'contributor', accessKey: 'Contributor', nameField: 'Contributor' }
}

const BILLS = {}
const BILLS_DROPDOWN_OPTIONS = []

Object.values(OR_SENATE).forEach((candidate) => {
    candidate.bills.forEach((bill) => {
        const {
            billId, billNumber, office, title
        } = bill
        if (!BILLS[billId]) {
            BILLS[billId] = {
                billNumber,
                office,
                title
            }
            BILLS_DROPDOWN_OPTIONS.push({ text: title, value: billId })
        }
    })
})

// const FINANCE = {
//     industry: {},
//     sector: {},
//     contributor: {}
// }

// const SANKEY_DATA = {
//     nodes: [],
//     links: []
// }
//
// Object.values(OR_SENATE).forEach((candidate) => {
//     SANKEY_DATA.nodes.push({ name: `${candidate.firstName} ${candidate.lastName}`, type: 'candidate' })
//     const candidateNodeIdx = SANKEY_DATA.nodes.length - 1

//     Object.entries(FOLLOW_THE_MONEY_CATEGORIES).forEach(([code, { label, accessKey, nameField }]) => {
//         const category = FINANCE[label]
//         candidate.finance[code].forEach((record) => {
//             const amount = parseFloat(record.Total_$.Total_$)
//             if (category[record[accessKey].id]) {
//                 category[record[accessKey].id].total += amount
//                 if (code === 'd-ccg') {
//                     SANKEY_DATA.links.push({
//                         source: candidateNodeIdx,
//                         target: category[record[accessKey].id].nodeIdx,
//                         value: amount
//                     })
//                 }
//             } else {
//                 let target
//                 if (code === 'd-ccg') {
//                     SANKEY_DATA.nodes.push({ name: record[accessKey][nameField], type: 'sector' })
//                     target = SANKEY_DATA.nodes.length - 1
//                     SANKEY_DATA.links.push({
//                         source: candidateNodeIdx,
//                         target,
//                         value: amount
//                     })
//                 }
//                 if (code === 'd-cci') {
//                     SANKEY_DATA.nodes.push({ name: record[accessKey][nameField], type: 'industry' })
//                     target = SANKEY_DATA.nodes.length - 1
//                     SANKEY_DATA.links.push({
//                         source: candidateNodeIdx,
//                         target,
//                         value: amount
//                     })
//                 }
//                 category[record[accessKey].id] = {
//                     total: amount,
//                     name: record[accessKey][nameField],
//                     nodeIdx: target
//                 }
//             }
//         })
//     })
// })

class Senate extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            bills: Object.values(BILLS).sort((r1, r2) => r1.billNumber > r2.billNumber)
        }
    }

    componentDidMount() {
        this.renderSankey()
    }

    getData = (filter) => {
        const data = {
            nodes: [],
            links: []
        }

        let source
        if (filter && filter.type === 'candidate') {
            source = [[filter.id, OR_SENATE[filter.id]]]
        } else {
            source = Object.entries(Object.assign({}, OR_SENATE))
        }

        for (let i = source.length; i--;) {
            const [candidateId, candidate] = source[i]
            if (filter && filter.type === 'bills' && !candidate.bills.filter(b => filter.bills.indexOf(b.billId) > -1 && b.vote === 'Y').length) {
                continue
            }
            data.nodes.push(
                { name: `${candidate.firstName} ${candidate.lastName}`, type: 'candidate', id: candidateId }
            )
            const candidateNodeIdx = data.nodes.length - 1

            Object.entries(FOLLOW_THE_MONEY_CATEGORIES).forEach(([code, { accessKey, nameField }]) => {
                candidate.finance[code].forEach((record) => {
                    const amount = parseFloat(record.Total_$.Total_$)
                    if (code === 'd-ccg') {
                        if (
                            !filter ||
                            filter.type !== 'sector' ||
                            (filter.type === 'sector' && filter.id === record[accessKey].id)
                        ) {
                            const sectorName = record[accessKey][nameField]
                            let target = data.nodes.findIndex(v => v.name === sectorName)
                            if (target === -1) {
                                data.nodes.push(
                                    { name: record[accessKey][nameField], type: 'sector', id: record[accessKey].id }
                                )
                                target = data.nodes.length - 1
                            }
                            data.links.push({
                                source: candidateNodeIdx,
                                target,
                                value: amount
                            })
                        }
                    }
                })
            })
        }
        return data
    }

    renderSankey = (filter) => {
        this.setState({ hasFilter: !!filter })
        const data = this.getData(filter)
        sankey({
            container: this.sankeyContainer,
            data,
            size: {
                width: 1200,
                height: 1000
            },
            onNodeClick: this.renderSankey
        })
    }

    render() {
        return (
            <Segment basic>
                <Button
                    primary
                    floated="left"
                    disabled={!this.state.hasFilter}
                    onClick={() => this.renderSankey()}
                >
                    Clear filter
                </Button>
                <div
                    ref={(c) => { this.sankeyContainer = c }}
                    style={{ height: 'auto', width: 1200 }}
                />

                <FormField inline>
                    <label><b>Filter by Bills:</b>&nbsp;</label>
                    <Dropdown
                        multiple
                        search
                        selection
                        options={BILLS_DROPDOWN_OPTIONS}
                        onChange={(e, { value }) => this.renderSankey({ type: 'bills', bills: value })}
                    />
                </FormField>
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>
                                Bill Number
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                Title
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {Object.entries(this.state.bills).map(([billId, { billNumber, title }]) => (
                            <Table.Row key={billId}>
                                <Table.Cell>{billNumber}</Table.Cell>
                                <Table.Cell>{title}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </Segment>
        )
    }
}

export default Senate
