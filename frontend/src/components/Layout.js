import { NavLink } from "react-router-dom";
import "./Layout.css"

function Layout({children}){
    return(
        <div className="layout">
            <div className="sidebar">
            <div className="sidebar-title">SpeechApp</div>
              <nav>
                <NavLink to= "/uploads">Uploads</NavLink>
                <NavLink to= "/history">History</NavLink>
              </nav>
            </div>
            <div className="content">{children}</div>
        </div>
    );
}

export default Layout;