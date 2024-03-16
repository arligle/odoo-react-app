'use client';
import { ReactElement } from 'react';
import { Separator } from "@repo/ui/components/ui/separator";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { useRouter } from "next/navigation";

interface OperateBarProps {
    create?: string;
    placeholder?: string;
    options?: () => ReactElement;
    change?: string;
    onChange?: (value: string) => void;
}

function OperateBar({
                        create,
                        options,
                        placeholder,
                        change,
                        onChange
                    }: OperateBarProps) {
    const router = useRouter();

    return (
        <div className="flex flex-col items-start mb-3 space-y-2">
            <Separator/>
            <div className="flex flex-row space-x-3 ml-3">
                {create ? (
                    <Button className="h-[32px]"
                            onClick={() => {
                                create ? router.push(create) : null
                            }}
                    >
                        新建
                    </Button>) : null
                }
                <Input
                    className="w-36 lg:w-72 h-[32px]"
                    placeholder={placeholder ? placeholder : "搜索"}
                    value={change? change : ""}
                    onChange={(e) => onChange?.(e.target.value)}
                />
                {options?.()}
            </div>
        </div>
    );
}

export default OperateBar;
