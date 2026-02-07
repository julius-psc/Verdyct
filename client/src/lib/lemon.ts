
export const LEMONSQUEEZY_STORE_ID = "286069";

export const VARIANTS = {
    STARTER_PACK: "6537fd34-ddc2-4b5e-8960-cbae9f1e0c93",  // 50 Credits
    BUILDER_MONTHLY: "44da7c82-d48b-45b2-a914-8f65936f2fab", // Monthly Subscription
    BUILDER_YEARLY: "b58bd7a1-f591-42ff-a220-46d372937e00", // Yearly Subscription
};

export function getCheckoutUrl(variantId: string, userId: string, redirectUrl?: string) {
    // Base checkout URL
    // Format: https://{store_subdomain}.lemonsqueezy.com/checkout/buy/{variant_id}
    // Or generic: https://store.lemonsqueezy.com/checkout/buy/{variant_id}
    // We'll use the generic one or the specific store slug if known.
    // Assuming store slug is 'verdyct' based on the domain, but safer to use the hostedcheckout Link from the dashboard if provided.
    // The user didn't provide the store slug, just the ID.
    // We can use the checkout URL format: https://verdyct.lemonsqueezy.com/checkout/buy/{variantId}
    // or https://store.lemonsqueezy.com/checkout/buy/{variantId}?checkout[store_id]={storeId}

    // Let's assume standard format: https://verdyct.lemonsqueezy.com/buy/{variantId} ?
    // Actually, usually it's https://<store-slug>.lemonsqueezy.com/buy/<variant-id>

    // Let's try to infer or use a generic one. 
    // Safest generic: https://lemonsqueezy.com/checkout/buy/{variantId}?checkout[store_id]={LEMONSQUEEZY_STORE_ID}

    // We use the configured store slug or fallback to 'verdyct' (which is correct based on your link)
    const storeSlug = process.env.NEXT_PUBLIC_LEMONSQUEEZY_STORE_SLUG || "verdyct";
    const baseUrl = `https://${storeSlug}.lemonsqueezy.com/checkout/buy/${variantId}`;

    const params = new URLSearchParams();
    params.append("checkout[custom][user_id]", userId);

    if (redirectUrl) {
        params.append("checkout[url]", redirectUrl);
    }

    return `${baseUrl}?${params.toString()}`;
}
