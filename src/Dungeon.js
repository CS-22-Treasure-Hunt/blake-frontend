import React, { Component } from "react";
import axios from "axios";
import "./Dungeon.css"

// import {connect} from "react-redux";
// import keydown from 'react-keydown';

class Dungeon extends Component {
  state = {
    room_info: null,
    cooldown: null,
    grid: [],
    visited: null,
    player_info: null,
  };

  componentDidMount = () => {
    this.init_call()
    this.make_grid()
    this.map_parser()
    //  this.check_inventory()
  }

  map_parser = () => {
    console.log("ok ok")
  }

  pick_up = () => {
    const treasure = {name: "treasure"}
    const token = process.env.REACT_APP_TOKEN;
    return axios.post(`https://lambda-treasure-hunt.herokuapp.com/api/adv/take/`, treasure, {headers: { Authorization: `Token ${token}`}, 'Content-Type': 'application/json'})
    .then(res => {
      console.log("pickup", res)
      this.setState({
        room_info: res.data
      },
        () => this.timer()
        );
      // this.check_inventory()
    })
  }

  sell = () => {
    const treasure = {name: "treasure", confirm: "yes"}
    const token = process.env.REACT_APP_TOKEN;
    return axios.post(`https://lambda-treasure-hunt.herokuapp.com/api/adv/sell/`, treasure, {headers: { Authorization: `Token ${token}`}, 'Content-Type': 'application/json'})
    .then(res => {
      console.log("sell", res.data)
      // this.confirm()
    })
  }

  pray = () => {
    axios({
      method: "post",
      url: `https://lambda-treasure-hunt.herokuapp.com/api/adv/pray/`,
      headers: {
        Authorization: `Token ${process.env.REACT_APP_TOKEN}`
      }
    })
      .then(({data}) => console.log("dat", data))
      .catch(err => console.log("error", err))
  }

  // check_status = () => {
  //   const token = process.env.REACT_APP_TOKEN;
  //   return axios.post(`https://lambda-treasure-hunt.herokuapp.com/api/adv/status/`,  {headers: { Authorization: `Token ${token}`}, 'Content-Type': 'application/json'})
  //   .then(res => {
  //     console.log("status:", res)
  //   })
  // }

  check_status = () => {
    axios({
      method: "post",
      url: `https://lambda-treasure-hunt.herokuapp.com/api/adv/status/`,
      headers: {
        Authorization: `Token ${process.env.REACT_APP_TOKEN}`
      }
    })
      .then(({data}) => this.setState({player_info: data}))
      .catch(err => console.log("error", err))
  }

  make_grid = () => {
    let grid = []
    for(let i = 0; i < 100; i++){
      grid[i] = []
      for(let j = 0; j < 100; j++){
        grid[i][j] = -1
      }
    }
    console.log("grid:", grid)
    this.setState({grid: grid})
  }

  timer = (duration, display) => {
    var timeleft = this.state.room_info.cooldown;
    setInterval(() => {
      if(timeleft > 0){
        // console.log(timeleft)
        timeleft -= 1
        this.setState({cooldown: timeleft})
      }
    }, 1000);
}

