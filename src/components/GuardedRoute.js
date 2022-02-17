import { Route, Navigate } from "react-router-dom"

const GuardedRoute = ({ component: Component, auth, ...rest }) => (
    <Route {...rest} render={(props) => (
    	auth === true
    		? <Component {...props} />
    		: <Navigate to="/" />
    )} />
)

export default GuardedRoute