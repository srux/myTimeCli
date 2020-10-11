import React, { Component } from 'react'

class Clients extends Component {
    constructor(props) {
        super(props)

    }


    render() {
        let {name,id} = this.props
        return (
            <>
                <option>{name}</option>
            </>
        )
    }
}


export default Clients