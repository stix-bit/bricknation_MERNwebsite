import {
    FacebookAuthProvider,
    GoogleAuthProvider,
    signInWithPopup,
} from 'firebase/auth'

import { firebaseAuth } from '../firebase'

const googleProvider = new GoogleAuthProvider()
const facebookProvider = new FacebookAuthProvider()

googleProvider.setCustomParameters({
    prompt: 'select_account',
})

export const signInWithGoogle = () =>
    signInWithPopup(firebaseAuth, googleProvider)

export const signInWithFacebook = () =>
    signInWithPopup(firebaseAuth, facebookProvider)
