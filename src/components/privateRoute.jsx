import React from "react"
import { Route, Redirect } from "react-router-dom"
import {useData} from '../api/provider'

export default function PrivateRoute({ component: Component, ...rest }) {
  const { currentUser } = useData()

  return (
    <Route
      {...rest}
      render={props => {
        return currentUser ? <Component {...props} /> : <Redirect to="/login" />
      }}
    ></Route>
  )
}