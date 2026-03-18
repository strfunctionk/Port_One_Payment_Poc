import { useMutation } from "@tanstack/react-query";

import { postPaymentComplete } from "./postPaymentComplete";

export const usePostPaymentComplete = () => {
    return useMutation({
        mutationFn: postPaymentComplete,
    });
};
