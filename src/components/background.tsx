import Head from "next/head";
import type { ReactFragment } from "react";
import React from "react";

export type JsxRenderable = JSX.Element|JSX.Element[]|ReactFragment;


type PageHeadProps = {
	title: string;
	initTrello?:boolean;
	description?:string;
	keywords?:[string, string][];
	children?:JsxRenderable;
}

type BackgroundProps = {
	pageHead:PageHeadProps;
	children?:JsxRenderable;
}

export default function Background(props:BackgroundProps) {
	return (
		<>
			<PageHead {...props.pageHead} />
			<main className="bg-slate-600 w-full h-screen m-0 text-slate-100">
				<div className="container flex flex-col mx-auto h-full">
					{props.children}
				</div>
			</main>
		</>
	)
}

const PageHead:React.FC<PageHeadProps> = ({ title, description, keywords, children, initTrello }) => {
	setTimeout(() => {
		if (!document) return;
		if (document.getElementById("PowerUpTrelloScript") != null) {
			return;
		}
		const script = document.createElement("script");
		script.src = "https://p.trellocdn.com/power-up.min.js";
		script.id = "PowerUpTrelloScript";
		if (initTrello) {
			script.onload = () => {
				const client = document.createElement("script");
				client.id = "TrelloClientScript";
				client.src = "/client.js";
				document.head.appendChild(client);
				script.onload = null;
			}
		}
		document.head.appendChild(script);
	}, 5);
	return (
		<Head>
			<title>{title}</title>
			<meta name="author" content="JM" />
			<meta name="description" content={description? description : "Generated by create-t3-app"} />
			{
				keywords?.map(
					(val, idx) => <meta key={idx} name={val[0]} content={val[1]} />
				)
			}
			<link rel="icon" href="/favicon.ico" />
			{children}
		</Head>
	)
}
