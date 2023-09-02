import React, { useState} from  'react';
import {useAuth} from './AuthContext';
import {Card, Form, Button, Container} from 'react-bootstrap';
import {Link, useNavigate} from 'react-router-dom';

export default function SignIn(){
    const [userEmail, setUserEmail]=useState("");
    const [userPassword, setUserPassword]=useState("");
    const [error, setError]=useState("");
    const { login } = useAuth()
    const navigate=useNavigate()

    const signInUser = async(event)=>{
        event.preventDefault()
        setError("") 
        try{
            await login(userEmail, userPassword)
            console.log("User signed in!")
            navigate('/')
        }
        catch{
            setError("Incorrect username or password")
        }
    }
    return(
        <div >
        <Container className="d-flex align-items-center justify-content-center">
        <Card className='panel'>
            <Card.Body>
            <h2 className="text-center mb-4">Sign In</h2>
            <Form>

            <Form.Group>    
            <Form.Label>E-mail:</Form.Label>
            <Form.Control required type="email" className="mb-3" placeholder="username"  value={userEmail}
            onChange={e=>setUserEmail(e.target.value)}/>
            </Form.Group>

            <Form.Group>    
            <Form.Label>Password:</Form.Label>
            <Form.Control required type="password" className="mb-3" placeholder="password" value={userPassword}
            onChange={e=>setUserPassword(e.target.value)}/>
            </Form.Group>

            {error && <p className="text-danger">{error}</p>}

            <Button type="submit" className="w-100" onClick={signInUser}>Sign in</Button>
            <p className="text-center mt-3">Forgot password?<Link to="/forgotPassword"> Change password</Link></p>
            </Form>
            </Card.Body>
        </Card>
        </Container>
        <div className="w-100 text-center mt-2">
        Don't have an account?
        <Link to="/Register"> Register </Link> 
      </div>
      </div>  
    )
}


