import Head from "next/head";

interface Metatags {
	title: string;
	image: string;
	description: string;
}

export default function Metatags({ title, image, description }: Record<string, string>) {

	return (
		<Head>
			<title>{title}</title>
			<meta name="twitter:card" content="summary" />
			<meta name="twitter:site" content="@fireship_dev" />
			<meta name="twitter:title" content={title} />
			<meta name="twitter:description" content={description} />
			<meta name="twitter:image" content={image} />

			<meta property="og:type" content="website" />
			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
		</Head>
	)
}