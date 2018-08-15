/* @flow */
import { StyleSheet } from 'react-native';
import _ from 'lodash';

import type { MessagePosition } from './types/Message';

const baseTextStyle = {
  fontSize: 16,
  lineHeight: 20,
  marginTop: 5,
  marginBottom: 5,
  marginLeft: 10,
  marginRight: 10,
};

export const textStyle = {
  left: StyleSheet.flatten([
    {
      color: 'black',
      ...baseTextStyle,
    },
  ]),
  right: StyleSheet.flatten([
    {
      color: 'white',
      ...baseTextStyle,
    },
  ]),
};

export const styles = _.memoize((position: MessagePosition) => ({
  text: {
    color: position === 'left' ? 'black' : 'white',
    fontSize: 16,
    lineHeight: 18,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
  },
  link: {
    textDecorationLine: 'underline',
  },
  bold: {
    fontWeight: 'bold',
  },
  boldItalic: {
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
  h1: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  h2: {
    fontWeight: 'bold',
    fontSize: 17,
  },
  h3: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  h4: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontSize: 16,
    lineHeight: 20,
  },
  h5: {
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 15,
  },
  listItem: {
    marginLeft: 10,
  },
}));

export const BubbleStyles = {
  left: StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'flex-start',
    },
    wrapper: {
      alignItems: 'center',
      display: 'flex',
      borderRadius: 15,
      backgroundColor: '#f0f0f0',
      marginRight: 60,
      minHeight: 20,
      justifyContent: 'flex-end',
    },
    containerToNext: {
      borderBottomLeftRadius: 3,
    },
    containerToPrevious: {
      borderTopLeftRadius: 3,
    },
  }),
  right: StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'flex-end',
    },
    wrapper: {
      borderRadius: 15,
      backgroundColor: '#0084ff',
      marginLeft: 60,
      minHeight: 20,
      justifyContent: 'flex-end',
    },
    containerToNext: {
      borderBottomRightRadius: 3,
    },
    containerToPrevious: {
      borderTopRightRadius: 3,
    },
  }),
  bottom: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  tick: {
    fontSize: 10,
    backgroundColor: 'transparent',
    color: 'white',
  },
  tickView: {
    flexDirection: 'row',
    marginRight: 10,
  },
  authorName: {
    fontSize: 11,
    color: '#888',
    paddingBottom: 2,
    paddingLeft: 10,
  },
  status: {
    fontSize: 11,
    color: '#888',
  },
  pendingBubble: {
    backgroundColor: '#AAAAAA',
  },
  failedBubble: {
    backgroundColor: '#AAAAAA',
  },
  failed: {
    color: 'red',
  },
};
