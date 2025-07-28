import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext()


export const AppContextProvider = (props) => {

    axios.defaults.withCredentials = true;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(false);
    
    const getAuthState = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/auth/is-auth')
            if(data.success){
                setIsLoggedin(true)
                getUserData()
            }
        } catch (error) {
            console.error("Error checking authentication state:", error);
            toast.error("Something went wrong while checking authentication state");
        }
    }


    const getUserData = async () => {
        try{
            axios.defaults.withCredentials = true
            const {data} = await axios.get(backendUrl + '/api/user/profile')
            if(data.success){
                setUserData(data.userData)
            }
            else{
                toast.error(data.message)
            }
        }
        catch(err){
            console.error("Error fetching user data:", err);
            toast.error("Something went wrong while fetching user data")
        }

    }

    useEffect(() => {
        getAuthState()
    }, [])

    const value = {
        backendUrl,
        isLoggedin, setIsLoggedin,
        userData, setUserData,
        getUserData
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}