import React, { Component } from "react";
import axios from "axios";
import "./Dungeon.css"

// import {connect} from "react-redux";
// import keydown from 'react-keydown';

class Dungeon extends Component {
  state = {
    room_info: null
  };

  componentDidMount = () => {
    // this.init_call()
  }

  init_call = () => {
    const token = process.env.REACT_APP_TOKEN;
    console.log(token)
    axios.get(`https://lambda-treasure-hunt.herokuapp.com/api/adv/init/`, {headers: { Authorization: `Token ${token}`}, 'Content-Type': 'application/json'})
    .then(res => {
      const response = res.data;
      this.setState({room_info: response});
    })
  } 
  
  render() {    
    return (
      <div>
        <div class="room_info">
          <button onClick={this.init_call}>init</button>
          <p>cooldown: {this.state.room_info ? this.state.room_info.cooldown : "na"}</p>
          <p>coordinates: {this.state.room_info ? this.state.room_info.coordinates : "na"}</p>
          <p>description: {this.state.room_info ? this.state.room_info.description : "na"}</p>
          <p>elevation: {this.state.room_info ? this.state.room_info.elevation : "na"}</p>
          <p>exits: {this.state.room_info ? `${this.state.room_info.exits[0]} ${this.state.room_info.exits[1]} ${this.state.room_info.exits[2]} ${this.state.room_info.exits[3]}` : "na"}</p>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
}

export default Dungeon;
// export default connect(null, {})(Dungeon)