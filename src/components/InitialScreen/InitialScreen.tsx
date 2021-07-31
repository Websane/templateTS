import React from 'react';
import classNames from 'classnames';

import Triangles from '../../assets/img/triangles.svg';
import src from '../../assets/img/doctor.png';

import styles from './InitialScreen.module.css';

function InitialScreen() {

  const classItem = classNames(styles.item, 'fadeIn');
  const classLogo = classNames(styles.logo, 'dasharrayIn');

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <Triangles className={classLogo} />
        <img src={src} />
      </div>
    </div>
  );
}

export default InitialScreen;
