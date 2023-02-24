import { Link } from "react-router-dom";
import { useState } from "react";
import Profile from "../Accounts/Profile/Profile";
import newlogo from "../../Images/newlogo.png"
import useHamburgerMenu from "../../Hooks/useHamburgerMenu";
import hamburgerMenuIcon from "../../Images/hamburgerMenuIcon.png"
const NavBar = ({
  user,
  users,
  handleUser,
  authenticated,
  handleLogout,
  isOpen,
  setIsOpen,
	model,
	setActive,
	active
}) => {
	const loggedInUser = [{ id: ''}]
	const notification = []
  return (
		  <div className={`${ active ? 'brightness-90' : ''} bg-[#F5F5F5] h-[80px] w-screen fixed flex place-content-between	 place-items-center z-40`}>
				<div className="mapNavbar">
				<img
							className="h-[60px] w-[160px] p-2 pl-3 place-self-center"
							src={newlogo}
							alt="foundLogo"
				/>
				</div>
				<div className={''} onClick={() => {setActive(true)}}>
        	<img className='mr-4' width='30px' height='30px' src={hamburgerMenuIcon} alt='hamburger-icon'/>
      	</div>
			</div>

    // <div className="center-nav">
			
    //   <h3 className="text-nav">
    //       <Link to="/">Home</Link>
    //     </h3>
		// 		<Link to="/" className="logoLink">
    //       <img
    //         className="logo"
    //         src={newlogo}
    //         alt="foundLogo"
    //       />
    //     </Link>
    //     <h3 className="text-nav">
    //       <Link to="/about">About</Link>{" "}
    //     </h3>
    //   </div>
    //   <div className="user-nav">
    //     <Profile
    //       user={user}
    //       users={users}
    //       handleUser={handleUser}
    //       authenticated={authenticated}
    //       handleLogout={handleLogout}
    //       isOpen={isOpen}
    //       setIsOpen={setIsOpen}
		// 			model={model}
    //     />
    //   </div>
    // </section>
  );
};

export default NavBar;
