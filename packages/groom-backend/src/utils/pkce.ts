import pkceChallenge from "pkce-challenge";

export interface PKCEPair {
  codeVerifier: string;
  codeChallenge: string;
}

export const generatePKCE = async (): Promise<PKCEPair> => {
  const { code_verifier, code_challenge } = await pkceChallenge();
  return {
    codeVerifier: code_verifier,
    codeChallenge: code_challenge,
  };
};

export const storePKCEVerifier = (
  state: string,
  verifier: string,
  storage: Map<string, string>,
) => {
  storage.set(state, verifier);

  // Auto-cleanup after 10 minutes
  setTimeout(
    () => {
      storage.delete(state);
    },
    10 * 60 * 1000,
  );
};

export const retrievePKCEVerifier = (
  state: string,
  storage: Map<string, string>,
): string | undefined => {
  const verifier = storage.get(state);
  if (verifier) {
    storage.delete(state);
  }
  return verifier;
};
