import { useState } from 'react';
import { Link } from 'react-router-dom';
import closeIcon from '../Images/closeIcon.png'

export default function useHamburgerMenu({notification, loggedInUser}) {
	
  const [active, setActive] = useState(false);

  const handleClose = (scrollUp) => {

    if(scrollUp) document.body.scrollTop = document.documentElement.scrollTop = 0 

    setActive(false);
  };

  const hamburgerMenuStructure = (
    <div id='hamburgerMenu' className={`${active ? 'overflow-hidden transition-transform translate-x-0' : 'transition-transform translate-x-full'} flex fixed overflow-scroll h-screen w-screen top-0 left-0 transition-transform ease-in-out duration-500 z-50`}>
      <div onClick={handleClose} className={`w-[50%] bg-transparent`}>

			</div>
			<div className='whitespace-nowrap	rounded-md bg-white w-[50%] h-screen text-left p-5 flex place-self-end flex-col self-start tracking-wider font-medium uppercase'>
        <div className='flex flex-row place-content-between text-slate-800'>
          <Link to={'/'} onClick={handleClose} class="pt-5 text-xl mb-4 delay-150 hover:text-slate-400 hover:cursor-pointer">
              Home
              <div className={`${ !loggedInUser.id && notification.length ? '' : 'hidden' } font-['Open_Sans'] inline-flex absolute justify-center items-center w-[20px] h-[20px] text-xs font-bold text-white bg-red-500 rounded-full border-2 border-white dark:border-gray-900 tabular-nums`}>{`${ loggedInUser.id ? notification.filter((plant) => plant.user_id === loggedInUser.id).length : notification.length}`}</div>
          </Link >
          <img
              src={closeIcon}
              width='30px' 
              height='30px'
              onClick={() => handleClose(false)}
              className={`${active ? '' : ''} place-self-center py-4 hover:text-slate-400 hover:cursor-pointer`}
          />
        </div>    

        <Link to={'/new'} onClick={handleClose} class="text-xl mb-4 w-min delay-150 hover:text-slate-400 hover:cursor-pointer">
            My Items
        </Link>
				<Link to={'/chat'} onClick={handleClose} class="text-xl mb-4 w-min delay-150 hover:text-slate-400 hover:cursor-pointer">
            Chat
        </Link>
        <Link to={'/index'} onClick={handleClose} class="text-xl mb-4 w-min delay-150 hover:text-slate-400 hover:cursor-pointer">
            All Items
        </Link>
        <Link to={'/new'} onClick={handleClose} class="text-xl mb-4 w-min delay-150 hover:text-slate-400 hover:cursor-pointer">
            Report Item
        </Link>
        <Link to={'/'} onClick={handleClose} class="text-xl mb-4 w-min delay-150 hover:text-slate-400 hover:cursor-pointer">
            About
        </Link>

      </div>
    </div>
  );

  return [ active, setActive, hamburgerMenuStructure];
};