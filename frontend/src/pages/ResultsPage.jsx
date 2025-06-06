import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { normalizeAirport, displayAirport } from "../airportData";

function ResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const flights = location.state?.flights || [];
  const search = location.state?.search || {};

  const filteredFlights = flights.filter((flight) => {
    const matchesFrom =
      !search.from ||
      normalizeAirport(flight.from_city) === normalizeAirport(search.from);

    const matchesTo =
      !search.to ||
      normalizeAirport(flight.to_city) === normalizeAirport(search.to);

    const matchesDeparture =
      !search.departureDate ||
      new Date(flight.flight_date).toDateString() ===
        new Date(search.departureDate).toDateString();

    const matchesPassengers =
      !search.passengers || flight.empty_seats >= search.passengers;

    return matchesFrom && matchesTo && matchesDeparture && matchesPassengers;
  });

  return (
    <div className="container">
      <div className="results-header">
        <button onClick={() => navigate("/search")} className="ghost-button">
          ← Back to Search
        </button>
        <h1 className="results-title">Available Flights</h1>
      </div>

      <div className="results-grid">
        {filteredFlights.length > 0 ? (
          filteredFlights.map((flight) => (
            <div key={flight.id} className="flight-card">
              <h2>
               {displayAirport(flight.from_city)} → {displayAirport(flight.to_city)}
              </h2>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(flight.flight_date).toLocaleDateString()}
              </p>
              <p>
                <strong>Time:</strong> {flight.flight_time}
              </p>
              <p>
                <strong>Available Seats:</strong> {flight.empty_seats}
              </p>
              <div className="button-group">
                {flight.empty_seats > 0 ? (
                  <button onClick={() => navigate("/booking", {
                    state: {...flight, passengers: search.passengers || 1},
                    })
                    }
                    className="primary-button"
                  >
                    Select
                  </button>

                ) : (
                  <span className="no-seats-label">No seats available</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No flights found.</p>
        )}
      </div>
    </div>
  );
}

export default ResultsPage;
