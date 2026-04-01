import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SignInPage from './SignInPage';

describe('SignInPage', () => {
	it('renders email/password inputs and submit button', () => {
		render(<SignInPage onSignInSuccess={vi.fn()} />);

		expect(screen.getByPlaceholderText('email')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('password')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
	});
});
