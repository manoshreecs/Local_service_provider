import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem("token");
    const [openMenu, setOpenMenu] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const menuRef = useRef(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenMenu(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);


    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);


        navigate(`/services?search=${value}`);
    };

    const handleSearch = (e) => {
        if (e.key === "Enter" && searchQuery.trim() !== "") {
            navigate(`/services?search=${searchQuery}`);

        }
    };

    const handleLogout = () => {
        setOpenMenu(false);
        localStorage.removeItem("token");
        navigate("/login");
        window.location.reload();
    };

    return ( <
        >
        <
        nav className = { `fixed top-0 left-0 w-full bg-orange-500 text-white px-6 py-4 flex items-center justify-between z-50 transition-all ${
          scrolled ? "shadow-lg" : ""
        }` } >
        <
        Link to = "/"
        className = "text-xl font-bold tracking-wide shrink-0" >
        ServiceHub <
        /Link>


        <
        div className = "hidden md:flex gap-6 items-center ml-auto mr-8" >
        <
        Link to = "/"
        className = "hover:text-orange-200 transition-colors" > Home < /Link>

        <
        Link to = "/services"
        className = "hover:text-orange-200 transition-colors" >
        Services <
        /Link>

        <
        Link to = "/provider-dashboard"
        className = "hover:text-orange-200 transition-colors font-semibold" >
        Dashboard <
        /Link>

        <
        Link to = "/about"
        className = "hover:text-orange-200 transition-colors" > About < /Link> <
        /div>

        <
        div className = "flex items-center gap-3 ml-auto md:ml-0"
        ref = { menuRef } >
        <
        div className = "hidden sm:flex items-center bg-white px-4 py-2 rounded-md" >
        <
        input type = "text"
        placeholder = "Search services..."
        className = "outline-none text-sm text-gray-700 w-32 lg:w-60"
        value = { searchQuery }
        onChange = { handleInputChange }
        onKeyDown = { handleSearch }
        /> <
        /div>

        <
        div className = "flex items-center gap-2" > {!isLoggedIn ? ( <
                >
                <
                button onClick = {
                    () => setMobileOpen(true) }
                className = "md:hidden p-1 mr-1" >
                <
                svg width = "28"
                height = "28"
                fill = "none"
                stroke = "currentColor"
                strokeWidth = "2.5" >
                <
                line x1 = "3"
                y1 = "6"
                x2 = "21"
                y2 = "6" / > < line x1 = "3"
                y1 = "12"
                x2 = "21"
                y2 = "12" / > < line x1 = "3"
                y1 = "18"
                x2 = "21"
                y2 = "18" / >
                <
                /svg> <
                /button> <
                Link to = "/login"
                className = "bg-slate-600 text-white px-5 py-2 rounded-md font-bold hover:bg-slate-700 text-sm" >
                Login <
                /Link> <
                />
            ) : ( <
                div className = "relative flex items-center gap-3" >
                <
                div onClick = {
                    () => setOpenMenu(!openMenu) }
                className = "w-10 h-10 bg-white text-orange-500 rounded-full flex items-center justify-center cursor-pointer shadow-sm" >
                <
                svg width = "20"
                height = "20"
                viewBox = "0 0 24 24"
                fill = "none"
                stroke = "currentColor"
                strokeWidth = "2" >
                <
                circle cx = "12"
                cy = "7"
                r = "4" / > < path d = "M5.5 21a6.5 6.5 0 0 1 13 0" / >
                <
                /svg> <
                /div>

                {
                    openMenu && ( <
                        div className = "absolute right-0 top-14 w-44 bg-white text-gray-700 rounded-lg shadow-xl border border-gray-100" >
                        <
                        Link to = "/bookings"
                        onClick = {
                            () => setOpenMenu(false) }
                        className = "block px-4 py-3 hover:bg-orange-50 font-medium" >
                        My Bookings <
                        /Link> <
                        button onClick = { handleLogout }
                        className = "w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 border-t font-medium" >
                        Logout <
                        /button> <
                        /div>
                    )
                } <
                /div>
            )
        } <
        /div> <
        /div> <
        /nav>


        <
        div className = { `fixed top-0 left-0 h-full w-72 bg-orange-600 text-white z-[60] transform transition-transform duration-300 ease-in-out ${mobileOpen ? "translate-x-0" : "-translate-x-full"}` } >
        <
        div className = "p-6 flex justify-between items-center border-b border-orange-500" >
        <
        span className = "text-xl font-bold" > ServiceHub < /span> <
        button onClick = {
            () => setMobileOpen(false) }
        className = "text-3xl" > & times; < /button> <
        /div> <
        div className = "flex flex-col gap-2 mt-4 px-4 text-lg" >
        <
        Link to = "/"
        className = "p-3 hover:bg-orange-500 rounded-md"
        onClick = {
            () => setMobileOpen(false) } > Home < /Link>

        <
        Link to = "/services"
        className = "p-3 hover:bg-orange-500 rounded-md"
        onClick = {
            () => setMobileOpen(false) } >
        Services <
        /Link>

        <
        Link to = "/provider-dashboard"
        className = "p-3 hover:bg-orange-500 rounded-md"
        onClick = {
            () => setMobileOpen(false) } >
        Dashboard <
        /Link> <
        Link to = "/about"
        className = "p-3 hover:bg-orange-500 rounded-md"
        onClick = {
            () => setMobileOpen(false) } > About < /Link> <
        /div> <
        /div>

        {
            mobileOpen && ( <
                div className = "fixed inset-0 bg-black/30 backdrop-blur-sm z-[55]"
                onClick = {
                    () => setMobileOpen(false) }
                />
            )
        } <
        />
    );
};

export default Sidebar;