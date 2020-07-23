import Link from 'next/link';

const Home = (props) => (
    <div>
        <div>You are home</div>
        <Link href="/sale">
            <a>Sale</a>
        </Link>
    </div>
)

export default Home;