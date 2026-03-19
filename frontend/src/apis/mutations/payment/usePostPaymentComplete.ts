import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/constants/queryKeys";

import { postPaymentComplete } from "./postPaymentComplete";

export const usePostPaymentComplete = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: postPaymentComplete,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.payment.my(),
            });
        },
    });
};
