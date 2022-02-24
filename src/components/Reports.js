import { EditOutlined } from '@ant-design/icons/lib/icons';
import { Input, Tabs } from 'antd';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNewTab, removeTab, setActiveKey, updateTitle } from '../rtk/dashboard/slices';
import Dashboard from './dashboard/Dashboard';

const { TabPane } = Tabs;



export default function Reports() {
    let dispatch = useDispatch();

    let reportDashboards = useSelector((state) => state.reportDashboards.tree);

    const activeKey = useSelector((state) => state.reportDashboards.activeKey);

    if (Object.keys(reportDashboards).length === 0) {
        dispatch(addNewTab());
    }


    reportDashboards = useSelector((state) => state.reportDashboards.tree);

    if (activeKey == undefined || Object.keys(reportDashboards).indexOf(activeKey) == -1) {
        const key = Object.keys(reportDashboards).slice(-1)[0];
        dispatch(setActiveKey(key));
    }


    function onTabsChanged(key) {
        dispatch(setActiveKey(key));
    }

    function onTabsEdited(targetKey, action) {
        switch (action) {
            case "remove":
                const lenTabs = Object.keys(reportDashboards).length;
                const lenWidgets = Object.keys(reportDashboards[targetKey].data).length;

                if (lenTabs === 1) {
                    dispatch(addNewTab());
                }

                if (lenWidgets > 0) {
                    if (!window.confirm(`This tab consists of widgets. Do you want to continue?`)) {
                        break;
                    }
                }
                dispatch(removeTab(targetKey));
                break;
            case "add":
                dispatch(addNewTab());
                break;
        }
    }

    function TabTitle({ k, v }) {
        const dispatch = useDispatch();
        const [isEditing, setIsEditing] = useState(false);
        const [value, setValue] = useState(v.title);

        return isEditing ? (
            <Input
                type='text'
                value={value}
                autoFocus={true}
                onChange={(event) => setValue(event.target.value)}
                onBlur={(event) => {
                    dispatch(updateTitle([k, event.target.value]))
                    setIsEditing(false);
                }}
                onPressEnter={(event) => {
                    dispatch(updateTitle([k, event.target.value]))
                    setIsEditing(false);
                }}
                onKeyDown={(event) => {
                    if (event.key == "Escape") {
                        setValue(v.title);
                        setIsEditing(false);
                    }
                }}
            />
        ) : (
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                <div>
                    <p
                        style={{ margin: "0", marginRight: "3px" }}
                    >{value}</p>
                </div>
                <div>
                    <EditOutlined style={{ margin: "0" }} onClick={() => { setIsEditing(true); }} />
                </div>
            </div>
        )
    }

    return (
        <>
            <Tabs
                defaultActiveKey={activeKey}
                onChange={onTabsChanged}
                onEdit={onTabsEdited}
                type="editable-card"
                activeKey={activeKey}
            >
                {
                    Object.entries(reportDashboards).map(
                        ([k, v]) =>
                        (
                            <TabPane tab={<TabTitle k={k} v={v} />} key={k} style={{ height: "70vh" }}>
                                <Dashboard tree={v.data} />
                            </TabPane>
                        )
                    )
                }
            </Tabs>
        </>
    )
}
