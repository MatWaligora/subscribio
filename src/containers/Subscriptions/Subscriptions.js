import React, {Component} from 'react';
import {connect} from 'react-redux';
import Subscription from '../../components/Subscription/Subscription';
import Spinner from '../../components/Ui/Spinner/Spinner';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import * as actions from "../../store/actions";
import Chart from "../Chart/Chart";

class Subscriptions extends Component {
  componentDidMount() {
    this.props.onFetchSubscriptions();
  }

  loginHandler = () => {
    this.props.history.push('/auth');
  };

  render() {
    let subs = <TransitionGroup>
      {
        this.props.subscriptions.map((subscription, index) => {
          return (
              <CSSTransition
                key={subscription.id}
                timeout={500}
                classNames="fade">
                <Subscription {...subscription} edit={this.props.handleEdit}/>
              </CSSTransition>
          )
        })
      }
    </TransitionGroup>;

    if (!this.props.isAuthenticated) {
      subs = (<div>
        <h3>Please login to see your subscriptions</h3>
        <button className="Button" onClick={this.loginHandler}>Go to login</button>
        </div>)
    } else if (this.props.fetchingData) {
      subs = <Spinner/>
    }

    return (
      <div>
        {this.props.error}
        {subs}
        <div className="Subscription Subscription-new" onClick={this.props.addNewSubscription}>
          <p className="Subscription-new">Add new</p>
        </div>
        <Chart/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    subscriptions: state.sub.subscriptions,
    fetchingData: state.sub.loading,
    error: state.sub.error,
    token: state.auth.token,
    isAuthenticated: state.auth.token !== null,
    userId: state.auth.userId
  }
};

const mapDispatchToProps = dispatch => {
  return {
    addNewSubscription: () => dispatch(actions.setFreshEditedSubscription()),
    onFetchSubscriptions: () => dispatch(actions.fetchSubscriptions()),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Subscriptions);
