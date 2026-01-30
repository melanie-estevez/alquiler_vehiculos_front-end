import RecommendedCars from "../../components/public/RecommendedCars";
import { Link } from "react-router-dom";
import video1 from "../../assets/video1.mp4"
import video2 from "../../assets/video2.mp4";
import video3 from "../../assets/video3.mp4"
import corto from "../../assets/corto.mp4";
import soporte from "../../assets/soporte.png"
import reservarhome from "../../assets/reservarhome.png"
import quito from "../../assets/quito.png";
import guayaquil from "../../assets/guayaquil.png";
import cuenca from "../../assets/cuenca.png"

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
            <video
              className="d-block w-100"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src={video1} type="video/mp4" />
            </video>

            <div className="carousel-caption d-none d-md-block modelo-caption">
              <h3 className="modelo__title">LOS MEJORES VEHICULOS</h3>
              <p className="modelo__subtitle">Renta segura y confiable</p>
            </div>
          </div>

          

          <div className="carousel-item">
            <video
              className="d-block w-100"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src={video2} type="video/mp4" />
            </video>

            <div className="carousel-caption d-none d-md-block modelo-caption">
              <h3 className="modelo__title">Viaja con estilo</h3>
              <p className="modelo__subtitle">Autos listos para ti</p>
            </div>
          </div>


          <div className="carousel-item">
            <video
              className="d-block w-100"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src={video3} type="video/mp4" />
            </video>

            <div className="carousel-caption d-none d-md-block modelo-caption">
              <h3 className="modelo__title">Reserva en minutos</h3>
              <p className="modelo__subtitle">Estés donde estés</p>
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

     <section className="container my-5 pt-3 text-center">
       <h2 className="section-title">NUESTROS MODELOS POPULARES</h2>
      <RecommendedCars />
     
      <div className="text-center mb-5">
        <Link to="/carros" className="btn btn-outline-dark px-5">
          Ver todos los Vehículos
        </Link>
      </div>
      </section>
     
     <section className="features-section py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="section-title"> ILUMINA TU CAMINO EN CADA KILÓMETRO</h2>

        </div>

       
        <div className="row align-items-center g-4 mb-5">
          <div className="col-md-6">
            <video
              src={corto}
              className="feature-video"
              autoPlay
              muted
              loop
              playsInline
            />

          </div>
          <div className="col-md-6">
            <h3 className="feature-title">Calidad garantizada</h3>
            <p className="text-muted feature-text">
              Vehículos revisados, limpios y listos para tu viaje, con mantenimientos al día y
              altos estándares de seguridad que garantizan una conducción tranquila y confiable.
              
            </p>
          </div>
        </div>

      
        <div className="row align-items-center g-4 mb-5 flex-md-row-reverse">
          <div className="col-md-6">
            <img
              src={soporte}
              className="img-fluid feature-img"
              alt="Atención 24/7"
            />
          </div>
          <div className="col-md-6">
            <h3 className="feature-title">Soporte cuando lo necesites</h3>
            <p className="text-muted feature-text">
              Nuestro equipo te acompaña antes,
              durante y después de tu reserva contamos con  
              gestión ágil de incidentes y seguimiento constante de tu reserva 
              para brindarte una experiencia sin complicaciones.
            </p>
          </div>
        </div>

     
        <div className="row align-items-center g-4">
          <div className="col-md-6">
            <img
              src={reservarhome}
              className="img-fluid feature-img"
              alt="Reserva segura"
            />
          </div>
          <div className="col-md-6">
            <h3 className="feature-title">Reserva segura</h3>
            <p className="text-muted feature-text">
              Proceso simple, claro y protegido. Pagos y datos con medidas de seguridad
              para que solo te preocupes por disfrutar el viaje.
            </p>
          </div>
        </div>
      </div>
    </section>

      
      <section className="container my-5">
        <div className="text-center mb-4">
          <h3 className="section-title m-0">Sucursales</h3>
        </div>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="card branch-card h-100">
              <img src={quito} className="branch-img" alt="Sucursal Quito" />
              <div className="card-body">
                <h5 className="branch-title">Quito</h5>
                <p className="text-muted branch-text">
                  Vehículos disponibles en la capital
                </p>
                <button className="btn btn-dark w-100">Ver vehículos</button>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card branch-card h-100">
              <img src={guayaquil} className="branch-img" alt="Sucursal Guayaquil" />
              <div className="card-body">
                <h5 className="branch-title">Guayaquil</h5>
                <p className="text-muted branch-text">
                  Autos para la costa
                </p>
                <button className="btn btn-dark w-100">Ver vehículos</button>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card branch-card h-100">
              <img src={cuenca} className="branch-img" alt="Sucursal Cuenca" />
              <div className="card-body">
                <h5 className="branch-title">Cuenca</h5>
                <p className="text-muted branch-text">
                  Viaja cómodo en el austro
                </p>
                <button className="btn btn-dark w-100">Ver vehículos</button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
