import { EventBus } from 'minimal-event-bus';

export const bus = new EventBus<{
  'display-result': (data: any) => void;
}>();
