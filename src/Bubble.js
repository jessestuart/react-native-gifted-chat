import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  Clipboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import _ from 'lodash';

import MessageText from './MessageText';
import MessageImageContainer from './MessageImageContainer';
import Time from './Time';

import { isSameUser, isSameDay } from './utils';

import { BubbleStyles as styles } from './styles';

export default class Bubble extends Component {
  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
    this.onLongPress = this.onLongPress.bind(this);
  }

  onPress() {
    // trigger longpress for failed messages
    if (
      this.props.position === 'right' &&
      this.props.currentMessage.status === 'failed'
    ) {
      this.onLongPress();
    }
  }

  onLongPress() {
    if (this.props.onLongPress) {
      this.props.onLongPress(this.context);
    } else {
      const options = ['Copy Text', 'Cancel'];
      if (this.props.currentMessage.status === 'failed') {
        options.unshift('Resend Message');
      }
      const retryButtonIndex = options.length - 3;
      const copyButtonIndex = options.length - 2;
      const cancelButtonIndex = options.length - 1;
      this.context.actionSheet().showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
        },
        buttonIndex => {
          switch (buttonIndex) {
            case copyButtonIndex:
              Clipboard.setString(this.props.currentMessage.text);
              break;
            case retryButtonIndex:
              this.props.retrySend(this.props.currentMessage);
              break;
            default:
              break;
          }
        },
      );
    }
  }

  handleStatus() {
    // change bubble color depending on status for user messages
    if (this.props.position === 'right') {
      switch (this.props.currentMessage.status) {
        case 'pending':
          if (this.props.showPending) {
            return styles.pendingBubble;
          }
          break;
        case 'failed':
          return styles.failedBubble;
        default:
          return null;
      }
    }
    return null;
  }

  handleBubbleToNext() {
    if (
      isSameUser(this.props.currentMessage, this.props.nextMessage) &&
      isSameDay(this.props.currentMessage, this.props.nextMessage)
    ) {
      return StyleSheet.flatten([
        styles[this.props.position].containerToNext,
        this.props.containerToNextStyle[this.props.position],
      ]);
    }
    return null;
  }

  handleBubbleToPrevious() {
    if (
      isSameUser(this.props.currentMessage, this.props.previousMessage) &&
      isSameDay(this.props.currentMessage, this.props.previousMessage)
    ) {
      return StyleSheet.flatten([
        styles[this.props.position].containerToPrevious,
        this.props.containerToPreviousStyle[this.props.position],
      ]);
    }
    return null;
  }

  renderMessageText() {
    if (this.props.currentMessage.text) {
      // eslint-disable-next-line no-unused-vars
      const { containerStyle, wrapperStyle, ...messageTextProps } = this.props;
      if (this.props.renderMessageText) {
        return this.props.renderMessageText(messageTextProps);
      }
      return <MessageText {...messageTextProps} />;
    }
    return null;
  }

  renderMessageImage() {
    const {
      currentMessage: { imageId },
      renderMessageImage,
    } = this.props;
    if (!imageId) {
      return null;
    }
    // eslint-disable-next-line no-unused-vars
    const messageImageProps = _.omit(this.props, [
      'containerStyle',
      'wrapperStyle',
    ]);
    return renderMessageImage ? (
      renderMessageImage(messageImageProps)
    ) : (
      <MessageImageContainer {...messageImageProps} />
    );
  }

  renderTicks() {
    const { currentMessage, renderTicks, user } = this.props;
    if (renderTicks) {
      return this.props.renderTicks(currentMessage);
    }
    if (_.get(currentMessage, 'user._id') !== _.get(user, '_id')) {
      return null;
    }
    if (currentMessage.sent || currentMessage.received) {
      return (
        <View style={styles.tickView}>
          {currentMessage.sent && (
            <Text style={[styles.tick, this.props.tickStyle]}>✓</Text>
          )}
          {currentMessage.received && (
            <Text style={[styles.tick, this.props.tickStyle]}>✓</Text>
          )}
        </View>
      );
    }
    return null;
  }

  renderTime() {
    if (this.props.currentMessage.timestamp) {
      // eslint-disable-next-line no-unused-vars
      const { containerStyle, wrapperStyle, ...timeProps } = this.props;
      if (this.props.renderTime) {
        return this.props.renderTime(timeProps);
      }
      return <Time {...timeProps} />;
    }
    return null;
  }

  renderAuthorName() {
    if (
      this.props.position === 'left' &&
      !isSameUser(this.props.currentMessage, this.props.previousMessage)
    ) {
      const { currentMessage, nameMap } = this.props;
      const userId = currentMessage.user._id;
      const displayName =
        nameMap[userId] || this.props.currentMessage.user.name;
      return <Text style={styles.authorName}>{displayName}</Text>;
    }
    return null;
  }

  renderCustomView() {
    if (this.props.renderCustomView) {
      return this.props.renderCustomView(this.props);
    }
    return null;
  }

  renderStatus() {
    // never render statuses for left messages
    if (this.props.position === 'right') {
      switch (this.props.currentMessage.status) {
        case 'pending':
          // group pending notifications together
          if (
            this.props.showPending &&
            this.props.currentMessage.status !== this.props.nextMessage.status
          ) {
            return <Text style={[styles.status]}>pending</Text>;
          }
          break;
        case 'failed':
          return (
            <Text style={[styles.status, styles.failed]}>
              Message failed to send. Tap to retry.
            </Text>
          );
        default:
          return null;
      }
    }
    return null;
  }

  render() {
    const { position } = this.props;
    return (
      <View
        style={[
          styles[this.props.position].container,
          this.props.containerStyle[this.props.position],
        ]}
      >
        {this.renderAuthorName()}
        <View
          style={[
            styles[position].wrapper,
            this.props.wrapperStyle[position],
            this.handleStatus(),
            this.handleBubbleToNext(),
            this.handleBubbleToPrevious(),
          ]}
        >
          <TouchableWithoutFeedback
            onPress={this.onPress}
            onLongPress={this.onLongPress}
            accessibilityTraits="text"
            {...this.props.touchableProps}
          >
            <View>
              {this.renderCustomView()}
              {this.renderMessageImage()}
              {this.renderMessageText()}
              <View style={styles.bottom}>
                {this.renderTime()}
                {this.renderTicks()}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
        {this.renderStatus()}
      </View>
    );
  }
}

