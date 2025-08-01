
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Navbar = () => {

    const navigate = useNavigate()
    const {userData, backendUrl, setUserData, setIsLoggedin} = useContext(AppContext)

    const sendVerificatonOtp = async () => {
        try {
            axios.defaults.withCredentials = true
            const {data} = await axios.post(backendUrl + '/api/auth/send-verify-otp')
            if(data.success){   
                navigate('/email-verify')
                toast.success(data.message)
            }
            else{
                toast.error(data.message)
            }

        } catch (error) {
            console.error("Error sending verification OTP:", error);
            toast.error("Something went wrong while sending verification OTP");
        }
    }


    const logout = async () => {
        try {
            axios.defaults.withCredentials = true
            const {data} = await axios.post(backendUrl + '/api/auth/logout')
            if(data.success){
                setUserData(false)
                setIsLoggedin(false)
                toast.success(data.message)
                navigate('/')
            }
            else{
                console.error(data.message)
            }
        } catch (error) {
            console.error("Error during logout:", error);
            toast.error("Something went wrong during logout");
        }
    }


return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0'>

            <img src={assets.logo} alt="" className='w-28 sm:w-32'/>
            {userData ? 
            <div className='w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group'>
                {userData.name[0].toUpperCase()}
                <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10'>
                    <ul className='list-none m-0 p-2 bg-gray-100 text-sm'>
                        {!userData.isAccountVerified && 
                        <li onClick={sendVerificatonOtp} className='py-1 px-2 hover:bg-gray-200 cursor-pointer'>Verify Email</li>
                        }                        
                        <li onClick={logout} className='py-1 px-2 hover:bg-gray-200 pr-10 cursor-pointer'>Logout</li>
                    </ul>
                
                </div>

            </div> 
            : 
            <button onClick={() => navigate('/login')} 
            
            className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all cursor-pointer'>Login <img src={assets.arrow_icon} alt="" /></button>
            }

            

    </div>
)
}

export default Navbar