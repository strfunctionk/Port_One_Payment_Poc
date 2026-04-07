import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants/queryKeys";

import { getMyCredits } from "./getMyCredits";

export const useGetMyCredits = () => {
    return useQuery({
        queryKey: queryKeys.ticket.myCredits(),
        queryFn: getMyCredits,
    });
};
