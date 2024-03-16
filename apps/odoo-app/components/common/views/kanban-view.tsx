"use client";
import React, {ReactNode, useEffect} from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { ScrollArea, ScrollBar } from "@ui/components/ui/scroll-area";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@ui/components/ui/dialog";
import { Label } from "@ui/components/ui/label";
import { Input } from "@ui/components/ui/input";
import { Button } from "@ui/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription, CardFooter,
    CardHeader,
    CardTitle,
} from "@ui/components/ui/card";
import { Badge } from "@ui/components/ui/badge";
import OperateBar from "../../page-tools/operate-bar";

/**
 * 注意：还需要做一个分页功能
 * */

interface KanbanViewProps {
    initDataList: any[];
    editLink?: string; // 启用编辑选项
    canDelete?: boolean; // 启用删除选项
    title?: string; // 指定显示标题
    content?: string; // 指定显示内容
    description?: string; // 指定显示内容
    onClick: (data: any) => void; // 点击事件
    DropDownItems?: (data: any) => ReactNode; // 添加额外下拉菜单
    operateBar?: {
        view?: boolean; // 启用视图选项
        create?: string; // 启用创建选项
        options?: () => ReactNode;
        placeholder?: string;
        searchKey?: string;
    };
}

function KanbanView({
                        canDelete,
                        initDataList,
                        editLink,
                        operateBar,
                        title,
                        content,
                        description,
                        onClick,
                        DropDownItems,
                    }: KanbanViewProps) {
    const router = useRouter();
    const confirm_column = title ? title : "name";  // 确认删除的列名
    const [name, setName] = React.useState("");
    const [status, setStatus] = React.useState(false);
    const [dataList, setDataList] = React.useState(initDataList);
    const [change, setChange] = React.useState<string>();
    const [noneOption, setNoneOption] = React.useState(true);

    function findObjectByName(data: any[], key: string, value: any) {
        return data.filter((item) =>
            item[key].toLowerCase().includes(value.toLowerCase()),
        );
    }

    useEffect(() => {
        if (typeof canDelete === 'undefined' && typeof editLink ==='undefined' && typeof DropDownItems === 'undefined') {
            setNoneOption(true);
        }else setNoneOption(false);
    }, []);

    useEffect(() => {
        if (change === "" || change === undefined) {
            setDataList(initDataList);
        } else {
            if (operateBar && operateBar.searchKey) {
                setDataList(
                    findObjectByName(initDataList, operateBar.searchKey, change),
                );
            } else {
                // operateBar 或 operateBar.searchKey 不存在，可以选择跳过调用 findObjectByName 函数
                // 或者给它们提供一个默认值
                console.log('operateBar 或 operateBar.searchKey 不存在');
            }
        }
    }, [change]);

    return (
        <ScrollArea>
            {operateBar?.view ? (
                <OperateBar
                    create={operateBar?.create}
                    placeholder={operateBar?.placeholder}
                    change={change}
                    onChange={setChange}
                />
            ) : null}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {dataList.map((data, index) => {
                    return (
                        <Dialog key={index}>
                            <DropdownMenu>
                                <div
                                    className="overflow-hidden shadow-sm rounded-lg group"
                                    onClick={() => (onClick ? onClick(data) : null)}
                                >
                                    <Card className="p-4 h-72 flex flex-col">
                                        <CardHeader>
                                            <div>
                                                <div className="flex flex-row justify-between items-center mb-2">
                                                    <CardTitle className="text-lg font-semibold">
                                                        {title ? data[title] : data.name}
                                                    </CardTitle>
                                                    {!noneOption? <DropdownMenuTrigger asChild>
                                                        <MoreHorizontal
                                                            className="lg:opacity-0 group-hover:opacity-100 w-15 rounded-md"
                                                            height={30}
                                                            width={40}
                                                        />
                                                    </DropdownMenuTrigger> : null}
                                                </div>
                                                <CardDescription>
                                                    {description ? data[description] : data.description}
                                                </CardDescription>
                                            </div>
                                        </CardHeader>
                                        {content || data.content ? (
                                            <CardContent>
                                                <p className="text-sm text-muted-foreground overflow-ellipsis overflow-hidden h-20 line-clamp-4">
                                                    {content ? data[content] : data.content}
                                                </p>
                                            </CardContent>
                                        ): null}
                                        <CardFooter className="mt-auto">
                                            {typeof data.active !== 'undefined' ? <div>
                                                {data.active ? (<Badge variant="default">启用</Badge>) : (<Badge variant="destructive">禁用</Badge>)}
                                            </div> : null}
                                        </CardFooter>
                                    </Card>
                                </div>
                                <DropdownMenuContent className="border-2 w-20 rounded-lg">
                                    {DropDownItems ? DropDownItems(data) : null}
                                    {editLink ? (
                                        <DropdownMenuItem
                                            onClick={() => router.push(`${editLink}/${data.id}`)}
                                        >
                                            <div className="text-center w-full">编辑</div>
                                        </DropdownMenuItem>
                                    ) : null}
                                    {typeof canDelete !== 'undefined' ? <DropdownMenuItem>
                                        <DialogTrigger asChild>
                                            <div className="text-center w-full text-destructive">
                                                删除
                                            </div>
                                        </DialogTrigger>
                                    </DropdownMenuItem> : null}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>确认删除</DialogTitle>
                                    <DialogDescription>
                                        请确认删除{" "}
                                        <strong className="text-destructive">
                                            {data[confirm_column]}
                                        </strong>{" "}
                                        删除后无法恢复，请谨慎操作
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right">确认名称</Label>
                                        <Input
                                            id="name"
                                            className="col-span-3"
                                            placeholder="请输入红字名称"
                                            onChange={(e) => {
                                                setName(e.target.value);
                                                setStatus(false);
                                            }}
                                        />
                                    </div>
                                    {status ? (
                                        <div className="text-destructive">请输入正确的名称</div>
                                    ) : null}
                                </div>
                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() => {
                                            if (name !== data[confirm_column]) {
                                                setStatus(true);
                                            } else {
                                                console.log("delete");
                                            }
                                        }}
                                    >
                                        确认
                                    </Button>
                                    <DialogClose asChild>
                                        <Button type="button">取消</Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    );
                })}
            </div>
            <ScrollBar/>
        </ScrollArea>
    );
}

export default KanbanView;
