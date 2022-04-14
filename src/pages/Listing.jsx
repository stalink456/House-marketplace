import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase.config";
import Spinner from "../components/Spinner";
import shareIcon from "../assets/svg/shareIcon.svg";
import { YMaps, Map, Placemark } from "react-yandex-maps";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(null);

  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }
    };
    fetchListing();
  }, [navigate, params.listingId]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <main>
      <Swiper slidesPerView={1} pagination={{ clickable: true }}>
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              style={{
                background: `url(${listing.imgUrls[index]}) center no-repeat`,
                backgroundSize: "cover",
              }}
              className="swiperSlideDiv"
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        className="shareIconDiv"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
      >
        <img src={shareIcon} alt="" />
      </div>
      {shareLinkCopied && <p className="linkCopied">Ссылка скопирована!</p>}

      <div className="listingDetails">
        <p className="listingName">
          {listing.name} - ₽{" "}
          {listing.offer
            ? listing.discountedPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : listing.regularPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </p>
        <p className="listingLocation">{listing.location}</p>
        <p className="listingType">
          Для {listing.type === "rent" ? "аренды" : "продажи"}
        </p>
        {listing.offer && (
          <p className="discountPrice">
            ₽{listing.regularPrice - listing.discountedPrice} скидка
          </p>
        )}
        <ul className="listingDetailsList">
          <li>
            {listing.bedrooms > 1
              ? `${listing.bedrooms} спальных комнат `
              : "1 спальная комната"}
          </li>
          <li>
            {listing.bathrooms > 1
              ? `${listing.bathrooms} ванных комнат `
              : "1 ванная комната"}
          </li>
          <li>
            {listing.parking && "Парковочное место"}
            {listing.furnished && " и мебель"}
          </li>
        </ul>

        <p className="listingLocationTitle">Местоположение</p>

        <div className="yandexMapContainer">
          <YMaps>
            <Map
              defaultState={{
                center: [listing.geolocation.lat, listing.geolocation.lng],
                zoom: 15,
                controls: ["zoomControl", "fullscreenControl"],
              }}
              modules={["control.ZoomControl", "control.FullscreenControl"]}
              style={{ height: "100%", width: "100%" }}
            >
              <Placemark
                modules={["geoObject.addon.balloon"]}
                defaultGeometry={[
                  listing.geolocation.lat,
                  listing.geolocation.lng,
                ]}
                properties={{
                  balloonContentBody: listing.location,
                }}
              />
            </Map>
          </YMaps>
        </div>
        {auth.currentUser?.uid !== listing.userRef && (
          <Link
            to={`/contact/${listing.userRef}?listingName=${listing.name}&listingLocation=${listing.location}`}
            className="primaryButton"
          >
            Контакт домовладельца
          </Link>
        )}
      </div>
    </main>
  );
}

export default Listing;
