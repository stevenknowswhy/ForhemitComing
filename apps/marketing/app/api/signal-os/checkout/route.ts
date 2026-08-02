const CHECKOUT_ENDPOINT =
  "https://signal-os-evidence.stefano94103.chatgpt.site/api/checkout";
const EDITIONS = new Set(["solo", "agency", "studio"]);

function returnToEditions(request: Request, state: "invalid" | "error") {
  const destination = new URL("/signal-os", request.url);
  destination.searchParams.set("checkout", state);
  destination.hash = "signal-editions";
  return Response.redirect(destination, 303);
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return returnToEditions(request, "invalid");
  }

  const edition = form.get("edition");
  if (typeof edition !== "string" || !EDITIONS.has(edition)) {
    return returnToEditions(request, "invalid");
  }

  try {
    const response = await fetch(CHECKOUT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        edition,
        attribution: {
          utm_source: "forhemit",
          utm_medium: "owned",
          utm_campaign: "founding72",
          utm_content: `owned_domain_${edition}_checkout`,
        },
      }),
    });
    const result = (await response.json()) as { url?: unknown };
    if (!response.ok || typeof result.url !== "string") {
      return returnToEditions(request, "error");
    }

    const checkout = new URL(result.url);
    if (checkout.origin !== "https://checkout.stripe.com") {
      return returnToEditions(request, "error");
    }
    return Response.redirect(checkout, 303);
  } catch {
    return returnToEditions(request, "error");
  }
}
