import { GetServerSideProps, NextPage, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import SettingsUser from "@components/settings-user-form";
import SettingsLocal from "@components/settings-markdown";
import Loading from "@components/loading";
import { PageTitle } from "@components/page-title";
import { initializeApollo } from "@lib/apollo";
import { getInitialStateFromCookie } from "@lib/cookie-managment";
import { useUserDetailsQuery, UserDetailsDocument } from "../__generated__/client";
import SettingsPassword from "@components/settings-password";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const client = initializeApollo({}, { req, res });

  await client.query({
    query: UserDetailsDocument,
    context: { req, res }
  });

  const initialAppState = await getInitialStateFromCookie(req);

  return {
    props: {
      initialAppState,
      initialApolloState: client.cache.extract()
    }
  };
};

const SettingsPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = () => {
  const { error, loading, data } = useUserDetailsQuery();
  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div className="max-w-4xl p-2 mx-auto mt-12" data-testid="SETTINGS_CONTAINER">
      <Head>
        <title>User Settings</title>
      </Head>
      <header className="flex items-center justify-between mb-6">
        <PageTitle>Settings</PageTitle>
      </header>
      <SettingsUser user={data?.settings} />
      <SettingsPassword username={data?.settings.username} />
      <SettingsLocal />
    </div>
  );
};

export default SettingsPage;
