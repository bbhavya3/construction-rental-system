import { useState } from "react";
import "./App.css";
import Booking from "./components/Booking";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  const [equipment, setEquipment] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [dispatches, setDispatches] = useState([]);
  const [dispatchForm, setDispatchForm] = useState({
    bookingId: "",
    driverName: "",
    vehicleNumber: "",
    deliveryAddress: "",
    destination: "",
    scheduledDate: "",
    dispatchDate: "",
    status: "PENDING",
    assignedTo: "Admin"
  });
  const [savingDispatch, setSavingDispatch] = useState(false);
  const [loadingDispatches, setLoadingDispatches] = useState(false);

  const [loading, setLoading] = useState(false);

  const [showLogin, setShowLogin] = useState(true);
  const [showRegister, setShowRegister] = useState(false);

  const [selectedEquipment, setSelectedEquipment] = useState(null);

  const [equipmentForm, setEquipmentForm] = useState({
    name: "",
    category: "",
    description: "",
    pricePerDay: "",
    location: "",
    status: "AVAILABLE"
  });
  const [editingEquipmentId, setEditingEquipmentId] = useState(null);
  const [savingEquipment, setSavingEquipment] = useState(false);


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


  // Add the JWT token to every protected backend request.
  const authFetch = (url, options = {}) => {
    const token = localStorage.getItem("token");

    return fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
  };

  // =====================================================
  // LOAD EQUIPMENT
  // =====================================================

  const loadEquipment = async () => {
    setLoading(true);

    try {
      const response = await authFetch(
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
      const response = await authFetch(
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
  // LOAD DISPATCHES
  // =====================================================

  const loadDispatches = async () => {
    setLoadingDispatches(true);
    try {
      const response = await authFetch("http://localhost:8080/api/dispatches");
      if (!response.ok) {
        throw new Error("Unable to load dispatches");
      }
      const data = await response.json();
      setDispatches(data);
    } catch (error) {
      console.error("Dispatches error:", error);
      alert("Unable to load dispatches. Check whether the backend is running.");
    } finally {
      setLoadingDispatches(false);
    }
  };

  const handleCreateDispatch = async (e) => {
    e.preventDefault();
    setSavingDispatch(true);
    try {
      const selectedBooking = bookings.find(
        (booking) => String(booking.id) === String(dispatchForm.bookingId)
      );
      if (!selectedBooking) {
        alert("Please select a valid booking.");
        return;
      }

      const payload = {
        booking: { id: Number(dispatchForm.bookingId) },
        driverName: dispatchForm.driverName.trim(),
        vehicleNumber: dispatchForm.vehicleNumber.trim(),
        deliveryAddress: dispatchForm.deliveryAddress.trim(),
        destination: (dispatchForm.destination || dispatchForm.deliveryAddress).trim(),
        scheduledDate: dispatchForm.scheduledDate,
        dispatchDate: dispatchForm.dispatchDate || dispatchForm.scheduledDate,
        status: dispatchForm.status,
        assignedTo: dispatchForm.assignedTo.trim() || "Admin"
      };

      const response = await authFetch("http://localhost:8080/api/dispatches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Unable to create dispatch");
      }

      alert("Dispatch created successfully.");
      setDispatchForm({
        bookingId: "",
        driverName: "",
        vehicleNumber: "",
        deliveryAddress: "",
        destination: "",
        scheduledDate: "",
        dispatchDate: "",
        status: "PENDING",
        assignedTo: "Admin"
      });
      await loadDispatches();
    } catch (error) {
      console.error("Create dispatch error:", error);
      alert(error.message || "Unable to create dispatch.");
    } finally {
      setSavingDispatch(false);
    }
  };

  const handleUpdateDispatchStatus = async (dispatch, status) => {
    try {
      const response = await authFetch(
        `http://localhost:8080/api/dispatches/${dispatch.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status })
        }
      );
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Unable to update dispatch status");
      }
      await loadDispatches();
    } catch (error) {
      console.error("Update dispatch error:", error);
      alert(error.message || "Unable to update dispatch status.");
    }
  };

  const handleDeleteDispatch = async (id) => {
    if (!window.confirm(`Delete dispatch #${id}?`)) return;
    try {
      const response = await authFetch(`http://localhost:8080/api/dispatches/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Unable to delete dispatch");
      }
      alert("Dispatch deleted successfully.");
      await loadDispatches();
    } catch (error) {
      console.error("Delete dispatch error:", error);
      alert(error.message || "Unable to delete dispatch.");
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

      if (data.token) {
        localStorage.setItem("token", data.token);
      } else {
        throw new Error("Login succeeded but the server did not return a JWT token.");
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
      if (data.role?.toUpperCase() === "ADMIN") loadDispatches();

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
    localStorage.removeItem("token");
    setLoggedInUser(null);

    setEquipment([]);
    setBookings([]);
    setDispatches([]);

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



  const resetEquipmentForm = () => {
    setEquipmentForm({
      name: "",
      category: "",
      description: "",
      pricePerDay: "",
      location: "",
      status: "AVAILABLE"
    });
    setEditingEquipmentId(null);
  };

  const handleSaveEquipment = async (e) => {
    e.preventDefault();
    setSavingEquipment(true);
    try {
      const isEditing = editingEquipmentId !== null;
      const response = await authFetch(
        isEditing
          ? `http://localhost:8080/api/equipment/${editingEquipmentId}`
          : "http://localhost:8080/api/equipment",
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...equipmentForm,
            pricePerDay: Number(equipmentForm.pricePerDay)
          })
        }
      );
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Unable to save equipment");
      }
      alert(isEditing ? "Equipment updated successfully." : "Equipment added successfully.");
      resetEquipmentForm();
      await loadEquipment();
    } catch (error) {
      console.error("Save equipment error:", error);
      alert(error.message || "Unable to save equipment. Check the backend.");
    } finally {
      setSavingEquipment(false);
    }
  };

  const startEditEquipment = (item) => {
    setEditingEquipmentId(item.id);
    setEquipmentForm({
      name: item.name || "",
      category: item.category || "",
      description: item.description || "",
      pricePerDay: item.pricePerDay ?? "",
      location: item.location || "",
      status: item.status || "AVAILABLE"
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loggedInUser.role?.toUpperCase() === "ADMIN") {
    const adminActiveRentals = bookings.filter(
      (booking) => booking.status === "ACTIVE"
    ).length;

    const fieldStyle = {
      width: "100%",
      padding: "11px 12px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      background: "#fff",
      color: "#111827",
      boxSizing: "border-box",
      marginTop: "6px"
    };
    const cardStyle = {
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      padding: "20px",
      boxShadow: "0 4px 14px rgba(15,23,42,0.04)"
    };

    return (
      <div className="dashboard" style={{ minHeight: "100vh", background: "#f4f6f9" }}>
        <nav className="main-navbar">
          <div className="main-logo">
            <span className="logo-icon">CR</span>
            Construct<span>Rent</span>
          </div>
          <div className="nav-links">
            <a href="#admin-dashboard">Dashboard</a>
            <a href="#admin-equipment">Equipment</a>
            <a href="#admin-bookings">All Bookings</a>
            <a href="#admin-dispatches">Dispatches</a>
          </div>
          <div className="nav-user">
            <div className="user-info">
              <span>Welcome, {loggedInUser.name}</span>
              <small>ADMIN</small>
            </div>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </nav>

        <main id="admin-dashboard" style={{ maxWidth: "1200px", margin: "0 auto", padding: "36px 24px" }}>
          <div style={{ marginBottom: "26px" }}>
            <p style={{ color: "#f59e0b", fontWeight: 800, letterSpacing: "3px", marginBottom: "8px" }}>CONSTRUCTRENT MANAGEMENT</p>
            <h1 style={{ color: "#111827", margin: 0 }}>Admin Dashboard</h1>
            <p style={{ color: "#64748b", marginTop: "8px" }}>Manage equipment inventory and monitor customer bookings.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "16px", marginBottom: "30px" }}>
            <div style={cardStyle}><p style={{ color: "#64748b", margin: "0 0 8px" }}>Total Equipment</p><strong style={{ fontSize: "30px", color: "#111827" }}>{equipment.length}</strong></div>
            <div style={cardStyle}><p style={{ color: "#64748b", margin: "0 0 8px" }}>Total Bookings</p><strong style={{ fontSize: "30px", color: "#111827" }}>{bookings.length}</strong></div>
            <div style={cardStyle}><p style={{ color: "#64748b", margin: "0 0 8px" }}>Active Rentals</p><strong style={{ fontSize: "30px", color: "#059669" }}>{adminActiveRentals}</strong></div>
            <div style={cardStyle}><p style={{ color: "#64748b", margin: "0 0 8px" }}>Pending Bookings</p><strong style={{ fontSize: "30px", color: "#d97706" }}>{bookings.filter((b) => b.status === "PENDING").length}</strong></div>
            <div style={cardStyle}><p style={{ color: "#64748b", margin: "0 0 8px" }}>Total Dispatches</p><strong style={{ fontSize: "30px", color: "#2563eb" }}>{dispatches.length}</strong></div>
          </div>

          <section style={{ ...cardStyle, marginBottom: "28px" }}>
            <h2 style={{ marginTop: 0, color: "#111827" }}>{editingEquipmentId ? "Edit Equipment" : "Add New Equipment"}</h2>
            <form onSubmit={handleSaveEquipment} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
              <label style={{ color: "#374151", fontWeight: 600 }}>Equipment Name
                <input style={fieldStyle} value={equipmentForm.name} onChange={(e) => setEquipmentForm({ ...equipmentForm, name: e.target.value })} required placeholder="e.g. JCB Excavator" />
              </label>
              <label style={{ color: "#374151", fontWeight: 600 }}>Category
                <input style={fieldStyle} value={equipmentForm.category} onChange={(e) => setEquipmentForm({ ...equipmentForm, category: e.target.value })} required placeholder="e.g. Excavator" />
              </label>
              <label style={{ color: "#374151", fontWeight: 600 }}>Price per day (₹)
                <input style={fieldStyle} type="number" min="0" step="0.01" value={equipmentForm.pricePerDay} onChange={(e) => setEquipmentForm({ ...equipmentForm, pricePerDay: e.target.value })} required placeholder="3000" />
              </label>
              <label style={{ color: "#374151", fontWeight: 600 }}>Location
                <input style={fieldStyle} value={equipmentForm.location} onChange={(e) => setEquipmentForm({ ...equipmentForm, location: e.target.value })} required placeholder="e.g. Vijayawada" />
              </label>
              <label style={{ color: "#374151", fontWeight: 600 }}>Status
                <select style={fieldStyle} value={equipmentForm.status} onChange={(e) => setEquipmentForm({ ...equipmentForm, status: e.target.value })}>
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="RENTED">RENTED</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                </select>
              </label>
              <label style={{ color: "#374151", fontWeight: 600, gridColumn: "1 / -1" }}>Description
                <textarea style={{ ...fieldStyle, minHeight: "82px", resize: "vertical" }} value={equipmentForm.description} onChange={(e) => setEquipmentForm({ ...equipmentForm, description: e.target.value })} placeholder="Equipment details" />
              </label>
              <div style={{ display: "flex", gap: "10px", gridColumn: "1 / -1", flexWrap: "wrap" }}>
                <button type="submit" disabled={savingEquipment} className="hero-btn">{savingEquipment ? "Saving..." : editingEquipmentId ? "Update Equipment" : "Add Equipment"}</button>
                {editingEquipmentId && <button type="button" onClick={resetEquipmentForm} style={{ padding: "12px 18px", border: "1px solid #cbd5e1", borderRadius: "8px", background: "#fff", color: "#111827" }}>Cancel Edit</button>}
                <button type="button" onClick={() => { loadEquipment(); loadBookings(); }} style={{ padding: "12px 18px", border: "1px solid #cbd5e1", borderRadius: "8px", background: "#fff", color: "#111827" }}>Refresh Data</button>
              </div>
            </form>
          </section>

          <section id="admin-equipment" style={{ ...cardStyle, marginBottom: "28px", overflowX: "auto" }}>
            <h2 style={{ marginTop: 0, color: "#111827" }}>Equipment Inventory</h2>
            {equipment.length === 0 ? <p style={{ color: "#64748b" }}>No equipment loaded. Use Refresh Data or check the backend.</p> : (
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px", color: "#111827" }}>
                <thead><tr style={{ textAlign: "left", background: "#f8fafc" }}>{["ID", "Name", "Category", "Price / day", "Location", "Status", "Action"].map((heading) => <th key={heading} style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>{heading}</th>)}</tr></thead>
                <tbody>{equipment.map((item) => <tr key={item.id}>
                  <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>{item.id}</td>
                  <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>{item.name}</td>
                  <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>{item.category}</td>
                  <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>₹{item.pricePerDay}</td>
                  <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>{item.location}</td>
                  <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>{item.status}</td>
                  <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}><button type="button" onClick={() => startEditEquipment(item)} style={{ padding: "8px 12px", border: 0, borderRadius: "6px", background: "#e0e7ff", color: "#3730a3" }}>Edit</button></td>
                </tr>)}</tbody>
              </table>
            )}
          </section>

          <section id="admin-bookings" style={{ ...cardStyle, overflowX: "auto" }}>
            <h2 style={{ marginTop: 0, color: "#111827" }}>All Customer Bookings</h2>
            {bookings.length === 0 ? <p style={{ color: "#64748b" }}>No bookings found.</p> : (
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "650px", color: "#111827" }}>
                <thead><tr style={{ textAlign: "left", background: "#f8fafc" }}>{["Booking ID", "Equipment", "Start Date", "End Date", "Amount", "Status"].map((heading) => <th key={heading} style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>{heading}</th>)}</tr></thead>
                <tbody>{bookings.map((booking) => <tr key={booking.id}>
                  <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>#{booking.id}</td>
                  <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>{booking.equipment?.name || "Equipment"}</td>
                  <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>{booking.startDate || "—"}</td>
                  <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>{booking.endDate || "—"}</td>
                  <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>₹{booking.estimatedAmount ?? "—"}</td>
                  <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>{booking.status || "—"}</td>
                </tr>)}</tbody>
              </table>
            )}
          </section>

          <section id="admin-dispatches" style={{ ...cardStyle, marginTop: "28px", marginBottom: "28px" }}>
            <h2 style={{ marginTop: 0, color: "#111827" }}>Dispatch Management</h2>
            <p style={{ color: "#64748b" }}>Create a dispatch for an existing booking and track its delivery status.</p>
            <form onSubmit={handleCreateDispatch} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
              <label style={{ color: "#374151", fontWeight: 600 }}>Booking
                <select style={fieldStyle} value={dispatchForm.bookingId} onChange={(e) => setDispatchForm({ ...dispatchForm, bookingId: e.target.value })} required>
                  <option value="">Select booking</option>
                  {bookings.map((booking) => (
                    <option key={booking.id} value={booking.id}>
                      Booking #{booking.id} — {booking.equipment?.name || "Equipment"} ({booking.status})
                    </option>
                  ))}
                </select>
              </label>
              <label style={{ color: "#374151", fontWeight: 600 }}>Driver Name
                <input style={fieldStyle} value={dispatchForm.driverName} onChange={(e) => setDispatchForm({ ...dispatchForm, driverName: e.target.value })} required placeholder="e.g. Ravi Kumar" />
              </label>
              <label style={{ color: "#374151", fontWeight: 600 }}>Vehicle Number
                <input style={fieldStyle} value={dispatchForm.vehicleNumber} onChange={(e) => setDispatchForm({ ...dispatchForm, vehicleNumber: e.target.value })} required placeholder="e.g. AP16AB5678" />
              </label>
              <label style={{ color: "#374151", fontWeight: 600 }}>Delivery Address
                <input style={fieldStyle} value={dispatchForm.deliveryAddress} onChange={(e) => setDispatchForm({ ...dispatchForm, deliveryAddress: e.target.value })} required placeholder="Delivery location" />
              </label>
              <label style={{ color: "#374151", fontWeight: 600 }}>Destination (optional)
                <input style={fieldStyle} value={dispatchForm.destination} onChange={(e) => setDispatchForm({ ...dispatchForm, destination: e.target.value })} placeholder="Defaults to delivery address" />
              </label>
              <label style={{ color: "#374151", fontWeight: 600 }}>Scheduled Date
                <input style={fieldStyle} type="date" value={dispatchForm.scheduledDate} onChange={(e) => setDispatchForm({ ...dispatchForm, scheduledDate: e.target.value })} required />
              </label>
              <label style={{ color: "#374151", fontWeight: 600 }}>Dispatch Date
                <input style={fieldStyle} type="date" value={dispatchForm.dispatchDate} onChange={(e) => setDispatchForm({ ...dispatchForm, dispatchDate: e.target.value })} />
              </label>
              <label style={{ color: "#374151", fontWeight: 600 }}>Initial Status
                <select style={fieldStyle} value={dispatchForm.status} onChange={(e) => setDispatchForm({ ...dispatchForm, status: e.target.value })}>
                  <option value="PENDING">PENDING</option>
                  <option value="IN_TRANSIT">IN_TRANSIT</option>
                  <option value="DELIVERED">DELIVERED</option>
                </select>
              </label>
              <label style={{ color: "#374151", fontWeight: 600 }}>Assigned To
                <input style={fieldStyle} value={dispatchForm.assignedTo} onChange={(e) => setDispatchForm({ ...dispatchForm, assignedTo: e.target.value })} placeholder="Admin / dispatch manager" />
              </label>
              <div style={{ gridColumn: "1 / -1", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button type="submit" disabled={savingDispatch} className="hero-btn">{savingDispatch ? "Creating..." : "Create Dispatch"}</button>
                <button type="button" onClick={loadDispatches} disabled={loadingDispatches} style={{ padding: "12px 18px", border: "1px solid #cbd5e1", borderRadius: "8px", background: "#fff", color: "#111827" }}>{loadingDispatches ? "Refreshing..." : "Refresh Dispatches"}</button>
              </div>
            </form>
            {bookings.length === 0 && <p style={{ color: "#b45309", marginTop: "12px" }}>No bookings loaded. Refresh data or check the bookings API before creating a dispatch.</p>}
          </section>

          <section style={{ ...cardStyle, marginBottom: "28px", overflowX: "auto" }}>
            <h2 style={{ marginTop: 0, color: "#111827" }}>All Dispatches</h2>
            {loadingDispatches ? <p style={{ color: "#64748b" }}>Loading dispatches...</p> : dispatches.length === 0 ? (
              <p style={{ color: "#64748b" }}>No dispatches found. Create one above or refresh the list.</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "1050px", color: "#111827" }}>
                <thead><tr style={{ textAlign: "left", background: "#f8fafc" }}>
                  {["Dispatch ID", "Booking", "Equipment", "Driver", "Vehicle", "Destination", "Scheduled", "Status", "Actions"].map((heading) => <th key={heading} style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>{heading}</th>)}
                </tr></thead>
                <tbody>{dispatches.map((dispatch) => (
                  <tr key={dispatch.id}>
                    <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>#{dispatch.id}</td>
                    <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>#{dispatch.booking?.id || "—"}</td>
                    <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>{dispatch.equipment?.name || dispatch.booking?.equipment?.name || "—"}</td>
                    <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>{dispatch.driverName}</td>
                    <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>{dispatch.vehicleNumber}</td>
                    <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>{dispatch.destination || dispatch.deliveryAddress}</td>
                    <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>{dispatch.scheduledDate || "—"}</td>
                    <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>
                      <select aria-label={`Status for dispatch ${dispatch.id}`} style={{ ...fieldStyle, minWidth: "145px", marginTop: 0 }} value={dispatch.status || "PENDING"} onChange={(e) => handleUpdateDispatchStatus(dispatch, e.target.value)}>
                        <option value="PENDING">PENDING</option>
                        <option value="IN_TRANSIT">IN_TRANSIT</option>
                        <option value="DELIVERED">DELIVERED</option>
                      </select>
                    </td>
                    <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>
                      <button type="button" onClick={() => handleDeleteDispatch(dispatch.id)} style={{ padding: "8px 12px", border: 0, borderRadius: "6px", background: "#fee2e2", color: "#991b1b" }}>Delete</button>
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            )}
          </section>
        </main>
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