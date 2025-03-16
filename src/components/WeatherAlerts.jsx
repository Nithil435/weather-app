import React from "react";

const WeatherAlerts = ({ alerts }) => {
  return (
    <div>
      {alerts && alerts.length > 0 ? (
        alerts.map((alert, index) => (
          <div key={index} className="alert-box">
            <h3>{alert.event}</h3>
            <p>{alert.description}</p>
          </div>
        ))
      ) : (
        <p>No weather alerts at this time.</p>
      )}
    </div>
  );
};

export default WeatherAlerts;
