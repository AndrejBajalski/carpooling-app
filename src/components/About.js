import React from 'react'
import {useLocation} from 'react-router-dom'
import {Container, Card} from "react-bootstrap"
import { Rating } from 'react-simple-star-rating'
import { CustomNavbar } from './Navbar'
import '../App.css'

export default function About(){
    const location = useLocation()
    return(
        <>
        <CustomNavbar/>
        <Container className='justify-content-center mt-3' id='user-profile'>
        <Card>
        <Card.Img variant='top' src={location.state.creator.profilePhoto} id='userPhoto'/>
        <Card.Body className='text-center'><h2>{location.state.creator.name+' '+location.state.creator.surname}</h2></Card.Body>   
        <ul id="about" className="list-group list-group-flush">
        <li className="list-group-item">{location.state.creator.sex}</li>
        <li className="list-group-item"><span className='fw-bold'>Age: </span>{location.state.creator.age}</li>
    {location.state.creator.offersRides && 
      <>
        <li className="list-group-item"><span className='fw-bold'>Rating:</span>
        <Rating initialValue={location.state.creator.rating.average} readonly allowFraction/>
        <strong>{location.state.creator.rating.average}/5</strong>  (Rated by {location.state.creator.rating.numRates} people)
        </li>
        <li className="list-group-item">
       <h3 className='fw-bold'>Cars:</h3>
        <ul>{
        location.state.creator.cars?.map((car)=>{
          return <li>{`${car.brand} ${car.model}, ${car.color}`}</li>
        })}
        </ul>
     </li>
     </>
    }
        <li className="list-group-item" ><span className='fw-bold'>
            Contact: </span><a href={`mailto:${location.state.creator.email}`}>{location.state.creator.email}</a>        
            <div>Tel: {location.state.creator.phone}</div>
        </li>
        </ul>
        </Card>
        </Container>
        </>
    )
}