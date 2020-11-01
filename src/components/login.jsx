import React, { Component } from 'react'

class Login extends Component {
    constructor(props) {
        super(props)

    }

    render() {
        return (
            <div>
                <form action="">
                    <input type="text" placeholder="Username:"/>
                    <input type="text" placeholder="Password:"/>
                </form>
            </div>
        )
    }
}


export default Login