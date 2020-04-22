
import React from "react";
import PropTypes from "prop-types";

import { AirbnbRating, Rating } from 'react-native-ratings';
import styles from "../styles";


const Rate = ({ isFractions = false, rating, readOnly = false, size = 24, onChange}) => {
  const ratingCompleted = (rating) => {
    console.log("Rating is: " + rating)
    onChange(rating);
  }

  if(isFractions) {
    return (
      <Rating
        startingValue={rating}
        type='custom'
        ratingCount={5}
        fractions={1}
        showRating={false}
        readonly={readOnly}
        imageSize={size}
        ratingBackgroundColor='transparent'
        //style={{borderColor:"red", borderStyle:"solid"}}
        onFinishRating={ratingCompleted}
      />
    );
  }
  else {
    return (
      <AirbnbRating
        defaultRating={rating}
        ratingCount={5}
        fractions={1}
        showRating={false}
        isDisabled={readOnly}
        ratingBackgroundColor='transparent'
        size={size}
        onFinishRating={ratingCompleted}
      />
    );
  }
  
};

Rate.propTypes = {
  rating: PropTypes.any.isRequired,
  onChange:PropTypes.func,
  readOnly: PropTypes.bool,
  size:PropTypes.number
};

export default Rate;