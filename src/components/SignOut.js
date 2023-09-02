import React from 'react';
import {signOut} from 'firebase/auth';
import {auth} from './firebase';

export default function SignOut(){
    async function signOutUser(){
        await signOut(auth)
    }
    return (
        <div>
            <button onClick={signOutUser}>Sign Out</button>
        </div>
    )
}
