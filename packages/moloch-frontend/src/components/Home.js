import React from 'react';
import { Grid, Button, Segment } from "semantic-ui-react";
import { Link } from 'react-router-dom';
import Graph from './Graph';
import moment from 'moment';

import { connect } from 'react-redux';
import { fetchMemberDetail, fetchMembers, fetchConfigFounders, fetchProposals } from '../action/actions';

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totalMembers: 0,
      totalProposals: 0,
    }
  }

  componentDidMount() {
    if (localStorage.getItem('loggedUser')) {
      let loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
      this.props.fetchMemberDetail(loggedUser.address)
        .then((responseJson) => {
          if (responseJson.type === 'FETCH_MEMBER_DETAIL_SUCCESS') {
            loggedUser.shares = responseJson.items.member.shares;
            loggedUser.status = responseJson.items.member.status;
            localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
          }
        })
    }

    this.props.fetchMembers()
      .then((responseJson) => {
        this.setState({ totalMembers: this.state.totalMembers + responseJson.items.length })
      });
    this.props.fetchConfigFounders()
      .then((responseJson) => {
        this.setState({ totalMembers: this.state.totalMembers + responseJson.items.length })
      });

    let proposalParams = {
      currentDate: moment(new Date()).format('YYYY-MM-DD')
    }
    let self = this;
    this.props.fetchProposals(proposalParams)
      .then((responseJson) => {
        if (responseJson.items && Object.keys(responseJson.items).length > 0) {
          // eslint-disable-next-line array-callback-return
          Object.keys(responseJson.items).map((key, idx) => {
            self.setState({ totalProposals: self.state.totalProposals+=responseJson.items[key].length });
          })
        }
      })
  }

  render() {
    return (
      <div id="homepage">
        <Grid columns={16} verticalAlign="middle">
          <Grid.Column mobile={16} tablet={6} computer={4} className="guild_value" >
            <Link to='/guildbank' className="text_link">
              <p className="subtext">Guild Bank Value</p>
              <p className="amount">$53,640,918</p>
            </Link>
          </Grid.Column>
          <Grid.Column mobile={16} tablet={10} computer={8} textAlign="center" className="browse_buttons" >
            <Link to='/members' className="link">
              <Button size='large' color='grey' className='btn_link'>{this.state.totalMembers} Members</Button>
            </Link>
            <Link to='/proposals' className="link">
              <Button size='large' color='grey' className='btn_link'>{this.state.totalProposals} Proposals</Button>
            </Link>
          </Grid.Column>

          <Grid.Column computer={4} />

          <Grid.Column width={16}>
            <Segment className="blurred box">
              <Grid columns="equal" className="graph_values">
                <Grid.Column textAlign="left">
                  <p className="subtext">Total Voting Shares</p>
                  <p className="amount">378</p>
                </Grid.Column>
                <Grid.Column textAlign="center">
                  <p className="subtext">Total Loot Tokens</p>
                  <p className="amount">541</p>
                </Grid.Column>
                <Grid.Column textAlign="right">
                  <p className="subtext">Loot Token Value</p>
                  <p className="amount">128 USD</p>
                </Grid.Column>
              </Grid>
              <div className="graph">
                <Graph></Graph>
              </div>
            </Segment>
          </Grid.Column>
        </Grid>

      </div>
    )
  }
}

// This function is used to convert redux global state to desired props.
function mapStateToProps(state) {
  return {};
}

// This function is used to provide callbacks to container component.
function mapDispatchToProps(dispatch) {
  return {
    fetchMemberDetail: function (id) {
      return dispatch(fetchMemberDetail(id));
    },
    fetchMembers: function () {
      return dispatch(fetchMembers());
    },
    fetchConfigFounders: function () {
      return dispatch(fetchConfigFounders());
    },
    fetchProposals: function (params) {
      return dispatch(fetchProposals(params));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);