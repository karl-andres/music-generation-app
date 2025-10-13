import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "~/server/db";
import { polar, checkout, portal, usage, webhooks } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";
import { env } from "~/env";

const polarClient = new Polar({
    accessToken: env.POLAR_ACCESS_TOKEN,
    server: 'production'
});

const prisma = db
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    emailAndPassword: {
        enabled: true, 
    }, 
    plugins: [
        polar({
            client: polarClient,
            createCustomerOnSignUp: true,
            use: [
                checkout({
                    products: [
                        {
                            productId: "db57bf53-3858-4ebd-8d11-74134380af46", // ID of Product from Polar Dashboard
                            slug: "small" // Custom slug for easy reference in Checkout URL, e.g. /checkout/pro
                        },
                        {
                            productId: "c0e47337-c574-4cb0-a5c0-afa5af91d4e2", // ID of Product from Polar Dashboard
                            slug: "medium" // Custom slug for easy reference in Checkout URL, e.g. /checkout/pro
                        },
                        {
                            productId: "36046c5f-1ac6-4639-af91-a76bd740656d", // ID of Product from Polar Dashboard
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
                            case "db57bf53-3858-4ebd-8d11-74134380af46":
                                creditsToAdd = 10;
                                break;
                            case "c0e47337-c574-4cb0-a5c0-afa5af91d4e2":
                                creditsToAdd = 25;
                                break;
                            case "36046c5f-1ac6-4639-af91-a76bd740656d":
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