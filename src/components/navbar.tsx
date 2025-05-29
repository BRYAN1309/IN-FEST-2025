import { useNavigate } from 'react-router-dom';

const navbar = () => {

    const navigate = useNavigate();

  return (
    <nav className="w-full bg-transparent text-white py-4 px-8 flex justify-between items-center">
      <div className="text-3xl ml-8 font-bold">NextPath</div>
        <ul className="hidden md:flex mt-2 space-x-10 text-sm font-light">
            <li>
                <div className="inline-block group rounded-full">
                    <div
                        className="
                        p-[2px] rounded-full 
                        transition-all duration-500 delay-200
                        group-hover:bg-[linear-gradient(90deg,_rgb(255,0,128),_rgb(128,0,255))]
                        group-hover:group-hover:shadow-lg
                        transform
                        "
                    >
                        <a
                        href="#About"
                        className="
                            block bg-black text-white 
                            rounded-full px-8 py-2 text-sm font-semibold 
                            transition-all duration-500
                            group-hover:text-pink-300
                        "
                        >
                        About
                        </a>
                    </div>
                </div>
            </li>
            <li>
                <div className="inline-block group rounded-full">
                    <div
                        className="
                        p-[2px] rounded-full 
                        transition-all duration-500 delay-200
                        group-hover:bg-[linear-gradient(90deg,_rgb(255,0,128),_rgb(128,0,255))]
                        group-hover:group-hover:shadow-lg
                        transform
                        "
                    >
                        <a
                        href="#Services"
                        className="
                            block bg-black text-white 
                            rounded-full px-8 py-2 text-sm font-semibold 
                            transition-all duration-500
                            group-hover:text-pink-300
                        "
                        >
                        Services
                        </a>
                    </div>
                </div>
            </li>
            <li>
                <div className="inline-block group rounded-full">
                    <div
                        className="
                        p-[2px] rounded-full 
                        transition-all duration-500 delay-200
                        group-hover:bg-[linear-gradient(90deg,_rgb(255,0,128),_rgb(128,0,255))]
                        group-hover:group-hover:shadow-lg
                        transform
                        "
                    >
                        <a
                        href="#Contact"
                        className="
                            block bg-black text-white 
                            rounded-full px-8 py-2 text-sm font-semibold 
                            transition-all duration-500
                            group-hover:text-pink-300
                        "
                        >
                        Contact
                        </a>
                    </div>
                </div>
            </li>
        </ul>
        {/*Sign in*/}
        <div className="inline-block rounded-full text-1xl p-[2px] bg-gradient-to-r from-pink-500 to-purple-500 mr-8">
            <button
                onClick={() => navigate("/login")}
                className="
                bg-black text-white px-10 py-2 rounded-full 
                transition-all duration-300
                hover:text-pink-300
                "
            >
                Sign in
            </button>
        </div>
    </nav>
  )
}

export default navbar
