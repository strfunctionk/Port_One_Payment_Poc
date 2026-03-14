import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { queryKeys } from "@/constants/queryKeys";

import { GetProfileResponse, getProfile } from "./getProfile";

export const useGetProfile = (enabled = true) => {
    return useQuery<GetProfileResponse, AxiosError>({
        queryKey: queryKeys.user.profile(),
        queryFn: () => getProfile(),
        enabled,
        retry: false,
    });
};
