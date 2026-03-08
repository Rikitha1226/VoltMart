import { Link } from "react-router-dom";

function Sidebar(){

  return(

    <div className="sidebar">

      <h2>VoltMart</h2>

      <Link to="/admin">Dashboard</Link>
      <Link to="/cashier">Billing</Link>
      <Link to="/">Logout</Link>

    </div>

  )

}

export default Sidebar;