document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const header = document.querySelector("[data-site-header]");
  const nav = document.querySelector("[data-site-nav]");
  const overlay = document.querySelector("[data-menu-overlay]");
  const toggle = document.querySelector("[data-menu-toggle]");

  const updateHeaderState = () => {
    if (!header) {
      return;
    }

    header.classList.toggle("is-scrolled", window.scrollY > 20);
  };

  const closeMenu = () => {
    body.classList.remove("menu-open");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    }
  };

  const toggleMenu = () => {
    const isOpen = body.classList.toggle("menu-open");
    if (toggle) {
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    }
  };

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });

  if (toggle) {
    toggle.addEventListener("click", toggleMenu);
  }

  if (overlay) {
    overlay.addEventListener("click", closeMenu);
  }

  if (nav) {
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth < 980) {
          closeMenu();
        }
      });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const targetId = anchor.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      const target = document.querySelector(targetId);

      if (!target) {
        return;
      }

      event.preventDefault();
      closeMenu();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  const revealItems = document.querySelectorAll("[data-reveal]");

  if (revealItems.length) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const formatCounter = (value, suffix = "") => `${value.toLocaleString()}${suffix}`;

  const animateCounter = (element) => {
    const target = Number(element.dataset.counter || 0);
    const suffix = element.dataset.suffix || "";
    const duration = 1600;
    const start = performance.now();

    const step = (timestamp) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      const current = Math.floor(progress * target);
      element.textContent = formatCounter(current, suffix);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        element.textContent = formatCounter(target, suffix);
      }
    };

    window.requestAnimationFrame(step);
  };

  const counters = document.querySelectorAll("[data-counter]");

  if (counters.length) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || entry.target.dataset.counted === "true") {
            return;
          }

          entry.target.dataset.counted = "true";
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.55,
      }
    );

    counters.forEach((counter) => counterObserver.observe(counter));
  }

  const sportFilterButtons = document.querySelectorAll("[data-sport-filter]");
  const sportCards = document.querySelectorAll("[data-sport-card]");

  if (sportFilterButtons.length && sportCards.length) {
    sportFilterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.sportFilter;

        sportFilterButtons.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");

        sportCards.forEach((card) => {
          const matches = filter === "all" || card.dataset.season === filter;
          card.classList.toggle("hidden", !matches);
        });
      });
    });
  }

  const monthFilterButtons = document.querySelectorAll("[data-month-filter]");
  const scheduleRows = document.querySelectorAll("[data-schedule-row]");

  if (monthFilterButtons.length && scheduleRows.length) {
    monthFilterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.monthFilter;

        monthFilterButtons.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");

        scheduleRows.forEach((row) => {
          const matches = filter === "all" || row.dataset.month === filter;
          row.hidden = !matches;
        });
      });
    });
  }

  const panelButtons = document.querySelectorAll("[data-panel-button]");
  const panels = document.querySelectorAll("[data-panel]");

  if (panelButtons.length && panels.length) {
    const setActivePanel = (panelName) => {
      panelButtons.forEach((button) => {
        button.classList.toggle("active", button.dataset.panelButton === panelName);
      });

      panels.forEach((panel) => {
        panel.hidden = panel.dataset.panel !== panelName;
      });
    };

    const initialButton =
      Array.from(panelButtons).find((button) => button.classList.contains("active")) || panelButtons[0];

    if (initialButton) {
      setActivePanel(initialButton.dataset.panelButton);
    }

    panelButtons.forEach((button) => {
      button.addEventListener("click", () => {
        setActivePanel(button.dataset.panelButton);
      });
    });
  }

  const contactForm = document.querySelector("[data-contact-form]");
  const formSuccess = document.querySelector("[data-form-success]");

  if (contactForm && formSuccess) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const nameInput = contactForm.querySelector('input[name="name"]');
      const name = nameInput && nameInput.value.trim() ? nameInput.value.trim() : "Legend";

      formSuccess.textContent = `Thanks, ${name}. Your note has been logged for the Hoosier Legends conference site. We will review it soon.`;
      formSuccess.hidden = false;
      contactForm.reset();
    });
  }
});
