import * as React from "react";
import { Helmet } from "react-helmet-async";
import NotFound from "../components/not-found";

interface IErrorViewProps {
  statusCode: number;
}

interface ICustomError extends Error {
  statusCode: number;
}

function StatusCode(props: Partial<ICustomError>) {
  return (
    <p>
      {props.statusCode
        ? "An error " + props.statusCode + "occurred on server"
        : "An error occurred on client"}
    </p>
  );
}

export default function ErrorPage(props: IErrorViewProps) {
  return (
    <section
      className="Wrapper u-center"
      style={{
        paddingTop: 128,
        paddingBottom: 128,
        paddingLeft: 16,
        paddingRight: 16
      }}>
      <Helmet>
        <title>Not Found | Downwrite</title>
      </Helmet>
      <h2 className="SuperErrorMessage">404</h2>
      <StatusCode statusCode={props.statusCode} />
      <NotFound
        error={null}
        message={
          props.statusCode
            ? "An error " + props.statusCode + "occurred on server"
            : "An error occurred on client"
        }
      />
    </section>
  );
}
