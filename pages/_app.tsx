import { Roboto } from 'next/font/google';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Header from '@/components/Header';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';

const roboto = Roboto({
	subsets: ['latin'],
	weight: ['400', '700'],
});

export default function App({ Component, pageProps }: AppProps) {
	return (
		<SessionProvider session={pageProps.session}>
			<main className={roboto.className}>
				<Toaster position="top-right" reverseOrder={false} />
				<Header />
				<Component {...pageProps} />
			</main>
		</SessionProvider>
	);
}
