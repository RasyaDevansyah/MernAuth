import { useState, useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext.jsx'
import InputField from '../components/InputField.jsx'

const Login = () => {
  const navigate = useNavigate()

  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContext)

  const [state, setState] = useState('Sign Up')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault()
      axios.defaults.withCredentials = true

      if (state === 'Sign Up') {
        const { data } = await axios.post(backendUrl + '/api/auth/register',
          {
            name,
            email,
            password
          }
        )
        if (data.success) {
          setIsLoggedin(true)
          toast.success(data.message)
          getUserData()
          navigate('/')
        }
        else {
          toast.error(data.message)
          
        }

      }
      else {
        console.log(email, password)
        const { data } = await axios.post(
          backendUrl + '/api/auth/login',
          {
            email,
            password
          },
        )
        if (data.success) {
          setIsLoggedin(true)
          toast.success(data.message)
          getUserData()
          navigate('/')
        }
        else {
          toast.error(data.message)
        }
      }

    }
    catch (err) {
      console.log(err)
      toast.error("Something went wrong!")
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
      <img onClick={() => navigate('/')} src={assets.logo} className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />
      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>

        <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</h2>
        <p className='text-center text-sm mb-6'>{state === 'Sign Up' ? 'Create your account' : 'Login to your account!'}</p>

        <form onSubmit={onSubmitHandler}>
          {state === 'Sign Up' && (

            <InputField type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} icon="person"/>
          
          )}
          
          <InputField type="email" placeholder="Email Id" value={email} onChange={(e) => setEmail(e.target.value)} icon="mail"/>

          <InputField type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} icon="lock"/>

          <p onClick={() => navigate('/reset-password')} className='mb-4 text-indigo-500 cursor-pointer'>Forgot password?</p>

          <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium cursor-pointer'
            type='submit'
          >{state}</button>
        </form>


        {state === 'Sign Up' ?
          (<p className='text-gray-400 text-center text-xs mt-4'
          >Already have an account?{' '}
            <span onClick={() => setState('Login')}
              className='text-blue-400 cursor-pointer underline'>Login here</span>
          </p>)
          :
          (<p className='text-gray-400 text-center text-xs mt-4'
          >Don't have an account?{' '}
            <span onClick={() => setState('Sign Up')}
              className='text-blue-400 cursor-pointer underline'>Sign up</span>
          </p>)}
      </div>

    </div>
  )
}

export default Login