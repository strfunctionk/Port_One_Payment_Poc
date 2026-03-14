import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import {
    PostSignInRequest,
    PostSignInResponse,
    postSignIn,
} from "./postSignIn";

export const usePostSignIn = () => {
    return useMutation<PostSignInResponse, AxiosError, PostSignInRequest>({
        mutationFn: (body) => postSignIn(body),
    });
};
