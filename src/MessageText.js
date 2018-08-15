/* @flow */
import { Text, View } from 'react-native';
import ParsedText from 'react-native-parsed-text';
import PropTypes from 'prop-types';
import React from 'react';

import _ from 'lodash';

import type { Message, MessagePosition } from './types/Message';
import { generateMarkdownPatterns, generatePredefinedPatterns } from './utils';
import { styles } from './styles';

type Props = {
  containerStyle: {
    left: any,
    right: any,
  },
  currentMessage: Message,
  linkStyle: {
    left: Text.propTypes.style,
    right: Text.propTypes.style,
  },
  position: MessagePosition,
  textStyle: {
    left: Text.propTypes.style,
    right: Text.propTypes.style,
  },
};

export default function MessageText(props: Props) {
  const {
    containerStyle,
    currentMessage,
    linkStyle,
    position,
    textStyle,
  } = props;
  const { link } = styles;

  // Predefined / native-specific patterns to match on — these include phone numbers, emails,
  // and hyperlinks (all of which are stylized with an underline and link to the corresponding
  // action tapped).
  const predefinedPatterns = generatePredefinedPatterns({
    link,
    linkStyle,
    position,
  });
  // Any other rules defining syntax transforms from RN input text to native formatted `<Text>`
  // elements.
  const markdownPatterns = generateMarkdownPatterns({ position });
  // To render the fully styled message, we concatenate these two collections of rules together,
  // and pass the result to the `<ParsedText>` component.
  const parsedTextPatterns = _.flatten([predefinedPatterns, markdownPatterns]);

  return (
    <View
      style={[
        _.get(styles(position), 'container'),
        _.get(containerStyle, 'position'),
      ]}
    >
      <ParsedText
        parse={parsedTextPatterns}
        style={[styles(position).text, textStyle[position]]}
      >
        {currentMessage.text}
      </ParsedText>
    </View>
  );
}

MessageText.defaultProps = {
  containerStyle: {},
  currentMessage: { text: '' },
  linkStyle: {},
  position: 'left',
  textStyle: {},
};

MessageText.contextTypes = {
  actionSheet: PropTypes.func,
};
