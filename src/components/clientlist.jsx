import React, { Component } from 'react';
import Job from '../components/job';

let styles = {
    close:{
      display:'none',
    },
    open:{
      display:'initial',
    }
  }

class Clientlist extends Component {
    constructor(props) {
        super(props)
            this.state = {
                toggle:styles.close,
                tasks:[]
            }
    }
    // shouldComponentUpdate(nextProps, nextState) {
    //     if (this.props.value.id !== nextProps.value.id) {
    //         this.setState({
    //             value: Object.assign({}, nextProps.value)
    //         });
    //     }
    //     return true;}

        shouldComponentUpdate(nextProps, nextState) {
            if (this.props.task !== nextProps.task) {
                let task = this.props.task
                this.setState({
                    ...this.state.tasks,
                    tasks:[task]
                })
            }
            return true;}

            
    // componentDidUpdate=()=>{
    //     let task = this.props.task
    //     this.setState({
    //         ...this.state.tasks,
    //         tasks:[task]
    //     })
    // }

    handleToggle=()=> {

        let open = styles.open
        let close = styles.close

        if ( this.state.toggle === close) {
            this.setState({
                toggle:open
            })
            console.log('open')
        }
        else {
            this.setState({
                toggle:close
            }) 
            console.log('hide')
        }
        console.log('hit')
    }

    

    render() {
          let {toggle,tasks} = this.state
          let {name,id,data} = this.props;


        return (
            <div className="existingjobs__jobitem" onClick={this.handleToggle}>{name}
                <div style={toggle}>
                {
                    this.state.tasks.map((task) => {
                      let taskProps = {
                        ...tasks,
                        key:task.id,
                      };
                      return (
                        <Job {...taskProps}/>
                      )
                    })
                    }
                </div>
               
              </div>
        )
    }
}


export default Clientlist