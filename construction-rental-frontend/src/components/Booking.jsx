import { useState } from "react";

function Booking({
  equipment,
  onClose,
  onBookingSuccess
}) {

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [checking, setChecking] = useState(false);
  const [booking, setBooking] = useState(false);

  const [available, setAvailable] = useState(false);

  const [message, setMessage] = useState("");

  const [bookingSuccess, setBookingSuccess] =
    useState(false);

  const [totalAmount, setTotalAmount] =
    useState(0);


  // =========================
  // CALCULATE TOTAL
  // =========================

  const calculateTotal = () => {

    if (!startDate || !endDate) {
      return 0;
    }

    const start =
      new Date(`${startDate}T00:00:00`);

    const end =
      new Date(`${endDate}T00:00:00`);


    const difference =
      Math.floor(
        (end.getTime() - start.getTime()) /
        (1000 * 60 * 60 * 24)
      ) + 1;


    if (difference <= 0) {
      return 0;
    }


    const pricePerDay =
      Number(equipment.pricePerDay);


    if (isNaN(pricePerDay)) {
      return 0;
    }


    return difference * pricePerDay;
  };


  // =========================
  // CHECK AVAILABILITY
  // =========================

  const checkAvailability = async () => {

    if (!startDate || !endDate) {

      setMessage(
        "Please select start date and end date."
      );

      setAvailable(false);

      return;
    }


    if (
      new Date(endDate) <
      new Date(startDate)
    ) {

      setMessage(
        "End date cannot be before start date."
      );

      setAvailable(false);

      return;
    }


    setChecking(true);
    setMessage("");
    setAvailable(false);
    setBookingSuccess(false);


    try {

      const response = await fetch(
        `http://localhost:8080/api/rentals/availability?equipmentId=${equipment.id}&startDate=${startDate}&endDate=${endDate}`
      );


      const result =
        await response.json();


      if (!response.ok) {

        setMessage(
          result.error ||
          "Unable to check availability."
        );

        return;
      }


      if (result === true) {

        const amount =
          calculateTotal();


        if (!amount || amount <= 0) {

          setMessage(
            "Unable to calculate the booking amount."
          );

          return;
        }


        setTotalAmount(amount);

        setAvailable(true);


        setMessage(
          "Equipment is available for these dates."
        );

      } else {

        setAvailable(false);

        setTotalAmount(0);


        setMessage(
          "Equipment is not available for these dates."
        );

      }

    } catch (error) {

      console.error(
        "Availability error:",
        error
      );


      setAvailable(false);


      setMessage(
        "Unable to connect to the server."
      );

    } finally {

      setChecking(false);

    }
  };


  // =========================
  // CONFIRM BOOKING
  // =========================

  const confirmBooking = async () => {

    if (!available) {

      setMessage(
        "Please check availability first."
      );

      return;
    }


    const calculatedAmount =
      calculateTotal();


    const amount = Number(
      calculatedAmount ||
      totalAmount ||
      0
    );


    if (
      amount <= 0 ||
      !Number.isFinite(amount)
    ) {

      setMessage(
        "Invalid booking amount. Please check the dates again."
      );

      return;
    }


    setBooking(true);
    setMessage("");


    const bookingData = {

      equipment: {
        id: Number(equipment.id)
      },

      startDate: startDate,

      endDate: endDate,

      estimatedAmount: amount,

      status: "PENDING"
    };


    console.log(
      "FINAL BOOKING DATA:",
      bookingData
    );


    try {

      const response = await fetch(
        "http://localhost:8080/api/bookings",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(
            bookingData
          )
        }
      );


      const text =
        await response.text();


      let data = {};


      try {

        data =
          text
            ? JSON.parse(text)
            : {};

      } catch {

        data = {};

      }


      if (!response.ok) {

        console.error(
          "Booking failed:",
          response.status,
          data
        );


        setMessage(
          data.error ||
          `Booking failed. Server returned ${response.status}.`
        );

        return;
      }


      console.log(
        "Booking successful:",
        data
      );


      setTotalAmount(amount);

      setBookingSuccess(true);

      setMessage(
        "Booking confirmed successfully!"
      );


      // Update dashboard booking count
      if (onBookingSuccess) {
        onBookingSuccess();
      }


    } catch (error) {

      console.error(
        "Booking error:",
        error
      );


      setMessage(
        "Unable to connect to the server."
      );

    } finally {

      setBooking(false);

    }
  };


  // =========================
  // UI
  // =========================

  return (

    <div className="modal-overlay">

      <div className="booking-box">


        {/* CLOSE BUTTON */}

        <button
          className="close-btn"
          onClick={onClose}
        >
          ×
        </button>


        <h2>
          Book Equipment
        </h2>


        <p className="booking-equipment">
          🚜 {equipment.name}
        </p>


        <p className="booking-price">
          ₹{equipment.pricePerDay} / day
        </p>



        {/* BOOKING FORM */}

        {!bookingSuccess && (

          <div className="booking-form">


            <label>
              Start Date
            </label>


            <input
              type="date"
              value={startDate}
              min={
                new Date()
                  .toISOString()
                  .split("T")[0]
              }
              onChange={(e) => {

                setStartDate(
                  e.target.value
                );

                setAvailable(false);

                setTotalAmount(0);

                setMessage("");

              }}
            />


            <label>
              End Date
            </label>


            <input
              type="date"
              value={endDate}
              min={
                startDate ||
                new Date()
                  .toISOString()
                  .split("T")[0]
              }
              onChange={(e) => {

                setEndDate(
                  e.target.value
                );

                setAvailable(false);

                setTotalAmount(0);

                setMessage("");

              }}
            />


            <button
              type="button"
              onClick={checkAvailability}
              disabled={checking}
            >

              {checking
                ? "Checking..."
                : "Check Availability"}

            </button>

          </div>

        )}



        {/* BOOKING DETAILS */}

        {available &&
          !bookingSuccess && (

          <div className="booking-details">


            <p>

              <strong>
                Rental Period:
              </strong>{" "}

              {startDate}
              {" → "}
              {endDate}

            </p>


            <p>

              <strong>
                Estimated Amount:
              </strong>{" "}

              ₹{totalAmount}

            </p>


            <button
              type="button"
              className="confirm-booking-btn"
              onClick={confirmBooking}
              disabled={booking}
            >

              {booking
                ? "Confirming..."
                : "Confirm Booking"}

            </button>

          </div>

        )}



        {/* SUCCESS */}

        {bookingSuccess && (

          <div className="booking-success">


            <div className="success-icon">
              ✓
            </div>


            <h3>
              Booking Confirmed!
            </h3>


            <p>
              Your equipment booking has been
              successfully created.
            </p>


            <p>

              <strong>
                Equipment:
              </strong>{" "}

              {equipment.name}

            </p>


            <p>

              <strong>
                Rental Period:
              </strong>{" "}

              {startDate}
              {" → "}
              {endDate}

            </p>


            <p>

              <strong>
                Amount:
              </strong>{" "}

              ₹{totalAmount}

            </p>


            <button
              type="button"
              className="auth-btn"
              onClick={onClose}
            >
              Done
            </button>

          </div>

        )}



        {/* MESSAGE */}

        {message &&
          !bookingSuccess && (

          <div
            className={
              available
                ? "booking-message success-message"
                : "booking-message"
            }
          >

            {message}

          </div>

        )}

      </div>

    </div>

  );
}

export default Booking;