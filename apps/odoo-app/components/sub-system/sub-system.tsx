'use client';
import React from 'react';
import systemDemo from "../../demo-data/system-demo";
import KanbanView from "../common/views/kanban-view";
import {useRouter} from "next/navigation";

function SubSystem() {
    const router = useRouter()

    const operateBar = {
        view: true,
        placeholder: "搜索系统",
        searchKey: "name",
    }

    return (
        <div>
            <KanbanView initDataList={systemDemo} onClick={(data)=> router.push(data.url) } operateBar={operateBar}/>
        </div>
    );
}

export default SubSystem;
