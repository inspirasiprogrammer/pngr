import React, { Component } from 'react'
import { Provider, Subscribe } from 'unstated'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Redirect } from 'react-router'

import UserContainer from './Containers/User'

import Nav from './Nav/Nav'

import Home from './Routes/Home/Home'
import LogIn from './Routes/LogIn/LogIn'
import SignUp from './Routes/SignUp/SignUp'
import NoMatch from './Routes/NoMatch/NoMatch'
import Verify from './Routes/Verify/Verify'

import Dashboard from './Routes/Dashboard/Dashboard'
import PostsCreate from './Routes/PostsCreate/PostsCreate'

const PrivateRoute = ({ component: C, ...rest }) => (
  <Route {...rest} render={(props) => (
    <Subscribe to={[UserContainer]}>
      {userContainer => {
        if (userContainer.state.user.id > 0) {
          return <C {...props} />
        } else {
          return <Redirect to={{
            pathname: '/login',
            state: { from: props.location }
          }} />
        }
      }}
    </Subscribe>
  )} />
)

export default class App extends Component {
  render() {
    return (
      <Provider inject={[UserContainer]}>
        <Router>
          <div className="wrapper">
            <Nav/>

            <section>
              <Subscribe to={[UserContainer]}>
                {userContainer => (
                  <Switch>
                    <Route exact path="/" component={Home} />

                    <Route path="/signup" component={SignUp} />
                    <Route path="/login" render={(props) => <LogIn {...props} userContainer={userContainer}/>} />
                    <Route path="/verify/:verification" render={(props) => <Verify {...props} userContainer={userContainer}/>} />

                    <PrivateRoute path="/dashboard" component={Dashboard}/>
                    <PrivateRoute path="/posts/create" component={PostsCreate}/>

                    <Route component={NoMatch} />
                  </Switch>
                )}
              </Subscribe>
            </section>
          </div>
        </Router>
      </Provider>
    );
  }
}
