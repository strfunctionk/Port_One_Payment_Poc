import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/constants/queryKeys";

import { postPaymentCancel } from "./postPaymentCancel";

export const usePostPaymentCancel = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: postPaymentCancel,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.payment.my(),
            });
        },
    });
};
