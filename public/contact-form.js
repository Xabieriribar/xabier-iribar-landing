const forms = document.querySelectorAll("[data-contact-form]");

const setStatus = (form, message, tone = "neutral") => {
  const status = form.querySelector("[data-form-status]");
  if (!status) return;
  status.textContent = message;
  status.dataset.tone = tone;
};

const formToPayload = (form) => {
  const formData = new FormData(form);
  return Object.fromEntries(formData.entries());
};

forms.forEach((form) => {
  const startedAtInput = form.querySelector("[data-contact-started-at]");
  if (startedAtInput) startedAtInput.value = String(Date.now());

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = form.querySelector("button[type='submit']");
    const initialText = submitButton?.textContent;

    form.dataset.state = "sending";
    submitButton?.setAttribute("disabled", "true");
    if (submitButton) submitButton.textContent = "Envoi en cours…";
    setStatus(form, "Transmission de votre demande…");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formToPayload(form)),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Le message n’a pas pu être envoyé.");
      }

      window.location.assign(form.dataset.successUrl || "/merci");
    } catch (error) {
      setStatus(
        form,
        "L’envoi automatique n’a pas abouti pour le moment. Vous pouvez aussi m’écrire directement à contact@xabieriribar.ch.",
        "error",
      );
      delete form.dataset.state;
      submitButton?.removeAttribute("disabled");
      if (submitButton && initialText)
        submitButton.textContent = initialText.trim();
    }
  });
});
