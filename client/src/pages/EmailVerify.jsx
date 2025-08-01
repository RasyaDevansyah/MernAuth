import React, { use, useContext, useEffect } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AppContext } from '../context/AppContext.jsx'

const EmailVerify = () => {
  axios.defaults.withCredentials = true
  const navigate = useNavigate()

  const {backendUrl, getUserData, isLoggedin, userData} = useContext(AppContext)

  const inputRefs = React.useRef([])


  const handleInput = (e, index) => {
    const value = e.target.value
    if (value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus()
    }
  }
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && index > 0 && e.target.value === '') {
      inputRefs.current[index - 1].focus()
    }
  }
  const handlePaste = (e) => {
    const pastedData = e.clipboardData.getData('text').split('')
    pastedData.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char
        inputRefs.current[index].dispatchEvent(new Event('input', { bubbles: true }))
      }
    })
  }

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault()
      const otpArray = inputRefs.current.map(e => e.value)
      const otp = otpArray.join('')

      console.log("OTP entered:", otp)
      const {data} = await axios.post(backendUrl + '/api/auth/verify-account', { otp:otp })

      if(data.success){
        toast.success("Email verified successfully!")
        navigate('/')
        getUserData()
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      console.error("Error verifying email:", error)
      toast.error("Something went wrong while verifying email")
    }

  }

  useEffect(() => {
    isLoggedin && userData && userData.isAccountVerified && navigate('/')
  }, [isLoggedin, userData])

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
      
      <img onClick={()=>navigate('/')} src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'/>

      <form onSubmit={onSubmitHandler} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>Email Verify OTP</h1>
        <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit code sent to your email id.</p>

        <div className='flex justify-between mb-8'>
          {Array(6).fill(0).map((_, index) => (
              <input type="text" maxLength='1' key={index} required
              className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md'
              ref={e => inputRefs.current[index] = e}
              onInput={(e) => handleInput(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={(e) => handlePaste(e)}
              />
          ))}
        </div>

        <button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'
        type='submit'
        >Verify Email</button>


      </form>

        
    </div>
  )
}

export default EmailVerify