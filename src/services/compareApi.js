import { compareHandler } from '../../api/compare';

export async function runComparison(payload) {
  return compareHandler(payload, 'browser-user');
}
