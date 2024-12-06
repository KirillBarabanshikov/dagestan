import { Outlet } from 'react-router-dom';

import styles from './ControllerPage.module.scss';

export const ControllerPage = () => {
    return (
        <div className={styles.controllerPage}>
            <Outlet />
        </div>
    );
};
