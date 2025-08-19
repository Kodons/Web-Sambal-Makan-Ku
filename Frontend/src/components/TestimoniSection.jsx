import React from 'react';
import useSWR from 'swr';
import { Swiper, SwiperSlide } from 'swiper/react';
// PERUBAHAN: Modul Grid tidak lagi diperlukan
import { Navigation, Pagination, A11y, Autoplay } from 'swiper/modules';
import { FaStar, FaUser } from 'react-icons/fa';

const fetcher = (url) => fetch(url).then((res) => res.json());

const TestimoniCard = ({ testimoni }) => (
    // Komponen TestimoniCard tidak berubah, desainnya sudah bagus
    <div className="box testimonial-ktp-card">
        <article className="media">
            <figure className="media-left is-align-self-center">
                <p className="image is-96x96 avatar-container">
                    <FaUser size="3.5em" className="has-text-grey" />
                </p>
            </figure>
            <div className="media-content" style={{ display: 'flex', flexDirection: 'column' }}>
                <div>
                    <p className="title is-5 mb-0">{testimoni.name}</p>
                    <p className="subtitle is-6 has-text-grey">({testimoni.title})</p>
                </div>
                <div className="content my-4" style={{ flexGrow: 1, overflowY: 'auto', minHeight: '50px' }}>
                    <p className="is-italic">"{testimoni.quote}"</p>
                </div>
                <div className="has-text-warning mt-auto">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className="icon is-small">
                            <FaStar style={{ color: i < testimoni.rating ? '#ffdd57' : '#dbdbdb' }} />
                        </span>
                    ))}
                </div>
            </div>
        </article>
    </div>
);

const TestimoniSection = () => {
    const { data: testimonials = [], error, isLoading } = useSWR(
        `${import.meta.env.VITE_BACKEND_URL}/api/testimoni`,
        fetcher
    );

    const renderContent = () => {
        if (isLoading) return <p>Memuat testimoni...</p>;
        if (error) return <p>Terjadi kesalahan saat memuat data.</p>;
        if (testimonials.length === 0) {
            return <p className="subtitle is-5 has-text-grey">Belum ada testimoni dari pelanggan.</p>;
        }
        
        return (
            // PERUBAHAN UTAMA: Konfigurasi Swiper kembali ke mode slider satu baris
            <Swiper
                modules={[Navigation, Pagination, A11y, Autoplay]}
                spaceBetween={30}
                slidesPerView={1} // Tampil 1 di mobile
                slidesPerGroup={1}
                loop={testimonials.length > 3} // Loop jika data cukup banyak
                pagination={{ clickable: true }}
                navigation={true}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                className="testimonial-swiper" // Ganti nama kelas agar lebih umum
                breakpoints={{
                    // 2 kartu per slide di tablet
                    768: {
                      slidesPerView: 2,
                      slidesPerGroup: 2,
                    },
                    // 3 kartu per slide di desktop
                    1024: {
                      slidesPerView: 3,
                      slidesPerGroup: 3,
                    },
                  }}
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
        <section id="testimoni" className="section is-large has-background-light">
            <div className="container">
                <div className="has-text-centered mb-6">
                    <h2 className="title is-2 has-text-black">Apa Kata Mereka?</h2>
                    <p className="subtitle is-5 has-text-grey">Testimoni asli dari para Juara penikmat sambal kami.</p>
                </div>
                {renderContent()}
            </div>
        </section>
    );
};

export default TestimoniSection;