import React, {useState} from  'react';
import {useAuth} from './AuthContext';
import {Card, Form, Button, Container, Row, Col} from 'react-bootstrap';
import {Link, useNavigate} from 'react-router-dom';
import {db} from './firebase'
import {setDoc, doc, collection} from 'firebase/firestore'

export default function Registration(){
    const [registerEmail, setRegisterEmail]=useState("");
    const [registerPassword, setRegisterPassword]=useState("");
    const [passwordConfirmation, setPasswordConfirmation]=useState("");
    const [name, setName]=useState("");
    const [surname, setSurname]=useState("");
    const [age, setAge]=useState(0);
    const [sex, setSex]=useState("male");
    const [phoneNumber, setPhoneNumber]=useState("")
    const [offersRides, setOffersRides]=useState(false);
    const [error, setError]=useState("");
    const {register, currentUser}=useAuth()
    const photoURL = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"

    const navigate=useNavigate();

    const registerUser = async(event)=>{
        event.preventDefault()
        setError("") 
        if (registerPassword !== passwordConfirmation) {
            return setError("Passwords do not match")
          }
        try{
            const res = await register (registerEmail, registerPassword)
            await setDoc(doc(db, "users", res.user.uid), {
                 name: name, surname: surname, age: age, sex: sex, offersRides: offersRides, email: registerEmail, phone: phoneNumber, profilePhoto: photoURL, 
                 rating: {
                    totalRates: 0,
                    numRates: 0,
                    average: 0
                 },
                 cars: [] 
                 });
            console.log("User registered!")
            navigate('/')
        }
        catch(err){
            setError(err)
        }
    }
    const ErrorHandler=(props)=>{
        return <p className="text-danger">{props.err}</p>
    }
    return(
        <div>
        <Container className="d-flex align-items-center justify-content-center">
        <Card className='panel'>
            <Card.Body>
            <h2 className="text-center mb-4">Sign Up</h2>
            <Form onSubmit={registerUser}>
            <Row>
            <Form.Group as={Col}>    
            <Form.Label>Name:</Form.Label>
            <Form.Control required type="text" className="mb-3" placeholder="Your Name"  value={name}
            onChange={e=>setName(e.target.value)}/>
            </Form.Group>
            <Form.Group as={Col}>    
            <Form.Label>Surname:</Form.Label>
            <Form.Control required type="text" className="mb-3" placeholder="Your Surname"  value={surname}
            onChange={e=>setSurname(e.target.value)}/>
            </Form.Group>
            </Row>

            <Row>
            <Form.Group as={Col}>    
            <Form.Label>Age:</Form.Label>
            <Form.Control required type="number" className="mb-3" placeholder="Your Age"
            onChange={e=>setAge(e.target.value)}/>
            </Form.Group>
            <div className='col mb-3'>Sex:
            <Form.Check name='sex' type='radio' label='Male' value="male" id="isMale" 
             onChange={e=>setSex(e.target.value)} required/>
            <Form.Check name='sex' type='radio' label='Female' value="female" id="isFemale"
            onChange={e=>setSex(e.target.value)}/>
            </div>
            </Row>

            <div className='mb-3'>
            <Form.Check type='checkbox' label='I will also offer rides' id="offersRides"
            onChange={()=>{setOffersRides(!offersRides)}}/>
            </div>

            <Row>
            <Form.Group as={Col}>    
            <Form.Label>E-mail:</Form.Label>
            <Form.Control required type="email" className="mb-3" placeholder="username"  value={registerEmail}
            onChange={e=>setRegisterEmail(e.target.value)}/>
            </Form.Group>
            <Form.Group as={Col}>    
            <Form.Label>Phone number:</Form.Label>
            <Form.Control required type="tel" className="mb-3" placeholder="Your phone number"  value={phoneNumber}
            onChange={e=>setPhoneNumber(e.target.value)}/>
            </Form.Group>
            </Row>

            <Form.Group>    
            <Form.Label>Password:</Form.Label>
            <Form.Control required type="password" className="mb-3" placeholder="password" value={registerPassword}
            onChange={e=>setRegisterPassword(e.target.value)}/>
            </Form.Group>

            <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control type="password"  className="mb-3" placeholder="Confirm entered password" required value={passwordConfirmation}
              onChange={e=>{setPasswordConfirmation(e.target.value)} } />
            </Form.Group>

            <ErrorHandler err={error}/>

            <Button type="submit" className="w-100">Sign up</Button>
            </Form>
            </Card.Body>
        </Card>
        </Container>

        <div className="w-100 text-center mt-2">
        Already have an account?
        <Link to="/SignIn"> Sign in </Link> 
      </div>
        
      </div>  
    )
}


