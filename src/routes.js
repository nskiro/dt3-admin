import React from 'react'
import { Route } from 'react-router-dom'
import { ConnectedSwitch } from 'reactRouterConnected'
import Loadable from 'react-loadable'
import Page from 'components/LayoutComponents/Page'
import NotFoundPage from 'pages/DefaultPages/NotFoundPage'
import HomePage from 'pages/DefaultPages/HomePage'

/*
function loadableRoutesFromLinkPages (linkPages){
  let routes ={};
  for (let  i=0;i<linkPages.length;i++){
    routes[linkPages[i].link]={component:loadable (()=>  import(linkPages[i].view))}
  }
  console.log(routes);
  return  routes;
}
*/
const loadable = loader =>
  Loadable({
    loader,
    delay: false,
    loading: () => null,
  })

/*
const linkPages =[
  {link: '/login', view:'pages/DefaultPages/LoginPage'},
  {link:'/dashboard/alpha', view:'pages/Dashboard/DashboardAlphaPage'},
  {link:'/pages/empty',view:'pages/DefaultPages/EmptyPage'},
  {link:'/pages/profile', view :'pages/Profile'}
];
*/

const loadableRoutes = {
  // Default Pages
  '/login': { component: loadable(() => import('pages/DefaultPages/LoginPage')) },
  // Dashboards
  '/dashboard/alpha': { component: loadable(() => import('pages/Dashboard/DashboardAlphaPage')) },
  // Empty Page
  '/pages/empty': { component: loadable(() => import('pages/DefaultPages/EmptyPage')) },
  '/admin/menus': { component: loadable(() => import('pages/Managements/Menus')) },

  //User Management Page
  '/admin/role-group': {
    component: loadable(() => import('pages/Managements/RolePage')),
  },

  //Authorization Page
  '/admin/user-authorization': {
    component: loadable(() => import('pages/Managements/UserPage')),
  },
}

class Routes extends React.Component {
  timeoutId = null

  componentDidMount() {
    this.timeoutId = setTimeout(
      () => Object.keys(loadableRoutes).forEach(path => loadableRoutes[path].component.preload()),
      5000, // load after 5 sec
    )
  }

  componentWillUnmount() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
    }
  }

  render() {
    return (
      <ConnectedSwitch>
        <Route exact path="/" component={HomePage} />
        {Object.keys(loadableRoutes).map(path => {
          const { exact, ...props } = loadableRoutes[path]
          props.exact = exact === void 0 || exact || false // set true as default
          return <Route key={path} path={path} {...props} />
        })}
        <Route
          render={() => (
            <Page>
              <NotFoundPage />
            </Page>
          )}
        />
      </ConnectedSwitch>
    )
  }
}

export { loadableRoutes }
export default Routes
