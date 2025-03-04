import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Career {
  id: number;
  title: string;
  imageUrl: string;
  link: string;
}

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent implements OnInit, AfterViewInit {
  @ViewChild('swiperContainer') swiperContainer!: ElementRef;
  
  careers = signal<Career[]>([
    { 
      id: 1,
      title: 'ESTÉTICA INTEGRAL',
      imageUrl: 'https://itsqmet.edu.ec/wp-content/uploads/2024/02/estetica_Mesa-de-trabajo-1.webp',
      link: '/estetica-integral'
    },
    
    {
      id: 3,
      title: 'MECÁNICA AUTOMOTRIZ',
      imageUrl: 'https://itsqmet.edu.ec/wp-content/uploads/2024/09/Recurso-2.webp',
      link: '/mecanica-automotriz'
    },
    {
      id: 4,
      title: 'DISEÑO MULTIMEDIA',
      imageUrl: 'https://itsqmet.edu.ec/wp-content/uploads/2024/09/Recurso-3.webp',
      link: '/diseno-multimedia'
    },
    {
      id: 5,
      title: 'RIESGOS LABORALES',
      imageUrl: 'https://itsqmet.edu.ec/wp-content/uploads/2024/09/Recurso-4.webp',
      link: '/riesgos-laborales'
    },
   
    {
      id: 7,
      title: 'ENFERMERÍA',
      imageUrl: 'https://itsqmet.edu.ec/wp-content/uploads/2023/10/enfermeria-jpg.webp',
      link: '/enfermeria'
    },
    {
      id: 8,
      title: 'CONTABILIDAD',
      imageUrl: 'https://itsqmet.edu.ec/wp-content/uploads/2023/10/contabilidad-jpg.webp',
      link: '/contabilidad'
    },
    {
      id: 9,
      title: 'EDUCACIÓN BÁSICA',
      imageUrl: 'https://itsqmet.edu.ec/wp-content/uploads/2023/10/educacion-basica-jpg.webp',
      link: '/carrera-de-educacion-basica'
    },
    {
      id: 10,
      title: 'VENTAS',
      imageUrl: 'https://itsqmet.edu.ec/wp-content/uploads/2023/10/ventas-jpg.webp',
      link: '/tecnologia-superior-en-ventas'
    },
   
    {
      id: 12,
      title: 'ADMINISTRACIÓN',
      imageUrl: 'https://itsqmet.edu.ec/wp-content/uploads/2023/10/administracion-jpg.webp',
      link: '/tecnologia-en-administracion'
    },
    {
      id: 13,
      title: 'EDUCACIÓN INICIAL',
      imageUrl: 'https://itsqmet.edu.ec/wp-content/uploads/2023/10/educacion-inicial-jpg.webp',
      link: '/educacion-inicial'
    },
    {
      id: 14,
      title: 'MARKETING DIGITAL',
      imageUrl: 'https://itsqmet.edu.ec/wp-content/uploads/2023/10/marketing-digital-jpg.webp',
      link: '/marketing-digital-y-comercio-electronico'
    },
    {
      id: 15,
      title: 'REDES Y TELECOMUNICACIONES',
      imageUrl: 'https://itsqmet.edu.ec/wp-content/uploads/2023/10/redes-jpg.webp',
      link: '/redes-y-telecomunicaciones'
    },
    {
      id: 16,
      title: 'GESTIÓN DE TALENTO HUMANO',
      imageUrl: 'https://itsqmet.edu.ec/wp-content/uploads/2023/10/talento-humano-jpg.webp',
      link: '/gestion-de-talento-humano'
    }
  ]);

  activeIndex = 0;
  swiperInstance: any;

  constructor() { }

  ngOnInit(): void {
    // Initialize component state
  }

  ngAfterViewInit(): void {
    // Initialize Swiper after view is initialized
    this.initSwiper();
  }

  private initSwiper(): void {
    // We'll need to dynamically import Swiper and its modules separately for standalone components
    Promise.all([
      import('swiper'),
      import('swiper/modules')
    ]).then(([swiperCore, swiperModules]) => {
      const Swiper = swiperCore.default;
      const { Pagination, Navigation, Autoplay } = swiperModules;
      
      Swiper.use([Pagination, Navigation, Autoplay]);
      
      this.swiperInstance = new Swiper(this.swiperContainer.nativeElement, {
        slidesPerView: 1,
        spaceBetween: 20,
        centeredSlides: false,
        loop: false,
        autoHeight: false,
        effect: 'slide',
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          dynamicBullets: false,
        },
        keyboard: true,
        breakpoints: {
          640: {
            slidesPerView: 2,
            spaceBetween: 15,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 15,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
          1400: {
            slidesPerView: 5,
            spaceBetween: 20,
          },
        },
      });
    });
  }

  // Methods to control the carousel
  nextSlide(): void {
    if (this.swiperInstance) {
      this.swiperInstance.slideNext();
    }
  }

  prevSlide(): void {
    if (this.swiperInstance) {
      this.swiperInstance.slidePrev();
    }
  }

  goToSlide(index: number): void {
    if (this.swiperInstance) {
      this.swiperInstance.slideTo(index);
    }
  }
}