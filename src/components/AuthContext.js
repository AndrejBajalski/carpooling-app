import React, { useContext, createContext, useState, useEffect } from "react"
import { auth, db } from "./firebase"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import {getDownloadURL, ref, getStorage, uploadBytes} from 'firebase/storage'
import {doc, getDoc, getDocs, collection, updateDoc} from "firebase/firestore";

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState({})
  const [loading, setLoading]=useState(true)
  const storage = getStorage()

  function register(email, password) {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  async function getUsersDocSnap(id){
    let res = await getDoc(doc(db, "users", id))
     return res.data()
  }

  async function getRides(){
    const data = await getDocs(collection(db, "rides"));
    const res = data.docs.map((doc)=>({
      id: doc.id,
      ...doc.data()
    }));
    return res;
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  function logout() {
    return signOut(auth)
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email)
  }

  async function upload(file, currentUser){
    const fileRef = ref(storage, currentUser.uid)
    setLoading(true)

    await uploadBytes(fileRef, file)
    const photoURL = await getDownloadURL(fileRef)

    updateProfile(currentUser, {photoURL: photoURL})
    setLoading(false)
  }

  const cancelationHandler = async(ride)=>{
    const updatedPassengers = ride.passengers.filter(pass => pass.email!==currentUser.email)
    const data={
        passengers: updatedPassengers,
        seats: ride.seats + 1
    }
    await updateDoc(doc(db, "rides", ride.id), data)
    console.log('ride canceled!')
  }  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    getUsersDocSnap,
    getRides,
    login,
    register,
    logout,
    resetPassword,
    upload,
    cancelationHandler
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
