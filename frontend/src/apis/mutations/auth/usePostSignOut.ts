import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { queryKeys } from "@/constants/queryKeys";

import { postSignOut } from "./postSignOut";

export const usePostSignOut = () => {
    const queryClient = useQueryClient();

    return useMutation<void, AxiosError, void>({
        mutationFn: () => postSignOut(),
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: queryKeys.user.all });
        },
    });
};
