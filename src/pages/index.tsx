import { useState } from 'react';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
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

export default function Home({
  postsPagination: { results, next_page },
}: HomeProps): JSX.Element {
  const [postList, setPostList] = useState<Post[]>(results);
  const [nextPage, setNextPage] = useState(next_page);

  async function loadMorePosts(): Promise<void> {
    const response = await fetch(nextPage);
    const data = await response.json();

    setNextPage(data.next_page);
    setPostList(state => [...state, ...data.results]);
  }

  return (
    <div className={`${commonStyles.contentContainer} ${styles.homeContainer}`}>
      <header>
        <img src="/logo.svg" alt="logo" />
      </header>

      <main>
        {postList.map(post => (
          <Link href={`/post/${post.uid}`} key={post.uid}>
            <a className={styles.post}>
              <h1>{post.data.title}</h1>
              <p>{post.data.subtitle}</p>
              <div>
                <span>
                  <FiCalendar size={18} />
                  {format(
                    new Date(post.first_publication_date),
                    'dd MMM yyyy',
                    { locale: ptBR }
                  )}
                </span>
                <span>
                  <FiUser size={18} />
                  {post.data.author}
                </span>
              </div>
            </a>
          </Link>
        ))}

        {nextPage && (
          <button
            className={styles.loadMoreButton}
            onClick={loadMorePosts}
            type="button"
          >
            Carregar mais posts
          </button>
        )}
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('post', { pageSize: 1 });

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results: postsResponse.results,
      },
    },
    revalidate: 60 * 60, // 1 hour
  };
};
