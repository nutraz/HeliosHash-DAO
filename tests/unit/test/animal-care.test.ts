<<<<<<< HEAD
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import AnimalCareForm from '@/components/community/AnimalCareForm';
=======
import AnimalCareForm from '@/components/community/AnimalCareForm';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
>>>>>>> audit-clean

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
