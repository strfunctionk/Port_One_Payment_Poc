import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants/queryKeys";

import { getMyPayments } from "./getMyPayments";

export const useGetMyPayments = () => {
    return useQuery({
        queryKey: queryKeys.payment.my(),
        queryFn: getMyPayments,
    });
};
