(function() {
  var root = document.documentElement;
  if (!root) {
    return;
  }

  var analyticsDomain = root.getAttribute("data-analytics-domain");
  if (!analyticsDomain) {
    return;
  }

  var ensurePlausible = function() {
    if (typeof window.plausible === "function") {
      return window.plausible;
    }

    window.plausible = window.plausible || function() {
      (window.plausible.q = window.plausible.q || []).push(arguments);
    };

    return window.plausible;
  };

  var sendEvent = function(eventName, properties) {
    if (!eventName) {
      return;
    }

    var plausibleFn = ensurePlausible();

    try {
      if (properties && Object.keys(properties).length > 0) {
        plausibleFn(eventName, { props: properties });
      } else {
        plausibleFn(eventName);
      }
    } catch (error) {
      console.warn("[analytics] Unable to send Plausible event", error);
    }
  };

  var parseCartMetrics = function(detail) {
    if (!detail) {
      return {};
    }

    var cart = detail.cart || detail;
    if (!cart) {
      return {};
    }

    var metrics = {};

    var resolveAmount = function(source) {
      if (!source) {
        return undefined;
      }

      if (typeof source === "number") {
        return source;
      }

      if (typeof source === "string") {
        var parsed = parseFloat(source);
        return Number.isFinite(parsed) ? parsed : undefined;
      }

      if (typeof source === "object") {
        if (typeof source.total === "string" || typeof source.total === "number") {
          return resolveAmount(source.total);
        }
        if (typeof source.amount === "string" || typeof source.amount === "number") {
          return resolveAmount(source.amount);
        }
        if (typeof source.value === "string" || typeof source.value === "number") {
          return resolveAmount(source.value);
        }
      }

      return undefined;
    };

    var total = resolveAmount(cart.total) ||
      resolveAmount(cart.grandTotal) ||
      resolveAmount(cart.amount) ||
      resolveAmount(cart.amount && cart.amount.total);

    if (Number.isFinite(total)) {
      metrics.total = Math.round(total * 100) / 100;
    }

    var currency = cart.currency ||
      (cart.amount && (cart.amount.currency || cart.amount.currencyCode)) ||
      cart.currencyCode;

    if (typeof currency === "string" && currency.trim()) {
      metrics.currency = currency.trim().toUpperCase();
    }

    var itemCount = 0;
    if (Array.isArray(cart.items)) {
      itemCount = cart.items.reduce(function(accumulator, item) {
        var quantity = item && Number(item.quantity);
        if (Number.isFinite(quantity)) {
          return accumulator + quantity;
        }
        return accumulator + 1;
      }, 0);
    } else if (cart.items && typeof cart.items.count === "number") {
      itemCount = cart.items.count;
    } else if (typeof cart.itemsCount === "number") {
      itemCount = cart.itemsCount;
    }

    if (itemCount > 0) {
      metrics.items = itemCount;
    }

    var orderId = cart.invoiceNumber || cart.orderToken || cart.token || cart.number || cart.id;
    if (orderId) {
      metrics.orderId = orderId;
    }

    return metrics;
  };

  var withLocale = function(properties) {
    var payload = properties ? Object.assign({}, properties) : {};
    var locale = root.getAttribute("lang");
    if (locale) {
      payload.locale = locale;
    }
    return payload;
  };

  var observeForms = function() {
    var forms = document.querySelectorAll("form[data-analytics-event]");
    if (!forms.length) {
      return;
    }

    forms.forEach(function(form) {
      var eventName = form.getAttribute("data-analytics-event");
      if (!eventName) {
        return;
      }

      form.addEventListener("submit", function() {
        var properties = {};
        var identifier = form.getAttribute("data-analytics-form") || form.getAttribute("id") || form.getAttribute("name");
        if (!identifier) {
          var action = form.getAttribute("action") || "";
          identifier = action.split("?")[0];
        }
        if (identifier) {
          properties.form = identifier;
        }
        sendEvent(eventName, withLocale(properties));
      });
    });
  };

  var observeSnipcart = function() {
    var registerHandlers = function() {
      document.addEventListener("snipcart.checkout.started", function(event) {
        var metrics = parseCartMetrics(event && event.detail);
        sendEvent("checkout_started", withLocale(metrics));
      });

      document.addEventListener("snipcart.cart.confirmed", function(event) {
        var metrics = parseCartMetrics(event && event.detail);
        sendEvent("order_completed", withLocale(metrics));
      });
    };

    if (window.Snipcart && window.Snipcart.ready && typeof window.Snipcart.ready.then === "function") {
      window.Snipcart.ready.then(registerHandlers);
    } else {
      document.addEventListener("snipcart.ready", registerHandlers, { once: true });
    }
  };

  ensurePlausible();
  observeForms();
  observeSnipcart();
})();
