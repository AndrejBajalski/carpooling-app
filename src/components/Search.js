import React, {useState, useEffect} from "react"
import { CustomNavbar } from "./Navbar"
import {Form, Button, Container, Row, Col, FloatingLabel, Dropdown, DropdownButton} from 'react-bootstrap';
import { useAuth } from "./AuthContext";
import {db} from "./firebase"
import {doc,  updateDoc} from "firebase/firestore" 
import {useNavigate} from "react-router-dom"
import {Rating} from "react-simple-star-rating"
import '../App.css'

export const Search = () =>{
    const [allRides, setAllRides]=useState([])
    const [departureDate, setDepartureDate]=useState("");
    const [startingPoint, setStartingPoint]=useState("")
    const [destination, setDestination]=useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [rating, setRating]=useState("");
    const [results, setResults]=useState([]);
    const [sortBy, setSortBy]=useState("")
    const {currentUser, getRides, getUsersDocSnap, cancelationHandler}=useAuth();
    const [newPassenger, setNewPassenger]=useState({});
    const navigate=useNavigate();

    const priceRanges = [
        {label: 'None', value: '-'},
        { label: '0 MKD - 200 MKD', value: '1-200' },
        { label: '200 MKD - 350 MKD', value: '200-350' },
        { label: '350 MKD - 500 MKD', value: '350-500' },
        { label: '500 MKD - 1000 MKD', value: '500-1000' },
        { label: '1000+ MKD', value: '1000-' },
      ];

    const handlePriceRangeSelect=(selectedPriceRange)=>{
        const [min, max] = selectedPriceRange.split('-')
        setMinPrice(Number(min) || '')
        setMaxPrice(Number(max) || '')
    }
    
    useEffect(()=>{
        getUsersDocSnap(currentUser.uid).then((res)=>{setNewPassenger(res)})
        getRides().then((res)=>setAllRides(res))
    }, [])

    const filterRides = async(event)=>{
        event.preventDefault()
        let tmp = allRides.filter((ride)=>{
            let isSameDate = ride.date == departureDate
            let fitsPriceRange = true, isSameRoute = true
            if(startingPoint && destination ){
                isSameRoute = (ride.from === startingPoint) && (ride.to === destination)
            }
            if(minPrice && maxPrice){
                fitsPriceRange = ride.price>=minPrice && ride.price<=maxPrice
            }
            else if(minPrice){
                fitsPriceRange = ride.price>=minPrice
            }
            else if(maxPrice){
                fitsPriceRange =  ride.price<=maxPrice
            }
            return isSameDate && isSameRoute && fitsPriceRange
        })
        const result = await updateCreatorInfo(tmp)
        sortRides(sortBy, result)
    }

    const updateCreatorInfo = async (rides)=>{
        let res = await Promise.all(rides.map(async (ride)=>{
           const creatorInfo = await getUsersDocSnap(ride.creator.id)
           console.log(creatorInfo.rating)
           return {...ride, creator: creatorInfo}
        }))
        if(rating){
            res = res.filter((ride)=>{
            const [min, max] = rating.split('-')
            return ride.creator.rating.average>=Number(min) && ride.creator.rating.average<=Number(max)
            })
        }
        return res 
     }

     const sortRides = (argument, array)=>{
           switch(argument){
                case 'date':
                    array.sort((a, b)=> a.date > b.date && a.time > b.time ? 1:-1)
                    break; 
                case 'rating':
                    array.sort((a, b) => b.rating - a.rating);
                    break;
                case 'price': 
                    array.sort((a, b) => a.price - b.price);
                    break;    
           }
           setResults(array)
     }

    const reservationHandler = async(ride, index)=>{
        try{
         const docRef = doc(db, "rides", ride.id)
         newPassenger.rideRating = 0
         const updatedArray = [...ride.passengers, newPassenger]
         if(newPassenger.email === ride.creator.email ){   
            alert("Can't reserve a ride you have created")
         }
         else{
        const updated = [...results]
        updated[index].passengers = [...updatedArray]
        updated[index].seats = ride.seats-1
        console.log(ride.seats)
        await updateDoc(docRef, {passengers: updatedArray, seats: ride.seats})
        console.log('Successfully reserved ride!')
        setResults(updated)
         }
        }
        catch(err){
            alert(err)
        }
    }

     const gotoCreatorProfile = (creator)=>{
        navigate(`/about/${creator}`, {state:{creator: creator}})
     }

    return(
    <>
    <CustomNavbar search/>
    <Container className="bg-light border rounded-2 mt-3 p-3 position-relative" id="search">
        <Form onSubmit={filterRides} className="position-relative">
        <Form.Group>    
            <Form.Label>Select a date:</Form.Label>
            <Form.Control required type="date" className="mb-2" value={departureDate} onChange={(event)=>{
                setDepartureDate(event.target.value)}}/>
        </Form.Group>

        <Row className="mb-3">
        <Form.Group as={Col}>    
            <Form.Label>Starting point:</Form.Label>
            <Form.Control type="text" onChange={(event)=>{setStartingPoint(event.target.value)}} value={startingPoint} placeholder="City, town, address"/>
        </Form.Group>
        <Form.Group as={Col}>
            <Form.Label>Destination:</Form.Label>
            <Form.Control type="text" onChange={(event)=>{setDestination(event.target.value)}} value={destination} placeholder="City, town, address"/>
        </Form.Group>
        </Row>

      <Row>  
      <Form.Group as={Col} xs={3}>
      <FloatingLabel controlId="minPrice" label="Price min">
        <Form.Control type="number" value={minPrice} onChange={(e)=>{setMinPrice(Number(e.target.value))}} placeholder="Enter min price"/>
      </FloatingLabel>
      </Form.Group> 
      <Form.Group as={Col} xs={3}>        
      <FloatingLabel controlId="maxPrice" label="Price max">
        <Form.Control type="number" value={maxPrice} onChange={(e)=>setMaxPrice(Number(e.target.value))} placeholder="Enter max price"/>
      </FloatingLabel>
      </Form.Group>          
        <DropdownButton as={Col} xs={4} onSelect={handlePriceRangeSelect} title="Select Price Range" className="mt-3">
            {priceRanges.map((range) => (
              <Dropdown.Item key={range.value} eventKey={range.value}>
                {range.label}
              </Dropdown.Item>
            ))}
        </DropdownButton>

        <DropdownButton as={Col} xs={3} onSelect={(value)=>setRating(value)} title="Select driver's rating" className="mt-3">
            <Dropdown.Item eventKey="">None</Dropdown.Item>
            <Dropdown.Item eventKey="0-3">0-3</Dropdown.Item>
            <Dropdown.Item eventKey="3-4">3-4</Dropdown.Item>
            <Dropdown.Item eventKey="4-5">4-5</Dropdown.Item>
        </DropdownButton>        
        </Row>

        <Button type="submit" id="search-submit" className="mt-3 btn-success">Submit changes</Button>

        <DropdownButton onSelect={(value)=>setSortBy(value)} title="Sort by" className="mt-3">
            <Dropdown.Item eventKey="date">Departure date</Dropdown.Item>
            <Dropdown.Item eventKey="price">Price</Dropdown.Item>
            <Dropdown.Item eventKey="rating">Rating</Dropdown.Item>
        </DropdownButton>
        </Form>
    </Container>
     <Container id="searchRides">
     {
        results.length? 
        results.map((ride, index)=>{
            let isFull = false, alreadyReserved=false;
            const carInfo = JSON.parse(ride.car)           
            if(ride.seats < 1){
                isFull = true;
            }
            for(let obj of ride.passengers){
                if(obj.email===newPassenger.email){
                    alreadyReserved=true
                }
            }
            return(
                <div key={ride.id} className="ride">
                <button className="avatar styleless-button" onClick={()=>gotoCreatorProfile(ride.creator)}>
                    <img src={ride.creator.profilePhoto} alt="profilePhoto"/>
                </button>
                <div className="containerInfo">
                <div className="rideInfo">    
                <div className="me-md-3"><span className="fw-bold">From: </span>{ride.from}</div>
                <div className="me-md-3"><span className="fw-bold">To: </span>{ride.to}</div>
                <div className="me-md-3">Departure: {ride.date + ' at ' + ride.time}</div>
                <div className="me-md-3"><span className="fw-bold">Available seats: </span>{ride.seats}</div>
                <div className="me-md-3"><span className="fw-bold">Car: </span>{`${carInfo.brand} ${carInfo.model}, ${carInfo.color}`}</div>
                </div>

                <div className="w-100 justify-content-around rate-driver">
                    <div><strong>Creator: </strong>{ride.creator.name + ' ' +ride.creator.surname}</div>
                    <div><strong>Driver's rating: </strong>
                    {ride.creator.rating.numRates?
                    <Rating initialValue={ride.creator.rating.average} readonly allowFraction/> : <span>Not rated yet</span>
                    }
                    </div>
                </div>

                <div className="m-md-3 m-1">
                <Button className="btn-success" style={{display: (isFull || alreadyReserved) ? 'none' : 'block'}}
                 onClick={()=>{reservationHandler(ride, index)}}>Reserve</Button>

                 {isFull && <div className="w-100 text-center text-danger">No available seats</div>}
                </div> 
                 {alreadyReserved &&
                  <div className="mb-md-3 m-1">  
                  <span className="text-success me-2">Ride reserved!</span>
                  <Button className="btn-danger" onClick={()=>{cancelationHandler(ride).then(()=>window.location.reload())}}>Cancel reservation</Button>
                  </div>
                 }
                </div>
                <div className="fw-bold price"><p>{ride.price} MKD</p></div>
                </div> 
                )})
                :
                <div id="info">There are currently no scheduled rides for these parameters</div>
    }
     </Container>
    </>
 )
}