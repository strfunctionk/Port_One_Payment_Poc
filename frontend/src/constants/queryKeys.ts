export const queryKeys = {
    user: {
        all: ["user"] as const,
        profile: () => ["user", "profile"] as const,
    },
};
