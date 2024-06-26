import { toast } from 'react-toastify';
import { config } from 'src/config/config';
import { links } from 'src/config/links';
import { ADDRESS_REGEX, TX_HASH_REGEX } from 'src/utils/addresses';
import { logger } from 'src/utils/logger';
import { z } from 'zod';

export const StakeActivationRequestSchema = z.object({
  address: z.string().regex(ADDRESS_REGEX),
  group: z.string().regex(ADDRESS_REGEX),
  transactionHash: z.string().regex(TX_HASH_REGEX),
});

export type StakeActivationRequest = z.infer<typeof StakeActivationRequestSchema>;

export async function submitStakeActivationRequest(request: StakeActivationRequest) {
  try {
    logger.debug('Submitting stake activation request');
    const upstashBase = new URL(links.upstash);
    upstashBase.pathname += `/${links.home}/staking/api`;
    const response = await fetch(upstashBase, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.upstashKey}`,
        'Upstash-Delay': '1d',
      },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`);
    }
    logger.debug('Stake activation request submitted');
  } catch (error) {
    logger.error('Stake activation request error', error);
    toast.error(
      'Unable to schedule automatic stake activation. You must activate your stake manually in 24 hours on the Dashboard page.',
    );
  }
}
