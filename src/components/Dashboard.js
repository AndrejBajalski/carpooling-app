import React, { useState, useEffect } from "react";
import { Button, Container, Card, Offcanvas } from "react-bootstrap";
import {useAuth} from "./AuthContext"
import {db} from './firebase'
import { updateProfile } from "firebase/auth";
import {doc, updateDoc} from 'firebase/firestore';
import {CustomNavbar} from "./Navbar"
import Ride from "./Ride.js"
import '../App.css';

export default function Dashboard(){
    const {currentUser, upload, getUsersDocSnap, getRides}=useAuth();
    const [rides, setRides]=useState([]);
    const [docSnap, setDocSnap]=useState({})
    const [photo, setPhoto] = useState("");
    const [addingCar, setAddingCar] = useState(false)
    const [showSidebar, setShowSidebar]=useState(false)
    const [reserved, setReserved]=useState([])
    const [created, setCreated]=useState([])
    const [passed, setPassed]=useState([])
    const [completed, setCompleted]=useState([])
    const current = new Date();
    const currentDate = `${current.getFullYear()}-${(current.getUTCMonth()+1)
      .toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}-${current.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}`
    const [brand, setBrand]=useState("");
    const [model, setModel]=useState("");
    const [color, setColor]=useState("");

    const fileHandler = (event)=>{
      if(event.target.files[0]){
        setPhoto(event.target.files[0])
      }
    }

    const addCar = async(brand, model, color)=>{
        const newCar={
          brand: brand,
          model: model,
          color: color
        }
        const updatedArray=[...docSnap.cars]
        updatedArray.push(newCar)
        await updateDoc(doc(db, "users", currentUser.uid), {cars: updatedArray})
        getUsersDocSnap(currentUser.uid).then((userInfo)=>setDocSnap({id: currentUser.uid, ...userInfo}))
                                         .catch((err)=>{alert(err)})
        setAddingCar(false)
    }

    useEffect(() => {
         getUsersDocSnap(currentUser.uid).then((userInfo)=>setDocSnap({id: currentUser.uid, ...userInfo}))
                                         .catch((err)=>{alert(err)})
         getRides().then((allRides)=>{
          let old = []
          let upcoming = []
          for(let ride of allRides){
            if(ride.date < currentDate){
              old.push(ride)
            }
            else{
              upcoming.push(ride)
            }
          }
          setPassed(old)
          setRides(upcoming)
        }) 
        .catch((err)=>{alert(err)})                                 
      }, []);

      useEffect(()=>{
        if(rides.length || passed.length){
        getCreated(rides)
        getReserved(rides)
        getCompleted()
      }}, [rides, passed])

      useEffect(() => {
        if (currentUser?.photoURL) {
          updateDoc(doc(db, "users", currentUser.uid), {profilePhoto: currentUser.photoURL})
        }
      }, [currentUser])
      
      const getCreated = (rides)=>{
        let filtered = rides.filter((ride) => ride.creator.id===currentUser.uid )
        const res = filtered.sort((a, b) => a.date > b.date? 1:-1)
        .map((ride)=>{
          return <Ride ride={ride} driver={docSnap} created/>
      })
       setCreated(res)
      }

      const getReserved = (rides)=>{
        let filtered = rides.filter((ride) => {
          let passengerExists=false;
          for(let obj of ride.passengers){
            if( docSnap.email===obj.email)
              passengerExists=true
          }
          return passengerExists
      })
      const res = filtered.sort((a, b) => a.date > b.date? 1:-1)
      .map((ride) =>{
        return <Ride ride={ride} driver={ride.creator} reserved/>
      })
      setReserved(res) 
    }

      const getCompleted = async()=>{
          console.log('passed rides: ', passed)
          const res = await Promise.all (passed.map(async (ride)=>{
            if(ride.creator.id===currentUser.uid){
              return <Ride ride={ride} driver={docSnap}/>
            }
            else if(ride.passengers.some((passenger)=>{return passenger.email===docSnap.email})){
              const creator = await getUsersDocSnap(ride.creator.id)
              return <Ride ride={ride} driver={creator} passed/>
            }
          }))
          setCompleted(res)
      } 
    
    return(
    <>
    <CustomNavbar dashboard/>
    <Button onClick={()=>setShowSidebar(true)} className="btn-light text-dark m-2">Your profile</Button>
    <Offcanvas show={showSidebar} onHide={()=>setShowSidebar(false)}>
      <Offcanvas.Header closeButton>
      <Offcanvas.Title>About me</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body id="sidebar">
    <img src={currentUser.photoURL} id="profile-photo" alt="Avatar"/>
    <div className="upload mb-3 position-relative">
      <p>Edit profile photo</p>  
      <input type="file" onChange={fileHandler} />
      <button disabled={!photo} onClick={()=>upload(photo, currentUser)}>Upload</button>
      <button onClick={()=>updateProfile(currentUser, {photoURL: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}).then(()=>window.location.reload())}>
        Remove profile photo
      </button>
    </div>  
             
    <ul id="about" className="list-group list-group-flush">
    <li className="list-group-item" ><h2 >{docSnap.name + " " + docSnap.surname}</h2></li>
    <li className="list-group-item" >{docSnap.email}</li>          
    <li className="list-group-item"><h3>{docSnap.sex}</h3></li>
    <li className="list-group-item"><h3>Age: {docSnap.age}</h3></li>
    {docSnap.offersRides && <>
    <li className="list-group-item"><h3>Rating: </h3>{docSnap.rating.numRates? docSnap.rating.average+'/5':'No rates yet'}</li>
    <li className="list-group-item">
       <h3>Cars:</h3>
       {
        docSnap.cars &&
        <ul>{
        docSnap.cars.map((car)=>{
          return <li>{`${car.brand} ${car.model}, ${car.color}`}</li>
        })}
        </ul>
       }
    </li>
    </>
}
      <Button onClick={()=>setAddingCar(true)} style={{display: addingCar? 'none':'block'}}>+ Add car</Button>
      <form style={{display: addingCar? 'block':'none'}}>
      <input type="text" placeholder="Car brand" onChange={(e)=>setBrand(e.target.value)}/>
      <input type="text" placeholder="Car model" onChange={(e)=>setModel(e.target.value)}/>
      <input type="text" placeholder="Color" onChange={(e)=>setColor(e.target.value)}/>  
      <Button onClick={()=>{addCar(brand, model, color)}} style={{display: addingCar? 'block':'none'}}>Add</Button>
      </form>
    </ul>
    </Offcanvas.Body>
    </Offcanvas>

    <Container>
      <h2 className="text-center">Upcoming rides</h2>
      {docSnap.offersRides && 
      <>
      <h4>Created by you:</h4>
      { 
        created.length?
        created.map((res)=>{return res}) : <p>No upcoming rides</p>
      }
      </>
    }
      </Container>
      <Container>
      <h4>Reserved rides:</h4>
      {
        reserved.length? reserved.map((res)=>{return res}) : <p>No upcoming rides</p>
      }
      <h2 className="text-center mt-5">Past rides</h2>
      {
        completed.length? completed.map((res)=>{return res}) : <p>No completed rides</p>
      }
    </Container>  
    </>
)}