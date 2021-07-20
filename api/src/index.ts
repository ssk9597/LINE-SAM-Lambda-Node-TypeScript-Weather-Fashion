// パッケージのインストール
import { ClientConfig, Client, WebhookEvent } from '@line/bot-sdk';
import aws from 'aws-sdk';

// モジュールを読み込む
import { buttonMessageTemplate } from './Common/ButtonMessage/ButtonMessageTemplate';
import { errorMessageTemplate } from './Common/ButtonMessage/ErrorMessageTemplate';
import { flexMessageTemplate } from './Common/WeatherForecastMessage/FlexMessageTemplate';

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

exports.handler = async (event: any, context: any) => {
  // SSM (.env)
  const CHANNEL_ACCESS_TOKEN: any = await ssm
    .getParameter(LINE_WEATHER_FASHION_CHANNEL_ACCESS_TOKEN)
    .promise();
  const CHANNEL_SECRET: any = await ssm.getParameter(LINE_WEATHER_FASHION_CHANNEL_SECRET).promise();
  const WEATHER_API: any = await ssm.getParameter(LINE_WEATHER_FASHION_WEATHER_API).promise();

  const channelAccessToken: string = CHANNEL_ACCESS_TOKEN.Parameter.Value;
  const channelSecret: string = CHANNEL_SECRET.Parameter.Value;
  const weatherApi: string = WEATHER_API.Parameter.Value;

  // client
  const clientConfig: ClientConfig = {
    channelAccessToken: channelAccessToken,
    channelSecret: channelSecret,
  };
  const client: Client = new Client(clientConfig);

  // post
  const body: any = JSON.parse(event.body);
  const response: WebhookEvent = body.events[0];

  // action
  try {
    await actionButtonOrErrorMessage(response, client);
    await actionFlexMessage(response, client, weatherApi);
  } catch (err) {
    console.log(err);
  }
};

// ボタンメッセージもしくはエラーメッセージを送る関数
const actionButtonOrErrorMessage = async (event: WebhookEvent, client: Client) => {
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
      const errorMessage = await errorMessageTemplate();
      await client.replyMessage(replyToken, errorMessage);
    }
  } catch (err) {
    console.log(err);
  }
};

// 天気予報とファッションレコメンドメッセージを送る関数
const actionFlexMessage = async (event: WebhookEvent, client: Client, weatherApi: string) => {
  try {
    if (event.type !== 'message' || event.message.type !== 'location') {
      return;
    }

    const { replyToken } = event;
    const message = await flexMessageTemplate(event, weatherApi);

    await client.replyMessage(replyToken, message);
  } catch (err) {
    console.log(err);
  }
};
