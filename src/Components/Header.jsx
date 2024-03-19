import logo from "../Images/logo.png";
import { IoLogOut } from "react-icons/io5";
// import logout from ""
const Header = () => {
  return (
    <div className="flex flex-row justify-between py-2 border">
      <div className="flex justify-between align-middles w-[34%]  ">
        <img className="w-[50%] ml-4" src={logo} />
        <h1 className="text-lg mr-2 font-semibold">Client Service Portal</h1>
      </div>
      <div className="flex justify-between align-middles gap-4 font-semibold mr-1">
        <h1>Logout</h1>
        <IoLogOut size={28} />
      </div>
    </div>
  );
};

export default Header;
