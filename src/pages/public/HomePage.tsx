import RecommendedCars from "../../components/public/RecommendedCars";
import { Link } from "react-router-dom";


import car1 from "../../assets/carrusel_1.jpg";
import car2 from "../../assets/carrusel_2.jpeg";
import car3 from "../../assets/carrusel_3.jpg";

export default function HomePage() {
  return (
    <>
 
      <div
        id="homeCarousel"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#homeCarousel"
            data-bs-slide-to="0"
            className="active"
          ></button>
          <button
            type="button"
            data-bs-target="#homeCarousel"
            data-bs-slide-to="1"
          ></button>
          <button
            type="button"
            data-bs-target="#homeCarousel"
            data-bs-slide-to="2"
          ></button>
        </div>

        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src={car1} className="d-block w-100" alt="Carros modernos" />
            <div className="carousel-caption d-none d-md-block">
              <h3>Los mejores vehículos</h3>
              <p>Renta segura y confiable</p>
            </div>
          </div>

          <div className="carousel-item">
            <img src={car2} className="d-block w-100" alt="Carros de lujo" />
            <div className="carousel-caption d-none d-md-block">
              <h3>Viaja con estilo</h3>
              <p>Autos listos para ti</p>
            </div>
          </div>

          <div className="carousel-item">
            <img src={car3} className="d-block w-100" alt="Reserva fácil" />
            <div className="carousel-caption d-none d-md-block">
              <h3>Reserva en minutos</h3>
              <p>Desde cualquier ciudad</p>
            </div>
          </div>
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#homeCarousel"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon"></span>
        </button>

        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#homeCarousel"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>

     
      <RecommendedCars />

      <div className="text-center mb-5">
        <Link to="/carros" className="btn btn-outline-dark px-5">
          Ver todos los carros
        </Link>
      </div>

     
      <section className="bg-light py-5">
        <div className="container text-center">
          <div className="row">
            <div className="col-md-4">
              <h5>Calidad garantizada</h5>
              <p className="text-muted">
                Vehículos revisados y asegurados
              </p>
            </div>
            <div className="col-md-4">
              <h5>Atención 24/7</h5>
              <p className="text-muted">
                Soporte cuando lo necesites
              </p>
            </div>
            <div className="col-md-4">
              <h5>Reserva segura</h5>
              <p className="text-muted">
                Pagos y datos protegidos
              </p>
            </div>
          </div>
        </div>
      </section>

      
      <section className="container my-5">
        <h3 className="mb-4">Sucursales</h3>

        <div className="row">
          <div className="col-md-4">
            <div className="card border-dark">
              <div className="card-body">
                <h5>Quito</h5>
                <p className="text-muted">
                  Vehículos disponibles en la capital
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-dark">
              <div className="card-body">
                <h5>Guayaquil</h5>
                <p className="text-muted">
                  Autos para la costa
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-dark">
              <div className="card-body">
                <h5>Cuenca</h5>
                <p className="text-muted">
                  Viaja cómodo en el austro
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
