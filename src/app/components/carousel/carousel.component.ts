import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  signal,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Career {
  id: number;
  title: string;
  imageUrl: string;
  link: string;
  externalUrl: string;
  description?: string;
}

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements AfterViewInit {
  @ViewChild('swiperContainer', { static: false }) swiperContainer!: ElementRef;

  careers = signal<Career[]>([
    { 
      id: 1,
      title: 'ESTÉTICA INTEGRAL',
      imageUrl: '/assets/carreras/estetica.webp',
      link: '/estetica-integral',
      externalUrl: 'https://itsqmet.edu.ec/estetica-integral/',
      description: 'La carrera de Estética Integral te prepara para ser un profesional capaz de realizar tratamientos estéticos faciales y corporales. Aprenderás técnicas de maquillaje, masajes, depilación y cuidado de la piel.'
    },
    {
      id: 2,
      title: 'DESARROLLO DE SOFTWARE',
      imageUrl: '/assets/carreras/desarrollo.webp',
      link: '/desarrollo-de-software',
      externalUrl: 'https://itsqmet.edu.ec/desarrollo-de-software/',
      description: 'La carrera de Desarrollo de Software te brinda las habilidades necesarias para diseñar, programar y mantener aplicaciones informáticas. Aprenderás los lenguajes de programación más demandados, bases de datos, desarrollo web y móvil, y metodologías ágiles. Contamos con laboratorios de última generación y docentes con amplia experiencia en la industria tecnológica.'
    },
    {
      id: 3,
      title: 'MECÁNICA AUTOMOTRIZ',
      imageUrl: '/assets/carreras/mecanica.webp',
      link: '/mecanica-automotriz',
      externalUrl: 'https://itsqmet.edu.ec/mecanica-automotriz/',
      description: 'Forma profesionales capaces de diagnosticar, reparar y realizar el mantenimiento de vehículos automotores. Contamos con talleres equipados con la última tecnología del sector automotriz.'
    },
    {
      id: 4,
      title: 'DISEÑO MULTIMEDIA',
      imageUrl: '/assets/carreras/diseñomultimedia.webp',
      link: '/diseno-multimedia',
      externalUrl: 'https://itsqmet.edu.ec/diseno-multimedia/',
      description: 'Desarrolla habilidades en diseño gráfico, animación, edición de video y creación de contenido digital. Prepárate para trabajar en agencias de publicidad, estudios de diseño o como freelancer.'
    },
    {
      id: 5,
      title: 'RIESGOS LABORALES',
      imageUrl: '/assets/carreras/riesgoslaborales.webp',
      link: '/riesgos-laborales',
      externalUrl: 'https://itsqmet.edu.ec/riesgos-laborales/',
      description: 'Aprende a identificar, evaluar y controlar los riesgos relacionados con la seguridad y salud ocupacional en empresas. Conviértete en un profesional clave para la prevención de accidentes laborales.'
    },
    {
      id: 7,
      title: 'ENFERMERÍA',
      imageUrl: '/assets/carreras/enfermeria.webp',
      link: '/enfermeria',
      externalUrl: 'https://itsqmet.edu.ec/enfermeria/',
      description: 'Forma profesionales en el cuidado de la salud con sólidos conocimientos científicos y habilidades prácticas. Realizarás prácticas en centros de salud y hospitales desde los primeros semestres.'
    },
    {
      id: 8,
      title: 'CONTABILIDAD',
      imageUrl: '/assets/carreras/contabilidad.webp',
      link: '/contabilidad',
      externalUrl: 'https://itsqmet.edu.ec/contabilidad/',
      description: 'Desarrolla competencias para gestionar la información financiera y contable de empresas. Aprenderás sobre tributación, auditoría y sistemas contables utilizados en el mercado laboral.'
    },
    {
      id: 9,
      title: 'EDUCACIÓN BÁSICA',
      imageUrl: '/assets/carreras/eduacionbasica.webp',
      link: '/carrera-de-educacion-basica',
      externalUrl: 'https://itsqmet.edu.ec/carrera-de-educacion-basica/',
      description: 'Prepárate para ser docente en educación básica con herramientas pedagógicas innovadoras. Desarrollarás competencias para facilitar el aprendizaje y fomentar el desarrollo integral de los estudiantes.'
    },
    {
      id: 10,
      title: 'VENTAS',
      imageUrl: '/assets/carreras/ventas.webp',
      link: '/tecnologia-superior-en-ventas',
      externalUrl: 'https://itsqmet.edu.ec/tecnologia-superior-en-ventas/',
      description: 'Adquiere técnicas avanzadas de negociación, estrategias de ventas y atención al cliente. Serás capaz de desarrollar planes comerciales efectivos para empresas de diversos sectores.'
    },
    {
      id: 12,
      title: 'ADMINISTRACIÓN',
      imageUrl: '/assets/carreras/administracion.webp',
      link: '/tecnologia-en-administracion',
      externalUrl: 'https://itsqmet.edu.ec/tecnologia-en-administracion/',
      description: 'Forma profesionales capaces de gestionar recursos humanos, financieros y materiales de una organización. Aprenderás sobre planificación estratégica, marketing y gestión empresarial.'
    },
    {
      id: 13,
      title: 'EDUCACIÓN INICIAL',
      imageUrl: '/assets/carreras/educacioninicial.webp',
      link: '/educacion-inicial',
      externalUrl: 'https://itsqmet.edu.ec/educacion-inicial/',
      description: 'Especialízate en la formación de niños en sus primeros años de vida. Aprenderás metodologías lúdicas y creativas para estimular el desarrollo cognitivo, emocional y social.'
    },
    {
      id: 14,
      title: 'MARKETING DIGITAL',
      imageUrl: '/assets/carreras/merketing.webp',
      link: '/marketing-digital-y-comercio-electronico',
      externalUrl: 'https://itsqmet.edu.ec/marketing-digital-y-comercio-electronico/',
      description: 'Desarrolla estrategias de marketing en entornos digitales y plataformas e-commerce. Aprenderás sobre SEO, redes sociales, analítica web y publicidad digital para posicionar marcas en internet.'
    },
    {
      id: 15,
      title: 'REDES Y TELECOMUNICACIONES',
      imageUrl: 'assets/carreras/redes.webp',
      link: '/redes-y-telecomunicaciones',
      externalUrl: 'https://itsqmet.edu.ec/redes-y-telecomunicaciones/',
      description: 'Forma profesionales capaces de diseñar, implementar y mantener infraestructuras de redes y sistemas de telecomunicaciones. Contamos con laboratorios equipados con tecnología de punta.'
    },
    {
      id: 16,
      title: 'GESTIÓN DE TALENTO HUMANO',
      imageUrl: 'assets/carreras/talentohumano.webp',
      link: '/gestion-de-talento-humano',
      externalUrl: 'https://itsqmet.edu.ec/gestion-de-talento-humano/',
      description: 'Desarrolla competencias para gestionar procesos de selección, capacitación y desarrollo del personal. Aprenderás sobre legislación laboral, evaluación del desempeño y clima organizacional.'
    }
  ]);

  swiperInstance: any;
  showModal = false;
  selectedCareer: Career | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initSwiper();
    }
  }

  private async initSwiper(): Promise<void> {
    if (!this.swiperContainer?.nativeElement) return;

    const swiperCore = await import('swiper');
    const swiperModules = await import('swiper/modules');

    const Swiper = swiperCore.default;
    const { Pagination, Navigation, Autoplay } = swiperModules;

    Swiper.use([Pagination, Navigation, Autoplay]);

    this.swiperInstance = new Swiper(this.swiperContainer.nativeElement, {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: false,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      breakpoints: {
        640: { slidesPerView: 2, spaceBetween: 15 },
        768: { slidesPerView: 3, spaceBetween: 15 },
        1024: { slidesPerView: 4, spaceBetween: 20 }
      }
    });
  }

  nextSlide(): void {
    this.swiperInstance?.slideNext();
  }

  prevSlide(): void {
    this.swiperInstance?.slidePrev();
  }

  goToSlide(index: number): void {
    this.swiperInstance?.slideTo(index);
  }

  openModal(career: Career, event: Event): void {
    event.preventDefault();
    this.selectedCareer = career;
    this.showModal = true;
    document.body.classList.add('modal-open');
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedCareer = null;
    document.body.classList.remove('modal-open');
  }

  navigateToExternalUrl(url: string): void {
    window.open(url, '_blank');
  }

  onModalBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.closeModal();
    }
  }
}