import React, { useContext, useRef, useState } from 'react'
import { assets } from '../assets/assets'
import { data, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import InputField from '../components/InputField'

const ResetPassword = () => {


  const {backendUrl} = useContext(AppContext)
  axios.defaults.withCredentials = true

  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isEmailSent, setIsEmailSent] = useState('')
  const [otp, setOtp] = useState(0)
  const [isOtpSubmited, setIsOtpSubmited] = useState(false)


  axios.defaults.withCredentials = true

  const inputRefs = useRef([])


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

  const onSubmitEmail = async (e)=>{
    e.preventDefault()
    try {
      const {data} = await axios.post(backendUrl + '/api/auth/send-reset-otp',{
        email:email
      })

      if(data.success){
        toast.success(data.message)
        setIsEmailSent(true)
      }
      else{
        toast.error(data.message)
      }

    } catch (error) {
      console.log("Error submitting email:" + error)
      toast.error("Error submitting email")
      
    }

  }


  const onSubmitOTP = async (e)=>{
    e.preventDefault();
    const otpArray = inputRefs.current.map(e=> e.value)
    setOtp(otpArray.join(''))
    setIsOtpSubmited(true)
  }


  const onSubmitNewPassword = async (e) =>{
    e.preventDefault();
    try{
      const {data} = await axios.post(backendUrl + '/api/auth/reset-password',{

        email:email,
        otp:otp,
        newPassword:newPassword
      })

      if(data.success){
        toast.success(data.message)
        navigate('/login')
      } else{
        toast.error(data.message)
        setIsOtpSubmited(false)
      }
      
    }catch(error){
      toast.error(error.message)
      console.log("Error resetting password: " + error)
    }


  }


  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>

      <img onClick={() => navigate('/')} src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />


      {!isEmailSent &&

        <form onSubmit={onSubmitEmail} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset password</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter your registered email address</p>

          <InputField type="email" placeholder="Email Id" value={email} onChange={(e) => setEmail(e.target.value)} icon="mail"/>

          <button type='submit'
            className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3 cursor-pointer'
          >Submit</button>
        </form>

      }

      {!isOtpSubmited && isEmailSent &&

        <form onSubmit={onSubmitOTP} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password OTP</h1>
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

          <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full cursor-pointer'
            type='submit'
          >Submit</button>
        </form>

      }

      {isOtpSubmited && isEmailSent &&

        <form onSubmit={onSubmitNewPassword} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>New password</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter the new password below</p>

          <InputField type="password" placeholder="Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} icon="lock"/>

          <button type='submit'
            className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3 cursor-pointer'
          >Submit</button>


        </form>

      }



    </div>
  )
}

export default ResetPassword