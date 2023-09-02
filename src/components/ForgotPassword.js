import React, { useState } from "react"
import {useAuth} from "./AuthContext"
import {Card, Form, Button, Alert} from 'react-bootstrap';
import {Link} from 'react-router-dom';

export default function ForgotPassword(){
const [message, setMessage]=useState("")
const [error, setError]=useState("")
const [userEmail, setUserEmail]=useState("")
const {resetPassword}=useAuth()

async function handleSubmit(event){
  event.preventDefault()
  setMessage("")
        setError("")
    try{
        await resetPassword(userEmail)
        setMessage("You have been sent an e-mail for password reset")
    }
    catch(error){
        setError(error)
    }
}
return (
    <>
      <Card className="panel m-3">
        <Card.Body>
          <h2 className="text-center mb-4">Password Reset</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          <Form>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" className="mb-3" required 
              onChange={(e)=>{
                    setUserEmail(e.target.value)
              }
              } />
            </Form.Group>

            <Button className="w-100" type="submit" onClick={handleSubmit}> 
              Reset Password
            </Button>
          </Form>
          <div className="w-100 text-center mt-3">
            <Link to="/signIn">Login</Link>
          </div>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Need an account? <Link to="/register">Sign Up</Link>
      </div>
    </>
  )
}