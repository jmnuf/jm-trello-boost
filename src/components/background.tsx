import Head from "next/head";
import Script from "next/script";
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
	const clientScript = initTrello ? <Script src="/client.js" defer /> : undefined;
	return (<>
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
		{clientScript}
	</>)
}
