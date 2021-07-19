// import
const aws = require('aws-sdk');

// SSM
const ssm = new aws.SSM();

exports.handler = async (event, context) => {
  const params = {
    Name: 'LINE_WEATHER_FASHION_CHANNEL_ACCESS_TOKEN',
    WithDecryption: false,
  };

  const channelAccessToken = await ssm.getParameter(params).promise();
  console.log('channelAccessToken: ' + JSON.stringify(channelAccessToken.Parameter.Value));
};
