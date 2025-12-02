let stylesInjected = false;

export function injectStyles() {
  if (stylesInjected) return;
  

  const cssUrl = new URL('./index.css', import.meta.url).href;
  
  const existingLink = document.querySelector(`link[href="${cssUrl}"]`);
  if (existingLink) {
    stylesInjected = true;
    return;
  }
  
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = cssUrl;
  document.head.appendChild(link);
  
  stylesInjected = true;
}

if (typeof window !== 'undefined') {
  injectStyles();
}
