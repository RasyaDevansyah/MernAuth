import { assets } from "../assets/assets"

const InputField = ({type = 'text', placeholder, value, onChange, icon, required = true, className = ''}) => {
  // Get the icon from assets based on the icon prop
  const getIcon = () => {
    switch (icon) {
      case 'mail':
        return assets.mail_icon
      case 'lock':
        return assets.lock_icon
      case 'person':
        return assets.person_icon
      default:
        return null
    }
  }

  return (
    <div className={`mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] ${className}`}>
      {icon && <img src={getIcon()} alt="" className="w-3 h-3" />}
      <input
        className='bg-transparent outline-none w-full text-white'
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  )
}

export default InputField