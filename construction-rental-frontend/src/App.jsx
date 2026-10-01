import { useState } from "react";
import "./App.css";
import Booking from "./components/Booking";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  const [equipment, setEquipment] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(false);

  const [showLogin, setShowLogin] = useState(true);
  const [showRegister, setShowRegister] = useState(false);

  const [selectedEquipment, setSelectedEquipment] = useState(null);

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    role: "CUSTOMER"
  });


  // =====================================================
  // LOAD EQUIPMENT
  // =====================================================

  const loadEquipment = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/equipment"
      );

      if (!response.ok) {
        throw new Error("Unable to load equipment");
      }

      const data = await response.json();

      setEquipment(data);

    } catch (error) {
      console.error("Equipment error:", error);
      alert("Unable to load equipment");

    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // LOAD BOOKINGS
  // =====================================================

  const loadBookings = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/bookings"
      );

      if (!response.ok) {
        throw new Error("Unable to load bookings");
      }

      const data = await response.json();

      setBookings(data);

    } catch (error) {
      console.error("Bookings error:", error);
    }
  };


  // =====================================================
  // LOGIN
  // =====================================================

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:8080/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(loginData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Login failed");
        return;
      }

      setLoggedInUser(data);

      setShowLogin(false);
      setShowRegister(false);

      setLoginData({
        email: "",
        password: ""
      });

      // Load dashboard data
      loadEquipment();
      loadBookings();

    } catch (error) {
      console.error("Login error:", error);
      alert("Unable to connect to server");
    }
  };


  // =====================================================
  // REGISTER
  // =====================================================

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:8080/api/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(registerData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Registration failed");
        return;
      }

      alert("Registration successful! Please login.");

      setRegisterData({
        name: "",
        email: "",
        password: "",
        role: "CUSTOMER"
      });

      setShowRegister(false);
      setShowLogin(true);

    } catch (error) {
      console.error("Registration error:", error);
      alert("Unable to connect to server");
    }
  };


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    setLoggedInUser(null);

    setEquipment([]);
    setBookings([]);

    setSelectedEquipment(null);

    setShowLogin(true);
    setShowRegister(false);
  };


  // =====================================================
  // LOCAL EQUIPMENT IMAGES
  // =====================================================

  const getEquipmentImage = (item) => {
    const name = item.name?.toLowerCase() || "";
    const category = item.category?.toLowerCase() || "";


    // JCB EXCAVATOR
    if (
      name.includes("jcb") ||
      name.includes("excavator") ||
      category.includes("excavator")
    ) {
      return "/images/jcb-excavator.jpg";
    }


    // BULLDOZER
    if (
      name.includes("bulldozer") ||
      category.includes("bulldozer")
    ) {
      return "/images/bulldozer.jpg";
    }


    // TOWER CRANE
    if (
      name.includes("crane") ||
      category.includes("crane")
    ) {
      return "/images/tower-crane.jpg";
    }


    // DUMP TRUCK
    if (
      name.includes("dump truck") ||
      name.includes("truck") ||
      category.includes("truck")
    ) {
      return "/images/dump-truck.jpg";
    }


    // CONCRETE MIXER
    if (
      name.includes("concrete mixer") ||
      category.includes("concrete mixer")
    ) {
      return "/images/concrete-mixer.jpg";
    }


    // WHEEL LOADER
    if (
      name.includes("wheel loader") ||
      category.includes("loader")
    ) {
      return "/images/wheel-loader.jpg";
    }


    // DEFAULT
    return "/images/jcb-excavator.jpg";
  };


  // =====================================================
  // AUTH PAGE
  // =====================================================

  if (!loggedInUser) {
    return (
      <div className="auth-page">


        {/* LEFT SIDE */}

        <div className="auth-left">

          <div className="auth-brand">

            <span className="brand-mark">
              CR
            </span>

            Construct<span>Rent</span>

          </div>


          <div className="auth-hero">

            <p className="small-title">
              CONSTRUCTION EQUIPMENT RENTAL
            </p>


            <h1>
              Build Your Project

              <span>
                With The Right Equipment
              </span>
            </h1>


            <p>
              Rent reliable construction equipment,
              check availability and manage your
              bookings from one place.
            </p>


            <div className="auth-features">

              <div>
                <strong>01</strong>

                <span>
                  Easy Equipment Search
                </span>
              </div>


              <div>
                <strong>02</strong>

                <span>
                  Simple Equipment Booking
                </span>
              </div>


              <div>
                <strong>03</strong>

                <span>
                  Reliable Rental Management
                </span>
              </div>

            </div>

          </div>

        </div>


        {/* RIGHT SIDE */}

        <div className="auth-right">


          {/* LOGIN */}

          {showLogin && (

            <div className="auth-box">

              <h2>
                Welcome Back
              </h2>


              <p className="auth-subtitle">
                Login to your ConstructRent account
              </p>


              <form onSubmit={handleLogin}>

                <label>
                  Email
                </label>


                <input
                  type="email"
                  placeholder="Enter your email"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({
                      ...loginData,
                      email: e.target.value
                    })
                  }
                  required
                />


                <label>
                  Password
                </label>


                <input
                  type="password"
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({
                      ...loginData,
                      password: e.target.value
                    })
                  }
                  required
                />


                <button
                  type="submit"
                  className="auth-btn"
                >
                  Login
                </button>

              </form>


              <p className="switch-auth">

                Don't have an account?

                <button
                  onClick={() => {
                    setShowLogin(false);
                    setShowRegister(true);
                  }}
                >
                  Register
                </button>

              </p>

            </div>

          )}


          {/* REGISTER */}

          {showRegister && (

            <div className="auth-box">

              <h2>
                Create Account
              </h2>


              <p className="auth-subtitle">
                Register for ConstructRent
              </p>


              <form onSubmit={handleRegister}>

                <label>
                  Full Name
                </label>


                <input
                  type="text"
                  placeholder="Enter your name"
                  value={registerData.name}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      name: e.target.value
                    })
                  }
                  required
                />


                <label>
                  Email
                </label>


                <input
                  type="email"
                  placeholder="Enter your email"
                  value={registerData.email}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      email: e.target.value
                    })
                  }
                  required
                />


                <label>
                  Password
                </label>


                <input
                  type="password"
                  placeholder="Create a password"
                  value={registerData.password}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      password: e.target.value
                    })
                  }
                  required
                />


                <label>
                  Role
                </label>


                <select
                  value={registerData.role}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      role: e.target.value
                    })
                  }
                >

                  <option value="CUSTOMER">
                    Customer
                  </option>

                  <option value="ADMIN">
                    Admin
                  </option>

                </select>


                <button
                  type="submit"
                  className="auth-btn"
                >
                  Create Account
                </button>

              </form>


              <p className="switch-auth">

                Already have an account?

                <button
                  onClick={() => {
                    setShowRegister(false);
                    setShowLogin(true);
                  }}
                >
                  Login
                </button>

              </p>

            </div>

          )}

        </div>

      </div>
    );
  }


  // =====================================================
  // ACTIVE RENTALS
  // =====================================================

  const activeRentals = bookings.filter(
    (booking) => booking.status === "ACTIVE"
  ).length;


  // =====================================================
  // DASHBOARD
  // =====================================================

  return (
    <div className="dashboard">


      {/* =================================================
          NAVBAR
      ================================================= */}

      <nav className="main-navbar">


        <div className="main-logo">

          <span className="logo-icon">
            CR
          </span>

          Construct<span>Rent</span>

        </div>


        <div className="nav-links">

          <a href="#home">
            Home
          </a>

          <a href="#dashboard">
            Dashboard
          </a>

          <a href="#equipment">
            Equipment
          </a>

          <a href="#bookings">
            My Bookings
          </a>

        </div>


        <div className="nav-user">

          <div className="user-info">

            <span>
              Welcome, {loggedInUser.name}
            </span>

            <small>
              {loggedInUser.role}
            </small>

          </div>


          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>


      {/* =================================================
          HERO
      ================================================= */}

      <section
        className="hero-section"
        id="home"
      >

        <div className="hero-overlay"></div>


        <div className="hero-content">

          <p className="hero-small-title">
            CONSTRUCTION EQUIPMENT RENTAL
          </p>


          <h1>

            Reliable Equipment

            <br />

            <span>
              For Every Project
            </span>

          </h1>


          <p className="hero-description">

            Rent construction equipment easily,
            check availability and manage your
            bookings from one place.

          </p>


          <button
            className="hero-btn"
            onClick={() => {
              document
                .getElementById("equipment")
                ?.scrollIntoView({
                  behavior: "smooth"
                });
            }}
          >

            Explore Equipment

            <span>
              →
            </span>

          </button>

        </div>


        <div className="hero-side-text">

          Build
          <br />

          Rent
          <br />

          Grow

        </div>

      </section>


      {/* =================================================
          DASHBOARD CONTENT
      ================================================= */}

      <main
        className="dashboard-content"
        id="dashboard"
      >


        {/* DASHBOARD HEADER */}

        <div className="dashboard-heading">

          <div>

            <p>
              YOUR DASHBOARD
            </p>


            <h2>
              Welcome, {loggedInUser.name}
            </h2>

          </div>


          <div className="dashboard-date">
            Manage your equipment rentals
          </div>

        </div>


        {/* =================================================
            STATISTICS
        ================================================= */}

        <div className="stats-grid">


          {/* AVAILABLE EQUIPMENT */}

          <div className="stat-card">

            <div className="stat-icon orange">
              🚜
            </div>


            <div>

              <span>
                Available Equipment
              </span>


              <strong>
                {equipment.length}
              </strong>

            </div>

          </div>


          {/* BOOKINGS */}

          <div className="stat-card">

            <div className="stat-icon blue">
              📅
            </div>


            <div>

              <span>
                My Bookings
              </span>


              <strong>
                {bookings.length}
              </strong>

            </div>

          </div>


          {/* ACTIVE RENTALS */}

          <div className="stat-card">

            <div className="stat-icon green">
              📋
            </div>


            <div>

              <span>
                Active Rentals
              </span>


              <strong>
                {activeRentals}
              </strong>

            </div>

          </div>

        </div>


        {/* =================================================
            EQUIPMENT SECTION
        ================================================= */}

        <section
          className="equipment-section"
          id="equipment"
        >


          <div className="section-title">

            <div>

              <p>
                EQUIPMENT COLLECTION
              </p>


              <h2>
                Available Equipment
              </h2>

            </div>


            <span>
              {equipment.length} equipment available
            </span>

          </div>


          {/* LOADING */}

          {loading && (

            <div className="loading-box">
              Loading equipment...
            </div>

          )}


          {/* EMPTY */}

          {!loading &&
            equipment.length === 0 && (

              <div className="loading-box">
                No equipment available.
              </div>

            )}


          {/* EQUIPMENT CARDS */}

          {!loading &&
            equipment.length > 0 && (

              <div className="modern-equipment-grid">

                {equipment.map((item) => (

                  <div
                    className="modern-equipment-card"
                    key={item.id}
                  >


                    {/* EQUIPMENT IMAGE */}

                    <div className="equipment-image">

                      <img
                        src={getEquipmentImage(item)}
                        alt={item.name}
                      />


                      <span className="availability-badge">
                        {item.status}
                      </span>

                    </div>


                    {/* EQUIPMENT CONTENT */}

                    <div className="equipment-card-content">


                      <p className="equipment-category">
                        {item.category}
                      </p>


                      <h3>
                        {item.name}
                      </h3>


                      <p className="equipment-description">
                        {item.description}
                      </p>


                      <div className="equipment-location">
                        📍 {item.location}
                      </div>


                      <div className="equipment-card-bottom">


                        <div>

                          <small>
                            Rental Rate
                          </small>


                          <strong>

                            ₹{item.pricePerDay}

                            <span>
                              / day
                            </span>

                          </strong>

                        </div>


                        <button
                          onClick={() =>
                            setSelectedEquipment(item)
                          }
                        >
                          Book Equipment
                        </button>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            )}

        </section>


        {/* =================================================
            MY BOOKINGS
        ================================================= */}

        <section
          className="bookings-section"
          id="bookings"
        >


          <div className="section-title">

            <div>

              <p>
                RENTAL ACTIVITY
              </p>


              <h2>
                My Bookings
              </h2>

            </div>


            <span>
              {bookings.length} booking(s)
            </span>

          </div>


          {/* NO BOOKINGS */}

          {bookings.length === 0 && (

            <div className="empty-bookings">

              <div>
                📅
              </div>


              <h3>
                No Bookings Yet
              </h3>


              <p>
                Your equipment bookings will
                appear here.
              </p>

            </div>

          )}


          {/* BOOKINGS */}

          {bookings.length > 0 && (

            <div className="modern-bookings-grid">

              {bookings.map((booking) => (

                <div
                  className="modern-booking-card"
                  key={booking.id}
                >


                  <div className="booking-top">


                    <div className="booking-icon">
                      🚜
                    </div>


                    <div>

                      <h3>
                        {booking.equipment?.name ||
                          "Equipment"}
                      </h3>


                      <p>
                        Booking #{booking.id}
                      </p>

                    </div>


                    <span
                      className={
                        booking.status === "ACTIVE"
                          ? "booking-status active"
                          : "booking-status pending"
                      }
                    >
                      {booking.status}
                    </span>

                  </div>


                  <div className="booking-details-grid">


                    <div>

                      <span>
                        Start Date
                      </span>


                      <strong>
                        {booking.startDate}
                      </strong>

                    </div>


                    <div>

                      <span>
                        End Date
                      </span>


                      <strong>
                        {booking.endDate}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Location
                      </span>


                      <strong>
                        {booking.equipment?.location ||
                          "Not available"}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Estimated Amount
                      </span>


                      <strong className="booking-amount">
                        ₹{booking.estimatedAmount}
                      </strong>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>


      {/* =================================================
          BOOKING MODAL
      ================================================= */}

      {selectedEquipment && (

        <Booking
          equipment={selectedEquipment}

          onClose={() =>
            setSelectedEquipment(null)
          }

          onBookingSuccess={() => {
            loadBookings();
          }}
        />

      )}

    </div>
  );
}

export default App;