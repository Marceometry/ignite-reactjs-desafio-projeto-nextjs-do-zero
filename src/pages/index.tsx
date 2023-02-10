import { GetStaticProps } from 'next';
import Link from 'next/link';
import { format } from 'date-fns';
import { FiCalendar, FiUser } from 'react-icons/fi';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

const posts: Post[] = [
  {
    uid: 'como-utilizar-hooks',
    first_publication_date: '2021-03-15T19:25:28+0000',
    data: {
      title: 'Como utilizar Hooks',
      subtitle: 'Pensando em sincronização em vez de ciclos de vida',
      author: 'Joseph Oliveira',
    },
  },
  {
    uid: 'criando-um-app-cra-do-zero',
    first_publication_date: '2021-03-25T19:27:35+0000',
    data: {
      title: 'Criando um app CRA do zero',
      subtitle:
        'Tudo sobre como criar a sua primeira aplicação utilizando Create React App',
      author: 'Danilo Vieira',
    },
  },
];

export default function Home(): JSX.Element {
  return (
    <div className={`${commonStyles.contentContainer} ${styles.homeContainer}`}>
      <header>
        <img src="/logo.svg" alt="logo" />
      </header>

      <main>
        {posts.map(post => (
          <Link href={`/post/${post.uid}`}>
            <a className={styles.post} key={post.uid}>
              <h1>{post.data.title}</h1>
              <p>{post.data.subtitle}</p>
              <div>
                <span>
                  <FiCalendar size={18} />
                  {format(new Date(post.first_publication_date), 'dd MMM yyyy')}
                </span>
                <span>
                  <FiUser size={18} />
                  {post.data.author}
                </span>
              </div>
            </a>
          </Link>
        ))}

        <button className={styles.loadMoreButton} type="button">
          Carregar mais posts
        </button>
      </main>
    </div>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient({});
//   // const postsResponse = await prismic.getByType(TODO);

//   // TODO
// };
