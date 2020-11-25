import React, { Component } from 'react';
import axios from 'axios';
import './App.css'

class App extends Component{

  constructor(){
    super();
    this.state={
      username:null,
      password:null,
      login:false,
      store:null,
      isLoaded: false,
      commercials:[{
        BreakName:null,
        Demographic:null,
        CommercialName:null,
        CommercialType:null,
        Rating:null,
        OptimisedRating:null
      }]
    };
  }
  componentDidMount(){
    this.persistLogin();
      }

  componentDidUpdate()
  {
    localStorage.setItem('comm',JSON.stringify(this.state.commercials));
  }

  persistLogin(){
    let store =JSON.parse(localStorage.getItem('login'));
    if(store && store.login){
        this.setState({login:true,store:store})
    }
  }  

  login(){  

  axios.post('http://localhost:62450/users/authenticate', { username: this.state.username, password: this.state.password })
  .then(response => {   
      localStorage.setItem('login',JSON.stringify({
           login:true,
           token:response.data.token}))
      this.setState({login:true})
      this.persistLogin()      
    })
    .catch(error => {
      console.log(error);
    });
  }

  getCommercials1 = async ()=>{
    let data = await axios.get('http://localhost:62450/Commercial/GetCommercials/false',
    {
      headers: {'authorization':`Bearer ${this.state.store.token}`}
    })    
    .then(({data})=>data);
    this.setState({ commercials:data,isLoaded: true });  
    }  

  getCommercials=()=>{   
    axios.get('http://localhost:62450/Commercial/GetCommercials/false',
    {
      headers: {'authorization':`Bearer ${this.state.store.token}`}
    })    
    .then(result=> {
      const comls = result.data;      
      this.setState({ commercials:comls,isLoaded: true });      
    });  
  }

  handleLogout(){
    localStorage.clear();
    this.setState({login:false});
  }

  getOptimisedCommercials=()=>{
    axios.get('http://localhost:62450/Commercial/GetCommercials/true',
    {
      headers: {'authorization':`Bearer ${this.state.store.token}`}
    })    
    .then(result=> {
      const comls = result.data;      
      this.setState({ commercials:comls,isLoaded: true });     
    });  
  }

  getCommercialsUneven=()=>{
    axios.get('http://localhost:62450/Commercial/GetCommercialsUneven',
    {
      headers: {'authorization':`Bearer ${this.state.store.token}`}
    })    
    .then(result=> {
      const comls = result.data;      
      this.setState({ commercials:comls,isLoaded: true });      
    });  
  }

  render(){

    const comm=[];
    let break1Total=0;
    let break2Total=0;
    let break3Total=0;

    this.state.commercials.forEach(c=>{
      const brk =c["breakName"];
      const rating=c["rating"];
      if(brk==="Break1")
      break1Total+=rating;
      else if(brk==="Break2") break2Total+=rating;
      else if(brk==="Break3") break3Total+=rating;

      comm.push({
        breakName:c["breakName"],
        demographic:c["demographic"],
        commercialName:c["commercialName"],
        commercialType:c["commercialType"],
        rating:c["rating"],
        optimisedRating:c["optimisedRating"],
    })
    });   
   
  return (
    !this.state.login?
    (<div>

<div className="container-fluid bg">
  <div className="row justify-content-center">
    <div className="col-12 col-sm-6 col-md-3">
    <div className="form-container">
  <div className="form-group">
    <label for="exampleInputEmail1">Username</label>
    <input type="text" className="form-control" id="exampleInputEmail1"
     aria-describedby="emailHelp" placeholder="Enter Username" onChange={(event)=>{this.setState({username:event.target.value})}}/>
   
  </div>
  <div className="form-group">
    <label for="exampleInputPassword1">Password</label>
    <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password"
    onChange={(event)=>{this.setState({password:event.target.value})}}/>
  </div>  
  <button className="btn btn-primary btn-block" onClick={()=>{this.login()}} >Login</button>
    </div>
    </div>
    </div>
    </div>     
    </div>
    ):  

    (<div>

<nav class="navbar navbar-light bg-light">
  <span class="navbar-text">
    <h2>Commercial Optimiser</h2>
  </span>
  <hr class="my-4"></hr>  
    <button className="btn btn-sm btn-outline-secondary" onClick={()=>{this.getCommercials()}}>Get Commercials</button>
        <button className="btn btn-sm btn-outline-secondary" onClick={()=>{this.getOptimisedCommercials()}}>Get Optimised Commercials</button>
        <button className="btn btn-sm btn-outline-secondary mr-2" onClick={()=>{this.getCommercialsUneven()}}>Get Optimised Commercials - Uneven</button>
        <button className="btn btn-sm btn-outline-danger" onClick={()=>{this.handleLogout()}}>Logout</button>
  
</nav>        
  
      <div className="w-80 p-4">
      {/* if(! this.state.isLoaded){<div> loading</div>}
      else
      { */}
          <div className="container">
          <div className="row">
          <div className="col"><p className="font-weight-bold justify-content-center">Break</p></div>
          <div className="col"><p className="font-weight-bold justify-content-center">Commercial</p></div>
          <div className="col"><p className="font-weight-bold justify-content-start">Commercial Type</p></div>
          <div className="col"><p className="font-weight-bold justify-content-center">Demographic</p></div>
          <div className="col"><p className="font-weight-bold justify-content-center">Rating</p></div>
          <div className="col"><p className="font-weight-bold justify-content-center">Optimised Rating</p></div>
          </div>         
          {comm.map((itm)=>(
            <div className="row">         
              <div className="col"><p>{itm["breakName"]}</p></div>
              <div className="col"><p>{itm["commercialName"]}</p></div>
              <div className="col"><p>{itm["commercialType"]}</p></div>
              <div className="col"><p>{itm["demographic"]}</p></div>
              <div className="col"><p>{itm["rating"]}</p></div>
              <div className="col"><p>{itm["optimisedRating"]}</p></div>
              {/* {itm["optimisedRating"]>0 &&  (<div className="col"><p>{itm["optimisedRating"]}</p></div>)} */}
            </div>
          ))}
      
      </div>
     
      </div>
{(break1Total>0 ||break2Total>0 ||break3Total>0)?

   (<div className="container w-25 p-2">
          <div className="row">
          <div className="col"><p class="lead">Total rating for Break1 is {break1Total}</p></div>
          </div>
          <div className="row">
          <div className="col"><p class="lead">Total rating for Break2 is {break2Total}</p></div>
          </div>
          <div className="row">
          <div className="col"><p class="lead">Total rating for Break3 is {break3Total}</p></div>
          </div> 
  </div>

):null}
</div>)   
)
};
         
}

export default App;
