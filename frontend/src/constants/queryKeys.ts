export const queryKeys = {
    user: {
        all: ["user"] as const,
        profile: () => ["user", "profile"] as const,
    },
    payment: {
        all: ["payment"] as const,
        my: () => ["payment", "my"] as const,
    },
};
