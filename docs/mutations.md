# Mutation Examples

This document provides examples of using mutations in HeliosHash DAO with React Query.

## Overview

Mutations are used for creating, updating, or deleting data. In HeliosHash DAO, we use mutations for:

- Staking and unstaking tokens
- Claiming rewards
- Other wallet operations

## Basic Mutation Usage

### useStakeMutation

```typescript
import { useStakeMutation } from '@/hooks/useMutations';

function StakingComponent() {
  const stakeMutation = useStakeMutation();

  const handleStake = (amount: number) => {
    stakeMutation.mutate(amount, {
      onSuccess: () => {
        // Handle success
      },
      onError: (error) => {
        // Handle error
      },
    });
  };

  return (
    <button onClick={() => handleStake(10)} disabled={stakeMutation.isPending}>
      {stakeMutation.isPending ? 'Staking...' : 'Stake 10 OWP'}
    </button>
  );
}
```

### useClaimRewardsMutation

```typescript
import { useClaimRewardsMutation } from '@/hooks/useMutations';

function RewardsComponent() {
  const claimRewardsMutation = useClaimRewardsMutation();

  const handleClaim = () => {
    claimRewardsMutation.mutate(undefined, {
      onSuccess: () => {
        // Handle success
      },
      onError: (error) => {
        // Handle error
      },
    });
  };

  return (
    <button onClick={handleClaim} disabled={claimRewardsMutation.isPending}>
      {claimRewardsMutation.isPending ? 'Claiming...' : 'Claim Rewards'}
    </button>
  );
}
```

## Optimistic Updates

Optimistic updates improve perceived performance by updating the UI before the server responds:

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/hooks/useQuery';

export function useStakeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amount: number) => {
      // API call
      return stakeTokens(amount);
    },
    onMutate: async (amount) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.wallet.balance });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(queryKeys.wallet.balance);

      // Optimistically update to the new value
      if (previousData) {
        queryClient.setQueryData(queryKeys.wallet.balance, {
          ...previousData,
          balance: previousData.balance - amount,
          stakedAmount: previousData.stakedAmount + amount,
        });
      }

      return { previousData };
    },
    onError: (err, amount, context) => {
      // Roll back on error
      if (context?.previousData) {
        queryClient.setQueryData(queryKeys.wallet.balance, context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.balance });
    },
  });
}
```

## Error Handling

Handle errors gracefully with user feedback:

```typescript
import { useStakeMutation } from '@/hooks/useMutations';
import { useToast } from '@/hooks/use-toast';

function StakingComponent() {
  const { toast } = useToast();
  const stakeMutation = useStakeMutation();

  const handleStake = (amount: number) => {
    stakeMutation.mutate(amount, {
      onSuccess: () => {
        toast({
          title: 'Success',
          description: `Successfully staked ${amount} OWP`,
        });
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description: `Failed to stake tokens: ${error.message}`,
          variant: 'destructive',
        });
      },
    });
  };

  // ... rest of component
}
```

## Best Practices

1. Always handle loading states
2. Provide user feedback
3. Use optimistic updates
4. Roll back on errors
5. Invalidate queries post-mutation
6. Test mutations thoroughly

## Advanced Patterns

### Batch Mutations

```typescript
import { useMutation } from '@tanstack/react-query';

export function useBatchStakeMutation() {
  return useMutation({
    mutationFn: async (amounts: number[]) => {
      return batchStake(amounts);
    },
    onSuccess: () => {
      // Invalidate queries
    },
  });
}
```

### Dependent Mutations

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useStakeAndClaimMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amount: number) => {
      const stakeResult = await stakeTokens(amount);
      const claimResult = await claimRewards();
      return { stakeResult, claimResult };
    },
    onSuccess: () => {
      // Invalidate queries
    },
  });
}
```

## Testing Mutations

```typescript
import { renderHook, act } from '@testing-library/react';
import { useStakeMutation } from '@/hooks/useMutations';

it('stakes tokens', async () => {
  const { result } = renderHook(() => useStakeMutation());
  await act(async () => {
    result.current.mutate(10);
  });
  expect(result.current.isSuccess).toBe(true);
});
```

These patterns provide a robust foundation for handling mutations in HeliosHash DAO.
