import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/constants/queryKeys";

import { getTicketProducts } from "./getTicketProducts";

export const useGetTicketProducts = () => {
    return useQuery({
        queryKey: queryKeys.ticket.products(),
        queryFn: getTicketProducts,
    });
};
