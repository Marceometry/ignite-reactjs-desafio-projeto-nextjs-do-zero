/* eslint-disable react/no-danger */
import { useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { format } from 'date-fns';
import prBR from 'date-fns/locale/pt-BR';

import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const { isFallback } = useRouter();

  function calcReadingTime(): number {
    const numberOfWordsInPost = post.data.content.reduce((acc, item) => {
      const wordsInHeading = item.heading.split(' ').length;
      const wordsInBody = item.body.reduce(
        (total, paragraph) => total + paragraph.text.split(' ').length,
        0
      );
      return acc + wordsInHeading + wordsInBody;
    }, 0);
    return Math.ceil(numberOfWordsInPost / 200);
  }

  return (
    <div>
      <Header />

      {isFallback ? (
        <h1>Carregando...</h1>
      ) : (
        <>
          <img
            className={styles.postBanner}
            src={post.data.banner.url}
            alt=""
          />

          <main
            className={`${commonStyles.contentContainer} ${styles.postContainer}`}
          >
            <div className={styles.postMainInfo}>
              <h1>{post.data.title}</h1>

              <div>
                <span>
                  <FiCalendar size={18} />
                  {format(
                    new Date(post.first_publication_date),
                    'dd MMM yyyy',
                    {
                      locale: prBR,
                    }
                  )}
                </span>
                <span>
                  <FiUser size={18} />
                  {post.data.author}
                </span>
                <span>
                  <FiClock size={18} /> {calcReadingTime()} min
                </span>
              </div>
            </div>

            <div className={styles.postContent}>
              {post.data.content.map(item => (
                <div key={item.heading}>
                  <h2>{item.heading}</h2>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: RichText.asHtml(item.body),
                    }}
                  />
                </div>
              ))}
            </div>
          </main>
        </>
      )}
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const response = await prismic.getByType('post');

  const paths = response.results.map(post => ({ params: { slug: post.uid } }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('post', params.slug);

  return {
    props: {
      post: response,
    },
  };
};
