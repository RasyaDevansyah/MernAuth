import { createContext, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext()


export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [isLoggedIn, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(false);
    

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
            toast.error("Something went wrong while fetching user data")
        }

    }


    const value = {
        backendUrl,
        isLoggedIn, setIsLoggedin,
        userData, setUserData,
        getUserData
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}