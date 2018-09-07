import React from 'react'
import { Header, Segment } from 'semantic-ui-react'

const Intro = () => (
    <Segment basic>
        <Header>
            About the Map the Money project
        </Header>
        <p>
            This project will visualize the flow of money from donors to public
            representatives. We’re looking at how that money influences votes
            and other actions of our representatives. This project is a
            Progressive project meaning, we are looking at all reps and
            targeting those actions that indicate support for corporate
            interest over the 99%.
        </p>
        <p>
            The data is publicly available thanks to websites like&nbsp;
            <a href="https://votesmart.org" target="_blank">Vote Smart</a>&nbsp;
            and <a href="https://opensecrets.org" target="_blank">Open Secrets</a>.&nbsp;
            The problem is, it's not presented in a way that
            makes it easy to visualize or make connections. We want to change
            that. We know money influences our representatives, we need to see
            how.
        </p>
        <p>
            Starting with Oregon’s 5 U.S. House reps, we will “Map The Money”
            to empower and inform constituents.  Here’s the plan.
        </p>

        <Header>
            Create charts and graphs to visualize the data
        </Header>

        <p>
            We’ll convert the data to show what sectors, industries, and individual donors gave to each representative in the 2018 cycle, in a way that makes it easy to see what’s going on.
        </p>

        <Header>
            Research ambiguous donors to identify who they really are and what they actually represent
        </Header>

        <p>
            There are lots of wealthy individuals that donate to reps but get coded as “uncategorized” because no one has researched them. These donors actually represent business interests that have not been mapped to their money. We will find out who they are and what they really represent.
        </p>

        <Header>
            Identify outlier votes as, “votes in question”
        </Header>

        <p>
            For the most part, votes are divided between Republican favored bills and Democrat favored bills. Occasionally, there are bills that have bipartisan support, but the ideological divide is a known, so that’s where we start. Oregon has 4 Democrat and 1 Republican U.S. House reps. In general, they vote party line. When they don’t, it’s an outlier vote. Not all of those are bad, but some sure look that way. We identify those and then start researching to build a complete picture of the bill and the votes.
        </p>

        <Header>
            Identify “bill killer” scenarios
        </Header>

        <p>
            One of the ways our reps work against us in favor of corporate donors is to “kill” a bill. This means sending a bill to committee where it gets delayed or stalled indefinitely. The reasons given are always perfectly within the bounds of the committee, but looking deeper you see more. In oregon, there is a pattern of progressive legislation coming from the House, that seems to “die” in Senate. This happens because powerful Senators who take money from corporate interests control committees that can stop bills.
        </p>

        <Header>
            Empower constituents with media
        </Header>

        <p>
            It’s not enough to present the data in a new way. We need to use it to hold our public employees accountable. We’ll create infographics and other media showing the discrepancies we find, and make them available to the public. You’ll be able to download them and we’ll make it easy to “one click share” the media with a mention to the representative in question. This gives the 99% powerful information to share and ask their reps on social media, “why did you vote against Party on this bill” or, “why did you kill this bill in committee?”.
        </p>

        <Header>
            Demo project vs. long term goal
        </Header>

        <p>
            We owe a yooge thank you to Vote Smart for one month of API access to complete our demo. We only had a few bucks and access is expensive. Once completed, we need to raise $2,500 to cover full API access for 1 year. We will ask for donations once the demo is up. If we fund API access for a year, our team will complete coding to provide data on every rep in every state. We will also continue work on outlier votes and bill killers. All Map the Money donations will go to funding ongoing API access or any professional work (i.e. coding or graphics)  needed beyond the scope of what our volunteers can do.
        </p>

        <Header>
            Who is this project?
        </Header>

        <p>
            This is a collaboration between <a href="http://advancementofdemocracy.org/index.html" target="_blank">Advancement of Democracy</a> and <a href="https://www.uphillmedia.org/" target="_blank">Uphill Media</a>. For more information contact <a href="mailto:info@uphillmedia.org">info@uphillmedia.org</a>.
        </p>
    </Segment>
)

export default Intro
