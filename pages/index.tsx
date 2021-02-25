import Head from 'next/head'

// The Storyblok Client
import Storyblok from '../lib/storyblok'
import useStoryblok from '../lib/storyblok-hook'
import DynamicComponent from '../components/DynamicComponent'

export default function Home(props) {
    // the Storyblok hook to enable live updates
    const story = useStoryblok(props.story)

    return (
        <div>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <header>
                <h1>
                    { story ? story.name : 'My Site' }
                </h1>
            </header>

            <main>
                { story ? story.content.body.map((blok) => (
                    <DynamicComponent blok={blok} key={blok._uid}/>
                )) : null }
            </main>
        </div>
    )
}

export async function getStaticProps(context) {
    const slug = 'home'
    const params = {
        version: 'draft', // or 'published'
    }

    if (context.preview) {
        params.version = 'draft'
        params.cv = Date.now()
    }

    const { data } = await Storyblok.get(`cdn/stories/${slug}`, params)

    return {
        props: {
            story: data ? data.story : false,
            preview: context.preview || false
        },
        revalidate: 10,
    }
}
