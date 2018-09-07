import React from 'react'
import c3 from 'c3'
import PropTypes from 'prop-types'
import {
    Card,
    Grid,
    Header,
    Image,
    Segment,
    Table
} from 'semantic-ui-react'

class Candidate extends React.Component {
    componentDidMount() {        
        this.sectorPieChartContainer.appendChild(
            c3.generate({
                data: {
                    columns: Object.entries(this.props.finance.sector),
                    type: 'pie'
                }
            }).element
        )

        this.industryPieChartContainer.appendChild(
            c3.generate({
                data: {
                    columns: Object.entries(this.props.finance.industry),
                    type: 'pie'
                }
            }).element
        )
        
        this.topContributorsPieChartContainer.appendChild(
            c3.generate({
                data: {
                    columns: Object.entries(this.props.finance.top_contributors),
                    type: 'pie'
                }
            }).element
        )
    }

    render() {
        const {
            photo,
            name,
            office,
            bills,
            allBills
        } = this.props

        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={3}>
                        <Segment basic>
                            <Card>
                                <Image src={photo} fluid />
                                <Card.Content>
                                    <Card.Header>{name}</Card.Header>
                                    <Card.Description>{office}</Card.Description>
                                </Card.Content>
                            </Card>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column width={8}>
                        <Segment basic>
                            <Header>
                                Sector
                            </Header>
                            <div ref={c => this.sectorPieChartContainer = c} />
                        </Segment>
                        <Segment basic>
                            <Header>
                                Industry
                            </Header>
                            <div ref={c => this.industryPieChartContainer = c} />
                        </Segment>
                        <Segment basic>
                            <Header>
                                Top Contributors
                            </Header>
                            <div ref={c => this.topContributorsPieChartContainer = c} />
                        </Segment>
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <Segment basic>
                            <Table>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>
                                            Bill Number
                                        </Table.HeaderCell>
                                        <Table.HeaderCell>
                                            Title
                                        </Table.HeaderCell>
                                        <Table.HeaderCell>
                                            Vote
                                        </Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {Object.entries(bills).map(([id, vote]) => (
                                        <Table.Row key={id}>
                                            <Table.Cell>
                                                {id}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {allBills[id]}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {vote}
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

Candidate.propTypes = {
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    photo: PropTypes.string.isRequired,
    office: PropTypes.string.isRequired,
    bills: PropTypes.shape({}).isRequired,
    allBills: PropTypes.shape({}).isRequired
}

export default Candidate
