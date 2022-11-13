import { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";


export default function Document() {
	return (
		<Html className="bg-slate-600 text-slate-100">
			<Head />
			<body>
				<Main />
				<Script
					src="https://p.trellocdn.com/power-up.min.js"
					strategy="beforeInteractive"
				/>
				<NextScript />
			</body>
		</Html>
	)
}
