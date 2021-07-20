// Load the package
import { WebhookEvent } from '@line/bot-sdk';
import axios, { AxiosResponse } from 'axios';

export const getWeatherForecastData = async (
  event: WebhookEvent,
  weatherApi: string
): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      if (event.type !== 'message' || event.message.type !== 'location') {
        return;
      }

      // Get latitude and longitude
      const latitude: number = event.message.latitude;
      const longitude: number = event.message.longitude;

      // OpenWeatherURL
      const openWeatherURL: string = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&lang=ja&appid=${weatherApi}`;

      const weatherData: AxiosResponse<any> = await axios.get(openWeatherURL);
      resolve(weatherData);
    } catch (err) {
      reject(err);
    }
  });
};
