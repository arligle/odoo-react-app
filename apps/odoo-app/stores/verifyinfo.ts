import { create } from "zustand";

interface VerifyStore {
    captchaVerification: string;
    verifyPass: boolean;
    setVerifyPass: (verifyPass: boolean) => void;
    setVerification: (captchaVerification: string) => void;
}

export const verifyStore = create<VerifyStore>((set) => ({
    captchaVerification: "",
    verifyPass: false,
    setVerifyPass: (verifyPass: boolean) => set({ verifyPass }),
    setVerification: (captchaVerification: string) => set({ captchaVerification }),
}));

