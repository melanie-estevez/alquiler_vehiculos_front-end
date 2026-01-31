import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useVehiculos } from "../../hooks/useVehiculos";
import { VehiculosCatalog } from "../../components/vehiculos/VehiculosCatalog";
import type { Vehiculo } from "../../services/vehiculos.service";

import video1 from "../../assets/video1.mp4";
import video2 from "../../assets/video2.mp4";
import video3 from "../../assets/video3.mp4";
import corto from "../../assets/corto.mp4";
import soporte from "../../assets/soporte.png";
import reservarhome from "../../assets/reservarhome.png";
import quito from "../../assets/quito.png";
import guayaquil from "../../assets/guayaquil.png";
import cuenca from "../../assets/cuenca.png";

export default function HomePage() {
  const { vehiculos: vehiculosRaw, loading } = useVehiculos();

  const vehiculos = useMemo(() => {
    const v: any = vehiculosRaw as any;
    if (Array.isArray(v)) return v as Vehiculo[];
    if (v && Array.isArray(v.items)) return v.items as Vehiculo[];
    return [];
  }, [vehiculosRaw]);

  
  const destacados = useMemo(
    () => vehiculos.filter((v) => v.estado === "DISPONIBLE").slice(0, 6),
    [vehiculos],
  );

  return (
    <>
   
      <div id="homeCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-indicators">
          <button data-bs-target="#homeCarousel" data-bs-slide-to="0" className="active" />
          <button data-bs-target="#homeCarousel" data-bs-slide-to="1" />
          <button data-bs-target="#homeCarousel" data-bs-slide-to="2" />
        </div>

        <div className="carousel-inner">
          {[video1, video2, video3].map((video, idx) => (
            <div key={idx} className={`carousel-item ${idx === 0 ? "active" : ""}`}>
              <video className="d-block w-100" autoPlay muted loop playsInline>
                <source src={video} type="video/mp4" />
              </video>

              <div className="carousel-caption d-none d-md-block modelo-caption">
                <h3 className="modelo__title">
                  {idx === 0
                    ? "LOS MEJORES VEHÍCULOS"
                    : idx === 1
                    ? "Viaja con estilo"
                    : "Reserva en minutos"}
                </h3>
                <p className="modelo__subtitle">
                  {idx === 0
                    ? "Renta segura y confiable"
                    : idx === 1
                    ? "Autos listos para ti"
                    : "Estés donde estés"}
                </p>
              </div>
            </div>
          ))}
        </div>

        <button className="carousel-control-prev" data-bs-target="#homeCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" />
        </button>
        <button className="carousel-control-next" data-bs-target="#homeCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" />
        </button>
      </div>

      
      <section
        className="container-fluid px-3 px-md-5 py-5"
        style={{ background: "#f4f5f7" }}
      >
        <div className="text-center mb-4">
          <h2 className="section-title text-dark">VEHÍCULOS DESTACADOS</h2>
          <p className="text-muted">
            Explora algunos de nuestros modelos disponibles
          </p>
        </div>

        {loading ? (
          <p className="text-center text-muted">Cargando vehículos…</p>
        ) : (
          <VehiculosCatalog vehiculos={destacados} />
        )}

        <div className="text-center mt-5">
          <Link to="/carros" className="btn btn-dark btn-lg px-5 rounded-3">
            Ver todos los vehículos
          </Link>
        </div>
      </section>

      
      <section className="features-section py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">ILUMINA TU CAMINO EN CADA KILÓMETRO</h2>
          </div>

          <div className="row align-items-center g-4 mb-5">
            <div className="col-md-6">
              <video src={corto} className="feature-video" autoPlay muted loop />
            </div>
            <div className="col-md-6">
              <h3 className="feature-title">Calidad garantizada</h3>
              <p className="text-muted feature-text">
                Vehículos revisados, limpios y listos para tu viaje.
              </p>
            </div>
          </div>

          <div className="row align-items-center g-4 mb-5 flex-md-row-reverse">
            <div className="col-md-6">
              <img src={soporte} className="img-fluid feature-img" alt="Soporte" />
            </div>
            <div className="col-md-6">
              <h3 className="feature-title">Soporte 24/7</h3>
              <p className="text-muted feature-text">
                Te acompañamos antes, durante y después de tu reserva.
              </p>
            </div>
          </div>

          <div className="row align-items-center g-4">
            <div className="col-md-6">
              <img src={reservarhome} className="img-fluid feature-img" alt="Reserva" />
            </div>
            <div className="col-md-6">
              <h3 className="feature-title">Reserva segura</h3>
              <p className="text-muted feature-text">
                Proceso simple, claro y protegido.
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
          {[
            { img: quito, name: "Quito" },
            { img: guayaquil, name: "Guayaquil" },
            { img: cuenca, name: "Cuenca" },
          ].map((s) => (
            <div key={s.name} className="col-md-4">
              <div className="card branch-card h-100">
                <img src={s.img} className="branch-img" alt={s.name} />
                <div className="card-body">
                  <h5 className="branch-title">{s.name}</h5>
                  <p className="text-muted branch-text">
                    Vehículos disponibles en {s.name}
                  </p>
                  <Link to={`/carros?ciudad=${s.name}`} className="btn btn-dark w-100">
                    Ver vehículos
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
