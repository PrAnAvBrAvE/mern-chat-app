import React from 'react';
import { BiLogOut } from "react-icons/bi";
import useLogout from '../../hooks/useLogout'; // Import your useLogout hook

const LogoutButton = () => {
  const { loading, logout } = useLogout(); // Use the useLogout hook to get logout function and loading state

  return (
    <div className='mt-auto'>
      {!loading ? (
        <BiLogOut className='w-6 h-6 text-white cursor-pointer' onClick={logout}/>
      ) : (
        <span className='loading loading-spinner'></span> // Spinner during logout
      )}
    </div>
  );
}

export default LogoutButton;