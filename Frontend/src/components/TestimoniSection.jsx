import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y, Autoplay } from 'swiper/modules';
import { FaStar, FaUser } from 'react-icons/fa';

// Komponen Card Testimoni terpisah agar kode lebih rapi
const TestimoniCard = ({ testimoni }) => (
    <div className="box testimonial-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div className="card-content" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <div className="content" style={{ flexGrow: 1 }}>
                <p className="is-size-5 is-italic has-text-white">
                    "{testimoni.quote}"
                </p>
            </div>
            <div className="has-text-centered mt-4">
                <span className="icon is-large has-text-grey-light" style={{ width: '64px', height: '64px', border: '2px solid #dbdbdb', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaUser size="1.8em" />
                </span>
                <p className="title is-5 mt-3 mb-1">{testimoni.name}</p>
                <p className="subtitle is-6 has-text-grey">{testimoni.title}</p>
            </div>
            <div className="has-text-warning has-text-centered mt-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="icon is-small">
                        <FaStar className={i < testimoni.rating ? '' : 'has-text-grey-lighter'} />
                    </span>
                ))}
            </div>
        </div>
    </div>
);


const TestimoniSection = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // State untuk loading
    const [error, setError] = useState(null); // State untuk error

    useEffect(() => {
        async function fetchTestimonials() {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/testimoni`);
                if (!response.ok) {
                    throw new Error('Gagal mengambil data dari server');
                }
                const data = await response.json();
                setTestimonials(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }
        fetchTestimonials();
    }, []);

    // Fungsi untuk menampilkan konten berdasarkan state
    const renderContent = () => {
        if (isLoading) {
            return <p>Memuat testimoni...</p>;
        }
        if (error) {
            return <p>Terjadi kesalahan: {error}</p>;
        }
        // PERUBAHAN 1: Jika tidak ada testimoni, tampilkan pesan ini
        if (!testimonials || testimonials.length === 0) {
            return <p className="subtitle is-5 has-text-grey">Belum ada testimoni dari pelanggan.</p>;
        }
        
        // Jika ada testimoni, tampilkan slider
        return (
            <Swiper
                modules={[Navigation, Pagination, A11y, Autoplay]}
                spaceBetween={30}
                slidesPerView={1}
                centeredSlides={true}
                loop={true}
                // PERUBAHAN 2: Aktifkan pagination
                pagination={{ clickable: true }}
                navigation={true}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                breakpoints={{
                    768: { slidesPerView: 2, spaceBetween: 40 },
                    1024: { slidesPerView: 3, spaceBetween: 50 },
                }}
                className="mySwiper"
            >
                {testimonials.map((testimoni) => (
                    <SwiperSlide key={testimoni.id}>
                        <TestimoniCard testimoni={testimoni} />
                    </SwiperSlide>
                ))}
            </Swiper>
        );
    };

    return (
        <section id="testimoni" className="section is-medium">
            <div className="container has-text-centered">
                <div className="has-text-centered mb-6">
                    <h2 className="title is-2">Apa Kata Mereka?</h2>
                    <p className="subtitle is-5 has-text-grey">Testimoni asli dari para Juara penikmat sambal kami.</p>
                </div>
                {renderContent()}
            </div>
        </section>
    );
};

export default TestimoniSection;