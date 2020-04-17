
import React from "react";
import PropTypes from "prop-types";

import { AirbnbRating } from 'react-native-elements';


const Rate = ({ rating, readOnly = false, size = 24, onChange}) => {
  const ratingCompleted = (rating) => {
    console.log("Rating is: " + rating)
    onChange(rating);
  }
  return (
    <AirbnbRating
      defaultRating={rating}
      ratingCount={5}
      showRating={false}
      isDisabled={readOnly}
      ratingBackgroundColor='transparent'
      size={size}
      onFinishRating={ratingCompleted}
    />
  );
};

Rate.propTypes = {
  rating: PropTypes.any.isRequired,
  onChange:PropTypes.func,
  readOnly: PropTypes.bool,
  size:PropTypes.number
};

export default Rate;