Bubble.contextTypes = {
  actionSheet: PropTypes.func,
};

Bubble.defaultProps = {
  touchableProps: {},
  onLongPress: null,
  renderMessageImage: null,
  renderMessageText: null,
  renderCustomView: null,
  renderTicks: null,
  renderTime: null,
  position: 'left',
  user: { _id: null },
  currentMessage: {
    text: null,
    timestamp: null,
    image: null,
    status: 'ok',
  },
  nextMessage: {},
  previousMessage: {},
  containerStyle: {},
  wrapperStyle: {},
  tickStyle: {},
  containerToNextStyle: {},
  containerToPreviousStyle: {},
  isSameDay: {},
  isSameUser: {},
  retrySend: () => {},
  showPending: false,
};

Bubble.propTypes = {
  containerStyle: PropTypes.shape({
    left: PropTypes.any,
    right: PropTypes.any,
  }),
  containerToNextStyle: PropTypes.shape({
    left: PropTypes.any,
    right: PropTypes.any,
  }),
  containerToPreviousStyle: PropTypes.shape({
    left: PropTypes.any,
    right: PropTypes.any,
  }),
  currentMessage: PropTypes.object,
  isSameDay: PropTypes.func,
  isSameUser: PropTypes.func,
  nameMap: PropTypes.object,
  nextMessage: PropTypes.object,
  onLongPress: PropTypes.func,
  position: PropTypes.oneOf(['left', 'right']),
  previousMessage: PropTypes.object,
  renderCustomView: PropTypes.func,
  renderMessageImage: PropTypes.func,
  renderMessageText: PropTypes.func,
  renderTicks: PropTypes.func,
  renderTime: PropTypes.func,
  retrySend: PropTypes.func,
  showPending: PropTypes.bool,
  tickStyle: Text.propTypes.style,
  touchableProps: PropTypes.object,
  user: PropTypes.object,
  wrapperStyle: PropTypes.shape({ left: PropTypes.any, right: PropTypes.any }),
};
