import { TrackingParams, TrackingResponse } from '../interface/tracking';
import { apiCore } from './main_service';

export const trackingService = {
  getTracking: ({ order_id, awb, courier }: TrackingParams) =>
    apiCore.get<TrackingResponse>(
      `/tracking/get?order_id=${order_id}&awb=${awb}&courier=${courier}`,
    ),
};
