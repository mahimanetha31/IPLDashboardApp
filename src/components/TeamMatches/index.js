// TeamMatches/index.js
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import LatestMatch from '../LatestMatch'
import MatchCard from '../MatchCard'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './index.css'

class TeamMatches extends Component {
  state = {
    teamBannerUrl: '',
    latestMatch: {},
    recentMatches: [],
    isLoading: true,
  }

  componentDidMount() {
    this.getTeamMatches()
  }

  getTeamMatches = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    const response = await fetch(`https://apis.ccbp.in/ipl/${id}`)
    const data = await response.json()

    const latestMatchFormatted = this.formatMatch(data.latest_match_details)
    const recentMatchesFormatted = data.recent_matches.map(this.formatMatch)

    this.setState({
      teamBannerUrl: data.team_banner_url,
      latestMatch: latestMatchFormatted,
      recentMatches: recentMatchesFormatted,
      isLoading: false,
    })
  }

  formatMatch = match => ({
    umpires: match.umpires,
    result: match.result,
    manOfTheMatch: match.man_of_the_match,
    id: match.id,
    date: match.date,
    venue: match.venue,
    competingTeam: match.competing_team,
    competingTeamLogo: match.competing_team_logo,
    firstInnings: match.first_innings,
    secondInnings: match.second_innings,
    matchStatus: match.match_status,
  })
  renderPieChart = () => {
    const {latestMatch, recentMatches} = this.state
    const totalMatches = recentMatches.length + 1
    const wonCount =
      recentMatches.filter(match => match.matchStatus === 'Won').length +
      (latestMatch.matchStatus === 'Won' ? 1 : 0)
    const lostCount =
      recentMatches.filter(match => match.matchStatus === 'Lost').length +
      (latestMatch.matchStatus === 'Lost' ? 1 : 0)
    const drawnCount = totalMatches - wonCount - lostCount
    const pieData = [
      {name: 'Won', value: wonCount},
      {name: 'Lost', value: lostCount},
      {name: 'Drawn', value: drawnCount},
    ]
    const COLORS = ['#4caf50', '#f44336', '#ffeb3b']

    return (
      <div className="pie-chart-container">
        <h2 className="pie-chart-heading">Match Statisitics</h2>
        <PieChart width={300} height={200}>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({name, percent}) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
          >
            {pieData.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </div>
    )
  }
  render() {
    const {teamBannerUrl, latestMatch, recentMatches, isLoading} = this.state
    const {history} = this.props

    const goBack = () => {
      history.push('/')
    }
    return (
      <div className="team-matches-container">
        {isLoading ? (
          <div data-testid="loader">
            <Loader type="Oval" color="#ffffff" height={50} width={50} />
          </div>
        ) : (
          <div>
           <div className="back-button-container">
              <Link to="/">
                <button type="button" onClick={goBack} className="back-button">
                  Back
                </button>
              </Link>
            </div>
            <img
              src={teamBannerUrl}
              alt="team banner"
              className="team-banner"
            />
            <LatestMatch matchDetails={latestMatch} />
            <ul className="match-cards">
              {recentMatches.map(eachMatch => (
                <MatchCard key={eachMatch.id} matchDetails={eachMatch} />
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }
}

export default TeamMatches
