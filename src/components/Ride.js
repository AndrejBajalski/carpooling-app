import React, { useState } from 'react'
import { Rating } from 'react-simple-star-rating'
import "../App.css"
import {db} from './firebase.js'
import {doc, updateDoc} from 'firebase/firestore'
import { Button } from 'react-bootstrap'
import { useAuth } from './AuthContext'
import { useNavigate } from 'react-router-dom'

 export default function Ride({ride, driver, passed, created, reserved}){
    const[rated, setRated]=useState(false)
    const {currentUser, cancelationHandler}=useAuth()
    const navigate = useNavigate()

    let numR = driver.rating.numRates;
    let totalR = driver.rating.totalRates;
    const index = ride.passengers.findIndex((passenger)=>{return passenger.email===currentUser.email})

    const handleRating =async(value)=>{
        console.log('before change', totalR, numR)
        totalR+=value
        numR++
        console.log('after change', totalR, numR)
        const updatedRating = Number((totalR/numR).toFixed(2))
        const data = {
            rating: {
            totalRates: totalR,
            numRates: numR,
            average: updatedRating
            }
        }
        const passengersUpdated = [...ride.passengers]
        passengersUpdated[index].rideRating = value 
        await updateDoc(doc(db, "users", ride.creator.id), data)
        await updateDoc(doc(db, "rides", ride.id), {passengers: passengersUpdated})
        setRated(true)
    }  
    const gotoCreatorProfile = (creator)=>{
        navigate(`/about/${creator}`, {state:{creator: creator}})
     }
     return (
        <div className="ride m-2">
        <button className='avatar styleless-button' onClick={()=>gotoCreatorProfile(driver)}><img src={driver.profilePhoto} className="float-start" alt="profilePhoto"/></button>
        <div className="containerInfo">
        <div className='rideInfo'>    
        <div className="m-md-3"><span className="fw-bold">From: </span>{ride.from}</div>
        <div className="m-md-3"><span className="fw-bold">To: </span>{ride.to}</div>
        <div className="m-md-3">Departure: {ride.date + ' at ' + ride.time}</div>
        {!passed && <div className="m-md-3"><span className="fw-bold">Available seats: </span>{ride.seats}</div>}
        </div> 
        {!created && <div>
        <div className="m-2"><span className="fw-bold">Creator: </span>{driver.name + ' ' +driver.surname}</div>
        <div><span className="fw-bold">Contact: </span><a href={`mailto: ${driver.email}`}>{driver.email}</a></div>
        </div>
        }
        {passed  && !created && !ride.passengers[index].rideRating && 
        <div className='rate-driver w-100'>Rate driver: 
        <Rating allowFraction="true" onClick={handleRating} transition='true' readonly={rated}/>
        </div>
        }
        {passed && !created && ride.passengers[index].rideRating?
         <div className='rate-driver w-100'>Rated: 
          <Rating allowFraction="true" readonly="true" initialValue={ride.passengers[index].rideRating}/>
        </div>
        :<></>
        }
        {created && <div className='w-100 ms-lg-3 ms-2'><span className="fw-bold">Passengers: </span>
        {ride.passengers.map((passenger, idx)=>{
            if(idx===ride.passengers.length-1)
            return <button className='styleless-button' onClick={()=>gotoCreatorProfile(passenger)}>{passenger.name}</button>
            else
            return <button className='styleless-button' onClick={()=>gotoCreatorProfile(passenger)}>{passenger.name + ', '}</button>
            })
        }</div>}
        {reserved && <div className='m-3'><Button onClick={()=>{cancelationHandler(ride).then(()=>window.location.reload())}} className="btn-danger">Cancel ride</Button></div>}
        </div>
        <div className="fw-bold price"><p>{ride.price} MKD</p></div>
        </div> 
    )
}