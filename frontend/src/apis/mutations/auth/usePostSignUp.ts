import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import {
    PostSignUpRequest,
    PostSignUpResponse,
    postSignUp,
} from "./postSignUp";

export const usePostSignUp = () => {
    return useMutation<PostSignUpResponse, AxiosError, PostSignUpRequest>({
        mutationFn: (body) => postSignUp(body),
    });
};
