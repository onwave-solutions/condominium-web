import React from "react";
import { Link } from "react-router-dom";

export default function Logo({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="isoLogoWrapper">
      {collapsed ? (
        <div>
          <h3 />
        </div>
      ) : (
        <h3>
          <Link to="#">OnWave</Link>
        </h3>
      )}
    </div>
  );
}
