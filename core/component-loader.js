class ComponentLoader {
  constructor() {
    this.cache = new Map();
  }

  async loadComponent(componentPath, targetSelector, options = {}) {
    try {
      const { replace = false, prepend = false } = options;

      if (this.cache.has(componentPath)) {
        const content = this.cache.get(componentPath);
        this.insertContent(content, targetSelector, { replace, prepend });
        return;
      }

      const response = await fetch(componentPath);
      if (!response.ok) {
        throw new Error(`Failed to load component: ${response.status}`);
      }

      const content = await response.text();

      this.cache.set(componentPath, content);

      this.insertContent(content, targetSelector, { replace, prepend });
    } catch (error) {
      console.error("Error loading component:", error);
    }
  }

  insertContent(content, targetSelector, options = {}) {
    const { replace = false, prepend = false } = options;
    const targetElement = document.querySelector(targetSelector);

    if (!targetElement) {
      console.error(`Target element not found: ${targetSelector}`);
      return;
    }

    if (replace) {
      targetElement.outerHTML = content;
    } else if (prepend) {
      targetElement.insertAdjacentHTML("afterbegin", content);
    } else {
      targetElement.insertAdjacentHTML("beforeend", content);
    }
  }

  async loadComponents(components) {
    const promises = components.map((component) =>
      this.loadComponent(component.path, component.target, component.options)
    );

    try {
      await Promise.all(promises);
    } catch (error) {
      console.error("Error loading components:", error);
    }
  }

  clearCache() {
    this.cache.clear();
  }

  removeFromCache(componentPath) {
    this.cache.delete(componentPath);
  }
}

const componentLoader = new ComponentLoader();

window.loadComponent = (path, target, options) =>
  componentLoader.loadComponent(path, target, options);

window.loadComponents = (components) =>
  componentLoader.loadComponents(components);

document.addEventListener("DOMContentLoaded", function () {
  const componentElements = document.querySelectorAll("[data-component]");

  componentElements.forEach((element) => {
    const componentPath = element.getAttribute("data-component");
    const target = element.getAttribute("data-target") || element;
    const replace = element.hasAttribute("data-replace");
    const prepend = element.hasAttribute("data-prepend");

    if (componentPath) {
      componentLoader.loadComponent(componentPath, target, {
        replace,
        prepend,
      });
    }
  });
});

if (typeof module !== "undefined" && module.exports) {
  module.exports = { ComponentLoader, componentLoader };
} else {
  window.ComponentLoader = ComponentLoader;
  window.componentLoader = componentLoader;
}
