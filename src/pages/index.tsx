import * as React from "react";
import * as Dwnxt from "downwrite";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Cookies from "universal-cookie";
import * as jwt from "jsonwebtoken";

import { getPosts } from "@legacy/posts";
import { dbConnect } from "@legacy/util/db";

import DeleteModal from "../components/delete-modal";
import PostList from "../components/post-list";
import Loading from "../components/loading";
import EmptyPosts from "../components/empty-posts";
import InvalidToken from "../components/invalid-token";
import useManagedDashboard from "../hooks/manage-dashboard";
import * as InitialProps from "../utils/initial-props";

export const getServerSideProps: GetServerSideProps<InitialProps.IDashboardProps> = async context => {
  const cookie = new Cookies(context.req.headers.cookie);
  const { DW_TOKEN } = cookie.getAll();
  console.log("TOKEN", DW_TOKEN, !!cookie.getAll().DW_TOKEN);

  if (!!DW_TOKEN) {
    await dbConnect();
    const x = jwt.decode(DW_TOKEN) as { user: string };
    const posts = await getPosts(x.user);
    return {
      props: {
        entries:
          posts.length > 0
            ? [
                ...posts.map((p: any) => {
                  p._id = p._id.toString();
                  p.dateAdded = p.dateAdded
                    ? p.dateAdded.toString()
                    : new Date().toString();
                  p.dateModified = p.dateModified
                    ? p.dateModified.toString()
                    : p.dateAdded.toString();
                  p.user = p.user.toString();
                  return p;
                })
              ]
            : [],
        token: DW_TOKEN
      }
    };
  }

  return { props: { entries: [], token: null } };
};

// TODO: refactor to have selected post, deletion to be handled by a lower level component
// should be opened at this level and be handed a token and post to delete
function DashboardUI(props: InitialProps.IDashboardProps) {
  const [
    { entries, selectedPost, modalOpen, loaded, error },
    ManagedDashboard
  ] = useManagedDashboard(props.entries);

  return (
    <>
      {modalOpen && (
        <DeleteModal
          title={selectedPost.title}
          onDelete={ManagedDashboard.onConfirmDelete}
          onCancelDelete={ManagedDashboard.onCancel}
          closeModal={ManagedDashboard.onCloseModal}
        />
      )}
      <Head>
        <title>{Array.isArray(entries) && entries.length} Entries | Downwrite</title>
      </Head>
      <section className="PostContainer">
        {loaded ? (
          Array.isArray(entries) && entries.length > 0 ? (
            <PostList
              onSelect={ManagedDashboard.onSelect}
              posts={entries as Dwnxt.IPost[]}
            />
          ) : !!error ? (
            <InvalidToken error={error} />
          ) : (
            <EmptyPosts />
          )
        ) : (
          <Loading size={100} />
        )}
      </section>
    </>
  );
}

export default DashboardUI;
