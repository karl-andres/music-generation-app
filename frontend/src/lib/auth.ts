import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "~/server/db";
import { polar, checkout, portal, usage, webhooks } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";
import { env } from "~/env";

const polarClient = new Polar({
    accessToken: env.POLAR_ACCESS_TOKEN,
    server: 'production',
});

const prisma = db
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    emailAndPassword: {
        enabled: true, 
    },
    trustedOrigins: ["http://localhost:3000"],
    
    plugins: [
        polar({
            client: polarClient,
            createCustomerOnSignUp: true,
            use: [
                checkout({
                    products: [
                        {
                            productId: "a2e1beaf-d11c-489c-a255-fef4fb6de82b", // ID of Product from Polar Dashboard
                            slug: "small" // Custom slug for easy reference in Checkout URL, e.g. /checkout/pro
                        },
                        {
                            productId: "041c024d-aae7-42f5-8a0f-fab77e69e786", // ID of Product from Polar Dashboard
                            slug: "medium" // Custom slug for easy reference in Checkout URL, e.g. /checkout/pro
                        },
                        {
                            productId: "72ce786b-77a6-4966-9619-29bd1dcd8fea", // ID of Product from Polar Dashboard
                            slug: "large" // Custom slug for easy reference in Checkout URL, e.g. /checkout/pro
                        }
                    ],
                    successUrl: "/",
                    authenticatedUsersOnly: true
                }),
                portal(),
                webhooks({
                    secret: env.POLAR_WEBHOOK_SECRET,
                    onOrderPaid: async (order) => {
                        const externalCustomerId = order.data.customer.externalId;

                        if (!externalCustomerId) {
                            console.error("No external customer ID found.");
                            throw new Error("No external customer id found.");
                        }

                        const productId = order.data.productId;

                        let creditsToAdd = 0;

                        switch (productId) {
                            case "a2e1beaf-d11c-489c-a255-fef4fb6de82b":
                                creditsToAdd = 10;
                                break;
                            case "041c024d-aae7-42f5-8a0f-fab77e69e786":
                                creditsToAdd = 25;
                                break;
                            case "72ce786b-77a6-4966-9619-29bd1dcd8fea":
                                creditsToAdd = 50;
                                break;
                        }

                        await db.user.update({
                            where: {
                                id: externalCustomerId
                            },
                            data: {
                                credits: {
                                    increment: creditsToAdd
                                }
                            }
                        })
                    }
                })
            ],
        })
    ]
});