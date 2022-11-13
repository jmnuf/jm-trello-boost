import { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";


export default function Document() {
	return (
		<Html>
			<Head />
			<body>
				<Main />
				<link rel="stylesheet" href="https://p.trellocdn.com/power-up.min.css" />
				<Script
					src="https://p.trellocdn.com/power-up.min.js"
					strategy="beforeInteractive"
				/>
				<NextScript />
			</body>
		</Html>
	)
}
