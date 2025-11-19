import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import AnimalCareForm from '@/components/community/AnimalCareForm';

vi.mock('@/hooks/useAuthContext', () => ({
  useAuthContext: () => ({ user: { principal: 'test-principal' } }),
}));

const submitMock = vi.fn(async () => 1);
vi.mock('@/declarations/hhdao_dao', () => ({
  createActor: () => ({ submitAnimalReport: submitMock }),
}));

describe('AnimalCareForm', () => {
  it('submits with minimal data', async () => {
    const { getByText, getByLabelText } = render(
      React.createElement(AnimalCareForm, { onSubmitted: () => {} })
    );
    fireEvent.change(getByLabelText(/Location/i), { target: { value: 'Park' } });
    fireEvent.change(getByLabelText(/Description/i), { target: { value: 'Injured cat' } });
    fireEvent.click(getByText(/Submit report/i));
    expect(submitMock).toHaveBeenCalled();
  });
});
