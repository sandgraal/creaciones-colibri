---
layout: layouts/base.njk
title: Home
description: Small-batch hot sauces, snacks, and wellness pantry goods crafted between Florida and Costa Rica.
localeLinks:
  es: /es/
---

<section class="hero">
  <div class="hero-media">
    <picture>
      <source srcset="{{ '/img/branding/creaciones-colibri-logo.svg' | url }}" type="image/svg+xml">
      <img
        class="hero-logo"
        src="{{ '/img/branding/creaciones-colibri-logo.svg' | url }}"
        alt="Creaciones Colibrí hummingbird logo"
      >
    </picture>
  </div>
  <div class="hero-content">
    <h1>Botanical heat and vibrant pantry creations.</h1>
    <p>Creaciones Colibrí is a small-batch food studio blending tropical ingredients, bold chiles, and regenerative sourcing into sauces, snacks, and sips that nourish the body and the story behind every jar.</p>
    <a class="button button-primary" href="{{ '/products/' | url }}">Explore the flavors</a>
  </div>
</section>

<section id="vision" class="content-section">
  <h2>Rooted in Story &amp; Sustainability</h2>
  <p>From our home gardens in Florida and Costa Rica, we craft recipes that honor Central American biodiversity while respecting the land. Expect compostable packaging, fairly sourced ingredients, and a healthy dose of culinary storytelling.</p>
</section>

<section id="catalog" class="content-section content-grid">
  <article class="card">
    <h3>Hot Sauces</h3>
    <p>Fruit-forward ferments, smoky classics, and adventurous regional profiles designed to layer heat with complexity.</p>
    <a class="button button-secondary" href="{{ '/products/#category-hot-sauces' | url }}">Shop sauces</a>
  </article>
  <article class="card">
    <h3>Granola &amp; Crunch</h3>
    <p>Crunchy granolas and snack clusters infused with adaptogens, tropical fruits, and garden herbs.</p>
    <a class="button button-secondary" href="{{ '/products/#category-granola-crunch' | url }}">Shop granola</a>
  </article>
  <article class="card">
    <h3>Wellness Pantry</h3>
    <p>Teas, spice blends, and upcycled treats that highlight functional botanicals and reduce waste.</p>
    <a class="button button-secondary" href="{{ '/products/#category-wellness-pantry' | url }}">Shop wellness</a>
  </article>
</section>

<section id="newsletter" class="content-section newsletter">
  <h2>Stay in the Loop</h2>
  <p>We’re developing new recipes, gathering stories from our community partners, and preparing for launch. Drop your email to be first in line when the shop opens.</p>
  {% if site.forms.newsletterAction %}
    <form class="newsletter-form" action="{{ site.forms.newsletterAction }}" method="POST">
      <label class="newsletter-form__label" for="newsletter-email">Email address</label>
      <div class="newsletter-form__controls">
        <input id="newsletter-email" class="newsletter-form__input" type="email" name="email" placeholder="you@example.com" autocomplete="email" required>
        <button class="button button-primary newsletter-form__submit" type="submit">Notify me</button>
      </div>
    </form>
  {% else %}
    <p class="newsletter-placeholder">We’re setting up our newsletter service. Until then, email us at <a href="mailto:hola@creacionescolibri.com">hola@creacionescolibri.com</a>.</p>
  {% endif %}
</section>
