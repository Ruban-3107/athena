export interface BatchesCount {
  type: string;
  count: string | number;
}
import { batchesAttributes } from '../database/models/batches';
export type Batches = batchesAttributes;
