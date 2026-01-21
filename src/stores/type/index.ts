import { Menu } from '@/types/global';

/* GlobalState */
export interface GlobalState {
    refreshPage: boolean;
    loading: boolean;
    language: string;
}

/* tabsMenuProps */
export interface TabsMenuProps {
    icon: string;
    title: string;
    path: string;
    name: string;
    close: boolean;
}

/* TabsState */
export interface TabsState {
    tabsMenuList: TabsMenuProps[];
}

/* AuthState */
export interface AuthState {
    routeName: string;
    authMenuList: Menu.MenuOptions[];
    authButtonList: {
        [key: string]: string[];
    };
}

/* keepAliveState */
export interface keepAliveState {
    keepAliveName: string[];
}

/* UserState */
export interface UserState {
    token: string;
    userInfo: {
        name: string;
        password: string;
    };
}