  init_call = () => {
    const token = process.env.REACT_APP_TOKEN;
    console.log(token)
    axios.get(`https://lambda-treasure-hunt.herokuapp.com/api/adv/init/`, {headers: { Authorization: `Token ${token}`}, 'Content-Type': 'application/json'})
    .then(res => {
      let first = parseInt(res.data.coordinates.split('(').pop().split(',')[0]);
      let second = parseInt(res.data.coordinates.split(',').pop().split(')')[0]);
      let coord_string = first.toString()+second.toString()
      let first_room = {}
      first_room[coord_string] = {
        exits: res.data.exits,
        title: res.data.title
      }
      let coord_array = [first, second]
      res.data.coordinates = coord_array
      const response = res.data;
      this.setState({
        room_info: response,
        visited: first_room 
      },
        () => this.timer()
        );
    })
  } 

  
  move_call = (direction) => {
    const move_dir = {direction: direction}
    const token = process.env.REACT_APP_TOKEN;
    console.log(move_dir)
    return axios.post(`https://lambda-treasure-hunt.herokuapp.com/api/adv/move/`, move_dir, {headers: { Authorization: `Token ${token}`}, 'Content-Type': 'application/json'})
    .then(res => {
      let first = parseInt(res.data.coordinates.split('(').pop().split(',')[0]);
      let second = parseInt(res.data.coordinates.split(',').pop().split(')')[0]);

      let coord_string = first.toString()+second.toString()
      let copy = Object.assign({}, this.state.visited);
      copy[coord_string] = {
        exits: res.data.exits,
        title: res.data.title
      }

      let coord_array = [first, second]
      res.data.coordinates = coord_array
      const response = res.data;
      this.setState({
        room_info: response,
        visited: copy 
      },
        () => this.timer()
      );
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
        <div className="room_info">
          <p>ROOM INFO</p>
          {/* <button onClick={this.init_call}>init</button> */}
          <p>cooldown: {this.state.room_info && this.state.room_info.cooldown }</p>
          <p>coordinates: {this.state.room_info && this.state.room_info.coordinates[0] + ", " + this.state.room_info.coordinates[1]}</p>
          <p>description: {this.state.room_info && this.state.room_info.description }</p>
          <p>title: {this.state.room_info && this.state.room_info.title  }</p>
          <p>room id: {this.state.room_info && this.state.room_info.room_id  }</p>
          <p>terrain: {this.state.room_info && this.state.room_info.terrain }</p>
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

        <div className="player_info">
          Player status
          {/* <p>items: {this.state.player_info && this.state.player_info.items} </p> */}
          <p>name: {this.state.player_info && this.state.player_info.name} </p>
          <p>gold: {this.state.player_info && this.state.player_info.gold} </p>
          <p>has mined (mvp!!): {this.state.player_info && (this.state.player_info.has_mined ? "yes" : "no")} </p>
          <p>carrying/capacity: {this.state.player_info && `${this.state.player_info.encumbrance}/${this.state.player_info.strength}`} </p>
          <p>speed: {this.state.player_info && this.state.player_info.speed} </p>
          <p>footwear: {this.state.player_info && this.state.player_info.footwear} </p>
          <p>bodywear: {this.state.player_info && this.state.player_info.bodywear} </p>

        </div>
        
        <div className="navigate">
          <div>cooldown: {this.state.cooldown}</div>
          <div>
            <button onClick={this.go_north}>n</button>
          </div>
          <button onClick={this.go_west}>w</button>
          <button onClick={this.go_east}>e</button>
          <div>
            <button onClick={this.go_south}>s</button>
          </div>
          <div>
          <button onClick={this.pick_up}>pick up: {this.state.room_info && this.state.room_info.items.length > 0 ?  "treasure" : "n/a"}</button>
          <button onClick={this.sell}>sell</button>
          <button onClick={this.check_status}>status</button>
          <button onClick={this.pray}>pray at shrine</button>
          </div>
        </div>

        <div className="map">
        {this.state.grid.length > 0 && this.state.grid.map((e, i) => {
          return(
            <div className="row">
              {e.map((event, index) => {
                return(
                  <span className={`room ${this.state.room_info && ((this.state.room_info.coordinates[0] === index && this.state.room_info.coordinates[1] === 99-i) ? "current" : "")}
                  ${this.state.room_info && ((this.state.room_info.coordinates[0] === index && this.state.room_info.coordinates[1] === 99-i && this.state.room_info.exits.includes("n")) ? "north" : "")}
                  ${this.state.room_info && ((this.state.room_info.coordinates[0] === index && this.state.room_info.coordinates[1] === 99-i && this.state.room_info.exits.includes("s")) ? "south" : "")}
                  ${this.state.room_info && ((this.state.room_info.coordinates[0] === index && this.state.room_info.coordinates[1] === 99-i && this.state.room_info.exits.includes("e")) ? "east" : "")}
                  ${this.state.room_info && ((this.state.room_info.coordinates[0] === index && this.state.room_info.coordinates[1] === 99-i && this.state.room_info.exits.includes("w")) ? "west" : "")}

                  ${this.state.visited && (this.state.visited[index.toString()+(99-i).toString()] ? "visited" : "")}
                  ${this.state.visited && this.state.visited[index.toString()+(99-i).toString()] && (this.state.visited[index.toString()+(99-i).toString()].exits.includes("n") ? "north" : "")}
                  ${this.state.visited && this.state.visited[index.toString()+(99-i).toString()] && (this.state.visited[index.toString()+(99-i).toString()].exits.includes("s") ? "south" : "")}
                  ${this.state.visited && this.state.visited[index.toString()+(99-i).toString()] && (this.state.visited[index.toString()+(99-i).toString()].exits.includes("e") ? "east" : "")}
                  ${this.state.visited && this.state.visited[index.toString()+(99-i).toString()] && (this.state.visited[index.toString()+(99-i).toString()].exits.includes("w") ? "west" : "")}

                  ${this.state.visited && this.state.visited[index.toString()+(99-i).toString()] && (this.state.visited[index.toString()+(99-i).toString()].title === "Shop" ? "shop" : "")}

                  
                  `}>
                    {/* ({299-i}, 
                    {index}) */}

                    {/* {this.state.room_info && this.state.room_info.exits[0]}
                    {this.state.room_info && this.state.room_info.exits[1]}
                    {this.state.room_info && this.state.room_info.exits[2]}
                    {this.state.room_info && this.state.room_info.exits[3]} */}
                    
                    {/* {this.state.room_info && (index === 10 && i - 299 === 0 ? "|||||" : "o")} */}
                  </span>
                )
              })}
            </div>
          )
        })

        }
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
}

export default Dungeon;
// export default connect(null, {})(Dungeon)