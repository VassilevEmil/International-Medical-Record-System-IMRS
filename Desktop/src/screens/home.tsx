import { Link } from "react-router-dom";
import { FaPlus, FaList } from "react-icons/fa";
import IconBach from "./../assets/IconBach.svg";
import "./HomeScreen.css";

const HomeScreen = () => {
  return (
    <div className="background">
      <div className="home-container">
        <div className="title-container">
          <h1 className="home-title">Mock</h1>
          <h1 className="home-title-EHRS">EHRS</h1>
          <h1 className="home-title">System</h1>
        </div>
        <img src={IconBach} alt="Icon Bach" className="home-icon" />
        <nav>
          <ul className="home-nav">
            <li>
              <Link to="/addRecord" >
                <FaPlus className="icon" /> Add Record
              </Link>
            </li>
            <li>
              <Link to="/viewRecords">
                <FaList className="icon" /> View Records
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default HomeScreen;
