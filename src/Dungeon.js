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
    this.init_call()
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

  
  move_call = (direction) => {
    const move_dir = {direction: direction}
    const token = process.env.REACT_APP_TOKEN;
    console.log(move_dir)
    return axios.post(`https://lambda-treasure-hunt.herokuapp.com/api/adv/move/`, move_dir, {headers: { Authorization: `Token ${token}`}, 'Content-Type': 'application/json'})
    .then(res => {
      console.log("r", res)
      const response = res.data;
      this.setState({room_info: response});
    })
  } 

  go_north = () => {
    // event.preventDefault
    this.move_call("n")
  }
  go_south = () => {
    // event.preventDefault
    this.move_call("s")
  }
  go_east = () => {
    // event.preventDefault
    this.move_call("e")
  }
  go_west = () => {
    // event.preventDefault
    this.move_call("w")
  }
  
  render() {    
    return (
      <div>
        <div class="room_info">
          <p>ROOM INFO</p>
          {/* <button onClick={this.init_call}>init</button> */}
          <p>cooldown: {this.state.room_info && this.state.room_info.cooldown }</p>
          <p>coordinates: {this.state.room_info && this.state.room_info.coordinates }</p>
          <p>description: {this.state.room_info && this.state.room_info.description }</p>
          <p>elevation: {this.state.room_info && this.state.room_info.elevation}</p>
          <p>exits: {this.state.room_info && this.state.room_info.exits.map(e => {
            return(
              <>
              <span> {e} </span>
              </>
            )
          })}</p>
          <p>items: {this.state.room_info && this.state.room_info.items.map(e => {
            return(
              <div>
              <span> {e} </span>
              </div>
            )
          })}</p>
          <p>messages: {this.state.room_info && this.state.room_info.messages.map(e => {
            return(
              <div>
              <span> {e} </span>
              </div>
            )
          })}</p>
          <p>players: {this.state.room_info && this.state.room_info.players.map(e => {
            return(
              <div>
              <span> {e} </span>
              </div>
            )
          })}</p>
        
        </div>
        <div>
          <button onClick={this.go_north}>n</button>
          <button onClick={this.go_south}>s</button>
          <button onClick={this.go_east}>e</button>
          <button onClick={this.go_west}>w</button>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
}

export default Dungeon;
// export default connect(null, {})(Dungeon)