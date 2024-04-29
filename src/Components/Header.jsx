import logo from "../Images/logo.png";
import { IoLogOut } from "react-icons/io5";
import { useDispatch } from 'react-redux';
import { logout } from '../reducers/userSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// import logout from ""
const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const handleLogout = () => {
    dispatch(logout());
    navigate('/')
    toast.success('Logged Out From System.')
  };
  return (
    <div className="flex flex-row justify-between py-2 border">
      <div className="flex justify-between align-middles w-[34%]  ">
        <img className="w-[50%] ml-4" src={logo} />
        <h1 className="text-lg mr-2 font-semibold">Client Service Portal</h1>
      </div>
      <div className="flex justify-between align-middles gap-4 font-semibold mr-1 cursor-pointer" onClick={handleLogout}>
        <h1>Logout</h1>
        <IoLogOut size={28} />
      </div>
    </div>
  );
};

export default Header;
