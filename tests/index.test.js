/**
 * @jest-environment jsdom
 */
describe('CalendlyFastLoad', () => {
  let CalendlyFastLoad;

  beforeEach(() => {
    jest.resetModules();
    document.body.innerHTML = `
      <div class="calendly-container"></div>
      <button class="calendly-trigger">Book Now</button>
    `;
    CalendlyFastLoad = require('../src/index').CalendlyFastLoad;
  });

  test('should preload widget.js and widget.css', () => {
    const calendly = new CalendlyFastLoad();
    calendly.preloadResources();
    const links = document.querySelectorAll('link[rel="preload"]');
    expect(links.length).toBe(2);
    expect(links[0].href).toBe('https://assets.calendly.com/assets/external/widget.js');
    expect(links[1].href).toBe('https://assets.calendly.com/assets/external/widget.css');
  });

  test('should prefetch DNS for calendly domains', () => {
    const calendly = new CalendlyFastLoad();
    calendly.prefetchDNS();
    const links = document.querySelectorAll('link[rel="dns-prefetch"]');
    expect(links.length).toBe(2);
    expect(links[0].href).toBe('https://calendly.com/');
    expect(links[1].href).toBe('https://assets.calendly.com/');
  });

  test('should setup click-based lazy-load', () => {
    const calendly = new CalendlyFastLoad({ lazyLoadTrigger: 'click' });
    calendly.setupLazyLoad();
    const trigger = document.querySelector('.calendly-trigger');
    expect(trigger).toBeTruthy();
  });

  test('should warn if trigger element is missing', () => {
    console.warn = jest.fn();
    document.querySelector('.calendly-trigger').remove();
    const calendly = new CalendlyFastLoad({ lazyLoadTrigger: 'click' });
    calendly.setupLazyLoad();
    expect(console.warn).toHaveBeenCalledWith('CalendlyFastLoad: Trigger element not found');
  });
});
