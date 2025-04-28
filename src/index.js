export class CalendlyFastLoad {
  constructor(options = {}) {
    this.calendlyUrl = options.calendlyUrl || 'https://calendly.com/your-username';
    this.widgetJs = 'https://assets.calendly.com/assets/external/widget.js';
    this.widgetCss = 'https://assets.calendly.com/assets/external/widget.css';
    this.lazyLoadTrigger = options.lazyLoadTrigger || 'click'; // 'click', 'visible', 'immediate'
    this.containerSelector = options.containerSelector || '.calendly-container';
    this.triggerSelector = options.triggerSelector || '.calendly-trigger';
  }

  init() {
    this.preloadResources();
    this.prefetchDNS();
    this.registerServiceWorker();
    this.setupLazyLoad();
  }

  preloadResources() {
    const jsLink = document.createElement('link');
    jsLink.rel = 'preload';
    jsLink.href = this.widgetJs;
    jsLink.as = 'script';
    document.head.appendChild(jsLink);

    const cssLink = document.createElement('link');
    cssLink.rel = 'preload';
    cssLink.href = this.widgetCss;
    cssLink.as = 'style';
    document.head.appendChild(cssLink);
  }

  prefetchDNS() {
    ['https://calendly.com', 'https://assets.calendly.com'].forEach((url) => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = url;
      document.head.appendChild(link);
    });
  }

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js').catch((err) => {
        console.warn('Service Worker registration failed:', err);
      });
    }
  }

  setupLazyLoad() {
    if (this.lazyLoadTrigger === 'immediate') {
      this.loadWidget();
    } else if (this.lazyLoadTrigger === 'click') {
      const trigger = document.querySelector(this.triggerSelector);
      if (trigger) {
        trigger.addEventListener('click', () => this.loadWidget());
      } else {
        console.warn('CalendlyFastLoad: Trigger element not found');
      }
    } else if (this.lazyLoadTrigger === 'visible') {
      const container = document.querySelector(this.containerSelector);
      if (container) {
        const observer = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) {
            this.loadWidget();
            observer.disconnect();
          }
        });
        observer.observe(container);
      } else {
        console.warn('CalendlyFastLoad: Container element not found');
      }
    }
  }

  loadWidget() {
    if (window.Calendly) {
      this.initializeWidget();
      return;
    }
    const script = document.createElement('script');
    script.src = this.widgetJs;
    script.async = true;
    script.onload = () => this.initializeWidget();
    document.body.appendChild(script);

    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = this.widgetCss;
    document.head.appendChild(css);
  }

  initializeWidget() {
    window.Calendly.showPopupWidget(this.calendlyUrl, 'PopupWidget', {
      parentElement: document.querySelector(this.containerSelector),
    });
  }
}
