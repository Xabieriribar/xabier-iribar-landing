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
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = form.querySelector("button[type='submit']");
    const initialText = submitButton?.textContent;

    submitButton?.setAttribute("disabled", "true");
    if (submitButton) submitButton.textContent = "Envoi en cours…";
    setStatus(form, "Transmission de votre demande…");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
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
      submitButton?.removeAttribute("disabled");
      if (submitButton && initialText)
        submitButton.textContent = initialText.trim();
    }
  });
});
