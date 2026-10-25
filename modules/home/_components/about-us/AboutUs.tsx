'use client';

import Image from 'next/image';
import { BsDiamondFill } from 'react-icons/bs';
import { motion } from 'framer-motion';
import aboutusTitle from '@/assets/images/aboutus-title.png';
import aboutusImage from '@/assets/images/aboutus-image.png';

export default function AboutUs() {
  return (
    <section id="nosotros" className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-[#F4ECE4] w-full overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-start">

        {/* Columna Izquierda: Título y Descripción */}
        <motion.div 
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col space-y-80 lg:pr-8"
        >
          <div className="flex flex-col space-y-8">
            <Image
              src={aboutusTitle}
              alt="Sobre Nosotros"
              className="w-full max-w-[600px] object-contain invert-[0.9]"
            />

            {/* Separador de Oro Premium Metálico con Diamante */}
            <div className="flex items-center gap-4">
              <BsDiamondFill className="w-3 h-3 text-[#845f15] drop-shadow-[0_0_4px_rgba(255,210,119,0.8)]" />
              <div
                className="h-[1.5px] w-48 sm:w-64"
                style={{
                  background: 'linear-gradient(to right, #77530a, #ffd277, transparent)',
                }}
              />
            </div>
          </div>

          <div className="space-y-5 text-[#523B2D] font-serif text-lg leading-relaxed text-justify">
            <p>
              En Kad Bay Studio creemos que la belleza no es solo un resultado, sino un ritual. Hemos creado un espacio donde el lujo sereno y la atención meticulosa se encuentran para ofrecerte una experiencia verdaderamente transformadora.
            </p>
            <p>
              Cada detalle de nuestro estudio ha sido pensado para tu máximo confort y relajación. Nuestro equipo de profesionales altamente capacitados se dedica a resaltar tu belleza natural con técnicas innovadoras y productos de primera calidad, asegurando que cada visita sea un momento único dedicado exclusivamente a ti.
            </p>
          </div>
        </motion.div>

        {/* Columna Derecha: Subtítulo e Imagen */}
        <motion.div 
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="flex flex-col space-y-12 items-center"
        >

          {/* Subtítulo alineado visualmente al top del título */}
          <div className="-mt-2 lg:-mt-2">
            <p className="text-xl sm:text-2xl text-[#523B2D] font-serif tracking-wide leading-relaxed">
              Experiencia{' '}
              <span className="font-script text-3xl sm:text-4xl text-[#77530a] tracking-normal font-normal p-1">
                personalizada
              </span>{' '}
              <br /> dedicada a la estética y el{' '}
              <span className="font-script text-3xl sm:text-4xl text-[#77530a] tracking-normal font-normal p-1">
                bienestar
              </span>
            </p>
          </div>

          {/* Imagen (estilo ventana abovedada para darle un toque premium) */}
          <div className="w-full relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-t-full overflow-hidden">
            <Image
              src={aboutusImage}
              alt="Instalaciones Kad Bay Studio"
              fill
              className="object-cover"
            />
          </div>

        </motion.div>
      </div>
    </section>
  );
}
