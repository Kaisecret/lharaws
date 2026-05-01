(() => {
  const imageFiles = window.CYNTHIAS_IMAGES || [];

  const sitePages = [
    { key: "home", label: "Home", file: "index.html" },
    { key: "about", label: "About", file: "about.html" },
    { key: "categories", label: "Categories", file: "categories.html" },
    { key: "new-arrivals", label: "New Arrivals", file: "new-arrivals.html" },
    { key: "best-sellers", label: "Best Sellers", file: "best-sellers.html" },
    { key: "promo", label: "Promo", file: "promo.html" },
    { key: "contact", label: "Contact", file: "contact.html" }
  ];

  const categoryMeta = {
    dresses: {
      title: "Dresses",
      anchor: "dresses",
      badge: "Style Pick",
      description:
        "Flowing day dresses, event ready gowns, and polished silhouettes for every special moment.",
      categoryCopy: "It brings graceful movement and a polished finish."
    },
    tops: {
      title: "Tops and Blouses",
      anchor: "tops-and-blouses",
      badge: "Fresh Edit",
      description:
        "Soft blouses, elegant tops, and easy styling pieces that work from class to casual errands.",
      categoryCopy: "It layers beautifully from class days to weekend plans."
    },
    tshirts: {
      title: "T Shirts",
      anchor: "t-shirts",
      badge: "Street Pick",
      description:
        "Graphic tees and sporty essentials with playful energy, relaxed comfort, and easy styling.",
      categoryCopy: "It keeps the look laid back, fresh, and easy to wear."
    },
    cropTops: {
      title: "Crop Tops",
      anchor: "crop-tops",
      badge: "Trend Pick",
      description:
        "Youthful shapes with modern proportion, easy confidence, and lightweight comfort for sunny days.",
      categoryCopy: "It adds a trendy silhouette with light everyday comfort."
    },
    jeans: {
      title: "Jeans",
      anchor: "jeans",
      badge: "Denim Edit",
      description:
        "Denim, cargos, trousers, joggers, and fashion bottoms that anchor versatile daily outfits.",
      categoryCopy: "It anchors outfits with versatile shape and easy movement."
    },
    skirts: {
      title: "Skirts",
      anchor: "skirts",
      badge: "Elegant Pick",
      description:
        "Soft drape, texture, and feminine detail for shoppers who want graceful everyday style.",
      categoryCopy: "It softens the look with flow, texture, and feminine detail."
    },
    shorts: {
      title: "Shorts",
      anchor: "shorts",
      badge: "Sunny Pick",
      description:
        "Warm weather favorites for active days, easy movement, and carefree local style.",
      categoryCopy: "It keeps warm weather styling cool and effortless."
    },
    outerwear: {
      title: "Jackets and Hoodies",
      anchor: "jackets-and-hoodies",
      badge: "Layer Love",
      description:
        "Jackets, hoodies, bombers, and statement layers that sharpen the whole outfit instantly.",
      categoryCopy: "It adds structure, comfort, and a confident finish."
    },
    sets: {
      title: "Matching Sets and Terno",
      anchor: "matching-sets-and-terno",
      badge: "Set Style",
      description:
        "Coordinated outfits, styled pairings, and lookbook inspiration for shoppers who want instant polish.",
      categoryCopy: "It creates an intentional look with minimal effort."
    },
    accessories: {
      title: "Accessories",
      anchor: "accessories",
      badge: "Finishing Touch",
      description:
        "Hair pieces, caps, bags, and small details that pull the full fashion story together.",
      categoryCopy: "It completes the outfit with a stylish final touch."
    }
  };

  const categoryOrder = [
    "dresses",
    "tops",
    "tshirts",
    "cropTops",
    "jeans",
    "skirts",
    "shorts",
    "outerwear",
    "sets",
    "accessories"
  ];

  const audienceLabelMap = {
    womens: "Women",
    mens: "Men",
    unisex: "Unisex",
    boys: "Boys",
    girls: "Girls",
    kids: "Kids",
    mixed: "Community",
    fashion: "Editorial"
  };

  const styleLabelMap = {
    casual: "Everyday Edit",
    formal: "Occasion Edit",
    streetwear: "Street Style",
    summer: "Sunny Edit",
    winter: "Layered Edit",
    sportswear: "Active Edit",
    fashion: "Lookbook",
    editorial: "Editorial",
    modest: "Modest Edit"
  };

  const tokenMap = {
    tshirt: "T Shirt",
    tshirts: "T Shirts",
    zipup: "Zip Up",
    filipiniana: "Filipiniana",
    retro: "Retro",
    aloha: "Aloha",
    york: "York",
    miami: "Miami",
    california: "California",
    dogs: "Dogs"
  };

  const cartStorageKey = "cynthias_cart_v1";
  const cartCurrency = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

  let cartItems = [];
  let cartModal;
  let cartItemsTarget;
  let cartSummaryTarget;
  let cartTotalTarget;
  let cartCheckoutButton;
  let cartEmptyState;
  let sweetAlertPromise;

  const styleCopyMap = {
    casual: "Easy styling for class, errands, and coffee catch ups.",
    formal: "A polished choice for parties, school events, and celebration moments.",
    streetwear: "Bold energy with relaxed comfort and city inspired attitude.",
    summer: "Lightweight comfort for warm days, market strolls, and sunny plans.",
    winter: "Layer friendly comfort with soft structure and cozy appeal.",
    sportswear: "Flexible comfort with active energy and easy movement.",
    fashion: "Curated inspiration for fresh styling ideas and coordinated looks.",
    editorial: "Curated inspiration for fresh styling ideas and coordinated looks.",
    modest: "Clean styling with refined comfort and graceful shape."
  };

  const priceBands = {
    accessories: [100, 290],
    cropTops: [150, 320],
    tshirts: [180, 420],
    tops: [200, 450],
    shorts: [220, 420],
    jeans: [350, 800],
    skirts: [260, 520],
    outerwear: [420, 800],
    dresses: [380, 800],
    sets: [450, 800]
  };

  function titleCaseWord(token) {
    if (!token) {
      return "";
    }

    if (/^\d+$/.test(token)) {
      return token;
    }

    return token.charAt(0).toUpperCase() + token.slice(1);
  }

  function baseName(file) {
    return file.replace(/\.[^.]+$/, "");
  }

  function splitTokens(file) {
    return baseName(file).split("-");
  }

  function getVariantKey(file) {
    return baseName(file).replace(/-\d+$/, "");
  }

  function getVariantNumber(file) {
    const match = baseName(file).match(/-(\d+)$/);
    return match ? Number.parseInt(match[1], 10) : 1;
  }

  const variantCounts = imageFiles
    .filter((file) => file !== "logo.webp")
    .reduce((counts, file) => {
      const key = getVariantKey(file);
      counts[key] = (counts[key] || 0) + 1;
      return counts;
    }, {});

  function inferCategory(file) {
    const name = file.toLowerCase();

    if (/(cap|hat|bag|belt|clip|bow)/.test(name)) return "accessories";
    if (/(dress|gown|filipiniana|prom)/.test(name)) return "dresses";
    if (/skirt/.test(name)) return "skirts";
    if (/(crop-top|crop-tops|cropped-tank-top|tank-top)/.test(name)) return "cropTops";
    if (/(tshirt|tshirts|jersey-shirt)/.test(name)) return "tshirts";
    if (/(jacket|hoodie|hoodies|bomber|puffer|zipup|blazer)/.test(name)) return "outerwear";
    if (/shorts/.test(name)) return "shorts";
    if (/(jeans|pants|jogger|cargo|track-pants|palazzo|chino|wide-leg|linen-pants)/.test(name)) return "jeans";
    if (/(lineup|background|banner|guide|swimsuit|outfit)/.test(name)) return "sets";
    if (/(blouse|blouses|top|tops|barong|shirt-flatlay)/.test(name)) return "tops";
    return "sets";
  }

  function buildTitle(file) {
    const name = baseName(file);

    if (name.includes("lookbook-photography-guide")) return "Lookbook Photography Edit";
    if (name.includes("beige-banner-image")) return "Boutique Banner Scene";
    if (name.includes("fashion-background")) return "Fashion Story Backdrop";

    const words = splitTokens(file)
      .slice(2)
      .filter((token, index, items) => {
        if (token === "mockup" || token === "image") return false;
        if (/^\d+$/.test(token) && items[index - 1] !== "number") return false;
        return true;
      })
      .map((token) => {
        if (token === "number") return "No.";
        return tokenMap[token] || titleCaseWord(token);
      })
      .filter(Boolean);

    const title = words.join(" ");

    if ((variantCounts[getVariantKey(file)] || 0) > 1) {
      return `${title} Type ${getVariantNumber(file)}`;
    }

    return title;
  }

  function buildBadge(product, mode = "standard") {
    if (mode === "new") return "Just In";
    if (mode === "best") return "Top Pick";
    if (mode === "promo") return "Save Now";
    return categoryMeta[product.category].badge;
  }

  function buildPrice(file, category) {
    const [min, max] = priceBands[category] || [100, 800];
    const step = 10;
    const spread = Math.floor((max - min) / step) + 1;
    const hash = [...file].reduce((total, character, index) => total + character.charCodeAt(0) * (index + 1), 0);
    return min + (hash % spread) * step;
  }

  const catalog = imageFiles
    .filter((file) => file !== "logo.webp")
    .map((file, index) => {
      const tokens = splitTokens(file);
      const audience = tokens[0] || "unisex";
      const style = tokens[1] || "casual";
      const category = inferCategory(file);
      const isEditorial = audience === "fashion" || /background|banner|guide/.test(file.toLowerCase());

      const freshScore =
        (style === "summer" ? 3 : 0) +
        (style === "streetwear" ? 2 : 0) +
        (category === "cropTops" || category === "dresses" ? 1 : 0) +
        (index % 7 === 0 ? 1 : 0);

      const bestScore =
        (category === "dresses" || category === "tshirts" || category === "outerwear" ? 2 : 0) +
        (/graphic|floral|hoodie|dress|bag/.test(file.toLowerCase()) ? 1 : 0) +
        (audience === "womens" || audience === "unisex" ? 1 : 0) +
        (index % 5 === 0 ? 1 : 0);

      const promoScore =
        (style === "casual" ? 2 : 0) +
        (["tops", "shorts", "accessories", "jeans"].includes(category) ? 1 : 0) +
        (/assorted|multicolor|lineup/.test(file.toLowerCase()) ? 1 : 0) +
        (index % 4 === 0 ? 1 : 0);

      return {
        file,
        index,
        audience,
        audienceLabel: audienceLabelMap[audience] || titleCaseWord(audience),
        style,
        styleLabel: styleLabelMap[style] || titleCaseWord(style),
        category,
        title: buildTitle(file),
        variantNumber: getVariantNumber(file),
        hasVariants: (variantCounts[getVariantKey(file)] || 0) > 1,
        price: buildPrice(file, category),
        isEditorial,
        freshScore,
        bestScore,
        promoScore
      };
    })
    .map((product) => ({
      ...product,
      description: `${styleCopyMap[product.style] || styleCopyMap.casual} ${categoryMeta[product.category].categoryCopy}${
        product.hasVariants ? ` This is Type ${product.variantNumber} in the same design line.` : ""
      }`
    }));

  const shoppableCatalog = catalog.filter((product) => !product.isEditorial);
  const catalogByFile = new Map(catalog.map((product) => [product.file, product]));

  function sortByScore(products, scoreKey) {
    return [...products].sort((left, right) => {
      if (right[scoreKey] !== left[scoreKey]) return right[scoreKey] - left[scoreKey];
      return left.index - right.index;
    });
  }

  function formatPrice(value) {
    return cartCurrency.format(value);
  }

  function uniqueProducts(products) {
    const seen = new Set();
    return products.filter((product) => {
      if (seen.has(product.file)) return false;
      seen.add(product.file);
      return true;
    });
  }

  function getCategoryProducts(categoryKey) {
    return catalog.filter((product) => product.category === categoryKey);
  }

  function selectByCategories(source, categories, amountPerCategory) {
    return uniqueProducts(
      categories.flatMap((categoryKey) =>
        source.filter((product) => product.category === categoryKey).slice(0, amountPerCategory)
      )
    );
  }

  function getProductsByFiles(files) {
    return files.map((file) => catalog.find((product) => product.file === file)).filter(Boolean);
  }

  const homeFeaturedProducts = uniqueProducts([
    ...selectByCategories(shoppableCatalog, ["dresses", "tops", "cropTops", "jeans", "outerwear", "accessories"], 1),
    ...sortByScore(
      shoppableCatalog.filter((product) => product.category === "tshirts" || product.category === "shorts"),
      "bestScore"
    ).slice(0, 2)
  ]).slice(0, 8);

  const homeStyleMix = getProductsByFiles([
    "mixed-fashion-assorted-outfit-lineup.webp",
    "womens-fashion-assorted-dress-lineup.webp",
    "unisex-casual-black-white-couple-graphic-tshirts.webp",
    "womens-formal-blue-ball-gown-dress.webp",
    "unisex-casual-light-pink-hoodie.webp",
    "womens-formal-gold-hair-clip-set.webp"
  ]);

  const aboutGallery = getProductsByFiles([
    "fashion-editorial-lookbook-photography-guide.webp",
    "fashion-editorial-beige-banner-image.webp",
    "mixed-fashion-assorted-outfit-lineup.webp",
    "unisex-fashion-multicolor-fashion-background.webp",
    "womens-fashion-assorted-dress-lineup.webp",
    "boys-fashion-assorted-outfit-lineup.webp"
  ]);

  const newArrivalProducts = sortByScore(shoppableCatalog, "freshScore").slice(0, 12);
  const arrivalEdit = selectByCategories(shoppableCatalog, ["cropTops", "dresses", "tops", "shorts", "outerwear", "accessories"], 1).slice(0, 6);
  const bestSellerProducts = sortByScore(shoppableCatalog, "bestScore").slice(0, 12);
  const promoProducts = sortByScore(shoppableCatalog, "promoScore").slice(0, 12);

  const contactGallery = getProductsByFiles([
    "womens-casual-pink-floral-midi-dress.webp",
    "womens-casual-white-button-front-blouse.webp",
    "unisex-casual-black-leather-sling-bag.webp",
    "womens-formal-pink-satin-hair-bow.webp",
    "unisex-casual-blue-denim-jacket.webp",
    "womens-casual-yellow-lace-crop-top.webp"
  ]);

  function createProductCard(product, options = {}) {
    const columnClass = options.columnClass || "col-sm-6 col-lg-4 col-xl-3";
    const mode = options.mode || "standard";

    return `
      <div class="${columnClass} reveal">
        <article class="product-card h-100">
          <div class="product-media">
            <img src="../images/${product.file}" alt="${product.title}" loading="lazy">
            <span class="badge-pill">${buildBadge(product, mode)}</span>
          </div>
          <div class="product-body">
            <div class="product-meta">
              <span>${product.audienceLabel}</span>
              <span>${product.styleLabel}</span>
              ${product.hasVariants ? `<span>Type ${product.variantNumber}</span>` : ""}
            </div>
            <h3 class="product-title">${product.title}</h3>
            <p class="product-copy">${product.description}</p>
            <div class="product-footer">
              <div class="product-price">${formatPrice(product.price)}</div>
              <button class="product-cart-btn" type="button" data-add-to-cart="${product.file}" aria-label="Add ${product.title} to cart">
                <i class="bi bi-bag-plus"></i>
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </article>
      </div>
    `;
  }

  function createCategoryCard(categoryKey) {
    const meta = categoryMeta[categoryKey];
    const sample = getCategoryProducts(categoryKey)[0];
    if (!sample) return "";

    return `
      <div class="col-md-6 col-xl-3 reveal">
        <article class="category-card h-100">
          <div class="category-card-image">
            <img src="../images/${sample.file}" alt="${meta.title}" loading="lazy">
          </div>
          <div class="category-card-body">
            <h3>${meta.title}</h3>
            <p>${meta.description}</p>
            <a class="inline-link" href="categories.html#${meta.anchor}">
              Explore the category
              <i class="bi bi-arrow-right"></i>
            </a>
          </div>
        </article>
      </div>
    `;
  }

  function createMosaicCard(product) {
    return `
      <article class="mosaic-card reveal">
        <img src="../images/${product.file}" alt="${product.title}" loading="lazy">
        <div class="mosaic-content">
          <h3>${product.title}</h3>
          <p>${product.description}</p>
        </div>
      </article>
    `;
  }

  function renderGrid(targetId, products, options = {}) {
    const container = document.getElementById(targetId);
    if (!container) return;
    container.innerHTML = `<div class="row g-4">${products.map((product) => createProductCard(product, options)).join("")}</div>`;
    initReveals();
  }

  function renderMosaic(targetId, products) {
    const container = document.getElementById(targetId);
    if (!container) return;
    container.innerHTML = `<div class="mosaic-grid three-up">${products.map((product) => createMosaicCard(product)).join("")}</div>`;
    initReveals();
  }

  function renderNav() {
    const target = document.querySelector("[data-site-nav]");
    if (!target) return;

    const currentPage = document.body.dataset.page;

    target.innerHTML = `
      <nav class="navbar navbar-expand-xl navbar-light fixed-top site-navbar">
        <div class="container">
          <a class="navbar-brand" href="index.html" aria-label="Cynthias DressShop home">
            <img class="brand-logo" src="../images/logo.webp" alt="Cynthias DressShop logo">
            <span class="brand-mark">
              <span>Fashion Boutique</span>
              <strong>Cynthias DressShop</strong>
            </span>
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#siteNav" aria-controls="siteNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="navbar-quick-actions d-xl-none">
            <button class="cart-trigger cart-trigger-compact" type="button" data-open-cart aria-label="Open cart">
              <i class="bi bi-bag-heart"></i>
              <span class="cart-count-badge is-empty" data-cart-count>0</span>
            </button>
          </div>
          <div class="collapse navbar-collapse" id="siteNav">
            <ul class="navbar-nav ms-auto align-items-xl-center">
              ${sitePages
                .map(
                  (page) => `
                    <li class="nav-item">
                      <a class="nav-link ${currentPage === page.key ? "active" : ""}" href="${page.file}">${page.label}</a>
                    </li>
                  `
                )
                .join("")}
            </ul>
            <div class="nav-actions ms-xl-3 mt-3 mt-xl-0">
              <button class="cart-trigger d-none d-xl-inline-flex" type="button" data-open-cart aria-label="Open cart">
                <i class="bi bi-bag-heart"></i>
                <span>Cart</span>
                <span class="cart-count-badge is-empty" data-cart-count>0</span>
              </button>
              <a class="btn-brand shop-now-btn" href="categories.html">
                Shop Now
                <i class="bi bi-bag-heart"></i>
              </a>
            </div>
          </div>
        </div>
      </nav>
    `;
  }

  function renderCartModal() {
    if (document.querySelector("[data-cart-modal]")) {
      cartModal = document.querySelector("[data-cart-modal]");
      cartItemsTarget = cartModal.querySelector("[data-cart-items]");
      cartSummaryTarget = cartModal.querySelector("[data-cart-summary]");
      cartTotalTarget = cartModal.querySelector("[data-cart-total]");
      cartCheckoutButton = cartModal.querySelector("[data-cart-checkout]");
      cartEmptyState = cartModal.querySelector("[data-cart-empty]");
      return;
    }

    document.body.insertAdjacentHTML(
      "beforeend",
      `
        <div class="cart-modal" data-cart-modal hidden>
          <button class="cart-backdrop" type="button" data-close-cart aria-label="Close cart"></button>
          <aside class="cart-panel" role="dialog" aria-modal="true" aria-label="Shopping cart">
            <header class="cart-header">
              <h2>Your Cart</h2>
              <button class="cart-close" type="button" data-close-cart aria-label="Close cart">
                <i class="bi bi-x-lg"></i>
              </button>
            </header>
            <p class="cart-subtitle">Review your selected items before checkout.</p>
            <div class="cart-empty-state" data-cart-empty>
              <i class="bi bi-bag"></i>
              <p>Your cart is empty. Add styles you love to get started.</p>
            </div>
            <div class="cart-items" data-cart-items aria-live="polite"></div>
            <footer class="cart-footer">
              <div>
                <span class="cart-summary" data-cart-summary>0 items</span>
                <strong class="cart-total" data-cart-total>${formatPrice(0)}</strong>
              </div>
              <button class="btn-brand cart-checkout" type="button" data-cart-checkout disabled>
                Buy Now
                <i class="bi bi-lightning-charge-fill"></i>
              </button>
            </footer>
          </aside>
        </div>
      `
    );

    cartModal = document.querySelector("[data-cart-modal]");
    cartItemsTarget = cartModal.querySelector("[data-cart-items]");
    cartSummaryTarget = cartModal.querySelector("[data-cart-summary]");
    cartTotalTarget = cartModal.querySelector("[data-cart-total]");
    cartCheckoutButton = cartModal.querySelector("[data-cart-checkout]");
    cartEmptyState = cartModal.querySelector("[data-cart-empty]");
  }

  function getStoredCart() {
    try {
      const raw = window.localStorage.getItem(cartStorageKey);
      if (!raw) return [];

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];

      return parsed
        .filter((item) => item && typeof item.file === "string" && Number.isFinite(item.quantity))
        .map((item) => ({
          file: item.file,
          quantity: Math.max(1, Math.floor(item.quantity))
        }))
        .filter((item) => catalogByFile.has(item.file));
    } catch {
      return [];
    }
  }

  function saveCart() {
    window.localStorage.setItem(cartStorageKey, JSON.stringify(cartItems));
  }

  function getCartQuantity() {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  function getCartTotal() {
    return cartItems.reduce((total, item) => {
      const product = catalogByFile.get(item.file);
      if (!product) return total;
      return total + product.price * item.quantity;
    }, 0);
  }

  function updateCartBadge() {
    const quantity = getCartQuantity();
    document.querySelectorAll("[data-cart-count]").forEach((badge) => {
      badge.textContent = String(quantity);
      badge.classList.toggle("is-empty", quantity === 0);
    });
  }

  function buildCartItem(item) {
    const product = catalogByFile.get(item.file);
    if (!product) return "";

    const subtotal = product.price * item.quantity;

    return `
      <article class="cart-item" data-cart-item="${item.file}">
        <img src="../images/${product.file}" alt="${product.title}" loading="lazy">
        <div class="cart-item-body">
          <h3>${product.title}</h3>
          <p>${product.audienceLabel} - ${product.styleLabel}</p>
          <strong>${formatPrice(subtotal)}</strong>
          <div class="cart-controls">
            <button type="button" data-cart-decrease="${item.file}" aria-label="Decrease ${product.title} quantity">
              <i class="bi bi-dash"></i>
            </button>
            <span>${item.quantity}</span>
            <button type="button" data-cart-increase="${item.file}" aria-label="Increase ${product.title} quantity">
              <i class="bi bi-plus"></i>
            </button>
            <button class="cart-remove" type="button" data-cart-remove="${item.file}">Remove</button>
          </div>
        </div>
      </article>
    `;
  }

  function renderCartState() {
    if (!cartModal || !cartItemsTarget || !cartSummaryTarget || !cartTotalTarget || !cartCheckoutButton || !cartEmptyState) return;

    const quantity = getCartQuantity();
    const total = getCartTotal();

    cartItemsTarget.innerHTML = cartItems.map((item) => buildCartItem(item)).join("");
    cartSummaryTarget.textContent = `${quantity} ${quantity === 1 ? "item" : "items"}`;
    cartTotalTarget.textContent = formatPrice(total);
    cartCheckoutButton.disabled = quantity === 0;
    cartItemsTarget.classList.toggle("is-empty", quantity === 0);
    cartEmptyState.classList.toggle("is-visible", quantity === 0);
  }

  function syncCartUI() {
    updateCartBadge();
    renderCartState();
  }

  function openCart() {
    if (!cartModal) return;
    cartModal.hidden = false;
    document.body.classList.add("cart-open");
    window.requestAnimationFrame(() => {
      cartModal.classList.add("is-open");
    });
  }

  function closeCart() {
    if (!cartModal) return;
    cartModal.classList.remove("is-open");
    document.body.classList.remove("cart-open");
    window.setTimeout(() => {
      if (!cartModal.classList.contains("is-open")) {
        cartModal.hidden = true;
      }
    }, 220);
  }

  function addToCart(file) {
    if (!catalogByFile.has(file)) return;

    const existing = cartItems.find((item) => item.file === file);
    if (existing) {
      existing.quantity += 1;
    } else {
      cartItems.push({ file, quantity: 1 });
    }

    saveCart();
    syncCartUI();
  }

  function changeItemQuantity(file, delta) {
    const item = cartItems.find((entry) => entry.file === file);
    if (!item) return;

    item.quantity = Math.max(1, item.quantity + delta);
    saveCart();
    syncCartUI();
  }

  function removeCartItem(file) {
    cartItems = cartItems.filter((item) => item.file !== file);
    saveCart();
    syncCartUI();
  }

  function ensureSweetAlert() {
    if (window.Swal) return Promise.resolve(window.Swal);
    if (sweetAlertPromise) return sweetAlertPromise;

    if (!document.querySelector("link[data-swal-theme]")) {
      const stylesheet = document.createElement("link");
      stylesheet.rel = "stylesheet";
      stylesheet.href = "https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css";
      stylesheet.setAttribute("data-swal-theme", "true");
      document.head.appendChild(stylesheet);
    }

    sweetAlertPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
      script.onload = () => resolve(window.Swal);
      script.onerror = () => reject(new Error("Failed to load SweetAlert2"));
      document.head.appendChild(script);
    });

    return sweetAlertPromise;
  }

  async function checkoutCart() {
    const quantity = getCartQuantity();
    const total = getCartTotal();
    if (quantity === 0) return;

    closeCart();

    await new Promise((resolve) => {
      window.setTimeout(resolve, 240);
    });

    try {
      const Swal = await ensureSweetAlert();
      await Swal.fire({
        icon: "success",
        title: "Order successful",
        html: `<p class="swal-copy">Thanks for shopping at Cynthias DressShop.<br>You ordered <strong>${quantity}</strong> ${
          quantity === 1 ? "item" : "items"
        } with a total of <strong>${formatPrice(total)}</strong>.</p>`,
        confirmButtonText: "Continue shopping",
        customClass: {
          popup: "shop-swal-popup",
          confirmButton: "shop-swal-confirm"
        },
        buttonsStyling: false
      });
    } catch {
      window.alert(`Order successful! Total: ${formatPrice(total)}`);
    }

    cartItems = [];
    saveCart();
    syncCartUI();
  }

  function initCart() {
    cartItems = getStoredCart();
    renderCartModal();
    syncCartUI();

    document.addEventListener("click", (event) => {
      const addTarget = event.target.closest("[data-add-to-cart]");
      if (addTarget) {
        addToCart(addTarget.dataset.addToCart);
        return;
      }

      if (event.target.closest("[data-open-cart]")) {
        openCart();
        return;
      }

      if (event.target.closest("[data-close-cart]")) {
        closeCart();
        return;
      }

      const increaseTarget = event.target.closest("[data-cart-increase]");
      if (increaseTarget) {
        changeItemQuantity(increaseTarget.dataset.cartIncrease, 1);
        return;
      }

      const decreaseTarget = event.target.closest("[data-cart-decrease]");
      if (decreaseTarget) {
        const file = decreaseTarget.dataset.cartDecrease;
        const item = cartItems.find((entry) => entry.file === file);
        if (item && item.quantity === 1) {
          removeCartItem(file);
        } else {
          changeItemQuantity(file, -1);
        }
        return;
      }

      const removeTarget = event.target.closest("[data-cart-remove]");
      if (removeTarget) {
        removeCartItem(removeTarget.dataset.cartRemove);
        return;
      }

      if (event.target.closest("[data-cart-checkout]")) {
        void checkoutCart();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && cartModal && cartModal.classList.contains("is-open")) {
        closeCart();
      }
    });
  }

  function renderFooter() {
    const target = document.querySelector("[data-site-footer]");
    if (!target) return;

    target.innerHTML = `
      <div class="footer-shell">
        <div class="container">
          <div class="row g-4">
            <div class="col-lg-5">
              <div class="footer-brand">
                <img class="footer-logo" src="../images/logo.webp" alt="Cynthias DressShop logo">
                <div>
                  <strong>Cynthias DressShop</strong>
                  <span>San Jose de Buenavista, Antique</span>
                </div>
              </div>
              <p>Trendy and affordable fashion for teenagers, students, and local shoppers who want confidence in every look.</p>
            </div>
            <div class="col-sm-6 col-lg-3">
              <h3 class="text-white h5 mb-3">Quick Links</h3>
              <div class="footer-links">${sitePages.map((page) => `<a href="${page.file}">${page.label}</a>`).join("")}</div>
            </div>
            <div class="col-sm-6 col-lg-4">
              <h3 class="text-white h5 mb-3">Visit and Contact</h3>
              <div class="footer-links">
                <span>Belison Road, San Jose de Buenavista, Antique</span>
                <a href="tel:+639175202456">0917 520 2456</a>
                <a href="mailto:hello@cynthiasdressshop.com">hello@cynthiasdressshop.com</a>
                <span>Open daily, 9:00 AM to 7:00 PM</span>
              </div>
            </div>
          </div>
          <div class="footer-note"><span data-year></span> Cynthias DressShop. All rights reserved.</div>
        </div>
      </div>
    `;
  }

  function renderHomePage() {
    const target = document.getElementById("home-featured-categories");
    if (target) {
      target.innerHTML = `<div class="row g-4">${["dresses", "tops", "cropTops", "accessories"].map((categoryKey) => createCategoryCard(categoryKey)).join("")}</div>`;
      initReveals();
    }

    renderGrid("home-featured-products", homeFeaturedProducts, { mode: "standard" });
    renderGrid("home-style-mix", homeStyleMix, { mode: "standard", columnClass: "col-md-6 col-xl-4" });
  }

  function renderAboutPage() {
    renderMosaic("about-gallery", aboutGallery);
  }

  function renderNewArrivalsPage() {
    renderGrid("new-arrivals-grid", newArrivalProducts, { mode: "new" });
    renderGrid("arrival-editors-picks", arrivalEdit, { mode: "standard", columnClass: "col-md-6 col-xl-4" });
  }

  function renderBestSellersPage() {
    renderGrid("best-sellers-grid", bestSellerProducts, { mode: "best" });
    const target = document.getElementById("best-seller-strip");
    if (!target) return;

    target.innerHTML = `
      <div class="row g-4">
        ${["dresses", "tshirts", "outerwear"]
          .map((categoryKey) => {
            const meta = categoryMeta[categoryKey];
            const count = getCategoryProducts(categoryKey).length;
            return `
              <div class="col-md-4 reveal">
                <article class="stat-card">
                  <div class="value-icon"><i class="bi bi-stars"></i></div>
                  <h3>${meta.title}</h3>
                  <p>${count} standout styles are featured in this best seller edit for shoppers who love easy style and value.</p>
                </article>
              </div>
            `;
          })
          .join("")}
      </div>
    `;
    initReveals();
  }

  function renderPromoPage() {
    renderGrid("promo-grid", promoProducts, { mode: "promo" });
    const target = document.getElementById("promo-banners");
    if (!target) return;

    const cards = [
      {
        title: "Style Savings",
        copy: "Selected everyday looks come with easy price points so shoppers can refresh more than one outfit at a time."
      },
      {
        title: "Bundle Picks",
        copy: "Pair tops, bottoms, and accessories for a polished store visit with friendly seasonal savings."
      },
      {
        title: "Weekend Treats",
        copy: "Fresh arrivals and popular staples are highlighted for students and families shopping before the weekend."
      }
    ];

    target.innerHTML = `
      <div class="row g-4">
        ${cards
          .map(
            (card) => `
              <div class="col-md-4 reveal">
                <article class="promo-card">
                  <div class="value-icon"><i class="bi bi-tags"></i></div>
                  <h3>${card.title}</h3>
                  <p>${card.copy}</p>
                </article>
              </div>
            `
          )
          .join("")}
      </div>
    `;
    initReveals();
  }

  function renderContactPage() {
    renderMosaic("contact-gallery", contactGallery);
  }

  let revealObserver;

  function initReveals() {
    const elements = document.querySelectorAll(".reveal:not([data-reveal-bound])");
    if (!elements.length) return;

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => {
        element.classList.add("is-visible");
        element.dataset.revealBound = "true";
      });
      return;
    }

    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      );
    }

    elements.forEach((element) => {
      element.dataset.revealBound = "true";
      revealObserver.observe(element);
    });
  }

  function initBackToTop() {
    const button = document.createElement("button");
    button.className = "back-to-top";
    button.type = "button";
    button.setAttribute("aria-label", "Back to top");
    button.innerHTML = '<i class="bi bi-arrow-up"></i>';
    document.body.appendChild(button);

    button.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    const toggle = () => {
      button.classList.toggle("is-visible", window.scrollY > 280);
    };

    toggle();
    window.addEventListener("scroll", toggle, { passive: true });
  }

  function initYear() {
    document.querySelectorAll("[data-year]").forEach((target) => {
      target.textContent = String(new Date().getFullYear());
    });
  }

  function renderPage() {
    switch (document.body.dataset.page) {
      case "home":
        renderHomePage();
        break;
      case "about":
        renderAboutPage();
        break;
      case "new-arrivals":
        renderNewArrivalsPage();
        break;
      case "best-sellers":
        renderBestSellersPage();
        break;
      case "promo":
        renderPromoPage();
        break;
      case "contact":
        renderContactPage();
        break;
      default:
        break;
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderNav();
    renderFooter();
    renderPage();
    initCart();
    initBackToTop();
    initReveals();
    initYear();
  });

  window.CYNTHIAS_SITE = {
    catalog,
    categoryMeta,
    categoryOrder,
    createProductCard,
    getCategoryProducts,
    initReveals
  };
})();


