'use strict';

// import
const line = require('@line/bot-sdk');
const aws = require('aws-sdk');

// modules
const buttonMessageTemplate = require('./Common/ButtonMessage/ButtonMessageTemplate');

// SSM
const ssm = new aws.SSM();
const LINE_WEATHER_FASHION_CHANNEL_ACCESS_TOKEN = {
  Name: 'LINE_WEATHER_FASHION_CHANNEL_ACCESS_TOKEN',
  WithDecryption: false,
};
const LINE_WEATHER_FASHION_CHANNEL_SECRET = {
  Name: 'LINE_WEATHER_FASHION_CHANNEL_SECRET',
  WithDecryption: false,
};
const LINE_WEATHER_FASHION_WEATHER_API = {
  Name: 'LINE_WEATHER_FASHION_WEATHER_API',
  WithDecryption: false,
};

exports.handler = async (event, context) => {
  // SSM (.env)
  const CHANNEL_ACCESS_TOKEN = await ssm
    .getParameter(LINE_WEATHER_FASHION_CHANNEL_ACCESS_TOKEN)
    .promise();
  const CHANNEL_SECRET = await ssm.getParameter(LINE_WEATHER_FASHION_CHANNEL_SECRET).promise();
  const WEATHER_API = await ssm.getParameter(LINE_WEATHER_FASHION_WEATHER_API).promise();

  const channelAccessToken = CHANNEL_ACCESS_TOKEN.Parameter.Value;
  const channelSecret = CHANNEL_SECRET.Parameter.Value;
  const weatherApi = WEATHER_API.Parameter.Value;

  // client
  const clientConfig = {
    channelAccessToken: channelAccessToken,
    channelSecret: channelSecret,
  };
  const client = new line.Client(clientConfig);

  // post
  const body = JSON.parse(event.body);
  const response = body.events[0];

  // action
  try {
    await actionButtonOrErrorMessage(response, client);
  } catch (err) {
    console.log(err);
  }
};

const actionButtonOrErrorMessage = async (event, client) => {
  try {
    if (event.type !== 'message' || event.message.type !== 'text') {
      return;
    }

    const { replyToken } = event;
    const { text } = event.message;

    if (text === '今日の洋服は？') {
      const buttonMessage = await buttonMessageTemplate();
      await client.replyMessage(replyToken, buttonMessage);
    } else {
    }
  } catch (err) {
    console.log(err);
  }
};
