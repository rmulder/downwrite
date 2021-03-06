import { useCallback } from "react";
import { useRouter } from "next/router";
import decode from "jwt-decode";
import base64 from "base-64";
import { useNotifications, NotificationType, useCurrentUser } from "@reducers/app";
import { TokenContents } from "@lib/token";
import { Routes } from "@utils/routes";
import {
  useLoginUserMutation,
  useCreateUserMutation
} from "../__generated__/client";

export interface IRegisterValues extends Record<string, string | boolean> {
  username: string;
  password: string;
  legalChecked: boolean;
  email: string;
}

export interface ILoginValues extends Record<string, string> {
  user: string;
  password: string;
}

interface IFormHandlers {
  onLoginSubmit(values: ILoginValues): void;
  onRegisterSubmit(values: IRegisterValues): void;
}

export function useLoginFns(): IFormHandlers {
  const router = useRouter();
  const [
    notifications,
    { addNotification, removeNotification }
  ] = useNotifications();
  const [createUser] = useCreateUserMutation();
  const [, { onCurrentUserLogin }] = useCurrentUser();

  const [authenticateUser] = useLoginUserMutation();

  const onSuccess = useCallback((token: string) => {
    const d = decode<TokenContents>(token);
    onCurrentUserLogin(d.name, d.user);

    router.push(Routes.DASHBOARD);

    if (notifications.length > 0) {
      notifications.forEach((n) => {
        removeNotification(n);
      });
    }
  }, []);

  const onLoginSubmit = useCallback(
    async (values: ILoginValues): Promise<void> => {
      await authenticateUser({
        variables: {
          username: values.user,
          password: base64.encode(values.password)
        }
      })
        .then((value) => {
          if (value?.data?.authenticateUser?.token) {
            const token = value.data.authenticateUser.token;
            onSuccess(token);
          }
        })
        .catch((error) => {
          addNotification(error.message, NotificationType.ERROR);
        });
    },
    [addNotification, authenticateUser, onSuccess]
  );

  const onRegisterSubmit = useCallback(
    async ({ legalChecked, ...values }: IRegisterValues): Promise<void> => {
      if (legalChecked) {
        await createUser({
          variables: {
            ...values,
            password: base64.encode(values.password)
          }
        })
          .then((value) => {
            if (value?.data?.createUser?.token) {
              const token = value.data.createUser.token;

              onSuccess(token);
            }
          })
          .catch((error) => {
            addNotification(error.message, NotificationType.ERROR);
          });
      }
    },
    [createUser, addNotification, onSuccess]
  );

  return {
    onLoginSubmit,
    onRegisterSubmit
  };
}
