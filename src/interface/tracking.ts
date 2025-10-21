export interface TrackingParams {
  order_id: number;
  awb: string;
  courier: string;
}

export interface TrackingResponse {
  order_id: number;
  phone_last5: string;
  raw_response: RawResponse;
  tracking: RawResponse;
}

export interface RawResponse {
  meta: Meta;
  data: TrackingData;
}

export interface Meta {
  message: string;
  code: number;
  status: string;
}

export interface TrackingData {
  delivered: boolean;
  summary: Summary;
  details: Details;
  delivery_status: DeliveryStatus;
  manifest: ManifestItem[];
}

export interface Summary {
  courier_code: string;
  courier_name: string;
  waybill_number: string;
  service_code: string;
  waybill_date: string;
  shipper_name: string;
  receiver_name: string;
  origin: string;
  destination: string;
  status: string;
}

export interface Details {
  waybill_number: string;
  waybill_date: string;
  waybill_time: string;
  weight: string;
  origin: string;
  destination: string;
  shipper_name: string;
  shipper_address1: string;
  shipper_address2: string;
  shipper_address3: string;
  shipper_city: string;
  receiver_name: string;
  receiver_address1: string;
  receiver_address2: string;
  receiver_address3: string;
  receiver_city: string;
}

export interface DeliveryStatus {
  status: string;
  pod_receiver: string;
  pod_date: string;
  pod_time: string;
}

export interface ManifestItem {
  manifest_code: string;
  manifest_description: string;
  manifest_date: string;
  manifest_time: string;
  city_name: string;
}
