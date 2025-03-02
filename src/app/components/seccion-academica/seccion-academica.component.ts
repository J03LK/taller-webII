import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import Swiper from 'swiper';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

interface Career {
  id: number;
  title: string;
  imageUrl: string;
  link: string;
}

@Component({
  selector: 'app-seccion-academica',
  standalone: true,
  imports: [],
  templateUrl: './seccion-academica.component.html',
  styleUrls: ['./seccion-academica.component.css']
})
export class SeccionAcademicaComponent implements OnInit, AfterViewInit {
  @ViewChild('swiperContainer', { static: false }) swiperContainer!: ElementRef<HTMLDivElement>;

  careers: Career[] = [
    { id: 1, title: 'ESTÉTICA INTEGRAL', imageUrl: 'https://itsqmet.edu.ec/wp-content/uploads/2024/02/estetica_Mesa-de-trabajo-1.webp', link: '/estetica-integral' },
    { id: 2, title: 'PROCESAMIENTO DE ALIMENTOS', imageUrl: 'https://itsqmet.edu.ec/wp-content/uploads/2024/09/Recurso-1.webp', link: '/procesamiento-de-alimentos' },
    { id: 3, title: 'MECÁNICA AUTOMOTRIZ', imageUrl: 'https://itsqmet.edu.ec/wp-content/uploads/2024/09/Recurso-2.webp', link: '/mecanica-automotriz' },
    { id: 4, title: 'DISEÑO MULTIMEDIA', imageUrl: 'https://itsqmet.edu.ec/wp-content/uploads/2024/09/Recurso-3.webp', link: '/diseno-multimedia' },
    { id: 5, title: 'DESARROLLO DE SOFTWARE', imageUrl: 'https://itsqmet.edu.ec/wp-content/uploads/2023/10/desarrollo-soft-jpg.webp', link: '/tecnologia-desarrollo-de-software' }
  ];

  swiperInstance!: Swiper;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.swiperContainer) {
      this.initSwiper();
    }
  }

  private initSwiper(): void {
    this.swiperInstance = new Swiper(this.swiperContainer.nativeElement, {
      modules: [Pagination, Navigation, Autoplay],
      slidesPerView: 1,
      spaceBetween: 20,
      loop: false,
      pagination: { el: '.swiper-pagination', clickable: true },
      autoplay: { delay: 3000, disableOnInteraction: false },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      breakpoints: {
        640: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 4 },
        1400: { slidesPerView: 5 },
      },
    });
  }

  nextSlide(): void {
    this.swiperInstance?.slideNext();
  }

  prevSlide(): void {
    this.swiperInstance?.slidePrev();
  }
}
