"use client";
import React, {useEffect, useState} from "react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@repo/ui/components/ui/form";
import { Button } from '@repo/ui/components/ui/button';
import { Input } from "@repo/ui/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import GitHubSignInButton from "./github-auth-button";
import { useRouter, useSearchParams } from "next/navigation";
import { signInFormSchema, SignInFormType } from "../../types/auth";
import { encryption } from "../../utils/symmetric-encryption";
import { getToken } from "../../actions/auth-action";
import { Session } from "../../utils/storage";
import { Dialog, DialogContent, DialogTrigger } from "@repo/ui/components/ui/dialog";
import SlideVerify from "./verify/slide-verify";
import { verifyStore } from "../../stores/verifyinfo";
import { useToast } from "@repo/ui/lib/use-toast";

export default function UserSignInForm() {
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl");
    const [loading, setLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const defaultValues = {
        username: "admin",
        password: "123456",
    };

    const { captchaVerification, verifyPass, setVerifyPass } = verifyStore(
      (state: any) => state,
    );

    const form = useForm<SignInFormType>({
        resolver: zodResolver(signInFormSchema),
        defaultValues,
    });

    const onSubmit = async (formData: SignInFormType) => {
        setIsDialogOpen(false);
        const singinData = {
            username: formData.username,
            password: encryption(
                formData.password,
                process.env.NEXT_PUBLIC_PWD_ENC_KEY as string,
            ),
            randomStr: "blockPuzzle",
            code: captchaVerification,
            grant_type: "password",
            scope: "server",
        };
        setLoading(true);
        // 登录请求
        const signInData = await getToken(singinData);
        // 存储信息
        Session.set("token", signInData.access_token);
        Session.set("refresh_token", signInData.refresh_token);
        setLoading(false);
        // 判断状态
        if (signInData?.code && !signInData?.ok) {
            toast({
                title: "登录失败",
                description: signInData.msg,
                variant: "destructive",
            });
        } else {
            toast({
                title: "登录成功",
                description: "欢迎回来",
                variant: "default",
            });
            setTimeout(() => {
                router.push(callbackUrl ? callbackUrl : "/");
            }, 500);
        }
    };

    useEffect(() => {
        if (verifyPass) {
            onSubmit(form.getValues());
            setVerifyPass(false);
        }
    }, [verifyPass]);

    return (
        <Dialog open={isDialogOpen} onOpenChange={()=>setIsDialogOpen(!isDialogOpen)}>
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">用户登录</h1>
                <p className="text-sm text-muted-foreground">请输入您的用户名登录</p>
            </div>
            <Form {...form}>
                <form className="space-y-5 w-full">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>用户名</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="输入您的用户名..."
                                        disabled={loading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>密码</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="请输入密码..."
                                        disabled={loading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <DialogTrigger asChild>
                        <Button disabled={loading} className="ml-auto w-full" type="button" onClick={()=>setIsDialogOpen(true)}>
                            登录
                        </Button>
                    </DialogTrigger>
                </form>
            </Form>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">或者</span>
                </div>
            </div>
            <GitHubSignInButton />
            <DialogContent className="sm:max-w-md justify-center items-center">
                <SlideVerify />
            </DialogContent>
        </Dialog>
    );
}
