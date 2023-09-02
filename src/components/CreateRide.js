import React, {useEffect, useState} from "react"
import { CustomNavbar } from "./Navbar"
import {Card, Form, Button, Container, InputGroup, FloatingLabel, Alert} from 'react-bootstrap';
import { useAuth } from "./AuthContext";
import {db} from "./firebase"
import {addDoc, collection} from "firebase/firestore" 

export const CreateRide = ()=>{
    const [error, setError]=useState("");
    const [pending, setPending]=useState(true)
    const [startingPoint, setStartingPoint]=useState("");
    const [destination, setDestination]=useState("");
    const [time, setTime]=useState(undefined);
    const [price, setPrice]=useState(0);
    const [date, setDate]=useState(undefined);
    const [numSeats, setNumSeats]=useState(3);
    const [docSnap, setDocSnap]=useState({})
    const [car, setCar]=useState({})
    const {currentUser, getUsersDocSnap}=useAuth();
    const docRef = collection(db, "rides")

    useEffect(()=>{
        getUsersDocSnap(currentUser.uid).then((user)=>setDocSnap(user))
        .catch((err)=>alert(err))
    }, [])
    useEffect(()=>{
        if(String(car)){
        console.log(car)
        }
    }, [car])

    const create = async(event)=>{
        event.preventDefault()
        setError("")
        try{
         const docData = {
            from: startingPoint, to: destination, date: date, time: time, price: price, seats: numSeats, car: car,
            creator: {...docSnap, id: currentUser.uid}, 
            passengers: []
        }   
        await addDoc(docRef, docData)
        console.log("Ride created!")
        setPending(false)
    }catch(err){
        setError(err)
    }
    }

    return(
        <>
        <CustomNavbar create/>
        {!pending && <Alert className="alert-success">Successfully created ride! Go to Dashboard to view all of your created rides.</Alert>}
        <Container className="d-flex align-items-center justify-content-center">
        <Card className="panel">
            <Card.Body>
            <h2 className="text-center mb-4">Create a ride</h2>
            
            <Form onSubmit={create}>
            <FloatingLabel label="Starting point" controlId="floatingInput">      
            <Form.Control required className="mb-3" placeholder="Choose a starting point"
            onChange={(event)=>setStartingPoint(event.target.value)}/>
            </FloatingLabel>

            <FloatingLabel label="Destination">    
            <Form.Control required className="mb-3" placeholder="Choose destination"
            onChange={(event)=>setDestination(event.target.value)}/>
            </FloatingLabel>

            <Form.Group>    
            <Form.Label>Select a date:</Form.Label>
            <Form.Control required type="date" className="mb-3" onChange={(event)=>setDate(event.target.value)}/>
            </Form.Group>

            <Form.Group>    
            <Form.Label>Set departure time:</Form.Label>
            <Form.Control required type="time" className="mb-3" onChange={(event)=>setTime(event.target.value)}/>
            </Form.Group>

            <Form.Select aria-label="Default select example" onChange={(e)=>{setCar(e.target.value)}}>
            <option>Select your car</option>
            {
                docSnap.cars?.map((car)=>{
                    return <option value={JSON.stringify(car)} >{`${car.brand} ${car.model}, ${car.color}`}</option>
                })
            }
            </Form.Select>

            <Form.Label>Set price:</Form.Label>
            <InputGroup className="mb-3">    
            <InputGroup.Text>MKD</InputGroup.Text>
            <Form.Control type="number" required onChange={(event)=>setPrice(Number(event.target.value))}/>
            <InputGroup.Text>.00</InputGroup.Text>
            </InputGroup>

            <Form.Group>    
            <Form.Label>Available seats:</Form.Label>
            <Form.Control required type="number" className="mb-3" value={numSeats} onChange={(event)=>setNumSeats(Number(event.target.value))}
            />
            </Form.Group>

            {error && <p className="text-danger">{error}</p>}

            <Button type="submit" className="w-100" style={{display: pending? 'block' : 'none'}}>
                Create</Button>
            <Button className="w-100" style={{display: pending? 'none' : 'block'}} onClick={()=>{window.location.reload()}}>Create more rides</Button>
            </Form>
            </Card.Body>
        </Card>
        </Container>
        </>
    )
}