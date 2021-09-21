import React, { Component } from 'react';
import { connect } from 'react-redux';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import './scss/style.scss';
import { LoginControlApiService } from './api_service';

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const TheLayout = React.lazy(() => import('./Views/Layout/TheLayout'));

// Pages
const Login = React.lazy(() => import('./Views/Auth/Login'));
const Page404 = React.lazy(() => import('./Views/Errors/Page404'));
const Page500 = React.lazy(() => import('./Views/Errors/Page500'));

class App extends Component {
  refreshPage = () =>{
    LoginControlApiService().then(data =>{
      if(data.isSuccessful){
        this.props.dispatch({type: 'set', isAuthenticated: true });
      }else{
        this.props.dispatch({type: 'set', isAuthenticated: false});
      }
    });
  }

  componentDidMount(){
    this.refreshPage();
  }

  render() {
    return (
      <HashRouter>
          <React.Suspense fallback={loading}>
            <Switch>
              <Route exact path="/404" name="Page 404" render={props => <Page404 {...props}/>} />
              <Route exact path="/500" name="Page 500" render={props => <Page500 {...props}/>} />
              <Route exact path="/login" name="Login Page" 
                render={(props) => !this.props.isAuthenticated ? 
                  <Login {...props}/> : 
                  <Redirect from="/login" to="/dashboard"/>
                }
              />
              <Route path="/" name="Home"
                render={(props) => !this.props.isAuthenticated ?
                  <Redirect from="/" to="/login" /> :
                  <TheLayout {...props}/>
                }
              />
            </Switch>
          </React.Suspense>
      </HashRouter>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.isAuthenticated,
  loginToken: state.loginToken
});

export default connect(mapStateToProps)(App);
