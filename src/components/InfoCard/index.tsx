import {
  faBasketball,
  faHome,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./styles.css";

export interface User {
  name: string;
  country: string;
  city: string;
  favorite_sport: string;
}

export default function InfoCard({
  name,
  city,
  country,
  favorite_sport,
}: User) {
  return (
    <div className="info-card" data-testid="info-card">
      <div className="info-item">
        <FontAwesomeIcon icon={faUser} />
        <h1 className="info-item">{name}</h1>
      </div>
      <div className="info-item">
        <FontAwesomeIcon icon={faHome} />
        <p className="info-item">
          {city}, {country}
        </p>
      </div>
      <div className="info-item">
        <FontAwesomeIcon icon={faBasketball} />
        <p className="info-item"> {favorite_sport} </p>
      </div>
    </div>
  );
}
