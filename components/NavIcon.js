import React from 'react';
import { Ionicons } from "@expo/vector-icons";
import PropTypes from 'prop-types';
import styles from '../styles';

const NavIcon = ({focused = true, name, color = styles.blackColor, size = 26}) => <Ionicons name={name} color={color} size={26}/>

NavIcon.propTypes = {
  name: PropTypes.string.isRequired,
  color:PropTypes.string,
  size:PropTypes.number,
  focused:PropTypes.bool
};

export default NavIcon;