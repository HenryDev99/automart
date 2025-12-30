class HeaderManager {
  constructor() {
    this.metaTags = [];
    this.stylesheets = [];
    this.scripts = [];
    this.inlineStyles = [];
    this.tailwindStyles = [];
    this.title = "";
    this.description = "";
    this.keywords = "";
    this.author = "";
    this.viewport = "width=device-width, initial-scale=1.0";
  }

  addMetaTag(name, content, property = "name") {
    this.metaTags.push({ name, content, property });
    return this;
  }

  addStylesheet(href, media = "all", crossorigin = false, as = null) {
    this.stylesheets.push({ href, media, crossorigin, as });
    return this;
  }

  addInlineStyle(css) {
    this.inlineStyles.push(css);
    return this;
  }

  addTailwindStyle(css) {
    this.tailwindStyles.push(css);
    return this;
  }

  addScript(src, defer = false, async = false) {
    this.scripts.push({ src, defer, async });
    return this;
  }

  setTitle(title) {
    this.title = title;
    return this;
  }

  setDescription(description) {
    this.description = description;
    return this;
  }

  setKeywords(keywords) {
    this.keywords = keywords;
    return this;
  }

  setAuthor(author) {
    this.author = author;
    return this;
  }

  setViewport(viewport) {
    this.viewport = viewport;
    return this;
  }

  addOpenGraph(property, content) {
    this.addMetaTag(property, content, "property");
    return this;
  }

  addTwitterCard(name, content) {
    this.addMetaTag(name, content, "name");
    return this;
  }

  generateHeader() {
    let header = "<head>\n";

    header += `    <meta charset="UTF-8">\n`;
    header += `    <meta name="viewport" content="${this.viewport}">\n`;

    if (this.title) {
      header += `    <title>${this.title}</title>\n`;
    }

    if (this.description) {
      header += `    <meta name="description" content="${this.description}">\n`;
    }
    if (this.keywords) {
      header += `    <meta name="keywords" content="${this.keywords}">\n`;
    }
    if (this.author) {
      header += `    <meta name="author" content="${this.author}">\n`;
    }

    this.metaTags.forEach((tag) => {
      header += `    <meta ${tag.property}="${tag.name}" content="${tag.content}">\n`;
    });

    this.stylesheets.forEach((style) => {
      let linkTag = `    <link rel="stylesheet" href="${style.href}" media="${style.media}"`;
      if (style.crossorigin) linkTag += ` crossorigin`;
      if (style.as) linkTag += ` as="${style.as}"`;
      linkTag += `>\n`;
      header += linkTag;
    });

    if (this.inlineStyles.length > 0) {
      header += `    <style>\n`;
      this.inlineStyles.forEach((css) => {
        header += `      ${css}\n`;
      });
      header += `    </style>\n`;
    }

    if (this.tailwindStyles.length > 0) {
      this.tailwindStyles.forEach((css) => {
        header += `    <style type="text/tailwindcss">\n`;
        header += `      ${css}\n`;
        header += `    </style>\n`;
      });
    }

    this.scripts.forEach((script) => {
      let scriptTag = `    <script src="${script.src}"`;
      if (script.defer) scriptTag += " defer";
      if (script.async) scriptTag += " async";
      scriptTag += "></script>\n";
      header += scriptTag;
    });

    header += "</head>";
    return header;
  }

  replaceHeader() {
    const newHeader = this.generateHeader();
    const head = document.head;
    if (head) {
      head.outerHTML = newHeader;
    }
  }

  appendToHead() {
    const head = document.head;
    if (!head) return;

    let viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      viewportMeta.setAttribute("content", this.viewport);
    } else {
      viewportMeta = document.createElement("meta");
      viewportMeta.setAttribute("name", "viewport");
      viewportMeta.setAttribute("content", this.viewport);
      head.appendChild(viewportMeta);
    }

    if (this.title) {
      let titleTag = document.querySelector("title");
      if (titleTag) {
        titleTag.textContent = this.title;
      } else {
        titleTag = document.createElement("title");
        titleTag.textContent = this.title;
        head.appendChild(titleTag);
      }
    }

    this.metaTags.forEach((tag) => {
      const meta = document.createElement("meta");
      meta.setAttribute(tag.property, tag.name);
      meta.setAttribute("content", tag.content);
      head.appendChild(meta);
    });

    this.stylesheets.forEach((style) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = style.href;
      link.media = style.media;
      if (style.crossorigin) link.crossOrigin = "anonymous";
      if (style.as) link.as = style.as;
      head.appendChild(link);
    });

    if (this.inlineStyles.length > 0) {
      const styleTag = document.createElement("style");
      styleTag.textContent = this.inlineStyles.join("\n");
      head.appendChild(styleTag);
    }

    this.tailwindStyles.forEach((css) => {
      const styleTag = document.createElement("style");
      styleTag.type = "text/tailwindcss";
      styleTag.textContent = css;
      head.appendChild(styleTag);
    });

    this.scripts.forEach((script) => {
      const scriptTag = document.createElement("script");
      scriptTag.src = script.src;
      if (script.defer) scriptTag.defer = true;
      if (script.async) scriptTag.async = true;
      head.appendChild(scriptTag);
    });
  }
}

const defaultHeader = new HeaderManager()
  .setTitle("AutoMart - 인터넷자동차공매")
  .setKeywords("자동차, 중고차, 차량, AutoMart, 인터넷자동차공매")
  .setAuthor("AutoMart Team")
  .addScript("https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4", true, false)
  .addStylesheet(
    "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css",
    "all",
    true,
    "style"
  )
  .addInlineStyle(
    `html { 
      font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', sans-serif;
      overflow-x: hidden !important;
      max-width: 100vw !important;
      width: 100% !important;
      position: relative;
    }
    body {
      font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', sans-serif;
      overflow-x: hidden !important;
      max-width: 100vw !important;
      width: 100% !important;
      position: relative;
    }
    main, section, article, div {
      max-width: 100% !important;
      overflow-x: hidden;
    }
    img, video, iframe {
      max-width: 100% !important;
      height: auto;
    }
      select {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        background: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23A10076' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat 95% center;
        background-size: 12px auto;
      }
      select::-ms-expand {
        display: none;
      }
      * {
        box-sizing: border-box;
      }
  `
  )
  .addTailwindStyle(
    `@theme {
      --breakpoint-md: 768px;
      --breakpoint-lg: 1024px;
    }`
  )
  .addOpenGraph("og:title", "AutoMart - 인터넷자동차공매")
  .addOpenGraph("og:type", "website")
  .addTwitterCard("twitter:card", "summary_large_image")
  .addTwitterCard("twitter:title", "AutoMart - 인터넷자동차공매");

if (typeof module !== "undefined" && module.exports) {
  module.exports = { HeaderManager, defaultHeader };
} else {
  window.HeaderManager = HeaderManager;
  window.defaultHeader = defaultHeader;
}
